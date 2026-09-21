import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';

import { prisma } from '../lib/prisma.js';
import { hashPassword, verifyPassword } from '../lib/password.js';
import { requireAuth, signAuthToken } from '../middleware/auth.js';

export const authRouter = Router();

// ON-1: signup with email or phone, verified before full access. Actual
// verification delivery (email link / SMS OTP) is not implemented — POST
// /auth/verify exists as a shape but always no-ops until a provider is chosen.
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 });

const signupSchema = z
  .object({
    email: z.string().email().optional(),
    phone: z.string().min(5).optional(),
    password: z.string().min(8),
    displayName: z.string().min(1).max(60).optional(),
  })
  .refine((data) => data.email || data.phone, { message: 'email or phone is required' });

authRouter.post('/signup', authLimiter, async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { email, phone, password, displayName } = parsed.data;

  const existing = await prisma.user.findFirst({
    where: { OR: [email ? { email } : undefined, phone ? { phone } : undefined].filter(Boolean) as any },
  });
  if (existing) {
    res.status(409).json({ error: 'An account with that email or phone already exists' });
    return;
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, phone, passwordHash, displayName },
  });
  await prisma.walletAccount.create({ data: { userId: user.id } });
  await prisma.subscription.create({ data: { userId: user.id } });

  const token = signAuthToken({ sub: user.id, role: user.role });
  res.status(201).json({
    token,
    user: { id: user.id, email: user.email, phone: user.phone, displayName: user.displayName, avatarUrl: user.avatarUrl },
  });
});

const loginSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  password: z.string(),
});

authRouter.post('/login', authLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }
  const { email, phone, password } = parsed.data;
  const user = await prisma.user.findFirst({
    where: email ? { email } : { phone },
  });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = signAuthToken({ sub: user.id, role: user.role });
  res.json({
    token,
    user: { id: user.id, email: user.email, phone: user.phone, displayName: user.displayName, avatarUrl: user.avatarUrl },
  });
});

// TODO: wire to a real verification provider (email link or SMS OTP) before
// this can gate access per ON-1's acceptance criteria. Currently a no-op stub.
authRouter.post('/verify', authLimiter, async (_req, res) => {
  res.status(501).json({ error: 'Not implemented — no verification provider configured yet' });
});

// Not in docs/08-Technical-Architecture.md §4's API sketch, but a client
// holding a persisted token (e.g. the mobile app after relaunch) needs a way
// to recover who that token belongs to without re-authenticating.
authRouter.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.auth!.sub } });
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json({ id: user.id, email: user.email, phone: user.phone, displayName: user.displayName, avatarUrl: user.avatarUrl });
});
