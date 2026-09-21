import { randomBytes } from 'node:crypto';

import { Router } from 'express';
import { z } from 'zod';

import { param } from '../lib/params.js';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

export const referralsRouter = Router();

// RF-3/RF-4: reward amounts aren't specified anywhere in the planning docs —
// unlike the commission %, this isn't flagged as a blocking open question, but
// it's still an unconfirmed number. Placeholder, not a real decision.
const REFERRER_REWARD_PLACEHOLDER = '5.00'; // TODO: confirm actual referral bonus amount
const INVITEE_REWARD_PLACEHOLDER = '5.00'; // TODO: confirm actual referral bonus amount

referralsRouter.post('/astrologers/:id/referral-code', requireAuth, async (req, res) => {
  if (req.auth!.sub !== param(req, 'id')) {
    res.status(403).json({ error: 'Can only generate your own referral code' });
    return;
  }
  const code = randomBytes(4).toString('hex');
  const invite = await prisma.referralInvite.create({
    data: { astrologerId: param(req, 'id'), code },
  });
  res.status(201).json(invite);
});

// RF-3/RF-4: called once, right after the invited guest completes signup with
// a code — reward triggers on account creation, not on session attendance.
const redeemSchema = z.object({});

referralsRouter.post('/referrals/:code/redeem', requireAuth, async (req, res) => {
  redeemSchema.parse(req.body ?? {});
  const invite = await prisma.referralInvite.findUnique({ where: { code: param(req, 'code') } });
  if (!invite) {
    res.status(404).json({ error: 'Invalid referral code' });
    return;
  }
  if (invite.convertedAt) {
    res.status(409).json({ error: 'Referral code already redeemed' });
    return;
  }

  await prisma.$transaction([
    prisma.referralInvite.update({
      where: { code: param(req, 'code') },
      data: { invitedUserId: req.auth!.sub, convertedAt: new Date(), rewardIssued: true },
    }),
    prisma.walletAccount.update({
      where: { userId: invite.astrologerId },
      data: { balance: { increment: REFERRER_REWARD_PLACEHOLDER } },
    }),
    prisma.walletTransaction.create({
      data: { walletId: invite.astrologerId, type: 'referral_bonus', amount: REFERRER_REWARD_PLACEHOLDER },
    }),
    prisma.walletAccount.update({
      where: { userId: req.auth!.sub },
      data: { balance: { increment: INVITEE_REWARD_PLACEHOLDER } },
    }),
    prisma.walletTransaction.create({
      data: { walletId: req.auth!.sub, type: 'referral_bonus', amount: INVITEE_REWARD_PLACEHOLDER },
    }),
  ]);

  res.status(204).send();
});
