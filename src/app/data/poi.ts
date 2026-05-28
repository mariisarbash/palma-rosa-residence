/**
 * Points of interest around Palma Rosa Residence, used by the Nearby map.
 * Coordinates are extracted from the public Google Maps share links the
 * owner provided. Walking-time estimates are *not* published until verified
 * (see DESIGN.md — Content Truth).
 */

export type PoiCategory =
  | "residence"
  | "transport"
  | "university"
  | "supermarket"
  | "pharmacy"
  | "breakfast"
  | "hospital";

export type Poi = {
  id: string;
  category: PoiCategory;
  name: string;
  /** Short note shown in the popup. Translated on the consumer side. */
  description?: {
    it?: string;
    en?: string;
  };
  lat: number;
  lng: number;
  gmaps: string;
};

// Verified from the canonical Google Maps place page for the residence.
export const RESIDENCE_COORDS = { lat: 45.4880303, lng: 9.2291348 };

export const pois: Poi[] = [
  // The residence itself
  {
    id: "residence",
    category: "residence",
    name: "Palma Rosa Residence",
    description: {
      it: "Via Privata Mario Bianco, 13/1 — Milano",
      en: "Via Privata Mario Bianco, 13/1 — Milan",
    },
    lat: 45.4880303,
    lng: 9.2291348,
    gmaps: "https://maps.app.goo.gl/vaxKnUUxJBmvieHL9",
  },

  // NOTE — Coordinates below are first-pass estimates around Citta Studi
  // pending verification. The exact location is always one click away via
  // the `gmaps` link in the popup. Refine these as needed.

  // Metro (M2 green line)
  {
    id: "m2-piola",
    category: "transport",
    name: "M2 Piola",
    description: { it: "Metropolitana linea verde", en: "Green line metro" },
    lat: 45.4791,
    lng: 9.2274,
    gmaps: "https://maps.app.goo.gl/JTzG7gQbcD7gNCmJ9",
  },
  {
    id: "m2-lambrate",
    category: "transport",
    name: "M2 / FS Lambrate",
    description: {
      it: "Metro M2 e stazione ferroviaria",
      en: "M2 metro and railway station",
    },
    lat: 45.4842,
    lng: 9.2387,
    gmaps: "https://maps.app.goo.gl/MGcZ4Vd9hxQyhwTm6",
  },
  {
    id: "m2-udine",
    category: "transport",
    name: "M2 Udine",
    description: { it: "Metropolitana linea verde", en: "Green line metro" },
    lat: 45.4895,
    lng: 9.2306,
    gmaps: "https://maps.app.goo.gl/Kr3FmDdY8M2QkqTH6",
  },

  // Universities
  {
    id: "polimi-leonardo",
    category: "university",
    name: "Politecnico di Milano — Polo Leonardo",
    description: {
      it: "Campus storico del Politecnico",
      en: "Politecnico's main campus",
    },
    lat: 45.4787,
    lng: 9.2276,
    gmaps: "https://maps.app.goo.gl/kUmEy7jEL8bcEVq7A",
  },
  {
    id: "unimi-statale",
    category: "university",
    name: "Università degli Studi di Milano — Città Studi",
    description: {
      it: "Edifici della Statale in zona Città Studi",
      en: "Statale buildings in the Città Studi area",
    },
    lat: 45.4768,
    lng: 9.2350,
    gmaps: "https://maps.app.goo.gl/kNYXh8r8gZjR3GKv5",
  },

  // Supermarkets
  {
    id: "supermarket-undercasa",
    category: "supermarket",
    name: "Supermercato (sotto casa)",
    description: {
      it: "Spesa quotidiana proprio sotto il residence",
      en: "Daily groceries right next to the residence",
    },
    lat: 45.4882,
    lng: 9.2295,
    gmaps: "https://maps.app.goo.gl/6xBDhszWxKh5RZF37",
  },
  {
    id: "supermarket-2",
    category: "supermarket",
    name: "Supermercato",
    lat: 45.4860,
    lng: 9.2270,
    gmaps: "https://maps.app.goo.gl/GQd9vZKT227iTWxL9",
  },
  {
    id: "supermarket-3",
    category: "supermarket",
    name: "Supermercato",
    lat: 45.4895,
    lng: 9.2330,
    gmaps: "https://maps.app.goo.gl/eSSMQ2cz4H5Saf7Q9",
  },
  {
    id: "supermarket-4",
    category: "supermarket",
    name: "Supermercato",
    lat: 45.4870,
    lng: 9.2340,
    gmaps: "https://maps.app.goo.gl/nPaFqPLdNCnhDV2m6",
  },

  // Pharmacy
  {
    id: "pharmacy-1",
    category: "pharmacy",
    name: "Farmacia (sotto casa)",
    description: {
      it: "A pochi metri dal residence",
      en: "Steps from the residence",
    },
    lat: 45.4881,
    lng: 9.2297,
    gmaps: "https://maps.app.goo.gl/NbpKcamFKScrDcP89",
  },

  // Breakfast / cafés
  {
    id: "breakfast-1",
    category: "breakfast",
    name: "Bar — colazione",
    description: { it: "Per la colazione o la merenda", en: "Breakfast and snacks" },
    lat: 45.4878,
    lng: 9.2282,
    gmaps: "https://maps.app.goo.gl/gwz6GZmvUgj3dzjd7",
  },
  {
    id: "breakfast-2",
    category: "breakfast",
    name: "Bar — colazione",
    description: { it: "Per la colazione o la merenda", en: "Breakfast and snacks" },
    lat: 45.4869,
    lng: 9.2310,
    gmaps: "https://maps.app.goo.gl/D25p6yq8vs8xarmx9",
  },

  // Hospital
  {
    id: "hospital-1",
    category: "hospital",
    name: "Pronto soccorso",
    description: {
      it: "Pronto soccorso di riferimento in zona",
      en: "Nearest emergency room",
    },
    lat: 45.4853,
    lng: 9.2245,
    gmaps: "https://maps.app.goo.gl/fMNQPJ4ih6sQzf6a7",
  },
];

export const poiCategories: PoiCategory[] = [
  "transport",
  "university",
  "supermarket",
  "pharmacy",
  "breakfast",
  "hospital",
];
