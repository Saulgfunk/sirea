# Sirea — MVP Roadmap

2026-09-21 · @Someone

Companion to the PRD, User Stories, and Trust & Safety documents. Timeline is intentionally left open (per current planning) — phases are sequenced by dependency and priority, not calendar dates; add target dates once a launch window is set.

## Roadmap Principles

Three phases, sequenced by build dependency and by what's needed to validate the core loop (content → follow → book → rate) before adding anything that assumes that loop already works:

- **Phase 1 (MVP)**: the smallest version of the full loop — a user can discover an astrologer, follow them, book a session or kahve falı, pay, and rate. Nothing in Phase 1 depends on features from later phases.
- **Phase 2 (Fast-follow)**: features that meaningfully improve retention/monetization but aren't required for the core loop to function — group sessions, the Top Rated automatic badge, live kahve falı, formalized referral rewards.
- **Phase 3 (Post-MVP expansion)**: features explicitly marked out of scope in the PRD — mentorship/endorsement layer, additional divination categories, deeper trust-and-safety automation, e-commerce-style monetization.

Each phase assumes the prior phase is live and stable, not calendar-complete — since the timeline itself is open, this roadmap sequences *what* comes before *what*, not *when*.

## Phase 1 — MVP Launch

The smallest complete version of the core loop. Story IDs reference the User Stories document.

| Area | Included | Story IDs |
| --- | --- | --- |
| Onboarding | Signup, birth date capture, optional birth time/place, sun-sign content | ON-1, ON-2, ON-3 |
| Content & discovery | Mixed feed, follow/unfollow, search/filter by specialty/badge/rating/price | CD-1, CD-2, CD-3 |
| Astrologer profile | Stats display, badge display, content + reviews tabs | PB-1, PB-2 |
| Ratings | Post-session rating for eligible users only, rating-ineligibility enforcement | PB-3, PB-4 |
| Private sessions | Astrologer-managed availability/pricing, wallet-credit and subscription payment, in-app video/voice, reminder notifications | PS-1, PS-2, PS-3, PS-4, PS-5 |
| Kahve falı | Async photo upload, payment, SLA-bound interpretation, reveal screen, rating | KF-1, KF-2, KF-3, KF-4 |
| Wallet | Top-up, balance/transaction history | WS-1, WS-2 |
| Subscriptions | Free tier only at launch (Premium can follow in Phase 2 if group sessions aren't ready simultaneously — see dependency note in Section 5) | WS-3 (partial) |
| Badges | Verified Pro application + manual admin review; platform-granted badge for recruited astrologers | AD-1, AD-2, AD-3, AD-4 |
| Trust & safety | Baseline rating-eligibility rule, session-duration-minimum eligibility gate, behavioral logging (not yet acted on) | Trust & Safety, Sections 1, 3 |

**Deliberately excluded from Phase 1**: group sessions, Top Rated automatic badge, live-video kahve falı, formalized referral rewards, chart comparison — all Phase 2 (Section 3 below).

## Phase 2 — Fast-Follow

Features that strengthen retention and monetization once the core loop is proven, but that a first launch doesn't strictly need.

| Area | Included | Story IDs |
| --- | --- | --- |
| Group sessions | Free and premium-gated live group sessions, attendee counts | GS-1, GS-2, GS-3, GS-4, GS-5 |
| Subscriptions | Premium tier (unlocks group sessions), upgrade prompts from paywalled content | WS-3 (complete) |
| Badges | Top Rated automatic badge and its underlying threshold calculation | PB-5 |
| Kahve falı | Live video/voice variant (reuses private-session infrastructure) | KF-5 |
| Personalization | Transit-based push notifications, in-feed prompt to complete birth chart | ON-4, ON-5 |
| Growth | Chart/compatibility comparison with friends, formalized referral/invite rewards | CD-4, RF-1, RF-2, RF-3, RF-4 |
| Trust & safety | Rating-delay/decay weighting, rater-diversity weighting, manual-review queue for flagged patterns, badge revocation process | Trust & Safety, Sections 3, 6, 7 |
| Wallet | Automatic monthly credit for Premium+Credit tier, cancellation/refund automation (pending policy decision) | WS-4, WS-5 |

This phase is where the platform's trust mechanics (badge integrity, rating-farming defenses) mature from "logged but not enforced" to "actively weighted and reviewed" — appropriate once there's enough real usage data to design good rules from observed behavior rather than hypotheticals (Trust & Safety, Section 7).

## Phase 3 — Post-MVP Expansion

Everything the PRD explicitly marks out of scope for MVP (PRD Section 11), included here for sequencing visibility rather than as a near-term commitment:

- **Mentorship/endorsement layer** — Verified Pro astrologers vouching for or fast-tracking promising amateurs. Deferred deliberately; revisit once there's a large enough amateur cohort for peer-mentorship to matter.
- **Additional divination categories** — tarot, numerology, and similar, extending the platform beyond astrology and kahve falı. Natural extension of the badge/session/content architecture already built; mainly a content and astrologer-onboarding expansion rather than new core infrastructure.
- **Deeper trust & safety automation** — moving from manual-review-triggered flags (Phase 1–2) to automated enforcement, once real abuse data justifies it (Trust & Safety, Section 7).
- **Multi-language localization** — beyond the PRD's English-first scope, if Turkish or other-market localization becomes a priority (PRD Section 10 notes the architecture should not hard-code English to avoid a costly retrofit here).
- **E-commerce-style monetization** — spiritual/astrology-adjacent product sales, following the pattern Astrotalk has pursued at scale (Competitive Analysis, Section 3) — not part of Sirea's current model, included here only as a category worth revisiting once the core marketplace is proven.
- **Advanced internal analytics/growth-ops tooling** — beyond what's needed to run badge review and fraud-signal review manually (PRD Section 11).

## Build Dependencies & Sequencing Risks

- **In-app video/voice infrastructure is the single largest Phase 1 dependency.** Private sessions, kahve falı's live-mode (Phase 2), and group sessions (Phase 2) all sit on top of it. Given it's flagged in the PRD (Non-Functional Requirements) as the most infrastructure-heavy hard requirement, building or integrating it early — even before other Phase 1 features are polished — reduces the risk of it becoming a late-stage bottleneck.
- **Payment processor integration blocks both the wallet and subscriptions.** Since the PRD's scope assumption (English/international-first) points toward Stripe/Apple/Google billing rather than Turkish-specific rails, this decision should be locked early — it affects the wallet (WS-1/WS-2), private session payment (PS-2), and every subscription story.
- **Badge review process (manual) must exist before any astrologer can hold a Verified Pro badge** — meaning the very first cohort of Verified Pro astrologers depends on someone (founder or early hire, per Trust & Safety Section 7) actually running this process by hand before automation is worth building.
- **Premium subscription (WS-3) and group sessions (GS-1–GS-5) are interdependent** — a Premium tier with nothing to unlock isn't worth shipping ahead of group sessions, and group sessions with no premium gating option removes one of the two access models discussed in the PRD. These likely need to ship together, which is why Phase 1 keeps subscriptions Free-tier-only rather than partially shipping Premium early.
- **Rating-integrity signal logging (Trust & Safety Section 3) should start in Phase 1** even though the weighting/enforcement using those signals is Phase 2 — logging late means losing the early behavioral data that would make Phase 2's rules well-calibrated.

## Open Questions

- No target launch date exists yet (per current planning) — once one is set, this roadmap's phases can take on actual target dates rather than relative sequencing.
- Whether to build the in-app video/voice layer fully in-house or integrate a third-party WebRTC provider under the hood (invisible to users, so it wouldn't violate the "no third-party redirect" requirement) — a build-vs-buy decision that materially affects Phase 1 timeline given solo/in-house development capacity.
- Whether Phase 1 needs both iOS and Android simultaneously, or whether a single-platform mobile launch (plus web) is acceptable to start, deferring the second mobile platform slightly — not yet decided in the PRD, which currently scopes both from MVP.
- The PRD's open scope question (English/international-first vs. Turkey-first go-to-market) also affects this roadmap's Phase 1 astrologer-recruitment sequencing — recruiting an initial cohort of astrologers looks different depending on which market comes first.
