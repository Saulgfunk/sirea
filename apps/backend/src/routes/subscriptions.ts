import { Router } from 'express';

import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

export const subscriptionsRouter = Router();
subscriptionsRouter.use(requireAuth);

subscriptionsRouter.get('/', async (req, res) => {
  const subscription = await prisma.subscription.findUnique({ where: { userId: req.auth!.sub } });
  res.json(subscription);
});

// WS-3: upgrading is a real billing event (Stripe web vs. Apple/Google IAP on
// mobile — CLAUDE.md, blocked on the same market-scope open question as
// wallet top-up). Not implemented for the same reason: this can't credit a
// tier change with no payment behind it.
subscriptionsRouter.post('/upgrade', async (_req, res) => {
  res.status(501).json({
    error: 'Subscription upgrade requires a payment processor integration not yet built — see CLAUDE.md open question 1',
  });
});

// Cancellation itself needs no payment processor — competitor research
// (docs/06-Competitive-Analysis.md §6) specifically flags buried, multi-step
// cancellation flows as a trust failure to avoid, so this is real: a single
// call sets status to cancelled, no dark patterns, no upsell step in between.
subscriptionsRouter.post('/cancel', async (req, res) => {
  const subscription = await prisma.subscription.update({
    where: { userId: req.auth!.sub },
    data: { status: 'cancelled' },
  });
  res.json(subscription);
});
