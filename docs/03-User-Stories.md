# Sirea — User Stories

2026-09-21 · @Someone

Companion to the PRD and User Flow diagrams. Priority: **P0** = MVP must-have, **P1** = fast-follow, **P2** = nice-to-have / post-MVP. Built on the same English/international-scope assumption flagged in the PRD.

## 1. Onboarding & Personalization

| ID | User Story | Priority | Acceptance Criteria |
| --- | --- | --- | --- |
| ON-1 | As a new user, I want to sign up with email or phone, so that I can access the app quickly. | P0 | Signup completes in ≤3 steps; email/phone verified before full access. |
| ON-2 | As a new user, I want to enter my birth date during signup, so that I see content for my zodiac sign immediately. | P0 | Sun-sign content available immediately after birth date is entered. |
| ON-3 | As a new user, I want the option to skip entering my birth time and place, so that I'm not blocked from using the app if I don't have that information handy. | P0 | Skipping leads to sun-sign-only content; no forced re-prompt blocking navigation. |
| ON-4 | As a returning user, I want to be prompted (not forced) to add my birth time and place after I've engaged with content, so that I can unlock a full natal chart when I'm ready. | P1 | Prompt appears after a defined engagement threshold (e.g., 3rd session or 5th day active); dismissible. |
| ON-5 | As a user, I want to receive a notification when a major planetary transit affects my chart, so that I have a reason to open the app beyond browsing. | P1 | Notification triggers off transit data cross-referenced with the user's sun sign (or full chart if available); user can disable in settings. |

## 2. Content Feed & Discovery

| ID | User Story | Priority | Acceptance Criteria |
| --- | --- | --- | --- |
| CD-1 | As a user, I want to see a mixed feed of daily sign content and posts from astrologers I follow, so that I have a reason to open the app daily. | P0 | Feed refreshes with new algorithmic + followed content at least once daily; no duplicate posts within a session. |
| CD-2 | As a user, I want to follow an astrologer, so that their content and live sessions surface in my feed and stories row. | P0 | Follow/unfollow is a single tap from the profile or feed; followed astrologers appear in the stories row immediately. |
| CD-3 | As a user, I want to search and filter astrologers by specialty, badge status, rating, and price, so that I can find someone who fits what I'm looking for. | P0 | Filters apply in combination; badge-holders surface with priority within the same result set (never a separate hidden list). |
| CD-4 | As a user, I want to compare my chart with a friend's, so that I can explore compatibility together. | P1 | If the friend has no account, they're prompted to sign up to view their own side of the comparison. |
| CD-5 | As a user, I want to post a comparison result or reading to share outside the app, so that I can show friends what I found. | P2 | Share generates a shareable image or link; no sensitive birth data exposed in the shared asset beyond what the user explicitly included. |

## 3. Astrologer Profile, Badges & Ratings

| ID | User Story | Priority | Acceptance Criteria |
| --- | --- | --- | --- |
| PB-1 | As a user, I want to see an astrologer's stats (sessions completed, rating, follower count) on their profile, so that I can judge their credibility myself. | P0 | Stats visible without requiring a follow or booking; update in near real-time as new sessions/ratings land. |
| PB-2 | As a user, I want to see whether an astrologer holds a Verified Pro or Top Rated badge, so that I understand what kind of trust signal it represents. | P0 | Badges are visually distinct from each other; tapping a badge shows a short explanation of what it means. |
| PB-3 | As a user who completed a paid session or kahve falı, I want to rate and review the astrologer, so that I can share my experience and help other users. | P0 | Rating form only appears for eligible completed sessions; one rating per completed session, editable within a short window (e.g., 24h). |
| PB-4 | As a user, I want to be prevented from rating an astrologer I haven't booked, so that ratings stay meaningful. | P0 | Rating action is hidden/disabled on profiles with no completed session by that user. |
| PB-5 | As an astrologer, I want my Top Rated badge to be awarded automatically once I cross the ratings threshold, so that I don't need to apply for it separately. | P1 | Badge appears within 24h of crossing the threshold (e.g., 100 rated sessions at 4.5+ average); recalculated continuously as new ratings land. |

## 4. Private Sessions & Booking

| ID | User Story | Priority | Acceptance Criteria |
| --- | --- | --- | --- |
| PS-1 | As a user, I want to book a private session with an astrologer at an available time slot, so that I can get a personal reading. | P0 | Only open slots are bookable; double-booking is prevented at the data level. |
| PS-2 | As a user, I want to pay for a private session with wallet credit or through my subscription, so that I can choose how I spend. | P0 | Both payment paths are available wherever the astrologer has enabled them; the correct path is selected based on the astrologer's chosen model. |
| PS-3 | As a user, I want to join my session via in-app video or voice, so that I never have to leave the app or use a third-party tool. | P0 | No external links generated for session join; video/voice connects within the app on both mobile and web. |
| PS-4 | As a user, I want a reminder notification before my scheduled session, so that I don't miss it. | P0 | Reminder sent at a configurable interval before start time (e.g., 15 min). |
| PS-5 | As an astrologer, I want to set my own availability and session price, so that I control my schedule and earnings. | P0 | Availability calendar is astrologer-managed; price changes apply to future bookings only, not sessions already booked. |
| PS-6 | As an astrologer, I want to choose per session type whether I'm paid via the bundled subscription pool or per-booking credit, so that I have flexibility in how I monetize. | P1 | Setting is configurable per session type, not locked platform-wide; payout ledger reflects the correct model per session. |

## 5. Group Sessions

| ID | User Story | Priority | Acceptance Criteria |
| --- | --- | --- | --- |
| GS-1 | As a user, I want to see upcoming live group sessions in my feed, so that I can decide whether to join. | P0 | Group session cards show host, topic, time, and access level (free/premium) clearly. |
| GS-2 | As a free-tier user, I want to be shown an upgrade prompt when I try to join a premium-gated session, so that I understand what I'm missing and how to get it. | P0 | Prompt routes directly into the subscription upgrade flow, not a dead end. |
| GS-3 | As an astrologer, I want to set a group session as free or premium-only, so that I control how it's used (audience growth vs. monetization). | P0 | Setting is per-session, not a fixed account-level default. |
| GS-4 | As a user, I want to join a group session directly from a reminder notification, so that I don't have to search for it again. | P1 | Notification deep-links directly into the live session screen. |
| GS-5 | As an astrologer, I want to see how many users are registered for my upcoming group session, so that I can gauge interest. | P1 | Live attendee count visible to the host before and during the session. |

## 6. Kahve Falı

| ID | User Story | Priority | Acceptance Criteria |
| --- | --- | --- | --- |
| KF-1 | As a user, I want to upload a photo of my coffee cup and choose an astrologer to interpret it, so that I can get a fal reading. | P0 | Photo upload supports standard formats; astrologer selection shows their kahve falı-specific rating and turnaround time. |
| KF-2 | As a user, I want to know how long I'll wait for my interpretation, so that I know when to check back. | P0 | Stated SLA (e.g., 24h) shown at time of order; notification sent when ready. |
| KF-3 | As a user, I want a dedicated "reveal" screen when my falı is ready, so that opening it feels like a moment rather than a flat notification. | P1 | Reveal screen matches the visual design already completed for this flow (image + interpretation text, distinct from a standard content post). |
| KF-4 | As a user, I want to rate my kahve falı experience after receiving it, so that I can give feedback and help other users choose an astrologer. | P0 | Same rating eligibility rule as private sessions (Section 3, PB-3/PB-4) applies here. |
| KF-5 | As an astrologer, I want to offer live video/voice kahve falı in addition to async photo interpretation, so that I can serve users who want a real-time experience. | P1 | Live kahve falı reuses the same in-app session infrastructure as private astrology sessions (see User Flows doc, Flow 3). |

## 7. Wallet & Subscriptions

| ID | User Story | Priority | Acceptance Criteria |
| --- | --- | --- | --- |
| WS-1 | As a user, I want to top up my credit wallet in fixed amounts, so that I can pay for sessions and kahve falı without re-entering payment details each time. | P0 | Top-up amounts are configurable server-side; balance updates immediately on successful payment. |
| WS-2 | As a user, I want to see my wallet balance and transaction history at any time, so that I know what I've spent and have left. | P0 | Transaction history includes date, amount, and what it was spent on; no ambiguity about pending vs. completed transactions. |
| WS-3 | As a user, I want to upgrade to a paid subscription tier to unlock premium group sessions, so that I can access more content. | P0 | Upgrade is a self-service in-app flow; access unlocks immediately on successful payment. |
| WS-4 | As a subscriber on the Premium+Credit tier, I want my monthly credit allotment applied automatically, so that I don't have to remember to top up. | P1 | Credit is applied on the subscription's renewal date without manual action. |
| WS-5 | As a user, I want to receive a credit refund if a session is cancelled by the astrologer, so that I'm not out of pocket for a session that didn't happen. | P1 | Refund/credit-back is automatic on astrologer-side cancellation; the exact policy (Section 8 of the PRD, still open) governs edge cases. |

## 8. Referral / Invite Loop

| ID | User Story | Priority | Acceptance Criteria |
| --- | --- | --- | --- |
| RF-1 | As an astrologer, I want to share an invite link/code for a free session, so that I can bring new users to the platform and build my ratings. | P1 | Each astrologer has a unique, trackable invite code; usage is logged per astrologer. |
| RF-2 | As an invited guest, I want to be shown other astrologers and content right after rating the session I was invited to, so that I have a reason to explore beyond the one session. | P1 | Prompt appears immediately post-rating, before the guest can navigate away; shows at least 3 other astrologer/content suggestions. |
| RF-3 | As an astrologer, I want to receive a credit bonus or badge-progress credit when an invited guest converts into a full account, so that I'm incentivized to bring genuinely new users rather than repeat the same few. | P2 | Reward triggers only on account creation (not just attendance); reward tied to unique new users, not repeat invitees. |
| RF-4 | As an invited guest who converts to a full account, I want to receive a small credit bonus, so that I have an incentive to explore the platform further. | P2 | One-time bonus applied on account creation via a valid invite code. |

## 9. Astrologer Badge Application & Admin/Trust Workflows

| ID | User Story | Priority | Acceptance Criteria |
| --- | --- | --- | --- |
| AD-1 | As an astrologer, I want to apply for the Verified Pro badge from my profile settings, so that I can build trust with users. | P0 | Application form captures background questions defined by the platform; submission confirmation shown immediately. |
| AD-2 | As an admin, I want to review a submitted badge application alongside a background check, so that I can approve or reject it with confidence. | P0 | Admin view surfaces the application answers plus cross-referenced public presence (social/professional); decision is logged with a reason. |
| AD-3 | As an astrologer, I want to be notified of my application's approval or rejection with a reason, so that I understand the outcome and can reapply if appropriate. | P0 | Notification includes a reason for rejection; reapplication is allowed after a defined cooldown. |
| AD-4 | As an admin, I want to grant a Verified Pro badge directly to a hand-selected, already-known astrologer without the standard application flow, so that the platform can recruit credible names as a growth strategy. | P1 | Direct-grant action is admin-only, logged separately from the standard application path (Section 12 of the PRD notes this bypasses AD-1–AD-3). |
| AD-5 | As an admin, I want to see flagged rating patterns (e.g., unusual velocity, low rater diversity) for manual review, so that I can catch badge-farming before it becomes a trust problem. | P1 | Flagging is signal-based and surfaced for human review, not auto-blocking, per the platform's stated fraud-handling approach (see Trust & Safety document). |
| AD-6 | As an admin, I want to retroactively revoke a Top Rated badge if a fraud pattern is confirmed, so that the badge continues to mean something. | P1 | Revocation shows a visible "under review" state before removal; underlying flagged ratings are excluded from the astrologer's public average. |
