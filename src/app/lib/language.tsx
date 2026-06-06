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
    openMenu: "Apri il menu",
    closeMenu: "Chiudi il menu",
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

    // Eyebrows & section labels
    eyebrowResidence: "Il residence",
    eyebrowServices: "Servizi inclusi",
    eyebrowApartments: "Appartamenti",
    eyebrowAvailability: "Disponibilita",
    eyebrowNearby: "Dintorni",
    eyebrowContact: "Contatti",

    // Hero
    heroTagline: "Dieci appartamenti con bagno privato, a pochi minuti dalla M2.",
    heroAddressEyebrow: "Via Privata Mario Bianco, Milano",
    heroCtaCheck: "Verifica disponibilita",
    heroCtaExplore: "Scopri il residence",

    // Gallery / Residence
    galleryHeading: "Scopri il residence",
    galleryIntro: "Esterni e interni reali del complesso in Via Privata Mario Bianco.",
    captionFacade: "Facciata",
    captionIngresso: "Ingresso",
    captionCorridoio: "Corridoio primo piano",
    captionScale: "Scale",
    captionAscensore: "Ascensore",
    captionLavanderia: "Lavanderia",
    captionCitofono: "Citofono",
    captionVistaDalBalcone: "Vista dal balcone",

    // Services
    servicesHeading: "Servizi inclusi",
    servicesIntro: "Solo informazioni confermate dai dati attuali del residence.",
    serviceBathDesc: "Ogni appartamento ha il proprio bagno privato",
    serviceSofaDesc: "Soluzioni pensate per ospitare fino a 2 persone",
    serviceWifiDesc: "Connessione disponibile nel residence",
    serviceLaundryDesc: "Lavatrice e asciugatrice a disposizione",
    serviceElevatorDesc: "Comodo accesso agli appartamenti del primo piano",
    serviceTransportDesc: "Vicino a Piola, Lambrate e Udine sulla M2",
    serviceLaundry: "Lavanderia",
    serviceWifi: "Wi-Fi",
    serviceElevator: "Ascensore",
    serviceTransport: "Metro e treni",

    // Apartments listing
    apartmentsHeading: "Appartamenti",
    apartmentsIntro: "10 appartamenti nel complesso Palma Rosa Residence, tutti con bagno privato.",
    apartmentsCount: "{count} appartamenti",

    // Availability page
    availabilityHeading: "Verifica le date",
    availabilityIntro: "Seleziona check-in e check-out per vedere in tempo reale quali appartamenti sono liberi.",
    availabilityResult: "{count} appartamenti disponibili nelle date selezionate.",
    availabilityNoResult: "Nessun appartamento risulta disponibile nelle date selezionate.",
    availabilityCheckFailed: "Non siamo riusciti a contattare i calendari. Riprova fra qualche istante.",
    selectDates: "Seleziona le date",
    nights: "{count} notti",
    night: "{count} notte",

    // Nearby map
    nearbyHeading: "La zona, in un colpo d'occhio",
    nearbyIntro: "Citta Studi: universita, metro e tutto quello che ti serve nei dintorni.",
    nearbyOpenMaps: "Apri su Google Maps",
    poiResidence: "Il residence",
    poiTransport: "Metro e treni",
    poiUniversity: "Universita",
    poiSupermarket: "Supermercati",
    poiPharmacy: "Farmacia",
    poiBreakfast: "Bar / colazione",
    poiHospital: "Pronto soccorso",

    // Footer
    footerTagline: "Appartamenti con bagno privato vicino alla M2 a Milano.",
    footerCopyright: "Tutti i diritti riservati.",

    // Misc
    backToHome: "Torna alla home",
    pageNotFound: "Pagina non trovata",
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
    openMenu: "Open menu",
    closeMenu: "Close menu",
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

    eyebrowResidence: "The residence",
    eyebrowServices: "Included services",
    eyebrowApartments: "Apartments",
    eyebrowAvailability: "Availability",
    eyebrowNearby: "Nearby",
    eyebrowContact: "Contact",

    heroTagline: "Ten apartments with private bathrooms, minutes from the M2 line.",
    heroAddressEyebrow: "Via Privata Mario Bianco, Milan",
    heroCtaCheck: "Check availability",
    heroCtaExplore: "Explore the residence",

    galleryHeading: "Discover the residence",
    galleryIntro: "Real exterior and interior views from Via Privata Mario Bianco.",
    captionFacade: "Facade",
    captionIngresso: "Entrance",
    captionCorridoio: "First floor corridor",
    captionScale: "Staircase",
    captionAscensore: "Elevator",
    captionLavanderia: "Laundry room",
    captionCitofono: "Intercom",
    captionVistaDalBalcone: "View from the balcony",

    servicesHeading: "Included services",
    servicesIntro: "Only services confirmed by the current residence data.",
    serviceBathDesc: "Each apartment has its own private bathroom",
    serviceSofaDesc: "Set up to host up to 2 people comfortably",
    serviceWifiDesc: "Internet available throughout the residence",
    serviceLaundryDesc: "Shared washing machine and dryer on site",
    serviceElevatorDesc: "Elevator access for first-floor apartments",
    serviceTransportDesc: "Close to Piola, Lambrate, and Udine on the M2 line",
    serviceLaundry: "Laundry",
    serviceWifi: "Wi-Fi",
    serviceElevator: "Elevator",
    serviceTransport: "Metro & rail",

    apartmentsHeading: "Apartments",
    apartmentsIntro: "10 apartments in the Palma Rosa Residence complex, each with a private bathroom.",
    apartmentsCount: "{count} apartments",

    availabilityHeading: "Check your dates",
    availabilityIntro: "Select check-in and check-out to see in real time which apartments are free.",
    availabilityResult: "{count} apartments available for the selected dates.",
    availabilityNoResult: "No apartments appear available for the selected dates.",
    availabilityCheckFailed: "We couldn't reach the calendars. Please try again in a moment.",
    selectDates: "Pick your dates",
    nights: "{count} nights",
    night: "{count} night",

    nearbyHeading: "The neighbourhood at a glance",
    nearbyIntro: "Citta Studi: universities, metro stops, and everyday essentials a short walk away.",
    nearbyOpenMaps: "Open in Google Maps",
    poiResidence: "The residence",
    poiTransport: "Metro & rail",
    poiUniversity: "Universities",
    poiSupermarket: "Supermarkets",
    poiPharmacy: "Pharmacy",
    poiBreakfast: "Cafés / breakfast",
    poiHospital: "Emergency room",

    footerTagline: "Apartments with private bathrooms near the M2 line in Milan.",
    footerCopyright: "All rights reserved.",

    backToHome: "Back to home",
    pageNotFound: "Page not found",
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
