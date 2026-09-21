# Sirea

A design system for an astrology and kahve falı platform connecting astrologers with people seeking guidance — content, live sessions, and coffee-cup fortune telling in one place. Built for a companion set of product documents (PRD, User Flows, User Stories, Technical Architecture) that define the same product; this system gives the visual language a shared, reusable vocabulary.

**No logo or wordmark mark exists yet.** In its absence, the brand name is set in the display face (Fraunces) as a plain type treatment — see the cover above. If a mark is designed later, it should sit at the same weight and warmth the type treatment implies: considered, not decorative.

## Principles

- **Editorial restraint, mysticism on purpose.** The base UI is dark, near-black, and quiet — closer to an editorial or premium-app register than a "mystical" one. Color and ornament are reserved for specific moments (badges, CTAs, the kahve falı reveal) rather than spread evenly, so they carry more weight when they appear.
- **Trust before wonder.** Because this platform handles real money and real personal data (birth details, payment information), the visual language leans toward credibility — restrained color, clear hierarchy, legible type — even in a category (astrology) that often reaches for glow and gradient instead.
- **Warmth where it counts.** The one deliberate exception to restraint is the kahve falı flow, where a slower, more ritual-feeling pace is appropriate — a reveal moment should feel considered, not like a standard content post.

## Color

One theme currently: **Dark**. Ten tokens, three of them carrying real semantic meaning (gold, purple, coral) and reserved for specific roles — never used interchangeably or decoratively.

- `void`, `surface`, `surface-2`, `border` build the dark ground and its elevation steps. Nest surfaces in that order (void → surface → surface-2) for cards within cards; never skip a step.
- `ink`, `ink-soft`, `ink-muted` are the three text weights, in descending order of presence. Use `ink` for headings and primary content, `ink-soft` for body copy that needs to read comfortably at length (kahve falı interpretations, bios), `ink-muted` for anything secondary (timestamps, captions, helper text).
- `gold` is reserved for trust signals: the Verified Pro badge, premium pricing, wallet balance. Never use it for a group-session or mystical-content accent — that's `purple`'s role.
- `purple` is reserved for the mystical/group layer: the Top Rated badge, group session cards, compatibility features. Keep gold and purple visually distinct in any screen that shows both (e.g., an astrologer profile with both badges) — they should never blend or sit adjacent without a clear boundary (a border, a gap) between them.
- `coral` is the one true call-to-action color — booking buttons, upgrade prompts, the central Falım tab icon. If a screen has more than one coral element competing for attention, that's a sign the hierarchy needs rethinking, not a reason to add a second CTA color.

**Contrast**: `ink` on `void`/`surface`/`surface-2` exceeds 4.5:1 in all three cases. `ink-muted` on `void` sits close to the 4.5:1 floor for small text — reserve it for text at 13px or larger, or pair it with `surface`/`surface-2` (slightly higher contrast) rather than the darkest `void` background for anything smaller.

## Typography

Two families: **Fraunces** (display serif) for headlines, astrologer names, and moments that should feel considered — and **Manrope** (body sans) for everything functional: UI labels, body copy, buttons. Both load from Google Fonts; no local font files are bundled with this system.

Fraunces is used sparingly and only at the sizes defined in the Display group — never for long-form body text, and never below 15px, where its optical detail stops reading cleanly at small sizes. Manrope carries every UI label, button, and body paragraph, including the falı interpretation text itself (long-form reading uses `body-l`, not the display face).

## Spacing & Radius

An 8-point-derived scale (4 / 8 / 12 / 16 / 20 / 24 / 32 / 40) — pick the token one step larger than feels obviously correct when a layout feels cramped, rather than an arbitrary intermediate value. Five radius steps run from `radius-sm` (small tiles) to `radius-pill` (badges, chips, avatars); cards default to `radius-lg`, with `radius-xl` reserved for a screen's single largest feature card (the kahve falı photo frame, a hero card) so it reads as distinct from standard content cards.

## Iconography

Inline stroke SVG only — no icon font, no emoji anywhere in the product UI. Icons follow the `ink` / `ink-muted` text-color system (an icon is `currentColor`, never a fixed hex) so they stay legible against whichever surface they sit on. A filled icon (the checkmark inside the Verified Pro badge, the star inside Top Rated) is the one exception, using the badge's own accent color rather than the surrounding text color.

## Accessibility

- Text contrast: `ink` on any surface token clears 4.5:1; `ink-muted` clears 3:1 (fine at 24px+ or for genuinely secondary text) but sits close to the floor at small sizes on `void` specifically — see the Color section above.
- Touch targets: every interactive element (buttons, badge chips, tab bar items) should measure at least 44×44px, regardless of how the visual token sizing looks — spacing tokens size the visual padding, not the tap target itself.
- Focus and interactive states are not yet defined in this system (no components are included yet — see below); define them before shipping any interactive component, using `gold` or `coral` (whichever the element's semantic role calls for) for focus rings rather than a generic default.

## What this system does not yet include

This is a tokens-and-guidelines system, not yet a component library — no `components/` bundle beyond the cover ships with this version. The four screen mockups built earlier for this project (feed, astrologer profile, kahve falı reveal, wallet/subscription) demonstrate the tokens applied to real layouts and remain the best reference for how these pieces compose; a native mobile codebase (React Native, per the Technical Architecture document) will implement its own components against these token values rather than consuming a web component bundle from this system.
