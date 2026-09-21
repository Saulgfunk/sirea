import { Router } from 'express';

import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

export const walletRouter = Router();
walletRouter.use(requireAuth);

walletRouter.get('/', async (req, res) => {
  const wallet = await prisma.walletAccount.findUnique({ where: { userId: req.auth!.sub } });
  res.json(wallet);
});

walletRouter.get('/transactions', async (req, res) => {
  const transactions = await prisma.walletTransaction.findMany({
    where: { walletId: req.auth!.sub },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });
  res.json(transactions);
});

// WS-1: top up in fixed amounts. Deliberately NOT implemented as a real charge —
// this needs an actual payment processor (Stripe vs. PayTR/Payguru-style rails),
// which is blocked on CLAUDE.md's open question 1 (market scope). Exposing a
// route that just credits the wallet with no payment behind it would be a real
// money bug, not a placeholder, so this returns 501 rather than faking success.
// Once a processor is chosen, this becomes a webhook handler (on payment
// confirmation) that calls the same WalletTransaction-append pattern used
// elsewhere in this file, not a client-trusted "just add balance" endpoint.
walletRouter.post('/topup', async (_req, res) => {
  res.status(501).json({
    error: 'Wallet top-up requires a payment processor integration not yet built — see CLAUDE.md open question 1',
  });
});
