import { Router } from 'express';

import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

export const feedRouter = Router();

// CD-1: mixed feed of algorithmic sign content + followed-astrologer posts.
// Only the "followed astrologers" half is implemented — algorithmic daily/
// weekly/monthly sign forecasts (PRD §6) need a content-generation pipeline
// that doesn't exist yet, so this returns followed-astrologer posts only,
// clearly partial rather than silently substituting something else for it.
feedRouter.get('/', requireAuth, async (req, res) => {
  const follows = await prisma.follow.findMany({
    where: { followerUserId: req.auth!.sub },
    select: { astrologerId: true },
  });
  const astrologerIds = follows.map((f) => f.astrologerId);

  const posts = await prisma.post.findMany({
    where: { astrologerId: { in: astrologerIds } },
    include: {
      astrologer: {
        include: { badges: { where: { revokedAt: null } }, user: { select: { id: true, displayName: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  res.json({ posts, algorithmicContent: null });
});
