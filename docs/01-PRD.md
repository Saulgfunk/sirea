# Sirea — Product Requirements Document (PRD)

2026-09-21 · @Someone

## 1. Product Vision & Problem Statement

Sirea is a content and marketplace platform connecting astrologers with people seeking astrological guidance, structured as a creator-economy platform rather than a personalized-horoscope app. Astrologers (professional and amateur) build audiences through free content — daily/weekly/monthly astral projections, sign-specific insights, video — and monetize through private readings, group sessions, and kahve falı (Turkish coffee-cup fortune telling), delivered natively in-app via photo upload or live video/voice.

**The gap Sirea fills**: existing astrology apps (Co-Star, Sanctuary, The Pattern, Nebula) center on algorithmic personalization from a single provider — the app itself is the "astrologer." Sirea instead treats astrologers as creators with their own identity, audience, and monetization, similar to how Patreon or Cameo structure creator relationships, while still offering algorithmic content (daily sign forecasts) as a free-tier hook. Kahve falı is a secondary anchor product with no direct international equivalent — it is a culturally specific, ritual-based offering that differentiates Sirea from generic horoscope apps and can expand toward tarot, numerology, and other divination categories over time.

**Core value loop**: free content builds trust and audience → users convert to paid 1:1 sessions or kahve falı with astrologers they already follow → ratings and badges build astrologer reputation → reputation drives more followers and bookings.

**Primary monetization**: subscription tiers (free / group-session access / credit-bundled) plus revenue share on paid sessions, split between a bundled (subscription-pooled) model and an à la carte (credit-based, per-session) model, astrologer's choice per session type.

## 2. Goals & MVP Success Metrics

No target numbers were specified, so the table below is a suggested starting framework — adjust once a launch market and budget are set. Ranges reflect typical early-stage creator-marketplace benchmarks (Patreon-, Cameo-, and Fiverr-style two-sided marketplaces), not astrology-specific data.

| Metric | Suggested MVP target (first 90 days post-launch) | Why it matters |
| --- | --- | --- |
| Onboarded astrologers (any badge tier) | 30–50 | Supply liquidity; below \~30 the catalog feels sparse |
| Verified Pro astrologers | 8–12 | Enough recognizable names to anchor trust from day one |
| Weekly active users (WAU) | 500–1,500 | Early signal of content-loop engagement |
| Paid sessions/week (private + kahve falı combined) | 50–150 by week 12 | Core monetization signal |
| Free-to-paid conversion rate | 3–6% | Standard range for freemium content + marketplace hybrids |
| 30-day user retention | 20–30% | Astrology/horoscope apps skew higher than average app retention due to daily-habit mechanics (transit notifications) |
| Astrologer 90-day retention (still active) | ≥60% | Marketplace health depends on suppliers not churning after a slow first month |
| Average rating (platform-wide) | ≥4.3/5 | Trust signal; below this, conversion typically suffers |
| Revenue (illustrative, TL or USD-neutral) | Break-even on hosting/infra costs by month 6 | Conservative anchor before setting a hard revenue target |

**Suggested qualitative goals** (harder to number pre-launch but worth tracking):

- At least one astrologer successfully completes the badge application process end-to-end before public launch (pressure-tests the review workflow).
- Kahve falı completes a full cycle (upload → interpretation → rating) with turnaround under the stated SLA (e.g., 24 hours) for at least 90% of orders.
- No critical payment or credit-wallet defect reported in the first 30 days (given real money is involved from day one).

**Open question for the user**: what would count as "MVP is working" in business terms — is the priority proving user demand (WAU, retention), proving astrologer economics (do astrologers actually earn enough to stay), or proving unit economics (is each session profitable after payment processing and revenue share)? The three point to different emphasis in what gets built first.

## 3. Target Users & Personas

**End users (consumers)**

- *Casual browser* — follows a few astrologers, reads free daily/weekly content, rarely pays. Primary value: habitual daily-open content (transit notifications, sign forecasts).
- *Curious convert* — engages with free content repeatedly, provides birth time/location, eventually books a first paid session or kahve falı. This is the core conversion target for the free-to-paid funnel.
- *Repeat client* — has a favorite astrologer (or two), books recurring private sessions, may hold a credit balance or premium subscription. Highest lifetime value.
- *Kahve falı casual* — primarily interested in the cultural/social ritual of coffee-cup fortune telling rather than deep astrology; often arrives via a friend's group session or referral, lower initial trust in the platform, high volume/low price-point behavior.

**Astrologers (supply side)**

- *Amateur / emerging astrologer* — new to the platform, no badge yet, builds reputation through free/low-cost sessions and kahve falı readings, aims to accumulate ratings toward the Top Rated badge.
- *Verified Professional astrologer* — established practitioner (may have an existing following on Instagram/YouTube/etc.), applies for or is invited to receive the Verified Pro badge, expects the platform to drive bookings and handle payments/scheduling/video infrastructure so they can focus on the craft.
- *Recruited/known-name astrologer* — well-known in the industry (via TV, social media, or existing client base), invited by the platform with a badge granted upfront as a growth/credibility strategy; used sparingly and by hand-selection only.

**Platform operator (internal)**

- *Trust & safety / support admin* — reviews badge applications, background-checks applicants, handles disputes and fraud signals (see the separate Trust & Safety document).
- *Content/growth ops* — curates featured astrologers, manages the recruited-badge outreach strategy, monitors engagement metrics.

## 4. Scope — Platform & Market

**Platform**: mobile (iOS + Android) and web, both in MVP scope. Web is used by both end users and astrologers — astrologers in particular are likely to prefer managing their profile, content calendar, and session availability from a desktop web dashboard rather than mobile alone, while end users may use either surface interchangeably. Mobile and web should share a single backend/API so content, bookings, and wallet state stay in sync across surfaces.

**Market & language: English**. This is interpreted as the primary product language and target audience being English-language / international from MVP, rather than a Turkey-only, Turkish-language launch as initially discussed. **This is a meaningful shift from earlier discussion in this project** (the visual designs, screen copy, and kahve falı framing were built around a Turkish-first, Turkey-launch assumption), so it's flagged as an assumption to confirm rather than silently carried forward:

- If Sirea is English-first and international from day one, kahve falı — while still a strong differentiator — becomes one specialty offering among astrologers on the platform rather than the platform's cultural anchor, and Turkish payment rails (PayTR, Payguru-style providers) become secondary to more globally standard payment infrastructure (Stripe, Apple/Google in-app billing).
- If the intent is instead: build in English (documentation, interface language default) but launch and market first in Turkey (where the founder has an existing network, and where kahve falı has natural cultural pull), that is a different scope decision — English UI with a Turkey-first go-to-market, expanding internationally later.

This PRD proceeds on the assumption that **English is the platform's interface/content language and the go-to-market is international from MVP**, with Turkey as one of several initial markets rather than the sole one. A comment is left on this section — confirm or correct before downstream documents (user flows, user stories) lock this in, since it affects payment provider selection, content localization scope, and marketing/growth planning materially.

## 5. User Roles & Permissions

| Role | Can do | Cannot do |
| --- | --- | --- |
| Free-tier user | Browse feed, follow astrologers, view free daily/weekly content, join astrologer-designated free sessions, hold a wallet with credits | Join paid-tier group sessions; rate an astrologer without a completed paid session |
| Paid-subscriber user | Everything free-tier can, plus: join premium-tier group sessions | Same rating restriction as free tier |
| Any user post-session | Rate and review the astrologer they booked (private session or kahve falı only) | Rate an astrologer they have not booked |
| Amateur astrologer | Post content, hold private/group/kahve falı sessions, receive ratings, apply for Verified Pro badge, apply for Top Rated badge (automatic once rating threshold is met) | Display the Verified Pro badge without approval |
| Verified Pro astrologer | Everything an amateur can, plus: displays Verified Pro badge, appears with priority in same-surface discovery/search ranking | — |
| Recruited astrologer | Granted Verified Pro badge directly by platform (hand-selected, limited) | — |
| Admin / support | Review badge applications, run background checks, moderate disputes, view platform-wide analytics, issue refunds/credit adjustments | — |

Note: per earlier discussion, the platform does **not** rank astrologers into a tiered ladder — badges and stats (volume, quality, consistency) are surfaced for users to judge themselves, with badge-holders getting priority *placement* in shared discovery surfaces, not a separate hidden tier.

## 6. Core Features — Content & Discovery

**Feed**

- Mixed content stream: algorithmic daily/weekly/monthly sign forecasts (platform-generated, not astrologer-authored) interleaved with followed astrologers' posts, live group session promotions, and kahve falı prompts.
- Content types supported: text posts, images, video uploads, and (future) live-streamed group sessions.
- "Stories"-style row of followed astrologers at the top of the feed for quick access.

**Personalization**

- Sun-sign-only content available immediately at signup (date of birth only).
- Full natal chart (requires birth time + location) unlocks richer personalized content; birth time/location capture is optional at signup and can be added later — framed as a ritual/onboarding moment rather than a bare form field (see visual design work already completed for this).
- Transit-based push notifications (e.g., "Mercury retrograde is affecting your communication house") as a low-cost, algorithmic retention mechanic, available even to users without a full natal chart.

**Discovery**

- Search/browse astrologers by specialty (astrology, kahve falı, tarot \[future\]), badge status, rating, and price range.
- Badge-holders (Verified Pro, Top Rated) surface with priority in shared discovery/search results — same surface as amateurs, ranked higher, never hidden separately (per earlier discussion).
- Compatibility/chart-comparison feature: users can compare their chart with a friend's, doubling as a viral invite mechanic (a friend without an account is prompted to join to see their own chart).

**Referral / invite loop**

- Formalized referral mechanic: an astrologer (especially amateurs building ratings) can invite users to a free session; both the astrologer and the invited user receive a small incentive (credit bonus or badge-progress credit) for the invite converting into a genuine new account — reframing what could otherwise look like rating-farming into a sanctioned growth channel (see Trust & Safety document for the abuse-prevention reasoning behind this design).

## 7. Core Features — Astrologer Profiles, Badges & Ratings

**Profile**

- Avatar, name, specialty tags (Vedic astrology, relationship readings, kahve falı, etc.), bio, language(s) spoken.
- Stats visible to all users: total sessions completed, average rating, rating count, follower count. No platform-assigned rank or tier is shown — only these raw, user-interpretable stats (see Section 5).
- Content tab (posts) and reviews tab, both visible on profile.

**Badges** (two independent, both visible if held)

- *Verified Pro*: application-based. Astrologer submits an application, answers platform-defined questions about their background and practice, and undergoes a background check (identity verification, professional standing, cross-check against known social/professional presence). Reviewed case-by-case, not against a fixed checklist. Can also be granted directly by the platform to hand-selected, already-well-known astrologers as a deliberate growth/credibility strategy (limited, invite-only).
- *Top Rated*: automatic, algorithmic. Awarded once an astrologer crosses a ratings threshold — suggested starting point: 100 completed, rated sessions at a 4.5+ average — recalculated continuously. Open to amateurs; does not require Verified Pro status.

**Ratings**

- Only users who completed a paid *or* platform-eligible free session (private session, group session, or kahve falı) with that astrologer may rate them — general followers cannot rate.
- Rating-farming defenses (detailed further in the Trust & Safety document): no hard caps on free sessions (since free sessions are also the referral/growth mechanic), but rating eligibility is weighted by signals such as session duration, rater diversity (has this rater rated many different astrologers, or only this one repeatedly), and timing patterns — flagged for human review rather than auto-blocked at MVP.
- Badges are revocable: a Top Rated badge (and its underlying ratings) can be pulled retroactively if a fraud pattern is confirmed, with a visible "under review" state in between.

## 8. Core Features — Booking, Sessions & Kahve Falı

**Private sessions**

- Astrologer sets availability, session length, and price (or offers it free, at their discretion, typically used by amateurs to build ratings).
- Delivered via in-app video/voice — no redirect to a third-party platform (Zoom, WhatsApp, etc.). This is an explicit requirement from earlier discussion and has real infrastructure implications (see Non-Functional Requirements).
- Astrologer chooses, per session type, between two payout models: (a) bundled — included in a subscriber's tier, astrologer receives a share of pooled subscription revenue; (b) à la carte — paid directly per booking via the user's credit wallet.

**Group sessions**

- Live, ticketed or open events ("Space"-style), hosted by an astrologer, in-app video/voice.
- Astrologer sets access level: fully free (any subscriber), or premium-tier only (paid subscribers), with the platform paying out a smaller per-session amount when premium-gated.

**Kahve falı (coffee-cup fortune telling)**

- Two delivery modes: (1) async photo upload — user photographs their coffee cup, astrologer interprets and responds within a stated SLA (e.g., 24 hours); (2) live video/voice — real-time reading, same in-app infrastructure as private sessions.
- Reveal UX: builds a moment of anticipation/ritual around the interpretation appearing (already reflected in the visual design work completed for this project) rather than a flat notification.
- Positioned as a lower-cost, lower-commitment entry point relative to full astrology sessions — a natural place for amateur astrologers to build initial volume and ratings, and for casual users to try the platform before committing to a deeper reading.

**Scheduling**

- Astrologer-managed availability calendar; users book into open slots.
- Reminder notifications ahead of scheduled sessions (private and group).
- Cancellation/reschedule policy: to be defined — open question for a future revision (affects both astrologer payout rules and user refund/credit rules).

## 9. Core Features — Wallet & Subscription Tiers

**Subscription tiers** (three at MVP, per earlier discussion; may expand)

1. **Free** — browse content, follow astrologers, join free-tier sessions only.
2. **Premium** — everything in Free, plus access to premium-gated group sessions, priority content feed placement.
3. **Premium + Credit bundle** — everything in Premium, plus a monthly credit allotment applied automatically to the wallet, priority queue position for booking in-demand astrologers.

**Credit wallet**

- Always available regardless of subscription tier; top-up via standard amounts (e.g., $50 / $100 / $250, or local-currency equivalents once markets are defined).
- Used for private sessions and kahve falı booked à la carte (outside the bundled-subscription model).
- Wallet balance and transaction history visible to the user at all times; refund/credit-adjustment path needed for cancelled or disputed sessions (ties to the open cancellation-policy question in Section 8).

**Payment processing**

- Given the English/international scope assumption (Section 4), standard international payment rails (Stripe, Apple/Google in-app purchase for mobile subscriptions) are the likely default, with local payment methods added per-market as needed. This differs from the Turkey-specific processors (PayTR, Payguru-style) that would apply under a Turkey-first scope — flagged again here since it is a direct consequence of the Section 4 assumption and affects backend integration work significantly.

## 10. Non-Functional Requirements

**In-app video/voice infrastructure**

- Live sessions (private and group) must run natively in-app, not redirect to third-party tools. This requires a WebRTC-based (or equivalent) video/voice layer with scheduling, waiting-room, and recording-consent handling — a significant infrastructure investment relative to embedding an existing tool, and worth validating as a hard requirement versus a fast-follow for MVP given the in-house, no-fixed-timeline development context (Section 4/5 of the earlier discussion).

**Data privacy**

- Birth date, time, and place are sensitive personal data used for natal chart generation — handle under applicable data protection law for each launch market (GDPR if any EU users, KVKK if Turkey remains a market, general data-minimization practice otherwise).
- Kahve falı photo uploads and any video/voice session recordings are sensitive; define retention and deletion policy explicitly (not yet specified — open question).

**Payments & financial data**

- PCI-DSS-compliant handling for any card data (in practice: never storing raw card numbers, using a compliant processor/tokenization).
- Wallet balances and transaction ledgers require accurate, auditable record-keeping given real money is held on behalf of users between top-up and spend.

**Performance & reliability**

- Live session infrastructure needs defined uptime/latency targets before launch (not yet specified — a dropped live session is a severe trust event for a paid, real-time consultation).
- Feed and content should load quickly on mobile networks typical of the target market(s).

**Moderation & fraud tooling**

- Logging infrastructure for the behavioral fraud-detection signals described in Section 7 (session duration, rater diversity, timing patterns) should be built from day one even if automated enforcement is deferred, per the "log now, automate later" approach discussed earlier.

**Localization**

- Interface built in English per Section 4; architecture should not hard-code English strings if Turkish (or other-language) markets are added later, to avoid a costly retrofit.

## 11. Out of Scope (MVP)

- Mentorship/endorsement layer between Verified Pro and amateur astrologers (explicitly deferred per earlier discussion — good idea, not MVP).
- Additional divination categories beyond astrology and kahve falı (tarot, numerology) — natural expansion, not required for launch.
- Algorithmic AI-generated personalized readings beyond basic sun-sign content (distinguish from astrologer-authored content, which is core to the platform's identity).
- Merchandise/product sales (seen in some competitor platforms like Astroyogi's gemstone/product marketplace) — not part of Sirea's initial model.
- Advanced internal analytics/growth-ops tooling beyond what's needed to run the badge application and fraud-signal review process manually.
- Multi-language localization beyond English (see Section 10 — architecture should allow for it later, but translated content is not an MVP deliverable).

## 12. Assumptions, Open Questions & Related Documents

**Key assumptions made in this PRD** (confirm or correct):

- English-language, international-first market scope (Section 4) — the most consequential assumption in this document; affects payments, localization, and go-to-market.
- In-app video/voice is a hard MVP requirement rather than a fast-follow (Section 10).
- Suggested success metrics (Section 2) are illustrative benchmarks, not validated targets.

**Open questions**

- Cancellation/reschedule and refund policy for sessions (Section 8).
- Data retention/deletion policy for kahve falı photos and session recordings (Section 10).
- Which of the three framings in Section 2 (user demand, astrologer economics, unit economics) is the priority "MVP is working" signal.
- Exact revenue-share formula for the bundled/subscription-pooled payout model (Section 8) — how pooled subscription revenue is split among astrologers who opt into it.

**Related documents**

- **Trust & Safety** (separate document, not folded into this PRD per the earlier decision to keep this PRD focused on product scope): badge application criteria, rating-farming defenses, referral-loop abuse prevention, dispute handling.
- **User Flow diagrams**: step-by-step screen flows for the core journeys named in this PRD (sign-up → follow → book; kahve falı upload → reveal → rate; badge application).
- **Visual design reference**: color system, typography, and four core screen mockups already completed in this project (feed, astrologer profile, kahve falı reveal, wallet/subscription) — built under the earlier Turkish-first assumption; will need a pass to confirm they still fit if the English/international scope in Section 4 is confirmed.
