import { Router } from 'express';
import { z } from 'zod';

import { param } from '../lib/params.js';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

export const adminRouter = Router();
adminRouter.use(requireAuth, requireRole('admin'));

// "Log now, automate later" (docs/04-Trust-and-Safety.md §7): FraudSignal rows
// are written elsewhere as behavioral logging happens (not yet implemented —
// no code currently writes to this table). This is just the manual-review
// queue surface for whenever that logging exists.
adminRouter.get('/fraud-signals', async (req, res) => {
  const status = typeof req.query.status === 'string' ? req.query.status : undefined;
  const signals = await prisma.fraudSignal.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  res.json(signals);
});

const reviewSchema = z.object({
  status: z.enum(['reviewed', 'cleared']),
});

adminRouter.patch('/fraud-signals/:id', async (req, res) => {
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const signal = await prisma.fraudSignal.update({
    where: { id: param(req, 'id') },
    data: { ...parsed.data, reviewedBy: req.auth!.sub },
  });
  res.json(signal);
});
