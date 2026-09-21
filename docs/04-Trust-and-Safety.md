# Sirea — Trust & Safety

2026-09-21 · @Someone

Companion to the PRD, User Flows, and User Stories. Covers badge integrity, rating fraud prevention, and dispute handling — kept as its own document per the earlier decision to keep the PRD focused on product scope.

## 1. Overview & Guiding Principles

Sirea's trust model rests on three signals working together: **badges** (credibility, either applied-for or platform-granted), **ratings** (performance, earned only from paying/eligible users), and **stats** (raw activity, always visible, never algorithmically ranked into a tier). Trust & safety work protects the meaning of these three signals without adding friction that suppresses supply, particularly for amateur astrologers who need a low-barrier way to build a track record.

**Guiding principles carried over from earlier product discussion:**

1. Prefer organic, structural defenses (pacing, weighting, behavioral signal) over hard blocks (caps, KYC-level verification) wherever possible — friction that blocks legitimate amateur growth is a bigger cost than a slow-to-close loophole.
2. Treat a pattern that looks like abuse (e.g., an astrologer inviting friends to a free session to build ratings) as potentially a legitimate growth behavior first — the response is to make the legitimate version more rewarding, not to shut the behavior down outright.
3. Automate enforcement only once real abuse data exists. At MVP, suspicious patterns are logged and flagged for manual review, not auto-blocked.
4. Reversibility is a backstop, not a substitute for prevention: badges and ratings can be revoked retroactively if fraud is later confirmed, which takes some pressure off getting detection perfect on day one.

## 2. Badge System

**Verified Pro (application-based, case-by-case review)**

- Astrologer submits an application from profile settings, answering platform-defined questions about background, training, and practice history.
- Admin conducts a background check: identity verification, cross-referencing claimed credentials against public/professional presence (verified social accounts, existing client base, media mentions, prior published work).
- Review is deliberately case-by-case rather than a fixed checklist — early applicants set informal precedent; consider documenting decisions internally (even informally) so later reviewers apply reasonably consistent judgment as volume grows.
- Approved applicants display the badge immediately; rejected applicants receive a reason and may reapply after a cooldown period (length not yet defined — open question).

**Platform-granted (recruited) badges**

- Reserved for hand-selected, already-well-known astrologers, granted directly without the application flow, as a deliberate strategy to seed credibility and drive user adoption at launch.
- Kept deliberately limited and manually curated — not a scalable path, and not disclosed to users as different from an earned badge (the badge's public meaning stays consistent; the distinction is tracked internally so the platform can defend the badge's integrity if ever challenged).

**Top Rated (algorithmic, open to amateurs)**

- Awarded automatically once an astrologer crosses a ratings threshold — suggested starting point (from the PRD): 100 rated sessions at a 4.5+ average, recalculated continuously.
- Requires no application and no Verified Pro status — this is the primary cold-start mechanism for amateurs, since it lets reputation substitute for credentials.
- Because it is purely metric-driven, it is also the badge most exposed to gaming — see Section 3.

## 3. Rating Integrity & Anti-Farming Defenses

**Baseline eligibility rule**: only users who completed a paid *or* platform-eligible free session (private session, group session, or kahve falı) with a given astrologer may rate them. General followers cannot rate. This alone rules out the simplest abuse (rating without any interaction).

**The harder problem**: free sessions are intentionally uncapped (per product decision — they're also the amateur ratings-building and referral-growth mechanism), so an astrologer could in theory hold many free sessions for the same small group of friends to farm ratings quickly. Rather than capping free sessions (which would blunt their legitimate use), the following organic, signal-based defenses apply:

| Defense | How it works | Enforcement at MVP |
| --- | --- | --- |
| Delayed/decayed rating weight | A rating doesn't count toward the public score immediately — held \~48–72h, and recent ratings weighted more than old ones | Log the delay window; weight in the score calculation |
| Session-duration minimum | A rating is only eligible if the session lasted a meaningful minimum time (data already captured since sessions run in-app) | Enforce as a hard eligibility gate — this one is cheap and low-false-positive enough to automate at MVP |
| Rater diversity weighting | A rating from someone who has rated many different astrologers counts more than one from someone who only ever rates a single astrologer repeatedly | Compute as a background signal; feed into badge threshold calculation, not shown to users |
| Behavioral clustering detection | Users who repeatedly attend the same astrologer's free sessions and rate in a coordinated pattern (timing, session overlap) are flagged | Log the behavioral data from day one; treat as a **manual review trigger**, not an automated block, until real abuse patterns are observed |

**Why manual review, not automated blocking, at MVP**: automated fraud rules designed against hypothetical abuse (rather than observed abuse) tend to over- or under-fire. The approach here is to instrument thoroughly, review flagged cases by hand early on, and only write automated rules once real cases show what the actual abuse patterns look like.

## 4. Referral / Invite Loop — Reframing "Farming" as Growth

An amateur astrologer inviting friends to a free session to build ratings looks, on the surface, like the exact abuse pattern Section 3 defends against. The product decision made earlier in this project is to treat it instead as **a real acquisition channel that happens to resemble gaming**, and design toward converting the invited person into a genuine user rather than trying to prevent the invite itself.

**How this is operationalized:**

- Every invited session is treated as an onboarding funnel moment, not just a rating event: immediately after the invited user rates the session, they're shown other astrologers/content (see User Flows, Flow 7) and, since their birth date is already known, a personalized teaser (their own sun-sign forecast) — making the platform about *them*, not just about supporting their friend.
- The referral becomes an explicit, rewarded mechanic (trackable invite codes) rather than an incidental, unrewarded one: the astrologer gets a small credit bonus or badge-progress credit tied to the invited user completing a genuine signup — not tied to the rating itself, which shifts the incentive from "get rated" to "bring someone who sticks around."
- Internally, track *reach* (unique new users an astrologer brings in) as a separate signal from their public rating. An astrologer who brings 40 unique users over a month is valuable to the platform even if some of those sessions' ratings are "soft"; one who has the same 3 friends attend repeatedly is not — this distinction is a segmentation/analytics question, not a policing one, and can inform internal growth support (e.g., which amateurs get extra visibility) without being a public-facing badge or score.

## 5. Dispute Handling & Session Issues

Not fully specified in earlier discussion — this section lays out the shape of the problem and the decisions still needed rather than final policy.

**Scenarios needing a defined path:**

- Astrologer no-shows or cancels a booked/paid session → user should be refunded or credited automatically; astrologer's completion-rate stat should reflect the no-show.
- User disputes the quality of a completed reading (dissatisfied but the session happened) → this is a harder case than a no-show, since "quality" is subjective; a review/rating is the primary outlet for this rather than a refund mechanism, to avoid incentivizing bad-faith refund requests after receiving the reading.
- Kahve falı interpretation delivered late (past the stated SLA) → define whether this triggers an automatic partial credit or just a service-quality flag against the astrologer.
- Harassment or inappropriate conduct during a live session (either direction — user toward astrologer, or astrologer toward user) → needs a report mechanism from within the live session UI itself, escalating to admin review; likely the most urgent gap to close before launch given real-time video/voice is involved.

**Open questions to resolve before this section can be finalized** (tracked also in the PRD, Section 12):

- Exact cancellation/reschedule and refund policy.
- Who bears the cost of a payment-processing failure mid-session (platform, astrologer, or user)?
- Escalation path and SLA for admin response to an in-session harassment report.

## 6. Badge Revocation & Appeals

**Revocation triggers:**

- Confirmed rating manipulation (coordinated free-session clustering, per Section 3) sufficient to have inflated the astrologer past the Top Rated threshold artificially.
- Verified Pro credentials found to be materially false after approval (e.g., claimed credential doesn't hold up under later scrutiny, such as a user complaint prompting re-review).
- Repeated confirmed disputes (Section 5) indicating a pattern of harm, not an isolated incident.

**Process:**

1. Flagged case moves to an "under review" state — badge remains visible but marked, rather than silently vanishing, so the astrologer and users see the process is active rather than arbitrary.
2. Astrologer is notified and given an opportunity to respond before a final decision (mirrors the case-by-case spirit of the original application review in Section 2).
3. If confirmed, the badge is removed and the specific ratings found to be fraudulent are excluded from the public average (not the entire rating history, unless the pattern is pervasive enough to warrant it).
4. Astrologer may reapply for Verified Pro after a defined cooldown; Top Rated is naturally re-earnable once legitimate ratings accumulate past the threshold again.

**Appeals**: the astrologer should have a channel to contest a revocation decision beyond the initial response window in step 2 — exact mechanism (a formal appeal to a second reviewer, a support ticket path, etc.) is an open question.

## 7. Moderation Operations

**Log now, automate later** — the operating principle for all fraud/abuse tooling in this document. At MVP:

| Build now | Defer until real data exists |
| --- | --- |
| Logging: session duration, rater history, invite-code usage, rating timing patterns | Automated blocking rules based on those logs |
| A manual admin review queue for flagged badge applications and disputes | A scoring/risk-model system that auto-approves or auto-rejects |
| Badge revocation as a manual, case-by-case admin action | Automated badge revocation |

**Why this matters for a two-person-scale team**: with development handled in-house and no fixed timeline (per the PRD), building a sophisticated automated trust & safety system before launch would consume disproportionate engineering time relative to the actual abuse the platform will see in its first months. Manual review is slower per case but requires far less upfront engineering, and produces the real-world data needed to design good automated rules later — trying to solve this perfectly pre-launch is a common early-stage trap.

**Staffing implication**: even at small scale, someone (the founder, or an early hire) needs to be the person who reviews flagged cases and badge applications — this is an operational commitment, not just a product decision, and should be accounted for in early team planning.

## 8. Open Questions

- Cooldown length before a rejected Verified Pro applicant may reapply (Section 2).
- Exact thresholds for the rating-delay window and Top Rated badge cutoff (Section 2/3) — suggested starting points given, not validated.
- Cancellation/reschedule and refund policy (Section 5) — same open item flagged in the PRD.
- Appeals mechanism for badge revocation (Section 6).
- Who staffs the manual review queue at launch, and what response-time SLA is realistic given the in-house, no-fixed-timeline development context (Section 7).
- Given the PRD's open scope question (English/international-first vs. Turkey-first go-to-market), whether background-check sources for Verified Pro applications need to vary by market (e.g., verifying a Turkish astrologer's credentials vs. one in another country may rely on different public records or professional bodies).
