---
name: add-user-story
description: Add a new user story to docs/03-User-Stories.md with consistent ID formatting, section placement, and priority. Use when the user asks to add, draft, or track a new user story or feature requirement for Sirea.
---

# Add User Story

Adds one new row to `docs/03-User-Stories.md`, matching the existing table format and ID conventions exactly. This is a docs-only skill — it does not touch application code.

## Steps

1. **Read `docs/03-User-Stories.md` in full** before editing anything, to see the current highest ID number in the relevant section and confirm table formatting.
2. **Identify the right section** based on what the story is about. Existing sections and their ID prefixes:
   - `1. Onboarding & Personalization` → `ON-`
   - `2. Content Feed & Discovery` → `CD-`
   - `3. Astrologer Profile, Badges & Ratings` → `PB-`
   - `4. Private Sessions & Booking` → `PS-`
   - `5. Group Sessions` → `GS-`
   - `6. Kahve Falı` → `KF-`
   - `7. Wallet & Subscriptions` → `WS-`
   - `8. Referral / Invite Loop` → `RF-`
   - `9. Astrologer Badge Application & Admin/Trust Workflows` → `AD-`

   If the story doesn't fit any existing section, ask the user before creating a new section — don't invent one unilaterally.
3. **Assign the next sequential number** in that prefix (e.g. if `ON-1` through `ON-5` exist, the new story is `ON-6`). Never reuse or renumber existing IDs.
4. **Write the story in the existing voice**: `As a [role], I want to [action], so that [benefit].` Keep it to one sentence.
5. **Assign a priority** — ask the user if it's not obvious from context:
   - `P0` = MVP must-have (Phase 1 per `docs/07-MVP-Roadmap.md`)
   - `P1` = fast-follow (Phase 2)
   - `P2` = nice-to-have / post-MVP (Phase 3)
6. **Write acceptance criteria** — concrete and testable, in the same terse style as existing rows (see examples already in the table). Avoid vague criteria like "works correctly."
7. **Insert the row** at the end of the correct section's table, preserving column order: `ID | User Story | Priority | Acceptance Criteria`.
8. **Cross-check against `CLAUDE.md`'s open questions** — if the story's behavior depends on an unresolved item (market scope, commission %, cancellation policy, etc.), note that dependency in the acceptance criteria or flag it to the user rather than silently assuming an answer.
9. **Cross-check the roadmap**: if the story is P0, confirm it belongs in Phase 1 of `docs/07-MVP-Roadmap.md`'s table (same file) — add it there too if the roadmap doc's story-ID list doesn't yet mention it, or point out the gap to the user rather than editing the roadmap unprompted for P1/P2 stories.

## Output

Report back the new story's ID, section, and priority, and confirm whether it also needed a roadmap update.
