import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';

import type { Prisma } from '@prisma/client';

import { param } from '../lib/params.js';
import { prisma } from '../lib/prisma.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

// Mounted at /astrologers — POST /astrologers/:id/badge-application.
export const astrologerBadgesRouter = Router();

const applicationLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 5 });

// AD-1: Verified Pro application. Review is case-by-case, not a fixed checklist
// (docs/04-Trust-and-Safety.md §2) — this endpoint just records the application;
// the actual background-check step is manual/admin-side, not automated here.
const applySchema = z.object({
  answers: z.record(z.string(), z.unknown()),
});

astrologerBadgesRouter.post('/:id/badge-application', requireAuth, applicationLimiter, async (req, res) => {
  if (req.auth!.sub !== param(req, 'id')) {
    res.status(403).json({ error: 'Can only apply for your own badge' });
    return;
  }
  const parsed = applySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const application = await prisma.badgeApplication.create({
    data: { astrologerId: param(req, 'id'), answers: parsed.data.answers as Prisma.InputJsonValue },
  });
  res.status(201).json(application);
});

// Mounted at /admin — matches docs/08-Technical-Architecture.md §4's grouping.
export const adminBadgesRouter = Router();
adminBadgesRouter.use(requireAuth, requireRole('admin'));

// AD-2/AD-3: admin reviews an application; approval grants the badge, rejection
// records a reason and cooldown. Exact reapply cooldown length is an open
// question (CLAUDE.md) — defaulting to 30 days as a placeholder, flagged below.
const REAPPLY_COOLDOWN_DAYS_PLACEHOLDER = 30; // TODO: confirm real cooldown, see CLAUDE.md open question 3

const reviewSchema = z.object({
  status: z.enum(['approved', 'rejected']),
  decisionReason: z.string().optional(),
});

adminBadgesRouter.get('/badge-applications/:id', async (req, res) => {
  const application = await prisma.badgeApplication.findUnique({ where: { id: param(req, 'id') } });
  if (!application) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }
  res.json(application);
});

adminBadgesRouter.patch('/badge-applications/:id', async (req, res) => {
  const parsed = reviewSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { status, decisionReason } = parsed.data;
  const application = await prisma.badgeApplication.findUnique({ where: { id: param(req, 'id') } });
  if (!application) {
    res.status(404).json({ error: 'Application not found' });
    return;
  }

  const reapplyAfter =
    status === 'rejected'
      ? new Date(Date.now() + REAPPLY_COOLDOWN_DAYS_PLACEHOLDER * 24 * 60 * 60 * 1000)
      : null;

  const updated = await prisma.$transaction(async (tx) => {
    const app = await tx.badgeApplication.update({
      where: { id: param(req, 'id') },
      data: { status, decisionReason, reviewerId: req.auth!.sub, reapplyAfter },
    });
    if (status === 'approved') {
      await tx.badge.create({
        data: { astrologerId: application.astrologerId, type: 'verified_pro', grantedVia: 'application' },
      });
    }
    return app;
  });

  res.json(updated);
});

// AD-4: platform-granted badge for hand-selected astrologers, bypassing the
// application flow entirely — admin-only, logged separately from AD-1–AD-3.
const grantSchema = z.object({ astrologerId: z.string() });

adminBadgesRouter.post('/badges/grant', async (req, res) => {
  const parsed = grantSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const badge = await prisma.badge.create({
    data: { astrologerId: parsed.data.astrologerId, type: 'verified_pro', grantedVia: 'platform_direct' },
  });
  res.status(201).json(badge);
});

// AD-6: revoke a badge (typically Top Rated after confirmed fraud) — visible
// "under review" state is not modeled separately here; revokedAt being set
// is the record of the final decision, not an interim flag.
adminBadgesRouter.post('/badges/:id/revoke', async (req, res) => {
  const badge = await prisma.badge.update({
    where: { id: param(req, 'id') },
    data: { revokedAt: new Date() },
  });
  res.json(badge);
});
