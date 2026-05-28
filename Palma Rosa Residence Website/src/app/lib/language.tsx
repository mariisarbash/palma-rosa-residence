import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Language = "it" | "en";

type TranslationParams = Record<string, string | number | null | undefined>;

const STORAGE_KEY = "palma-rosa-language";

const dictionary = {
  it: {
    apartment: "Appartamento",
    apartments: "Appartamenti",
    availability: "Disponibilita",
    available: "Disponibile",
    unavailable: "Non disponibile",
    unknown: "Da verificare",
    checking: "Verifica in corso",
    checkAvailability: "Verifica disponibilita",
    checkIn: "Arrivo",
    checkOut: "Partenza",
    clearDates: "Cancella date",
    close: "Chiudi",
    contactWhatsApp: "Contatta su WhatsApp",
    details: "Dettagli",
    discover: "Scopri",
    floor: "Piano",
    firstFloor: "Primo piano",
    gallery: "Galleria",
    groundFloor: "Piano terra",
    language: "Lingua",
    listings: "{count} appartamenti",
    location: "Posizione",
    mapLink: "Apri su Google Maps",
    nextPhoto: "Foto successiva",
    notAvailableSelectedDates: "Non disponibile nelle date selezionate",
    people: "{count} persona",
    peoplePlural: "{count} persone",
    photosComingSoon: "Foto in arrivo",
    previousPhoto: "Foto precedente",
    privateBathroom: "Bagno privato",
    privateCorridorBathroom: "Bagno privato nel corridoio",
    privateEnsuiteBathroom: "Bagno privato in camera",
    roomsNav: "Appartamenti",
    services: "Servizi",
    sofaBed: "Divano letto",
    transport: "Trasporti",
    viewDetails: "Vedi dettagli",
  },
  en: {
    apartment: "Apartment",
    apartments: "Apartments",
    availability: "Availability",
    available: "Available",
    unavailable: "Unavailable",
    unknown: "To verify",
    checking: "Checking",
    checkAvailability: "Check availability",
    checkIn: "Check-in",
    checkOut: "Check-out",
    clearDates: "Clear dates",
    close: "Close",
    contactWhatsApp: "Contact on WhatsApp",
    details: "Details",
    discover: "Discover",
    floor: "Floor",
    firstFloor: "First floor",
    gallery: "Gallery",
    groundFloor: "Ground floor",
    language: "Language",
    listings: "{count} apartments",
    location: "Location",
    mapLink: "Open in Google Maps",
    nextPhoto: "Next photo",
    notAvailableSelectedDates: "Not available for selected dates",
    people: "{count} person",
    peoplePlural: "{count} people",
    photosComingSoon: "Photos coming soon",
    previousPhoto: "Previous photo",
    privateBathroom: "Private bathroom",
    privateCorridorBathroom: "Private bathroom in the corridor",
    privateEnsuiteBathroom: "Private bathroom inside the room",
    roomsNav: "Apartments",
    services: "Services",
    sofaBed: "Sofa bed",
    transport: "Transport",
    viewDetails: "View details",
  },
} as const;

type TranslationKey = keyof typeof dictionary.it;

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, params?: TranslationParams) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("it");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "it" || stored === "en") setLanguageState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = "Palma Rosa Residence";
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute(
        "content",
        language === "it"
          ? "Appartamenti con bagno privato a Palma Rosa Residence, Milano Citta Studi."
          : "Apartments with private bathrooms at Palma Rosa Residence, Milan Citta Studi.",
      );
    }
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => {
    function setLanguage(nextLanguage: Language) {
      setLanguageState(nextLanguage);
      window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    }

    function t(key: keyof typeof dictionary.it, params?: TranslationParams) {
      const text = dictionary[language][key] || dictionary.it[key] || key;
      return String(text).replace(/\{(\w+)\}/g, (_, token) => {
        const replacement = params && Object.prototype.hasOwnProperty.call(params, token) ? params[token] : "";
        return replacement == null ? "" : String(replacement);
      });
    }

    return { language, setLanguage, t };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
