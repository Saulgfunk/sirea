# Sirea

## What this is

Sirea is a content-and-marketplace platform connecting astrologers with people seeking astrological guidance — structured like a creator economy (Patreon/Cameo), not a personalized-horoscope app (unlike Co-Star/Nebula/The Pattern, where the *app* is "the astrologer"). Astrologers build an audience through free content (daily/weekly/monthly sign forecasts, posts, video) and monetize through private 1:1 sessions, live group sessions, and **kahve falı** (Turkish coffee-cup fortune telling, delivered via async photo upload or live video/voice). Trust is carried by two independent badges (Verified Pro, application-based; Top Rated, algorithmic) plus visible raw stats — never a hidden platform-assigned tier. All live sessions run natively in-app (WebRTC-based); no redirect to third-party tools like Zoom or WhatsApp is permitted. Astrologers choose, per session type, between a bundled (subscription-pool, rating-weighted split) or à la carte (flat commission, wallet-credit) payout model.

Full planning docs live in [`docs/`](docs/) — PRD, user flows, user stories, trust & safety, business model, competitive analysis, MVP roadmap, technical architecture, and the design system (`docs/design-system/`). This file is the fast-context summary; go to the source doc for detail rather than re-deriving it here.

## Data model (entity list — see `docs/08-Technical-Architecture.md` §3 for fields)

`User`, `Profile` (birth date/time/place, natal chart), `AstrologerProfile`, `Badge`, `BadgeApplication`, `Follow`, `Post`, `Session` (private/group/kahve-falı-live), `SessionParticipant`, `KahveFaliOrder`, `Rating`, `WalletAccount`, `WalletTransaction`, `Subscription`, `ReferralInvite`, `FraudSignal`.

Notable constraints baked into the model: `WalletTransaction` is meant to be an append-only ledger (immutable once written, not editable balance fields) for audit integrity; `FraudSignal` is a polymorphic association that can flag a `Rating`, `Session`, or `ReferralInvite` for manual admin review rather than auto-enforcement.

## Tech stack (recommended, not mandated — see `docs/08-Technical-Architecture.md` §1–2)

- **Mobile**: React Native · **Web**: Next.js · **Backend**: Node.js + TypeScript · **DB**: PostgreSQL (relational integrity matters for wallet ledgers and double-booking prevention) · **Realtime**: WebSockets
- **Payments**: Stripe (web/wallet top-up) + Apple In-App Purchase / Google Play Billing (mobile subscriptions — required by platform policy, Stripe alone can't do mobile subscription billing)
- **Video/voice**: LiveKit (self-hostable, avoids per-minute vendor lock-in)
- **Chart calculation**: Swiss Ephemeris (license terms not yet confirmed for commercial use — see open questions)
- **Identity verification**: Persona/Onfido for identity, manual admin cross-reference for professional credentials
- **Content moderation**: automated image moderation (AWS Rekognition / Google Cloud Vision) as first pass on kahve falı photo uploads, backed by manual review

All of the above is explicitly negotiable — swap freely if the developer has stronger existing familiarity elsewhere. The data model and API grouping (`docs/08-Technical-Architecture.md` §4) should hold regardless of framework choice.

## Key architectural constraints

- **In-app video/voice only, no third-party redirect.** Hard MVP requirement per the PRD, not a fast-follow — private sessions, group sessions, and live kahve falı all depend on this one infrastructure layer. Flagged in the roadmap as the single largest Phase 1 dependency; build/integrate it early.
- **Two-badge trust system, kept structurally separate.** *Verified Pro* is application-based (case-by-case admin review + background check) or platform-granted (hand-selected, invite-only, limited). *Top Rated* is algorithmic (crosses a ratings threshold, suggested starting point 100 sessions at 4.5+ avg). Both badges are independently revocable. Never collapse these into a single "trust score" — they answer different questions (credibility vs. performance) and the design deliberately keeps them visually and structurally distinct.
- **No platform-assigned ranking tier.** Astrologers are never sorted into a hidden ladder — badges affect discovery *placement* priority within a shared result set; stats (sessions completed, avg rating, rating count, follower count) are shown raw for users to judge themselves.
- **Rating eligibility is gated, not open.** Only users who completed a paid-or-eligible-free session with an astrologer may rate them. Free sessions are deliberately uncapped (they double as the referral/growth mechanic), so rating-integrity relies on organic signals (session-duration minimum, rater-diversity weighting, delayed/decayed weight, behavioral clustering) rather than hard caps — see `docs/04-Trust-and-Safety.md`. **"Log now, automate later"**: instrument all fraud signals from day one, but keep enforcement manual/admin-reviewed at MVP; don't build automated blocking rules against hypothetical abuse.
- **Payout split is per-session-type, astrologer's choice**: bundled (subscription-pool, split by `sessions_i × avg_rating_i` share of the pool — rating-weighted deliberately, to avoid rewarding high-volume/low-quality gaming) vs. à la carte (flat commission % per booking, from wallet credit). See `docs/08-Technical-Architecture.md` §5 for the proposed formula — **the actual commission % and pool size are unresolved**, see below.
- **Wallet top-up and subscription are orthogonal.** Neither requires the other. Wallet funds à la carte sessions/kahve falı; subscription tier gates premium group sessions and (Premium+Credit tier) auto-applies monthly credit.
- **Architecture should not hard-code English strings**, even though English is the only MVP-shipped language — retrofit cost for future localization is the reason, not an MVP deliverable itself.

## Open questions — confirm before building dependent code

These are unresolved in the source docs, not implementation details I can infer. Do not write code whose behavior depends on these until confirmed — flagged explicitly below by what they block.

1. **English/international-first vs. Turkey-first go-to-market.** The PRD *proceeds on the assumption* that English is the interface language and go-to-market is international-first from MVP (Turkey as one market among several), but flags this as a meaningful shift from earlier Turkey-first discussion and asks for explicit confirmation. This is the single most consequential open item — it directly determines:
   - **Payment provider**: Stripe/Apple/Google (international) vs. PayTR/Payguru-style rails (Turkey-specific)
   - **Applicable data-protection regime**: GDPR (if EU users) vs. KVKK (if Turkey)
   - **Kahve falı's product role**: cultural anchor (Turkey-first) vs. one specialty offering among several (international-first)
   - **Verified Pro background-check sourcing**: may need to vary by market
   - **Blocks specifically**: payment integration code, localization/string architecture decisions, any market-specific compliance work. Non-market-specific scaffolding (data model, API routes, UI shell) can proceed in parallel.

2. **Exact commission percentage and bundled-pool sizing for the revenue-share formula.** `docs/08-Technical-Architecture.md` §5 proposes a concrete formula shape (rating-weighted pool split for bundled sessions; flat % for à la carte) but the actual numbers — platform commission % (15–25% suggested range, unconfirmed), what fraction of subscription revenue feeds the bundled pool, and whether the rating-weight curve should be linear or steeper — are business decisions, not resolved here. **Blocks**: any real payout/payment logic. Do not hardcode a commission number without confirming it first.

3. Secondary open items (lower urgency, tracked in source docs, listed for completeness):
   - Cancellation/reschedule and refund policy (`01-PRD.md` §8, `04-Trust-and-Safety.md` §5)
   - Data retention/deletion policy for kahve falı photos and session recordings (`01-PRD.md` §10) — build the deletion-TTL *hook* now per the architecture doc's advice, even before the retention window itself is decided
   - Which MVP-success framing is the priority: user demand, astrologer economics, or unit economics (`01-PRD.md` §2)
   - Swiss Ephemeris commercial licensing terms (`08-Technical-Architecture.md` §2)
   - Content moderation policy specifics (technical hook — automated first-pass filter — should exist regardless)
   - Cooldown length for Verified Pro reapplication after rejection; Top Rated/rating-delay threshold tuning (both marked as suggested starting points, not validated)

## Roadmap shape (see `docs/07-MVP-Roadmap.md` for full detail)

Three phases sequenced by build dependency, not calendar date (no launch date set yet):
- **Phase 1 (MVP)**: the smallest complete core loop — discover → follow → book (private session or kahve falı, async) → pay → rate. Free subscription tier only; Verified Pro application flow; baseline (non-enforced) fraud-signal logging.
- **Phase 2 (fast-follow)**: group sessions, Premium tier, Top Rated automatic badge, live-video kahve falı, formalized referral rewards, fraud-signal weighting/enforcement graduates from "logged" to "active."
- **Phase 3 (post-MVP)**: mentorship/endorsement layer, additional divination categories (tarot, numerology), deeper trust automation, e-commerce, multi-language localization.

## Design system

Tokens and usage rules live in `docs/design-system/` (`README.md` + `tokens.json`) — dark theme, editorial/restrained register (not glow-and-gradient mystical), with `gold` reserved for trust signals, `purple` for the mystical/group layer, `coral` as the sole CTA color. No component library yet — tokens only, applied against four not-yet-attached mockups (feed, astrologer profile, kahve falı reveal, wallet/subscription). Note: the design system's visual/copy language was built under the earlier Turkey-first assumption (see open question 1) and may need a pass once market scope is confirmed.
