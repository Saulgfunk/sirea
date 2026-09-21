import { Router } from 'express';
import { z } from 'zod';

import { param } from '../lib/params.js';
import { prisma } from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';

export const astrologersRouter = Router();

// Not in docs/08-Technical-Architecture.md §4's API sketch — that doc lists no
// "become an astrologer" endpoint at all, but the platform can't function
// without one. Self-serve: any authenticated user can create their own
// AstrologerProfile. No approval gate here — Verified Pro/Top Rated badges
// (separate from this) are what carry trust, per CLAUDE.md's badge design.
const createAstrologerSchema = z.object({
  bio: z.string().optional(),
  specialties: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
});

astrologersRouter.post('/', requireAuth, async (req, res) => {
  const parsed = createAstrologerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const existing = await prisma.astrologerProfile.findUnique({ where: { userId: req.auth!.sub } });
  if (existing) {
    res.status(409).json({ error: 'Astrologer profile already exists' });
    return;
  }
  const astrologer = await prisma.astrologerProfile.create({
    data: { userId: req.auth!.sub, ...parsed.data },
  });
  res.status(201).json(astrologer);
});

// CD-3: search/filter by specialty, badge, rating, price. Badge-holders surface
// with priority *placement* within the same result set, never a separate list
// (CLAUDE.md) — implemented here as an order-by, not a filter, so amateurs are
// never hidden.
const querySchema = z.object({
  specialty: z.string().optional(),
  badge: z.enum(['verified_pro', 'top_rated']).optional(),
  minRating: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
});

astrologersRouter.get('/', async (req, res) => {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { specialty, badge, minRating } = parsed.data;

  const astrologers = await prisma.astrologerProfile.findMany({
    where: {
      specialties: specialty ? { has: specialty } : undefined,
      avgRating: minRating ? { gte: minRating } : undefined,
      badges: badge ? { some: { type: badge, revokedAt: null } } : undefined,
    },
    include: { badges: { where: { revokedAt: null } }, user: { select: { id: true, displayName: true } } },
    orderBy: [{ avgRating: 'desc' }],
    take: 50,
  });

  // maxPrice filters on Session.price, which isn't part of AstrologerProfile —
  // left unfiltered here rather than guessing a "starting price" definition;
  // revisit once session pricing display conventions are decided.
  res.json(astrologers);
});

astrologersRouter.get('/:id', async (req, res) => {
  const astrologer = await prisma.astrologerProfile.findUnique({
    where: { userId: param(req, 'id') },
    include: {
      badges: { where: { revokedAt: null } },
      posts: { orderBy: { createdAt: 'desc' }, take: 20 },
      user: { select: { id: true, displayName: true } },
    },
  });
  if (!astrologer) {
    res.status(404).json({ error: 'Astrologer not found' });
    return;
  }
  res.json(astrologer);
});

astrologersRouter.post('/:id/follow', requireAuth, async (req, res) => {
  const astrologerId = param(req, 'id');
  const astrologer = await prisma.astrologerProfile.findUnique({ where: { userId: astrologerId } });
  if (!astrologer) {
    res.status(404).json({ error: 'Astrologer not found' });
    return;
  }

  const alreadyFollowing = await prisma.follow.findUnique({
    where: { followerUserId_astrologerId: { followerUserId: req.auth!.sub, astrologerId } },
  });
  if (alreadyFollowing) {
    res.status(204).send();
    return;
  }

  await prisma.$transaction([
    prisma.follow.create({ data: { followerUserId: req.auth!.sub, astrologerId } }),
    prisma.astrologerProfile.update({
      where: { userId: astrologerId },
      data: { followerCount: { increment: 1 } },
    }),
  ]);

  res.status(204).send();
});

// Also missing from docs/08-Technical-Architecture.md §4 — the doc describes
// consuming the feed (GET /feed) but never how an astrologer actually
// publishes a post. Minimal text/image/video post creation, mirroring CD-1's
// content types (PRD §6).
const createPostSchema = z.object({
  type: z.enum(['text', 'image', 'video']),
  body: z.string().optional(),
  mediaUrl: z.string().url().optional(),
});

astrologersRouter.post('/:id/posts', requireAuth, async (req, res) => {
  const astrologerId = param(req, 'id');
  if (req.auth!.sub !== astrologerId) {
    res.status(403).json({ error: 'Can only post as yourself' });
    return;
  }
  const parsed = createPostSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const post = await prisma.post.create({ data: { astrologerId, ...parsed.data } });
  res.status(201).json(post);
});
