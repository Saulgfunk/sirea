import cors from 'cors';
import express from 'express';

import { adminRouter } from './routes/admin.js';
import { astrologersRouter } from './routes/astrologers.js';
import { authRouter } from './routes/auth.js';
import { adminBadgesRouter, astrologerBadgesRouter } from './routes/badges.js';
import { feedRouter } from './routes/feed.js';
import { groupSessionsRouter } from './routes/groupSessions.js';
import { kahveFaliRouter } from './routes/kahveFali.js';
import { profileRouter } from './routes/profile.js';
import { ratingsRouter } from './routes/ratings.js';
import { referralsRouter } from './routes/referrals.js';
import { sessionsRouter } from './routes/sessions.js';
import { subscriptionsRouter } from './routes/subscriptions.js';
import { uploadsDir, uploadsRouter } from './routes/uploads.js';
import { walletRouter } from './routes/wallet.js';

export const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

app.get('/health', (_req, res) => res.json({ ok: true }));

// Grouped to match docs/08-Technical-Architecture.md §4.
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/feed', feedRouter);
app.use('/astrologers', astrologersRouter);
app.use('/astrologers', astrologerBadgesRouter); // POST /astrologers/:id/badge-application
app.use('/', sessionsRouter); // /astrologers/:id/availability, /sessions*
app.use('/', ratingsRouter); // /sessions/:id/rating, /kahve-fali/orders/:id/rating
app.use('/group-sessions', groupSessionsRouter);
app.use('/kahve-fali', kahveFaliRouter);
app.use('/wallet', walletRouter);
app.use('/subscription', subscriptionsRouter);
app.use('/', referralsRouter); // /astrologers/:id/referral-code, /referrals/:code/redeem
app.use('/admin', adminRouter); // /admin/fraud-signals
app.use('/admin', adminBadgesRouter); // /admin/badge-applications/:id, /admin/badges/*
app.use('/uploads', uploadsRouter);

app.use((req, res) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.path}` });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});
