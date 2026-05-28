import { MapPin, MessageCircle, Phone } from "lucide-react";
import { RESIDENCE_ADDRESS, RESIDENCE_MAP_URL, WHATSAPP_NUMBER } from "../data/apartments";
import { useLanguage } from "../lib/language";
import Logo from "./Logo";

export default function Footer() {
  const { language } = useLanguage();
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}`;
  const fg = "rgba(250, 248, 244, 0.7)";

  return (
    <footer className="bg-primary px-6 py-20 text-primary-foreground md:px-12 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <Logo variant="light" />
            <p className="mt-6 max-w-xs text-sm" style={{ color: fg }}>
              {language === "it"
                ? "Appartamenti con bagno privato vicino alla M2 a Milano."
                : "Apartments with private bathrooms near the M2 line in Milan."}
            </p>
          </div>

          <div>
            <p className="eyebrow mb-5" style={{ color: fg }}>
              {language === "it" ? "Contatti" : "Contact"}
            </p>
            <div className="space-y-4 text-sm">
              <a
                href={RESIDENCE_MAP_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 transition hover:text-primary-foreground"
                style={{ color: fg }}
              >
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{RESIDENCE_ADDRESS}</span>
              </a>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 transition hover:text-primary-foreground"
                style={{ color: fg }}
              >
                <MessageCircle className="h-4 w-4 flex-shrink-0" />
                <span>WhatsApp</span>
              </a>
              <a
                href={`tel:+${WHATSAPP_NUMBER}`}
                className="flex items-center gap-3 transition hover:text-primary-foreground"
                style={{ color: fg }}
              >
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+39 328 325 5279</span>
              </a>
            </div>
          </div>

          <div>
            <p className="eyebrow mb-5" style={{ color: fg }}>
              {language === "it" ? "Disponibilita" : "Availability"}
            </p>
            <p className="text-sm" style={{ color: fg }}>
              {language === "it"
                ? "Usa il controllo date per verificare i calendari aggiornati."
                : "Use the date checker to verify the latest calendars."}
            </p>
            <button
              type="button"
              onClick={() => document.getElementById("availability")?.scrollIntoView({ behavior: "smooth" })}
              className="mt-6 inline-flex items-center border border-white/30 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.18em] transition hover:bg-white hover:text-foreground"
            >
              {language === "it" ? "Verifica date" : "Check dates"}
            </button>
          </div>
        </div>

        <div className="border-t border-white/15 pt-8 text-xs" style={{ color: "rgba(250, 248, 244, 0.5)" }}>
          <p>&copy; 2026 Palma Rosa Residence. {language === "it" ? "Tutti i diritti riservati." : "All rights reserved."}</p>
        </div>
      </div>
    </footer>
  );
}
