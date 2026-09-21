import { Router } from 'express';
import { z } from 'zod';

import { param } from '../lib/params.js';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

export const kahveFaliRouter = Router();

// KF-1/KF-2: photo upload + SLA. photoUrl is taken as already-uploaded (the
// actual upload/storage step — and the content-moderation first-pass filter
// noted in CLAUDE.md's open questions — isn't wired up; this assumes a client
// or a separate upload endpoint already produced a URL).
const SLA_HOURS_PLACEHOLDER = 24; // matches the PRD's example SLA, not a confirmed value

const createOrderSchema = z.object({
  astrologerId: z.string(),
  photoUrl: z.string().url(),
});

kahveFaliRouter.post('/orders', requireAuth, async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const astrologer = await prisma.astrologerProfile.findUnique({
    where: { userId: parsed.data.astrologerId },
  });
  if (!astrologer) {
    res.status(404).json({ error: 'Astrologer not found' });
    return;
  }

  const order = await prisma.kahveFaliOrder.create({
    data: {
      userId: req.auth!.sub,
      astrologerId: parsed.data.astrologerId,
      photoUrl: parsed.data.photoUrl,
      slaDeadline: new Date(Date.now() + SLA_HOURS_PLACEHOLDER * 60 * 60 * 1000),
    },
  });
  res.status(201).json(order);
});

kahveFaliRouter.get('/orders/:id', requireAuth, async (req, res) => {
  const order = await prisma.kahveFaliOrder.findUnique({ where: { id: param(req, 'id') } });
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  if (order.userId !== req.auth!.sub && order.astrologerId !== req.auth!.sub) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  res.json(order);
});

// Astrologer delivers the interpretation.
const deliverSchema = z.object({ interpretationText: z.string().min(1) });

kahveFaliRouter.patch('/orders/:id/deliver', requireAuth, async (req, res) => {
  const parsed = deliverSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const order = await prisma.kahveFaliOrder.findUnique({ where: { id: param(req, 'id') } });
  if (!order || order.astrologerId !== req.auth!.sub) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  const updated = await prisma.kahveFaliOrder.update({
    where: { id: param(req, 'id') },
    data: { status: 'delivered', interpretationText: parsed.data.interpretationText, deliveredAt: new Date() },
  });
  res.json(updated);
});
