/**
 * Guest reviews — curated, multi-platform social proof.
 *
 * ⚠️  CONTENT TRUTH (see DESIGN.md): every review here must be a REAL quote
 * copied from the matching platform. The entries below are PLACEHOLDERS so the
 * section can be previewed — their text is deliberately marked as a sample and
 * MUST be replaced (or removed) before publishing. Do not invent ratings or
 * quotes.
 *
 * To maintain:
 *  1. Replace each placeholder with a real review (author = first name + initial
 *     only, for privacy). Translate the `en` field, or reuse the original text.
 *  2. Update `reviewsSummary` with the real Google rating/count and profile URL.
 *  3. Add or remove entries freely — the grid reflows automatically.
 */

export type ReviewSource = "google" | "airbnb" | "booking";

export type Review = {
  id: string;
  /** First name + initial only (e.g. "Marco R.") — never a full name. */
  author: string;
  source: ReviewSource;
  /** 1–5, whole or half stars. */
  rating: number;
  /** Display date, free-form (e.g. "Marzo 2025" / "March 2025") or ISO month. */
  date: { it: string; en: string };
  text: { it: string; en: string };
  /** Mark true while the entry is sample copy; flip/remove once it's real. */
  isPlaceholder?: boolean;
};

/** Overall rating shown in the section header. TODO: set from the real Google listing. */
export const reviewsSummary = {
  rating: 4.9, // TODO: voto medio reale
  count: 0, // TODO: numero recensioni reale (0 nasconde il conteggio)
  // TODO: link al profilo Google del residence ("" nasconde il bottone)
  googleUrl: "",
};

export const reviews: Review[] = [
  {
    id: "ph-1",
    author: "TODO — Nome P.",
    source: "google",
    rating: 5,
    date: { it: "Mese 2025", en: "Month 2025" },
    text: {
      it: "Testo di esempio da sostituire con una recensione reale da Google. Posizione comoda vicino alla metro, appartamento pulito e accogliente.",
      en: "Sample text to replace with a real Google review. Convenient location near the metro, clean and welcoming apartment.",
    },
    isPlaceholder: true,
  },
  {
    id: "ph-2",
    author: "TODO — Nome A.",
    source: "airbnb",
    rating: 5,
    date: { it: "Mese 2025", en: "Month 2025" },
    text: {
      it: "Testo di esempio da sostituire con una recensione reale da Airbnb. Host disponibile, bagno privato comodissimo e zona ben collegata.",
      en: "Sample text to replace with a real Airbnb review. Helpful host, very convenient private bathroom and a well-connected area.",
    },
    isPlaceholder: true,
  },
  {
    id: "ph-3",
    author: "TODO — Nome B.",
    source: "booking",
    rating: 5,
    date: { it: "Mese 2025", en: "Month 2025" },
    text: {
      it: "Testo di esempio da sostituire con una recensione reale da Booking. Ottimo rapporto qualità-prezzo, tutto come descritto.",
      en: "Sample text to replace with a real Booking review. Great value for money, everything as described.",
    },
    isPlaceholder: true,
  },
];

/**
 * True once at least one real review exists. Used to keep the section + its nav
 * link out of production while the file still holds only placeholder copy.
 */
export const hasRealReviews = reviews.some((r) => !r.isPlaceholder);

/** Platform display metadata — brand name + accent colour used for attribution. */
export const reviewSources: Record<ReviewSource, { label: string; color: string; url?: string }> = {
  google: { label: "Google", color: "#4285F4" },
  airbnb: { label: "Airbnb", color: "#FF5A5F" },
  booking: { label: "Booking", color: "#003580" },
};
