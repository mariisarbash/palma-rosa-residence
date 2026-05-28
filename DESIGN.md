# Palma Rosa Residence Design System

This document is the source of truth for the public website. Update it whenever visual rules, content assumptions, apartment data, or interaction patterns change.

## Identity

- Public name: Palma Rosa Residence.
- Location: Via Privata Mario Bianco, 13/1, 20131 Milano.
- Product: 10 apartments in the residence complex. Lattanzio is not part of the complex and must not be shown.
- Primary audience: people looking for private-bathroom accommodation in Milan near the M2 line.
- Languages: Italian and English. Italian is the default language.

## Content Truth

- Apartments: A1, A2, A3, A4, A5, B1, B2, B3, B4, B5.
- B5 stays visible even while photos are missing and uses the "photos coming soon" state.
- Availability is checked through `/api/ical`.
- B5 has no iCal calendar yet and is treated as always available.
- Confirmed shared services from current data: private bathroom, sofa bed, Wi-Fi, washing machine, dryer, elevator.
- Confirmed transport references: M2 Piola, M2/railway Lambrate, M2 Udine.
- Do not publish precise walking times unless they have been verified.
- Do not add fake phone numbers, emails, ratings, restaurants, reviews, room sizes, cleaning schedules, AC, or security claims.

## Visual Direction

- Overall feeling: refined residential hospitality, warm, editorial, minimal. Inspired by Ray-is-a-place, Kinn Collective, Daniel Blue.
- Hero is full-bleed photo with the wordmark anchored bottom-left and a soft bottom-weighted vignette — no heavy gradient.
- Photo surfaces are pure rectangles (no rounded corners). Radius is reserved for small interactive controls (4–6px).
- Color does not come from the brand — it comes from the real photography. The UI is built on warm neutrals.

### Palette (defined in `src/styles/theme.css`)

| Token | Hex | Use |
| --- | --- | --- |
| `--background` | `#FAF8F4` | Page base, warm off-white |
| `--foreground` | `#1A1814` | Body text, headings, primary CTA fill |
| `--primary` / `--primary-foreground` | `#1A1814` / `#FAF8F4` | shadcn CTA, footer, icon boxes |
| `--secondary` | `#EFE9DE` | Cream-tone full-width section bands |
| `--muted` / `--muted-foreground` | `#F2EDE3` / `#6B635A` | Subtler bg + secondary copy |
| `--accent` | `#B8896B` | Warm terracotta, used sparingly |
| `--border` | `rgba(26,24,20,0.10)` | Hairlines |

Avoid: any pink/coral, heavy gradients, drop shadows on photos, fake stock imagery, overly promotional copy.

### Typography

- Headings: **Fraunces** (variable, optical-sizing on, opsz 144 for display) at weight 400.
- Body and UI: **Inter** 400/500.
- Scale (see `theme.css` `@layer base`):
  - h1 `clamp(2.25rem, 5vw, 3.75rem)`, tracking `-0.02em`, line-height 1.05.
  - h2 `clamp(1.75rem, 3.5vw, 2.5rem)`, tracking `-0.015em`.
  - h3 `clamp(1.25rem, 2vw, 1.5rem)`.
  - h4 / labels / eyebrows: Inter 12px uppercase, tracking `0.12em`–`0.18em`.
- A reusable `.eyebrow` class is provided in `fonts.css` for section labels.

### Motion

- Use `motion/react` only. Default in-view entrance: opacity 0 → 1 + y 24 → 0, 0.7s, single shot (`viewport={{ once: true }}`).
- Hover transforms on images stay subtle: `scale-[1.03]` over 700–1000ms. No dramatic 1.1 scales.

## Layout

- First viewport must clearly show the Palma Rosa Residence name and real building imagery.
- Hero uses `min-h-[100dvh]`, never fixed `h-screen`, to avoid mobile browser jump.
- Page order:
  1. Navigation
  2. Hero
  3. Residence gallery
  4. Confirmed services
  5. Apartments
  6. Availability checker
  7. Transport
  8. Nearby references
  9. Footer
- Apartment cards use real apartment photos when available. Missing photos use a clear placeholder state.
- Details open in a modal with gallery, metadata, services, location, and WhatsApp CTA.

## Interaction Rules

- Availability search requires valid check-in and check-out dates, with check-out after check-in.
- During search, apartment cards show loading state.
- After search, cards show available, unavailable, or unknown.
- If an apartment is unavailable for selected dates, the WhatsApp CTA in the modal is disabled and replaced by a clear unavailable message.
- Language choice is stored in local storage.
- Buttons should have visible hover and active feedback.

## Component Ownership

- Apartment data lives in `src/app/data/apartments.ts`.
- Availability logic lives in `src/app/lib/availability.ts`.
- Shared availability state lives in `src/app/lib/availability-context.tsx`.
- Translations live in `src/app/lib/language.tsx`.
- Do not reintroduce apartment data inside components unless it is component-only presentation text.

## Repository Layout

Flat layout at repo root (no nested project folder):

- `src/` — React + Vite app entry (`main.tsx`, `app/`, `styles/`).
- `public/` — static assets served as-is (`images/apartments/<id>/...`, `images/building/...`).
- `api/` — Vercel serverless functions (CommonJS, isolated by `api/package.json`).
- `docs/` — `design inspiration/` reference screenshots, ATTRIBUTIONS.
- `index.html`, `vite.config.ts`, `vercel.json` at root.

## Future Improvements

- Verify and add exact walking times to Piola, Lambrate, and Udine.
- Replace any remaining approximate nearby copy with verified local information.
- Add B5 photos when available.
- Expand English translations for longer section copy if the site needs full editorial parity.
