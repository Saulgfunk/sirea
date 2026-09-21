# Sirea backend

Node.js + TypeScript + Express + Prisma (PostgreSQL). See [`../../CLAUDE.md`](../../CLAUDE.md)
and [`../../docs/08-Technical-Architecture.md`](../../docs/08-Technical-Architecture.md) for
product/architecture context — this file is setup + what's actually implemented.

## Setup

```bash
cp .env.example .env   # fill in DATABASE_URL and JWT_SECRET
```

Postgres, either via Docker:

```bash
docker compose up -d
```

...or a local install (e.g. `brew install postgresql@16 && brew services start postgresql@16`,
then create a `sirea` role/database matching your `.env`).

```bash
npm install
npm run prisma:migrate   # applies prisma/migrations, creates the schema
npm run dev               # http://localhost:4000
```

`npm run typecheck` and `npm run build` both pass clean as of this writing.

## What's real vs. stubbed

Verified end-to-end against a live database: signup/login (email+password, JWT), creating an
astrologer profile, following, posting, the feed, browsing/filtering astrologers, booking a
private session (à la carte, wallet-credit deduction with an append-only ledger), rating
eligibility + astrologer stat recalculation, badge application + admin approval, subscription
cancellation, group-session listing/joining, kahve falı order creation + delivery.

**Deliberately not implemented** (per `CLAUDE.md`'s open questions — see the
`check-open-questions` skill before touching these):
- `POST /wallet/topup` and `POST /subscription/upgrade` return `501`. Both need a real payment
  processor (Stripe vs. Turkey-specific rails), which depends on the unresolved market-scope
  question. Faking success here would be a real money bug, not a placeholder.
- No payout-crediting logic anywhere (astrologer never receives a share of what a user pays) —
  blocked on the commission %/pool-sizing open question.

**Gaps in the source docs themselves**, filled in pragmatically and flagged in code comments —
worth a deliberate design pass later, not silently treated as settled:
- `POST /astrologers` (becoming an astrologer) and `POST /astrologers/:id/posts` (publishing
  content) aren't in the architecture doc's API sketch at all. Added because the platform can't
  function without them.
- No `Availability` entity exists in the data model — `GET /astrologers/:id/availability` just
  lists the astrologer's own unbooked upcoming `Session` rows rather than computing real
  business-hours availability.
- Group-session premium-gating is modeled as `price > 0`, since there's no dedicated
  access-level field on `Session`.
- `AstrologerProfile.sessionsCompleted` is never incremented — nothing currently marks a session
  `completed` (that's the video-session-end event, which depends on the LiveKit integration that
  doesn't exist yet).

**Known placeholders** (grep for `PLACEHOLDER` / `TODO` in `src/`): Verified Pro reapply
cooldown (30 days), kahve falı SLA (24h), referral bonus amounts ($5) — all unconfirmed numbers
carried over from the PRD's own "suggested, not validated" framing, not business decisions made
here.

**Not built at all yet**: real signup verification (email link/SMS), rate-limited but otherwise
unautomated fraud-signal *writing* (the admin review queue exists, but nothing currently writes
to `FraudSignal`), content moderation on kahve falı photo uploads, transit-based push
notifications, chart comparison, and — biggest — the actual in-app video/voice layer (LiveKit)
that private sessions, group sessions, and live kahve falı all depend on.
