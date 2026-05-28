export type ApartmentStatus = "available" | "unavailable" | "unknown" | "loading" | null;

export type Apartment = {
  id: string;
  label: string;
  people: number;
  bathrooms: number;
  zone: string;
  address: string;
  photos: string[];
  whatsappMessage: {
    it: string;
    en: string;
  };
  icalId: string;
  alwaysAvailable: boolean;
};

export const WHATSAPP_NUMBER = "393283255279";

export const RESIDENCE_ADDRESS = "Via Privata Mario Bianco, 13/1, 20131 Milano";
export const RESIDENCE_MAP_URL = "https://maps.app.goo.gl/1HrYYdhJ2okZqfP58";

const sharedPhotos = [
  "/images/apartments/lavatrice_asciugatrice.jpeg",
  "/images/apartments/lavanderia.jpeg",
  "/images/apartments/ascensore.jpeg",
];

export const apartments: Apartment[] = [
  {
    id: "a1",
    label: "A1",
    people: 2,
    bathrooms: 1,
    zone: "Milano, Citta Studi",
    address: RESIDENCE_ADDRESS,
    photos: [
      "/images/apartments/a1/a1_1.jpg",
      "/images/apartments/a1/a1_2.jpg",
      "/images/apartments/a1/a1_3.jpg",
      "/images/apartments/a1/a1_4.jpg",
      "/images/apartments/a1/a1_5.jpg",
      "/images/apartments/a1/a1_5.1.jpg",
      "/images/apartments/a1/a1_6.jpg",
      "/images/apartments/a1/a1_7.jpg",
      "/images/apartments/a1/a1_8.jpg",
      "/images/apartments/a1/a1_9.jpg",
      "/images/apartments/a1/a1_10.jpg",
      "/images/apartments/a1/a1_11.jpg",
      "/images/apartments/a1/a1_12.jpeg",
      ...sharedPhotos,
    ],
    whatsappMessage: {
      it: "Ciao, sono interessato all'appartamento A1. Mi puoi dare maggiori informazioni su disponibilita e prezzo?",
      en: "Hi, I'm interested in apartment A1. Could you tell me more about availability and pricing?",
    },
    icalId: "a1",
    alwaysAvailable: false,
  },
  {
    id: "a2",
    label: "A2",
    people: 2,
    bathrooms: 1,
    zone: "Milano, Citta Studi",
    address: RESIDENCE_ADDRESS,
    photos: [
      "/images/apartments/a2/b2_a2_1.jpg",
      "/images/apartments/a2/b2_a2_2.jpg",
      "/images/apartments/a2/b2_a2_3.jpg",
      "/images/apartments/a2/b2_a2_4.jpg",
      "/images/apartments/a2/b2_a2_4.1.jpg",
      "/images/apartments/a2/b2_a2_4.2.jpg",
      "/images/apartments/a2/b2_a2_4.3.jpg",
      "/images/apartments/a2/b2_a2_4.4.jpg",
      "/images/apartments/a2/b2_a2_4.5.jpg",
      "/images/apartments/a2/b2_a2_5.jpg",
      "/images/apartments/a2/b2_a2_6.jpg",
      "/images/apartments/a2/b2_a2_7.jpg",
      "/images/apartments/a2/b2_a2_8.jpg",
      "/images/apartments/a2/b2_a2_9.jpg",
      "/images/apartments/a2/b2_a2_10.jpg",
      "/images/apartments/a2/b2_a2_11.jpg",
      "/images/apartments/a2/b2_a2_12.jpg",
      "/images/apartments/a2/b2_a2_13.jpg",
      "/images/apartments/a2/b2_a2_14.jpg",
      "/images/apartments/a2/b2_a2_15.jpg",
      "/images/apartments/a2/b2_a2_16.jpg",
      "/images/apartments/a2/b2_a2_17.jpg",
      "/images/apartments/a2/b2_a2_18.jpg",
      "/images/apartments/a2/b2_a2_19.jpg",
      ...sharedPhotos,
    ],
    whatsappMessage: {
      it: "Ciao, sono interessato all'appartamento A2. Mi puoi dare maggiori informazioni su disponibilita e prezzo?",
      en: "Hi, I'm interested in apartment A2. Could you tell me more about availability and pricing?",
    },
    icalId: "a2",
    alwaysAvailable: false,
  },
  {
    id: "a3",
    label: "A3",
    people: 2,
    bathrooms: 1,
    zone: "Milano, Citta Studi",
    address: RESIDENCE_ADDRESS,
    photos: [
      "/images/apartments/a3/a3_1.jpg",
      "/images/apartments/a3/a3_2.jpg",
      "/images/apartments/a3/a3_3.jpg",
      "/images/apartments/a3/a3_4.jpg",
      "/images/apartments/a3/a3_5.jpg",
      "/images/apartments/a3/a3_6.jpg",
      "/images/apartments/a3/a3_7.jpg",
      "/images/apartments/a3/a3_8.jpg",
      "/images/apartments/a3/a3_9.jpg",
      "/images/apartments/a3/a3_10.jpg",
      "/images/apartments/a3/a3_11.jpg",
      "/images/apartments/a3/a3_12.jpg",
      "/images/apartments/a3/a3_bagno_1.jpg",
      "/images/apartments/a3/a3_bagno_2.jpg",
      "/images/apartments/a3/a3_bagno_3.jpg",
      "/images/apartments/a3/a3_bagno_4.jpg",
      ...sharedPhotos,
    ],
    whatsappMessage: {
      it: "Ciao, sono interessato all'appartamento A3. Mi puoi dare maggiori informazioni su disponibilita e prezzo?",
      en: "Hi, I'm interested in apartment A3. Could you tell me more about availability and pricing?",
    },
    icalId: "a3",
    alwaysAvailable: false,
  },
  {
    id: "a4",
    label: "A4",
    people: 2,
    bathrooms: 1,
    zone: "Milano, Citta Studi",
    address: RESIDENCE_ADDRESS,
    photos: [
      "/images/apartments/a4/a4_1.jpg",
      "/images/apartments/a4/a4_2.jpg",
      "/images/apartments/a4/a4_3.jpg",
      "/images/apartments/a4/a4_4.jpg",
      "/images/apartments/a4/a4_5.jpg",
      "/images/apartments/a4/a4_6.jpg",
      "/images/apartments/a4/a4_7.jpg",
      "/images/apartments/a4/a4_8.jpg",
      "/images/apartments/a4/a4_9.jpg",
      "/images/apartments/a4/a4_10.jpg",
      "/images/apartments/a4/a4_11.jpg",
      "/images/apartments/a4/a4_bagno_1.jpg",
      "/images/apartments/a4/a4_bagno_2.jpg",
      ...sharedPhotos,
    ],
    whatsappMessage: {
      it: "Ciao, sono interessato all'appartamento A4. Mi puoi dare maggiori informazioni su disponibilita e prezzo?",
      en: "Hi, I'm interested in apartment A4. Could you tell me more about availability and pricing?",
    },
    icalId: "a4",
    alwaysAvailable: false,
  },
  {
    id: "a5",
    label: "A5",
    people: 2,
    bathrooms: 1,
    zone: "Milano, Citta Studi",
    address: RESIDENCE_ADDRESS,
    photos: [
      "/images/apartments/a5/a5_1.jpg",
      "/images/apartments/a5/a5_2.jpg",
      "/images/apartments/a5/a5_3.jpg",
      "/images/apartments/a5/a5_4.jpg",
      "/images/apartments/a5/a5_5.jpg",
      "/images/apartments/a5/a5_6.jpg",
      "/images/apartments/a5/a5_7.jpg",
      "/images/apartments/a5/a5_8.jpg",
      "/images/apartments/a5/a5_9.jpg",
      "/images/apartments/a5/a5_bagno_1.jpg",
      "/images/apartments/a5/a5_bagno_2.jpg",
      "/images/apartments/a5/a5_bagno_3.jpg",
      ...sharedPhotos,
    ],
    whatsappMessage: {
      it: "Ciao, sono interessato all'appartamento A5. Mi puoi dare maggiori informazioni su disponibilita e prezzo?",
      en: "Hi, I'm interested in apartment A5. Could you tell me more about availability and pricing?",
    },
    icalId: "a5",
    alwaysAvailable: false,
  },
  {
    id: "b1",
    label: "B1",
    people: 2,
    bathrooms: 1,
    zone: "Milano, Citta Studi",
    address: RESIDENCE_ADDRESS,
    photos: [
      "/images/apartments/b1/b1_1.jpg",
      "/images/apartments/b1/b1_2.jpg",
      "/images/apartments/b1/b1_3.jpg",
      "/images/apartments/b1/b1_4.jpg",
      "/images/apartments/b1/b1_5.jpg",
      "/images/apartments/b1/b1_6.jpg",
      "/images/apartments/b1/b1_7.jpg",
      "/images/apartments/b1/b1_8.jpg",
      "/images/apartments/b1/b1_10.jpg",
      "/images/apartments/b1/b1_11.jpg",
      "/images/apartments/b1/b1_12.jpg",
      "/images/apartments/b1/b1_13.jpg",
      "/images/apartments/b1/b1_14.jpg",
      "/images/apartments/b1/b1_15.jpeg",
      ...sharedPhotos,
    ],
    whatsappMessage: {
      it: "Ciao, sono interessato all'appartamento B1. Mi puoi dare maggiori informazioni su disponibilita e prezzo?",
      en: "Hi, I'm interested in apartment B1. Could you tell me more about availability and pricing?",
    },
    icalId: "b1",
    alwaysAvailable: false,
  },
  {
    id: "b2",
    label: "B2",
    people: 2,
    bathrooms: 1,
    zone: "Milano, Citta Studi",
    address: RESIDENCE_ADDRESS,
    photos: [
      "/images/apartments/b2/b2_a2_1.jpg",
      "/images/apartments/b2/b2_a2_2.jpg",
      "/images/apartments/b2/b2_a2_3.jpg",
      "/images/apartments/b2/b2_a2_4.jpg",
      "/images/apartments/b2/b2_a2_4.1.jpg",
      "/images/apartments/b2/b2_a2_4.2.jpg",
      "/images/apartments/b2/b2_a2_4.3.jpg",
      "/images/apartments/b2/b2_a2_4.4.jpg",
      "/images/apartments/b2/b2_a2_4.5.jpg",
      "/images/apartments/b2/b2_a2_5.jpg",
      "/images/apartments/b2/b2_a2_6.jpg",
      "/images/apartments/b2/b2_a2_7.jpg",
      "/images/apartments/b2/b2_a2_8.jpg",
      "/images/apartments/b2/b2_a2_9.jpg",
      "/images/apartments/b2/b2_a2_10.jpg",
      "/images/apartments/b2/b2_a2_11.jpg",
      "/images/apartments/b2/b2_a2_12.jpg",
      "/images/apartments/b2/b2_a2_13.jpg",
      "/images/apartments/b2/b2_a2_14.jpg",
      "/images/apartments/b2/b2_a2_15.jpg",
      "/images/apartments/b2/b2_a2_16.jpg",
      "/images/apartments/b2/b2_a2_17.jpg",
      "/images/apartments/b2/b2_a2_18.jpg",
      "/images/apartments/b2/b2_a2_19.jpg",
      ...sharedPhotos,
    ],
    whatsappMessage: {
      it: "Ciao, sono interessato all'appartamento B2. Mi puoi dare maggiori informazioni su disponibilita e prezzo?",
      en: "Hi, I'm interested in apartment B2. Could you tell me more about availability and pricing?",
    },
    icalId: "b2",
    alwaysAvailable: false,
  },
  {
    id: "b3",
    label: "B3",
    people: 2,
    bathrooms: 1,
    zone: "Milano, Citta Studi",
    address: RESIDENCE_ADDRESS,
    photos: [
      "/images/apartments/b3/b3_1.jpg",
      "/images/apartments/b3/b3_2.jpg",
      "/images/apartments/b3/b3_3.jpg",
      "/images/apartments/b3/b3_4.jpg",
      "/images/apartments/b3/b3_5.jpg",
      "/images/apartments/b3/b3_6.jpg",
      "/images/apartments/b3/b3_7.jpg",
      "/images/apartments/b3/b3_8.jpg",
      "/images/apartments/b3/b3_9.jpg",
      "/images/apartments/b3/b3_bagno_1.jpg",
      "/images/apartments/b3/b3_bagno_2.jpg",
      "/images/apartments/b3/b3_bagno_3.jpg",
      "/images/apartments/b3/b3_bagno_4.jpg",
      "/images/apartments/b3/b3_bagno_5.jpg",
      ...sharedPhotos,
    ],
    whatsappMessage: {
      it: "Ciao, sono interessato all'appartamento B3. Mi puoi dare maggiori informazioni su disponibilita e prezzo?",
      en: "Hi, I'm interested in apartment B3. Could you tell me more about availability and pricing?",
    },
    icalId: "b3",
    alwaysAvailable: false,
  },
  {
    id: "b4",
    label: "B4",
    people: 2,
    bathrooms: 1,
    zone: "Milano, Citta Studi",
    address: RESIDENCE_ADDRESS,
    photos: [
      "/images/apartments/b4/b4_1.jpg",
      "/images/apartments/b4/b4_2.jpg",
      "/images/apartments/b4/b4_3.jpg",
      "/images/apartments/b4/b4_4.jpg",
      "/images/apartments/b4/b4_5.jpg",
      "/images/apartments/b4/b4_6.jpg",
      "/images/apartments/b4/b4_7.jpg",
      "/images/apartments/b4/b4_8.jpg",
      "/images/apartments/b4/b4_9.jpg",
      "/images/apartments/b4/b4_10.jpg",
      "/images/apartments/b4/b4_11.jpg",
      "/images/apartments/b4/b4_bagno_1.jpg",
      "/images/apartments/b4/b4_bagno_2.jpg",
      "/images/apartments/b4/b4_bagno_3.jpg",
      "/images/apartments/b4/b4_bagno_4.jpg",
      ...sharedPhotos,
    ],
    whatsappMessage: {
      it: "Ciao, sono interessato all'appartamento B4. Mi puoi dare maggiori informazioni su disponibilita e prezzo?",
      en: "Hi, I'm interested in apartment B4. Could you tell me more about availability and pricing?",
    },
    icalId: "b4",
    alwaysAvailable: false,
  },
  {
    id: "b5",
    label: "B5",
    people: 2,
    bathrooms: 1,
    zone: "Milano, Citta Studi",
    address: RESIDENCE_ADDRESS,
    photos: [],
    whatsappMessage: {
      it: "Ciao, sono interessato all'appartamento B5. Mi puoi dare maggiori informazioni su disponibilita e prezzo?",
      en: "Hi, I'm interested in apartment B5. Could you tell me more about availability and pricing?",
    },
    icalId: "b5",
    alwaysAvailable: true,
  },
];

export function getApartmentFloor(apt: Apartment) {
  if (apt.id.startsWith("a")) return "ground" as const;
  if (apt.id.startsWith("b")) return "first" as const;
  return null;
}

export function getBathroomLocation(apt: Apartment) {
  return ["a1", "a2", "b1", "b2"].includes(apt.id) ? "ensuite" : "corridor";
}

export function buildWhatsAppHref(apt: Apartment, language: "it" | "en") {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(apt.whatsappMessage[language])}`;
}
