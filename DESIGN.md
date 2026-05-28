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

- Overall feeling: refined residential hospitality, warm, direct, and practical.
- Use the Figma Make design as the visual base: full-bleed photo hero, coral primary color, soft white surfaces, rounded image cards, restrained motion.
- Primary color: `#E87B77`.
- Background: white and light neutral bands.
- Text: high-contrast dark neutral, with muted gray for secondary information.
- Avoid one-note decoration, fake stock imagery, heavy gradients, and overly promotional copy.

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

- Apartment data lives in `Palma Rosa Residence Website/src/app/data/apartments.ts`.
- Availability logic lives in `Palma Rosa Residence Website/src/app/lib/availability.ts`.
- Shared availability state lives in `Palma Rosa Residence Website/src/app/lib/availability-context.tsx`.
- Translations live in `Palma Rosa Residence Website/src/app/lib/language.tsx`.
- Do not reintroduce apartment data inside components unless it is component-only presentation text.

## Future Improvements

- Verify and add exact walking times to Piola, Lambrate, and Udine.
- Replace any remaining approximate nearby copy with verified local information.
- Add B5 photos when available.
- Expand English translations for longer section copy if the site needs full editorial parity.
