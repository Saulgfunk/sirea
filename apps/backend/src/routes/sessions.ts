import { Router } from 'express';
import { z } from 'zod';

import { param } from '../lib/params.js';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

export const sessionsRouter = Router();

// PS-5: astrologer-managed availability. There's no separate Availability
// entity in the data model yet (CLAUDE.md's entity list doesn't have one) —
// this treats every non-cancelled Session row the astrologer owns as an
// occupied slot and returns everything else as "available" is NOT actually
// computed (that needs a real business-hours/calendar concept). For now this
// just lists the astrologer's own open (unbooked) upcoming slots.
sessionsRouter.get('/astrologers/:id/availability', async (req, res) => {
  const slots = await prisma.session.findMany({
    where: {
      astrologerId: param(req, 'id'),
      status: 'scheduled',
      scheduledAt: { gte: new Date() },
      participants: { none: {} },
    },
    orderBy: { scheduledAt: 'asc' },
  });
  res.json(slots);
});

// PS-5: astrologer creates a bookable slot (type, time, price, payout model).
const createSlotSchema = z.object({
  type: z.enum(['private', 'group', 'kahve_fali_live']),
  scheduledAt: z.coerce.date(),
  durationMinutes: z.number().int().positive(),
  price: z.number().nonnegative(),
  paymentModel: z.enum(['bundled', 'a_la_carte']),
});

sessionsRouter.post('/sessions', requireAuth, async (req, res) => {
  const parsed = createSlotSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const astrologer = await prisma.astrologerProfile.findUnique({ where: { userId: req.auth!.sub } });
  if (!astrologer) {
    res.status(403).json({ error: 'Only astrologers can create session slots' });
    return;
  }

  const session = await prisma.session.create({
    data: { astrologerId: req.auth!.sub, ...parsed.data, price: parsed.data.price.toFixed(2) },
  });
  res.status(201).json(session);
});

sessionsRouter.get('/sessions/:id', requireAuth, async (req, res) => {
  const session = await prisma.session.findUnique({
    where: { id: param(req, 'id') },
    include: { participants: true },
  });
  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }
  res.json(session);
});

// PS-2: pay via wallet credit (à la carte) or subscription (bundled). This
// deducts the user's wallet balance for the session's price and appends a
// WalletTransaction — it does NOT credit the astrologer any payout amount,
// since the commission %/pool-split formula is still an open business
// decision (CLAUDE.md open question 2). Do not add payout-crediting logic
// here until that's confirmed — see the check-open-questions skill.
sessionsRouter.post('/sessions/:id/join', requireAuth, async (req, res) => {
  const session = await prisma.session.findUnique({
    where: { id: param(req, 'id') },
    include: { participants: true },
  });
  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }
  if (session.status !== 'scheduled') {
    res.status(409).json({ error: `Session is ${session.status}, not open for booking` });
    return;
  }
  // PS-1: double-booking prevention — a private session only ever has one participant.
  if (session.type === 'private' && session.participants.length > 0) {
    res.status(409).json({ error: 'This session is already booked' });
    return;
  }
  if (session.participants.some((p) => p.userId === req.auth!.sub)) {
    res.status(409).json({ error: 'Already joined' });
    return;
  }

  if (session.paymentModel === 'a_la_carte') {
    const wallet = await prisma.walletAccount.findUnique({ where: { userId: req.auth!.sub } });
    if (!wallet || wallet.balance.lessThan(session.price)) {
      res.status(402).json({ error: 'Insufficient wallet balance' });
      return;
    }
    await prisma.$transaction([
      prisma.walletAccount.update({
        where: { userId: req.auth!.sub },
        data: { balance: { decrement: session.price } },
      }),
      prisma.walletTransaction.create({
        data: {
          walletId: req.auth!.sub,
          type: 'spend',
          amount: session.price.negated(),
          relatedSessionId: session.id,
        },
      }),
      prisma.sessionParticipant.create({ data: { sessionId: session.id, userId: req.auth!.sub } }),
    ]);
  } else {
    // Bundled: gated on subscription tier, not charged from wallet. Doesn't
    // check which *tier* unlocks which session type (WS-3 nuance, Phase 2) —
    // just requires an active non-free subscription for now.
    const subscription = await prisma.subscription.findUnique({ where: { userId: req.auth!.sub } });
    if (!subscription || subscription.tier === 'free' || subscription.status !== 'active') {
      res.status(402).json({ error: 'Requires an active paid subscription' });
      return;
    }
    await prisma.sessionParticipant.create({ data: { sessionId: session.id, userId: req.auth!.sub } });
  }

  res.status(204).send();
});

// Cancellation/reschedule policy is an open question (CLAUDE.md) — this only
// records the status transition. It does NOT issue a refund/credit; that
// logic depends on the still-undecided policy (who bears the cost, etc.).
const patchSchema = z.object({ status: z.enum(['cancelled']) });

sessionsRouter.patch('/sessions/:id', requireAuth, async (req, res) => {
  const parsed = patchSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const session = await prisma.session.findUnique({ where: { id: param(req, 'id') } });
  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }
  if (session.astrologerId !== req.auth!.sub) {
    res.status(403).json({ error: 'Only the astrologer can cancel their own session' });
    return;
  }
  const updated = await prisma.session.update({ where: { id: param(req, 'id') }, data: { status: 'cancelled' } });
  res.json(updated);
});
