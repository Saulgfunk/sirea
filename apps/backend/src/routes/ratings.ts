import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';

import { param } from '../lib/params.js';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

export const ratingsRouter = Router();

const ratingLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 30 });

const ratingSchema = z.object({
  score: z.number().int().min(1).max(5),
  reviewText: z.string().optional(),
});

async function recalculateAstrologerStats(astrologerId: string) {
  const agg = await prisma.rating.aggregate({
    where: { astrologerId, eligible: true },
    _avg: { score: true },
    _count: { score: true },
  });
  await prisma.astrologerProfile.update({
    where: { userId: astrologerId },
    data: { avgRating: agg._avg.score ?? 0, ratingCount: agg._count.score },
  });
}

// PB-3/PB-4: only users who completed a paid-or-eligible-free session/kahve
// falı with the astrologer may rate them; one rating per completed session.
// The session-duration-minimum eligibility gate (docs/04-Trust-and-Safety.md
// §3) needs real join/leave telemetry from the video layer, which doesn't
// exist yet — this only checks session.status === 'completed' for now.
ratingsRouter.post('/sessions/:id/rating', requireAuth, ratingLimiter, async (req, res) => {
  const parsed = ratingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const session = await prisma.session.findUnique({
    where: { id: param(req, 'id') },
    include: { participants: true },
  });
  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }
  const participated = session.participants.some((p) => p.userId === req.auth!.sub);
  if (!participated || session.status !== 'completed') {
    res.status(403).json({ error: 'You may only rate a completed session you attended' });
    return;
  }
  const existing = await prisma.rating.findFirst({
    where: { sessionId: session.id, raterUserId: req.auth!.sub },
  });
  if (existing) {
    res.status(409).json({ error: 'Already rated this session' });
    return;
  }

  const rating = await prisma.rating.create({
    data: {
      sessionId: session.id,
      raterUserId: req.auth!.sub,
      astrologerId: session.astrologerId,
      ...parsed.data,
    },
  });
  await recalculateAstrologerStats(session.astrologerId);
  res.status(201).json(rating);
});

ratingsRouter.post('/kahve-fali/orders/:id/rating', requireAuth, ratingLimiter, async (req, res) => {
  const parsed = ratingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const order = await prisma.kahveFaliOrder.findUnique({ where: { id: param(req, 'id') } });
  if (!order || order.userId !== req.auth!.sub || order.status !== 'delivered') {
    res.status(403).json({ error: 'You may only rate a delivered order you placed' });
    return;
  }
  const existing = await prisma.rating.findFirst({
    where: { kahveFaliOrderId: order.id, raterUserId: req.auth!.sub },
  });
  if (existing) {
    res.status(409).json({ error: 'Already rated this order' });
    return;
  }

  const rating = await prisma.rating.create({
    data: {
      kahveFaliOrderId: order.id,
      raterUserId: req.auth!.sub,
      astrologerId: order.astrologerId,
      ...parsed.data,
    },
  });
  await recalculateAstrologerStats(order.astrologerId);
  res.status(201).json(rating);
});
