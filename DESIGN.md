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
- Guest reviews are **curated and static**: real quotes copied by hand from Google / Airbnb / Booking into `src/app/data/reviews.ts`. There is no live API (Google Places caps at 5 reviews with billing/attribution constraints; Airbnb and Booking expose no public review API). Every entry must be a real review with author reduced to first name + initial. The shipped file currently holds clearly-marked placeholders (`isPlaceholder: true`) — replace them with real reviews before publishing.

## Visual Direction (v2 — soft, modern, expressive)

- Overall feeling: refined residential hospitality, warm, contemporary, soft. Inspired by Ray-is-a-place, Kinn Collective, Daniel Blue.
- Hero is a full-bleed photo with the wordmark anchored bottom-left and frosted-glass pill buttons. The photo carries **two stacked overlays**: a uniform `bg-black/25` scrim (calms the bright enhanced source so it doesn't read as busy) plus a bottom-weighted gradient `from-black/20 via-black/15 to-black/75` that anchors the wordmark and keeps the CTAs legible. Keep enough darkening that white text stays readable over the brightest part of the image.
- Photo surfaces use a generous `rounded-3xl` radius (24px) — soft contemporary, not flat editorial.
- Color does not come from the brand — it comes from the real photography. UI is built on warm neutrals.
- Buttons follow three named classes in `theme.css`:
  - `.btn-glass` — frosted-glass pill (backdrop-blur + inset highlight). Used on dark photo backgrounds.
  - `.btn-solid` — ink-black pill, primary CTA on light surfaces.
  - `.btn-outline` — neutral pill, secondary CTA.

### Palette (defined in `src/styles/theme.css`)

| Token | Hex | Use |
| --- | --- | --- |
| `--background` | `#F7F3EC` | Page base, warm sand |
| `--foreground` | `#1F1B16` | Body text, headings, primary CTA fill |
| `--primary` / `--primary-foreground` | `#1F1B16` / `#F7F3EC` | shadcn CTA, footer, icon boxes |
| `--secondary` | `#ECE4D6` | Cream-tone full-width section bands |
| `--muted` / `--muted-foreground` | `#EFEAE0` / `#6F6557` | Subtler bg + secondary copy |
| `--accent` | `#C2876A` | Soft terracotta, used sparingly |
| `--border` | `rgba(31,27,22,0.10)` | Hairlines |
| `--radius` | `1rem` (16px) | Default; pill controls use `9999px` |

Avoid: any pink/coral, heavy gradients, fake stock imagery, overly promotional copy.

### Typography

- Primary family: **General Sans** (Fontshare), weights 400 / 500 / 600 / 700.
- Wordmark "Residence" + occasional accents: **Cormorant Garamond** italic (`.font-display-italic`).
- Scale (see `theme.css` `@layer base`):
  - h1 `clamp(2.5rem, 5.5vw, 4.25rem)`, weight 500, tracking `-0.025em`, line-height 1.05.
  - h2 `clamp(1.875rem, 3.5vw, 2.75rem)`, weight 500.
  - h3 `clamp(1.125rem, 1.8vw, 1.375rem)`, weight 500.
  - h4 / labels: General Sans 14px medium.
- `.eyebrow` utility: General Sans 12px uppercase, tracking `0.16em`.

### Motion

- Use `motion/react` only. Default in-view entrance: opacity 0 → 1 + y 18–24 → 0, 0.4–0.7s, single shot (`viewport={{ once: true }}`).
- Hover transforms stay subtle: cards `-translate-y-0.5`, images `scale-[1.04]` over 700–1000ms.
- Listing grids use the CSS-only `.apr-fade` stagger (inline `animation-delay`) instead of per-card IntersectionObservers — see the INP note in `RoomsSection.tsx`.
- The whole app is wrapped in `<MotionConfig reducedMotion="user">` (`App.tsx`), so every `motion/react` animation **and** `.apr-fade` honour `prefers-reduced-motion`. Don't add new entrance animations that bypass this.

### Images & performance

- All photography is served as responsive WebP. The original JPGs in `public/images/**` are the source of truth and the universal `<img>` fallback; WebP width variants (`<name>-480w.webp`, `-768w.webp`, …) are generated next to them.
- Generator: `npm run optimize:images` (`scripts/optimize-images.mjs`) uses `cwebp` (`brew install webp`). It is idempotent, never upscales, prunes orphan variants, and writes `src/app/lib/image-manifest.json`. **Re-run it whenever you add or replace a source photo**, then commit the new `.webp` files and the manifest.
- Render images through the `<Picture>` component (`src/app/components/Picture.tsx`), never a bare `<img>`. It reads the manifest to build the WebP `srcset`, falls back to a plain `<img>` when an image has no manifest entry (e.g. the SVG placeholder), and uses `display:contents` so existing `h-full w-full object-cover` sizing is unchanged. Pass `sizes` for correct selection and `priority` for above-the-fold images (Hero, the modal's active photo).
- The hero WebP set is preloaded in `index.html` via `imagesrcset`/`imagesizes` — keep that list in sync if the hero's available widths change.
- Source JPGs are downscaled to a sensible cap on import (hero ≤ 2400px, gallery portraits ≤ 2000px) so the fallback never ships a multi-megapixel file.

## Routing

The site is a 2-route SPA (React Router):

- `/` — Landing. Presentation-only: Hero → Gallery → Services → Apartments → Reviews → NearbyMap → Footer. Includes a "Check availability" CTA in the nav and below the Apartments grid.
- `/disponibilita` (alias `/availability`) — Availability page. Large `DateRangePicker` (react-day-picker) above the apartments grid, status badges on each card, WhatsApp CTA in the modal disabled when an apartment is unavailable for the chosen dates.

Shared chrome (Navigation + Footer + scroll reset) lives in `SiteLayout.tsx`.

## Layout

- First viewport must clearly show the Palma Rosa Residence name and real building imagery.
- Hero uses `min-h-[100dvh]`, never fixed `h-screen`, to avoid mobile browser jump.
- Apartment cards use real apartment photos when available. Missing photos use a clear placeholder state.
- Details open in a modal with gallery, metadata, services, location, and WhatsApp CTA.
- The neighbourhood is shown via an interactive **Leaflet + OpenStreetMap** component (`NearbyMap.tsx`) with category filter chips (transport, university, supermarket, pharmacy, breakfast, hospital). POI data lives in `src/app/data/poi.ts`. Map pins use a **de-saturated, warmed** category palette (slate-blue / ochre / sage / brick / brown / plum) so the wayfinding colours stay distinguishable without breaking the warm-neutral system; the chip's coloured dot doubles as the legend.

## Hidden apartments

The `hidden` flag on an apartment record removes it from every visible surface (homepage listing, availability search and count) while keeping the entry for future re-publish. B5 is currently hidden until photos and availability are confirmed; flip `hidden: false` (or remove the key) to bring it back.

## Interaction Rules

- Availability search requires valid check-in and check-out dates, with check-out after check-in.
- During search, apartment cards show loading state.
- After search, cards show available, unavailable, or unknown.
- If an apartment is unavailable for selected dates, the WhatsApp CTA in the modal is disabled and replaced by a clear unavailable message.
- Language choice is stored in local storage.
- Buttons should have visible hover and active feedback.
- All interactive controls have a visible keyboard focus ring: the `.btn-*` pill classes define `:focus-visible` (light ring on dark photo surfaces, `--ring` on light surfaces); the map filter chips and nav links use `focus-visible:outline-*` utilities. Never ship an interactive element with `outline:none` and no replacement.
- Touch targets are ≥ 44px (filter chips use `min-h-[44px]`, the mobile menu button uses `p-3`). Toggle controls expose state to assistive tech (`aria-pressed` on the map chips), and icon-only buttons have an `aria-label` that reflects current state (the menu button swaps open/close).

## Component Ownership

- Apartment data lives in `src/app/data/apartments.ts`.
- Review data lives in `src/app/data/reviews.ts`; the `Reviews.tsx` section (cream `bg-secondary` band, card grid, brand-coloured platform tags, star summary) renders it. The section and its nav link auto-hide in production while only placeholders exist (`hasRealReviews` + `import.meta.env.PROD`), so the layout can be previewed in `npm run dev` without ever shipping sample reviews.
- Availability logic lives in `src/app/lib/availability.ts`.
- Shared availability state lives in `src/app/lib/availability-context.tsx`.
- Translations live in `src/app/lib/language.tsx`.
- Do not reintroduce apartment data inside components unless it is component-only presentation text.

## Repository Layout

Flat layout at repo root (no nested project folder):

- `src/` — React + Vite app entry (`main.tsx`, `app/`, `styles/`).
- `public/` — static assets served as-is (`images/apartments/<id>/...`, `images/building/...`, plus generated `*.webp` variants).
- `api/` — Vercel serverless functions (CommonJS, isolated by `api/package.json`).
- `scripts/` — build-time utilities (`optimize-images.mjs`, run via `npm run optimize:images`).
- `docs/` — `design inspiration/` reference screenshots, raw source photos (`foto_palazzo/`), ATTRIBUTIONS.
- `index.html`, `vite.config.ts`, `vercel.json` at root.

## Future Improvements

- Verify and add exact walking times to Piola, Lambrate, and Udine.
- Replace any remaining approximate nearby copy with verified local information.
- Add B5 photos when available.
- Expand English translations for longer section copy if the site needs full editorial parity.
