---
name: check-open-questions
description: Check whether a piece of proposed Sirea work touches an unresolved or explicitly-paused item in CLAUDE.md (payment integration, commission %, cancellation policy, etc.) before writing code that depends on it. Use before implementing payment logic, the revenue-share payout formula, geo-based compliance logic, or anything else CLAUDE.md flags as blocked or on hold.
---

# Check Open Questions

`CLAUDE.md` has a "Resolved" section and a "Still open" section. Resolved doesn't always mean "go build it" — market scope was confirmed (English/international-first) but payment provider integration was explicitly kept on hold in that same decision. This skill is a guardrail: it stops implementation work from silently proceeding on something the user paused, or baking in an assumption on something genuinely still undecided.

## When to run this

Before writing or generating code for anything that touches:
- Payment provider integration (Stripe, Apple/Google IAP, or any real charge/payout) — market scope is resolved, but this is explicitly still on hold; don't start it just because the market question is answered
- The revenue-share / payout formula (commission percentage, bundled-pool sizing, rating-weight curve) — confirmed as not needed right now
- Geo-based data-protection logic (GDPR vs. KVKK branching per user location) — the *approach* is decided (per-user jurisdiction, not a single regime), but check `CLAUDE.md` for whether implementation has been requested yet
- Cancellation, reschedule, or refund logic
- Data retention/deletion windows for kahve falı photos or session recordings
- Verified Pro cooldown periods or Top Rated threshold tuning

If the task at hand doesn't touch any of these, this skill has nothing to do — don't run it reflexively on unrelated work.

## Steps

1. Re-read `CLAUDE.md`'s "Resolved" and "Still open" sections (do not rely on memory of it — it may have changed since you last saw it).
2. Identify whether the requested work's *correctness* depends on something still open, or whether it's something resolved-but-paused (like payment integration). For example: scaffolding a `POST /wallet/topup` route doesn't need the commission % yet; implementing the actual payout-split calculation does; building the actual Stripe charge flow needs an explicit go-ahead even though the market question behind it is settled.
3. If it's blocked (open, or resolved-but-paused):
   - Do not guess a value (e.g. don't hardcode "20%") and don't silently start payment/payout work just because a related question was resolved.
   - Tell the user explicitly what's blocking this work, quoting the relevant line from `CLAUDE.md`, and ask them to confirm before you continue.
   - If the user wants to proceed anyway with a placeholder (e.g. to unblock scaffolding), use an obviously-named placeholder (e.g. `PLATFORM_COMMISSION_PCT = null // TODO: confirm, see CLAUDE.md`) rather than a plausible-looking real number, so it can't be mistaken for a real decision later.
4. If it doesn't depend on anything open or paused, proceed normally — most scaffolding (data model, non-payment API routes, UI shell, badge/rating logic not tied to payout math) is unaffected and shouldn't be blocked reflexively.
5. If the user resolves or explicitly greenlights something in the conversation (answers a question, says "go ahead and build payments now"), update `CLAUDE.md` to reflect it — move it into "Resolved" with the date and what was decided, or note the new go-ahead — so future sessions don't re-ask or stay stuck on stale caution.

## Output

State which item(s), if any, apply, and whether you're proceeding, blocking, or using a flagged placeholder.
