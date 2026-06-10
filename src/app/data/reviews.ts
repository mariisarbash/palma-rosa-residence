/**
 * Guest reviews — curated, multi-platform social proof.
 *
 * ⚠️  CONTENT TRUTH (see DESIGN.md): every review here must be a REAL quote
 * copied from the matching platform. The entries below are REAL Google reviews
 * transcribed by hand from the screenshots in `docs/recensioni/`. Authors are
 * reduced to first name + surname initial for privacy. Do not invent ratings or
 * quotes.
 *
 * To maintain:
 *  1. Add new reviews by copying a real quote (author = first name + initial).
 *     Translate the `en` field faithfully, or reuse the original text.
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

/**
 * Overall rating shown in the section header. All transcribed Google reviews are
 * 5★, so the average is 5.0. TODO (owner): set `count` to the real total number
 * of Google reviews and paste the public Google profile URL into `googleUrl` so
 * the "Leggi tutte" button appears.
 */
export const reviewsSummary = {
  rating: 5.0,
  count: 6, // TODO: numero totale reale di recensioni Google (ora = quelle mostrate)
  // TODO: link al profilo Google del residence ("" nasconde il bottone "Leggi tutte")
  googleUrl: "",
};

export const reviews: Review[] = [
  {
    id: "nathan-l",
    author: "Nathan L.",
    source: "google",
    rating: 5,
    date: { it: "Marzo 2026", en: "March 2026" },
    text: {
      it: "Ho trascorso sei mesi in questo appartamento per il mio semestre di scambio al Politecnico di Milano e il mio soggiorno è stato davvero fantastico! L'appartamento è nuovissimo, confortevole e silenzioso, senza alcun problema da segnalare. Pietro e la sua famiglia sono sempre attenti, disponibili e molto premurosi. La posizione è ideale, in un quartiere tranquillo e sicuro a circa 15 minuti a piedi dal Politecnico di Milano, vicino a molti negozi, bar e locali accoglienti, e ben servito dalle linee della metropolitana M1 e M2, nonché da diverse linee di autobus. Il quartiere è perfetto per studiare, offrendo agli studenti molta pace e tranquillità. Lo consiglio vivamente a chiunque sia interessato; il prezzo è più che giustificato!",
      en: "I spent six months in this apartment for my exchange semester at the Politecnico di Milano and my stay was truly fantastic! The apartment is brand new, comfortable and quiet, with nothing to complain about. Pietro and his family are always attentive, helpful and very caring. The location is ideal, in a quiet and safe neighbourhood about 15 minutes' walk from the Politecnico di Milano, close to many shops, bars and welcoming spots, and well served by the M1 and M2 metro lines as well as several bus routes. The area is perfect for studying, giving students plenty of peace and quiet. I highly recommend it to anyone interested; the price is more than justified!",
    },
  },
  {
    id: "anna-b",
    author: "Anna B.",
    source: "google",
    rating: 5,
    date: { it: "Febbraio 2026", en: "February 2026" },
    text: {
      it: "Ho soggiornato in questa residenza per sei mesi e sono rimasta molto soddisfatta. Pietro, Natalia e la loro famiglia sono stati molto disponibili per qualsiasi cosa avessi bisogno. La residenza è anche molto vicina al campus del Politecnico, il che è fantastico per gli studenti che studiano lì.",
      en: "I stayed in this residence for six months and I was very satisfied. Pietro, Natalia and their family were very helpful with anything I needed. The residence is also very close to the Politecnico campus, which is fantastic for students studying there.",
    },
  },
  {
    id: "erbol-s",
    author: "Erbol S.",
    source: "google",
    rating: 5,
    date: { it: "Settembre 2025", en: "September 2025" },
    text: {
      it: "Abbiamo soggiornato qui durante la nostra vacanza nell'agosto del 2025. Vorrei sottolineare la posizione: si trova in una zona molto tranquilla e riservata. È comodissima: le fermate dell'autobus sono a 4-5 minuti di distanza e l'appartamento si trova all'angolo di un'ampia strada fiancheggiata da accoglienti caffè, tutti ombreggiati da alberi che creano una sorta di corridoio verde. Tutto nell'appartamento, dai mobili alla biancheria agli elettrodomestici della cucina, è nuovo. Per quanto riguarda la sicurezza, il proprietario ha preso molto sul serio l'aspetto: ci sono telecamere nei corridoi e tutti gli impianti elettrici sono altamente protetti, e il proprietario ci ha mostrato tutto durante la nostra visita. Un ringraziamento speciale va ai proprietari, una coppia sposata, molto gentili e sempre pronti ad aiutare per qualsiasi domanda. Lo consiglio vivamente!",
      en: "We stayed here during our holiday in August 2025. I'd like to highlight the location: it's in a very quiet and private area. It's extremely convenient: the bus stops are 4-5 minutes away and the apartment is on the corner of a wide street lined with cosy cafés, all shaded by trees that create a sort of green corridor. Everything in the apartment, from the furniture to the linens to the kitchen appliances, is new. As for security, the owner took it very seriously: there are cameras in the hallways and all the electrical systems are highly protected, and the owner showed us everything during our visit. A special thank-you goes to the owners, a married couple, very kind and always ready to help with any question. I highly recommend it!",
    },
  },
  {
    id: "filipo-g",
    author: "Filipo G.",
    source: "google",
    rating: 5,
    date: { it: "Settembre 2025", en: "September 2025" },
    text: {
      it: "L'appartamento è molto comodo, moderno e con un design minimalista che lo rende davvero piacevole da vivere. L'edificio è nuovo e in ottime condizioni, ben illuminato e con tutto il necessario per sentirsi a proprio agio. La posizione è ideale: in una zona tranquilla, vicino al Polimi, con supermercati e ristoranti a pochi passi, oltre a un buon collegamento con la metro. Voglio anche sottolineare l'eccellente disponibilità del proprietario, sempre attento e cordiale. In sintesi, un posto pratico e accogliente, assolutamente consigliato.",
      en: "The apartment is very comfortable, modern and with a minimalist design that makes it really pleasant to live in. The building is new and in excellent condition, well lit and with everything you need to feel at home. The location is ideal: in a quiet area, close to Polimi, with supermarkets and restaurants just a few steps away, plus a good metro connection. I also want to highlight the excellent availability of the owner, always attentive and friendly. In short, a practical and welcoming place, absolutely recommended.",
    },
  },
  {
    id: "luciano-d",
    author: "Luciano D.",
    source: "google",
    rating: 5,
    date: { it: "Settembre 2025", en: "September 2025" },
    text: {
      it: "L'appartamento è bello, moderno, praticamente nuovo, anche il palazzo. Ha una buona posizione vicina alla metro, ristoranti, servizi, sicurezza. La stazione ferroviaria Lambrate è anche vicina al palazzo. Siamo stati per un mese con mia moglie e non abbiamo avuto nessun problema. Allo stesso tempo, Pietro è stato gentilissimo, sempre pronto ad offrire un aiuto, affettuoso e ben disposto per tutto. Saremo sempre grati a lui. Se c'è la possibilità di prenotare qui, non pensarci due volte e affitta uno dei loft.",
      en: "The apartment is beautiful, modern, practically new, and so is the building. It has a great location near the metro, restaurants, services and security. The Lambrate railway station is also close to the building. We stayed for a month with my wife and didn't have a single problem. At the same time, Pietro was extremely kind, always ready to lend a hand, warm and well disposed about everything. We will always be grateful to him. If you have the chance to book here, don't think twice and rent one of the loft apartments.",
    },
  },
  {
    id: "maria-j",
    author: "Maria José P.",
    source: "google",
    rating: 5,
    date: { it: "Ottobre 2025", en: "October 2025" },
    text: {
      it: "Ho vissuto in una delle proprietà del proprietario per un anno ed è stata un'esperienza fantastica. È sempre stato attento alle mie richieste e ha risolto qualsiasi problema in modo rapido ed efficiente. Gli appartamenti sono piccoli ma dotati di tutto il necessario, sono nuovi e hanno elettrodomestici di buona qualità.",
      en: "I lived in one of the owner's properties for a year and it was a fantastic experience. He was always attentive to my requests and solved any problem quickly and efficiently. The apartments are small but equipped with everything you need, they are new and have good-quality appliances.",
    },
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
