# Sirea — Technical Architecture & Data Model

2026-09-21 · @Someone

Companion to the PRD, User Stories, and MVP Roadmap — written to give a coding agent (or any engineer) a concrete starting point: a data model, service choices, and API shape. Recommendations here are suggestions, not final decisions — flagged individually where a real choice is still needed.

## 1. Recommended Tech Stack

No stack preference was specified (PRD Section 4/5), so this is a concrete starting recommendation for Claude Code to build against — reasonable defaults, not a mandate. Swap freely.

| Layer | Recommendation | Why |
| --- | --- | --- |
| Mobile | React Native | One codebase for iOS + Android (PRD requires both); large ecosystem for the video/voice and payment SDKs this project needs. |
| Web | Next.js (React) | Shares component logic and data-fetching patterns with React Native; strong support for the astrologer-facing dashboard use case (PRD Section 4 notes astrologers likely prefer managing profile/availability from web). |
| Backend | Node.js + TypeScript | Single language across mobile, web, and backend reduces context-switching for a solo in-house developer; TypeScript's typing helps keep the data model (Section 3) consistent across the stack. |
| Database | PostgreSQL | Relational integrity matters here — wallet balances, session bookings, and ratings all need transactional consistency (double-booking prevention, accurate ledgers) that a relational database enforces more naturally than a document store. |
| Realtime/chat | WebSockets (e.g., via a managed service or self-hosted) | Needed for live attendee counts (GS-5), in-session state, and notification delivery. |
| Hosting | Any major cloud provider (AWS, GCP, or a PaaS like Render/Railway for faster early iteration) | Left open — the choice matters less early on than getting the data model and API right; a PaaS may let a solo developer move faster pre-scale. |

**This section is the most negotiable of the document** — if the in-house developer has existing familiarity with a different stack, that familiarity likely outweighs any of the reasoning above.

## 2. Third-Party Service Recommendations

The PRD and other documents named these as needed but left the specific vendor open — resolving that here so Claude Code has something concrete to integrate against.

| Need | Recommendation | Alternatives | Notes |
| --- | --- | --- | --- |
| Payments (subscriptions, wallet top-up) | Stripe (web/backend) + Apple In-App Purchase / Google Play Billing (mobile subscriptions) | Adyen, Braintree | Apple/Google mandate their own billing for in-app subscription purchases on iOS/Android — Stripe alone can't be used for mobile subscription billing on those platforms; wallet top-ups outside a subscription context can go through Stripe directly. |
| In-app video/voice | LiveKit (open-source, self-hostable or cloud) | Agora, Daily.co, Twilio Video | LiveKit gives full control over session recording/consent handling (needed per PRD's data-retention open question) and avoids per-minute vendor lock-in pricing that could eat into astrologer payouts at scale. |
| Astrology chart calculation (natal chart, transits) | Swiss Ephemeris (via a wrapper library, e.g. pyswisseph) self-hosted, or a hosted astrology-calculation API (e.g. Prokerala, FreeAstrologyAPI) | Building calculation logic in-house from raw ephemeris data | Swiss Ephemeris is the de facto industry standard for astronomical/astrological calculation accuracy; licensing (AGPL or a commercial license from Astrodienst) needs review before shipping, since Sirea is a commercial product. |
| Identity verification (Verified Pro background checks) | Persona or Onfido (identity verification) + manual admin cross-reference of professional/social presence | Stripe Identity | Per Trust & Safety Section 2, the credential/professional-standing check stays manual and case-by-case — automated identity verification only confirms *who* the applicant is, not their professional legitimacy. |
| Push notifications | Firebase Cloud Messaging (Android) + Apple Push Notification service (iOS), or a unified layer like OneSignal | — | Needed for transit alerts (ON-5), session reminders (PS-4, GS-4), and falı-ready notifications (KF-2). |
| Content moderation (kahve falı photo uploads) | Automated image moderation API (e.g., AWS Rekognition or Google Cloud Vision's safe-search) as a first-pass filter, backed by manual review | — | Not detailed elsewhere in this project's documents — flagged as a gap the user chose to defer (content moderation policy), but the technical hook for it belongs in this architecture regardless of when the policy itself is written. |

## 3. Core Data Model

Entities implied across the PRD, User Flows, and User Stories, consolidated into one reference. Field lists are illustrative, not exhaustive — Claude Code should expand as implementation needs dictate.

| Entity | Key fields | Relationships |
| --- | --- | --- |
| **User** | id, email/phone, role (user \| astrologer \| admin), created\_at | Has one Profile; has one WalletAccount; has one Subscription |
| **Profile** | user\_id, birth\_date, birth\_time (nullable), birth\_place (nullable), sun\_sign, natal\_chart\_data (nullable until birth time/place added) | Belongs to User |
| **AstrologerProfile** | user\_id, bio, specialties\[\], languages\[\], stats (sessions\_completed, avg\_rating, rating\_count, follower\_count) | Belongs to User; has many Badges, Posts, Sessions, KahveFaliOrders |
| **Badge** | id, astrologer\_id, type (verified\_pro \| top\_rated), granted\_via (application \| platform\_direct), granted\_at, revoked\_at (nullable) | Belongs to AstrologerProfile |
| **BadgeApplication** | id, astrologer\_id, answers (jsonb), status (pending \| approved \| rejected), reviewer\_id, decision\_reason, reapply\_after (nullable) | Belongs to AstrologerProfile; reviewed by admin User |
| **Follow** | follower\_user\_id, astrologer\_id, created\_at | Join table, User ↔ AstrologerProfile |
| **Post** | id, astrologer\_id, type (text \| image \| video), body, media\_url, created\_at | Belongs to AstrologerProfile |
| **Session** | id, type (private \| group \| kahve\_fali\_live), astrologer\_id, scheduled\_at, duration\_minutes, price, payment\_model (bundled \| a\_la\_carte), status (scheduled \| completed \| cancelled \| no\_show) | Belongs to AstrologerProfile; has many SessionParticipants |
| **SessionParticipant** | session\_id, user\_id, joined\_at, left\_at | Join table, Session ↔ User (one row for private, many for group) |
| **KahveFaliOrder** | id, user\_id, astrologer\_id, photo\_url, status (pending \| delivered), interpretation\_text, ordered\_at, delivered\_at, sla\_deadline | Belongs to User and AstrologerProfile |
| **Rating** | id, session\_id or kahve\_fali\_order\_id, rater\_user\_id, astrologer\_id, score, review\_text, eligible (bool), weight (computed), created\_at | Belongs to Session/KahveFaliOrder; belongs to AstrologerProfile |
| **WalletAccount** | user\_id, balance | Belongs to User; has many WalletTransactions |
| **WalletTransaction** | id, wallet\_id, type (topup \| spend \| refund \| referral\_bonus), amount, related\_session\_id (nullable), created\_at | Belongs to WalletAccount |
| **Subscription** | id, user\_id, tier (free \| premium \| premium\_credit), status, renewal\_date | Belongs to User |
| **ReferralInvite** | id, astrologer\_id, code, invited\_user\_id (nullable until used), converted\_at (nullable), reward\_issued (bool) | Belongs to AstrologerProfile |
| **FraudSignal** | id, related\_entity\_type, related\_entity\_id, signal\_type, score, status (flagged \| reviewed \| cleared), reviewed\_by | Polymorphic association — flags a Rating, Session, or ReferralInvite for admin review |

## 4. API Structure (High-Level)

Grouped by domain rather than fully specified — enough for Claude Code to scaffold route/controller structure against the data model in Section 3.

| Group | Representative endpoints | Notes |
| --- | --- | --- |
| Auth | POST /auth/signup, POST /auth/login, POST /auth/verify | Email/phone verification per ON-1 |
| Profile | GET/PATCH /profile, POST /profile/birth-data | Supports the optional birth time/place flow (ON-2, ON-3, ON-4) |
| Feed | GET /feed | Mixed algorithmic + followed-astrologer content (CD-1) |
| Astrologers | GET /astrologers (search/filter), GET /astrologers/:id, POST /astrologers/:id/follow | Filter by specialty/badge/rating/price (CD-3) |
| Badges | POST /astrologers/:id/badge-application, GET/PATCH /admin/badge-applications/:id | Admin review path (AD-1, AD-2, AD-3) |
| Sessions | GET /astrologers/:id/availability, POST /sessions, GET /sessions/:id, PATCH /sessions/:id (cancel/reschedule) | Availability and booking (PS-1 through PS-6) |
| Group sessions | GET /group-sessions, POST /group-sessions/:id/join | Access-level check against subscription tier (GS-1–GS-3) |
| Kahve falı | POST /kahve-fali/orders, GET /kahve-fali/orders/:id | Photo upload + status polling (KF-1–KF-4) |
| Ratings | POST /sessions/:id/rating, POST /kahve-fali/orders/:id/rating | Eligibility check server-side (PB-3, PB-4) |
| Wallet | GET /wallet, POST /wallet/topup, GET /wallet/transactions | (WS-1, WS-2) |
| Subscriptions | GET /subscription, POST /subscription/upgrade, POST /subscription/cancel | (WS-3) |
| Referrals | POST /astrologers/:id/referral-code, POST /referrals/:code/redeem | (RF-1–RF-4) |
| Admin/moderation | GET /admin/fraud-signals, PATCH /admin/fraud-signals/:id, POST /admin/badges/:id/revoke | Manual review queue (Trust & Safety Section 7) |

Whether this is REST (as sketched) or GraphQL is left to the developer's preference — the domain grouping and underlying data model hold either way.

## 5. Proposed Revenue-Share Payout Formula

This has been an open question across the PRD, User Stories, and Trust & Safety documents — a concrete proposal, since Claude Code needs actual payment logic to implement rather than a placeholder.

**À la carte model** (credit-based, per-booking): straightforward — the astrologer receives a fixed percentage of the session/kahve falı price (a platform commission rate, e.g., 15–25%, needs a business decision but is a single number either way), paid out per completed session. Simple to implement, no formula complexity.

**Bundled model** (subscription-pooled) — this is the harder case flagged repeatedly. Proposed starting formula:

```latex
\text{Astrologer's share} = \text{Pool} \times \frac{\text{sessions}_i \times \overline{\text{rating}}_i}{\sum_{j=1}^{n} \text{sessions}_j \times \overline{\text{rating}}_j}
```

Where *Pool* is the portion of monthly subscription revenue allocated to the bundled-model payout, *sessions₍ᵢ₎* is astrologer *i*'s completed bundled-model sessions that month, and *ratinḡ₍ᵢ₎* is their average rating over the same period. This rating-weighting is deliberate: a pure volume split (no rating term) would reward high-volume, low-effort sessions — the exact failure mode flagged earlier in this project's discussion of payout design.

**Still needs a business decision**: the exact platform commission percentage, the exact size of the bundled-model pool as a fraction of subscription revenue, and whether the rating weight should be linear (as shown) or use a steeper curve to reward quality more aggressively. These are business/economics calls, not technical ones — Claude Code can implement whichever numbers are decided, but shouldn't be the one deciding them.

## 6. Security, Privacy & Compliance Notes

Expands the PRD's Non-Functional Requirements (Section 10) into implementation-relevant specifics for Claude Code:

- **Never store raw payment card data.** Stripe/Apple/Google billing (Section 2) handle this by design — the backend should only ever store tokenized references (customer IDs, payment method IDs), never card numbers.
- **Birth data (date, time, place) is sensitive personal data.** Store it encrypted at rest; access-controlled to the owning user and, narrowly, to whatever chart-calculation service needs it (Section 2) — never exposed in logs, analytics events, or third-party integrations beyond what's strictly needed.
- **Kahve falı photo uploads and any session recordings** need an explicit retention/deletion policy before this feature ships with real users — flagged as unresolved in the PRD; the technical hook (a deletion job/TTL on stored media) should exist even before the policy's exact retention window is decided, since it's easier to shorten a TTL than to retrofit deletion logic later.
- **Wallet ledger integrity**: every WalletTransaction (Section 3) should be immutable once written (append-only ledger pattern) rather than editable balance fields, so the transaction history is auditable and disputes (Trust & Safety Section 5) can be investigated from a reliable record.
- **Rate limiting and abuse prevention** on badge applications, ratings, and referral-code redemption endpoints — the fraud-signal logging described in Trust & Safety Section 3 depends on this data being reliable, which requires the endpoints themselves to resist trivial scripted abuse.
- **Data protection law applicability** depends on the still-open market-scope question (PRD Section 4) — GDPR if any EU users, KVKK if Turkey remains a market. Architecture should default to privacy-by-design practices (data minimization, explicit consent for sensitive data collection) regardless of which regime ultimately applies, since retrofitting compliance is more expensive than building it in from the start.

## 7. Open Questions & Decisions Needed Before Building

- **Platform commission percentage and bundled-pool sizing** (Section 5) — the one open item most likely to block real payment code, since it's a business number, not a technical one.
- **Swiss Ephemeris licensing** (Section 2) — confirm commercial-use terms before relying on it for chart calculations at scale.
- **Confirm the stack recommendations in Section 1** — or substitute the in-house developer's preferred stack; the data model and API structure (Sections 3–4) should hold regardless of the specific framework choice.
- **The PRD's still-open English/international vs. Turkey-first scope question** directly affects Section 2's payment provider choice and Section 6's applicable data-protection regime — this is the one decision that should be finalized before Claude Code starts on payment or data-handling code specifically, even if other scaffolding (data model, API routes, UI) can proceed in parallel.
- **Content moderation and cancellation/refund policy** — the user has deferred these documents for now; Section 6 notes the technical hooks these need (deletion TTLs, refund-triggering logic) should still be built with placeholders so the policy can slot in later without a schema change.
