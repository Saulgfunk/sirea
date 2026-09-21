---
name: check-open-questions
description: Check whether a piece of proposed Sirea work touches one of the unresolved open questions in CLAUDE.md (market scope, commission %, cancellation policy, etc.) before writing code that depends on the answer. Use before implementing payment logic, localization/market-specific code, the revenue-share payout formula, or anything else CLAUDE.md flags as blocked on an open question.
---

# Check Open Questions

Sirea's `CLAUDE.md` documents two hard-blocking open questions and several secondary ones, carried over from the planning docs in `docs/`. The product/business owner has not yet answered them. This skill is a guardrail: it stops implementation work from silently baking in an assumption on something that's explicitly still undecided.

## When to run this

Before writing or generating code for anything that touches:
- Payment provider integration (Stripe vs. Turkey-specific rails) or any currency/locale-specific logic
- The revenue-share / payout formula (commission percentage, bundled-pool sizing, rating-weight curve)
- Data-protection/compliance logic (GDPR vs. KVKK-specific handling)
- Cancellation, reschedule, or refund logic
- Data retention/deletion windows for kahve falı photos or session recordings
- Verified Pro cooldown periods or Top Rated threshold tuning

If the task at hand doesn't touch any of these, this skill has nothing to do — don't run it reflexively on unrelated work.

## Steps

1. Re-read the "Open questions" section of `CLAUDE.md` (do not rely on memory of it — it may have been updated since).
2. Identify whether the requested work's *correctness* depends on one of the open questions' answers (not just adjacent to the topic). For example: scaffolding a `POST /wallet/topup` route doesn't need the commission % yet; implementing the actual payout-split calculation does.
3. If it depends on an unresolved question:
   - Do not guess a value (e.g. don't hardcode "20%" or pick Stripe vs. PayTR unilaterally) and don't silently proceed.
   - Tell the user explicitly which open question blocks this work, quoting the relevant line from `CLAUDE.md`, and ask them to confirm an answer before you continue.
   - If the user wants to proceed anyway with a placeholder (e.g. to unblock scaffolding), use an obviously-named placeholder (e.g. `PLATFORM_COMMISSION_PCT = null // TODO: confirm, see CLAUDE.md open question 2`) rather than a plausible-looking real number, so it can't be mistaken for a real decision later.
4. If it doesn't depend on any open question, proceed normally — most scaffolding (data model, non-payment API routes, UI shell, badge/rating logic not tied to payout math) is unaffected and shouldn't be blocked reflexively.
5. If the user does confirm an answer to an open question in the conversation, update `CLAUDE.md`'s open-questions section to reflect the resolution (move it out of "open," or mark it decided with the answer) so future sessions don't re-ask.

## Output

State which open question(s), if any, apply, and whether you're proceeding, blocking, or using a flagged placeholder.
