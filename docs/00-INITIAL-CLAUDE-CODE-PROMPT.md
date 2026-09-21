I'm starting a new project called Sirea — a content and marketplace platform connecting astrologers with people seeking astrological guidance (think Patreon/Cameo structure applied to astrology: astrologers post free content to build a following, then monetize through private readings, group sessions, and kahve falı — Turkish coffee-cup fortune telling — delivered in-app via photo upload or live video/voice).

I've attached a full set of planning documents produced during product discovery:

- `01-PRD.md` — the product requirements document: vision, goals, target users, scope, roles, core features, non-functional requirements, out-of-scope items, and open questions.
- `02-User-Flows.md` — step-by-step flow diagrams (mermaid) for the core journeys: onboarding, booking a private session, kahve falı, group sessions, badge application, wallet/subscription, and the referral loop.
- `03-User-Stories.md` — prioritized (P0/P1/P2) user stories with acceptance criteria, organized by feature area and cross-referenced with story IDs.
- `04-Trust-and-Safety.md` — the badge system (Verified Pro application-based, Top Rated algorithmic), rating-integrity defenses, referral-loop design, dispute handling, and moderation approach.
- `05-Business-Model-Canvas.md` — the business model in Business Model Canvas format.
- `06-Competitive-Analysis.md` — how Sirea compares to Co-Star, Sanctuary, Nebula, The Pattern, Astrotalk (the closest marketplace-model analog, at large scale in India), and the Turkish fal/astrology app landscape, plus lessons drawn from competitors' documented failures.
- `07-MVP-Roadmap.md` — a three-phase build roadmap (MVP / fast-follow / post-MVP expansion), sequenced by build dependency and tied to user story IDs, with no fixed calendar dates.
- `08-Technical-Architecture.md` — a recommended tech stack, third-party service choices (payments, video/voice, chart calculation, identity verification), the core data model, a high-level API structure, a proposed revenue-share payout formula, and security/privacy notes.
- `design-system/README.md` and `design-system/tokens.json` — the visual design system: color, typography, spacing, and radius tokens with usage rules, built from four screen mockups designed earlier (feed, astrologer profile, kahve falı reveal, wallet/subscription — not attached here, but the tokens and guidelines capture their visual language).

**Before writing any application code**, I want you to:

1. Read through all of the attached documents carefully.
2. Generate a `CLAUDE.md` file at the project root that captures the essential context a future Claude Code session would need without re-reading every document from scratch: the product in one paragraph, the core data model (entity list, not full detail), the tech stack decisions, key architectural constraints (in-app video/voice, no third-party redirect; the two-badge trust system; the bundled-vs-à-la-carte payout split), and — importantly — the open questions that are NOT yet resolved (starting with the English/international vs. Turkey-first scope question flagged throughout the PRD, plus the exact commission percentage and pool-sizing for the revenue-share formula). Flag clearly in `CLAUDE.md` that these open questions should be confirmed with me before code that depends on them (payment logic, localization, market-specific integrations) gets built.
3. Propose and scaffold whatever Claude Code skills would make ongoing work on this repo more consistent and less repetitive — for example (use your judgment on what's actually warranted, don't force a fixed list): a skill for generating a new API endpoint that follows the data model and conventions in the architecture doc, a skill for adding a new user story to the tracked set with consistent ID formatting, or a skill for keeping the design token usage consistent across components as they're built. Tell me what skills you're proposing and why before creating them, since I'd rather review the plan than have you build blind.
4. Do NOT scaffold the actual application (no repo structure, no boilerplate, no dependencies installed) until I've confirmed the CLAUDE.md content and the skill proposals look right — this first pass is about establishing shared context and tooling, not writing product code yet.

Ask me anything that's unclear before you start.
