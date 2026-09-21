import { Router } from 'express';

import { param } from '../lib/params.js';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

export const groupSessionsRouter = Router();

// GS-1/GS-3: the data model has no dedicated "access level" field for group
// sessions — modeled here as price > 0 meaning "premium-gated" (requires an
// active paid subscription) and price === 0 meaning "free" (any authenticated
// user). This is a stand-in, not a confirmed convention; revisit with a real
// accessLevel field if that mapping turns out to be wrong in practice.
groupSessionsRouter.get('/', requireAuth, async (_req, res) => {
  const sessions = await prisma.session.findMany({
    where: { type: 'group', status: 'scheduled', scheduledAt: { gte: new Date() } },
    include: {
      astrologer: {
        select: { userId: true, bio: true, user: { select: { displayName: true, avatarUrl: true } } },
      },
      _count: { select: { participants: true } },
    },
    orderBy: { scheduledAt: 'asc' },
  });
  res.json(sessions);
});

groupSessionsRouter.post('/:id/join', requireAuth, async (req, res) => {
  const session = await prisma.session.findUnique({ where: { id: param(req, 'id') } });
  if (!session || session.type !== 'group') {
    res.status(404).json({ error: 'Group session not found' });
    return;
  }
  if (session.status !== 'scheduled') {
    res.status(409).json({ error: `Session is ${session.status}` });
    return;
  }

  const isPremiumGated = Number(session.price) > 0;
  if (isPremiumGated) {
    const subscription = await prisma.subscription.findUnique({ where: { userId: req.auth!.sub } });
    if (!subscription || subscription.tier === 'free' || subscription.status !== 'active') {
      res.status(402).json({ error: 'Requires an active paid subscription' });
      return;
    }
  }

  await prisma.sessionParticipant.upsert({
    where: { sessionId_userId: { sessionId: session.id, userId: req.auth!.sub } },
    create: { sessionId: session.id, userId: req.auth!.sub },
    update: {},
  });

  res.status(204).send();
});
