# Sirea — User Flow Diagrams

2026-09-21 · @Someone

Companion to the Sirea PRD — step-by-step flows for the core journeys named there. Built on the same English/international-scope assumption flagged in the PRD; revisit if that assumption changes.

## 1. Onboarding

```mermaid
flowchart TD
  A[Open app] --> B[Sign up: email/phone]
  B --> C[Enter birth date]
  C --> D{Add birth time & place?}
  D -- Yes --> E[Full natal chart unlocked]
  D -- Skip --> F[Sun-sign content only]
  E --> G[Home feed]
  F --> G
  G --> H[Prompt: add birth time later]
```

Birth time/place capture is optional at signup (skip leads straight to sun-sign content); a later in-feed prompt invites users to complete their chart once they've engaged with content.

## 2. Discovery to Private Session Booking

```mermaid
flowchart TD
  A[Browse feed] --> B[View astrologer profile]
  B --> C[Follow astrologer]
  B --> D[Select private session]
  D --> E{Payment method}
  E -- Wallet credit --> F[Pay per session]
  E -- Subscription --> G[Confirm via bundled tier]
  F --> H[Session scheduled]
  G --> H
  H --> I[Reminder notification]
  I --> J[Join live session in-app]
  J --> K{Rate astrologer?}
  K -- Yes --> L[Submit rating & review]
```

Following and booking are independent actions off the same profile screen — a user can book without following, though following is what surfaces the astrologer in the home feed's stories row going forward.

## 3. Kahve Falı

```mermaid
flowchart TD
  A[Tap Falım tab] --> B[Choose astrologer]
  B --> C[Upload cup photo]
  C --> D[Pay via wallet credit]
  D --> E[Await interpretation - SLA 24h]
  E --> F[Push: falın hazır]
  F --> G[Open reveal screen]
  G --> H{Rate the falı?}
  H -- Yes --> I[Submit rating]
  G --> J[Book another / share result]
```

Async photo-upload is the default path shown here; the live video/voice variant reuses the same in-app session infrastructure as private astrology sessions (Flow 2) rather than a separate flow.

## 4. Group Session

```mermaid
flowchart TD
  A[See group session in feed] --> B{Access level}
  B -- Free --> C[Join directly]
  B -- Premium-gated --> D{Subscribed to Premium?}
  D -- Yes --> C
  D -- No --> E[Prompt: upgrade to Premium]
  E --> F[Upgrade flow - see Flow 6]
  C --> G[Reminder before start time]
  G --> H[Join live group session in-app]
  H --> I{Rate astrologer?}
  I -- Yes --> J[Submit rating]
```

A user blocked by a premium-gated session is routed into the subscription-upgrade flow (Flow 6) rather than a dead end, keeping the paywall itself as a conversion moment.

## 5. Verified Pro Badge Application

```mermaid
flowchart TD
  A[Astrologer profile settings] --> B[Apply for Verified Pro]
  B --> C[Answer background questions]
  C --> D[Submit application]
  D --> E[Admin review + background check]
  E --> F{Approved?}
  F -- Yes --> G[Verified Pro badge granted]
  F -- No --> H[Rejection notice + reason]
  H --> I[Reapply after cooldown]
  G --> J[Badge visible on profile]
```

Review is case-by-case (per the PRD), so "admin review" here stands in for a manual workflow, not an automated checklist; the Trust & Safety document is the place to define the review criteria in detail.

Separately, the platform-initiated path (hand-selected, already-known astrologers granted the badge directly) bypasses this flow entirely and is not diagrammed — it is a manual, invite-only action taken by platform/growth ops, not a user-facing flow.

## 6. Wallet Top-Up & Subscription Upgrade

```mermaid
flowchart TD
  A[Open Wallet tab] --> B{Action}
  B -- Top up credit --> C[Choose amount]
  C --> D[Pay via processor]
  D --> E[Credit balance updated]
  B -- Upgrade subscription --> F[Choose tier: Premium or Premium+Credit]
  F --> G[Confirm payment]
  G --> H[Tier unlocked]
  H --> I[Group sessions & priority feed enabled]
```

Both paths are reachable from the same Wallet screen; a top-up never requires a subscription and a subscription upgrade never requires a wallet top-up, per the PRD's note that the two are orthogonal (Section 9).

## 7. Referral / Invite Loop

```mermaid
flowchart LR
  A[Astrologer shares invite] --> B[Friend joins free session]
  B --> C[Friend rates astrologer]
  C --> D[Prompt: explore other astrologers]
  D --> E{Friend signs up fully?}
  E -- Yes --> F[New account created]
  F --> G[Referral credit to both]
  E -- No --> H[Remains a one-time guest]
```

The conversion prompt at step D (surfacing other content immediately after the friend rates) is the deliberate design choice discussed earlier — turning an incidental visitor into an explored one before they leave, rather than treating the free-session-for-ratings pattern as something to restrict.
