import { MapPin, MessageCircle, Phone } from "lucide-react";
import { RESIDENCE_ADDRESS, RESIDENCE_MAP_URL, WHATSAPP_NUMBER } from "../data/apartments";
import { useLanguage } from "../lib/language";
import Logo from "./Logo";

export default function Footer() {
  const { language } = useLanguage();
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <footer className="bg-primary px-6 py-16 text-primary-foreground">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <div className="mb-4">
              <Logo variant="light" showText={true} />
            </div>
            <p className="mb-4 text-white/70">
              {language === "it"
                ? "Appartamenti con bagno privato vicino alla M2 a Milano."
                : "Apartments with private bathrooms near the M2 line in Milan."}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-white">{language === "it" ? "Contatti" : "Contact"}</h4>
            <div className="space-y-3 text-white/80">
              <a href={RESIDENCE_MAP_URL} target="_blank" rel="noreferrer" className="flex items-start gap-3 transition hover:text-white">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <span>{RESIDENCE_ADDRESS}</span>
              </a>
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="flex items-center gap-3 transition hover:text-white">
                <MessageCircle className="h-5 w-5 flex-shrink-0" />
                <span>WhatsApp</span>
              </a>
              <a href={`tel:+${WHATSAPP_NUMBER}`} className="flex items-center gap-3 transition hover:text-white">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>+39 328 325 5279</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-white">{language === "it" ? "Disponibilita" : "Availability"}</h4>
            <div className="space-y-2 text-white/80">
              <p>
                {language === "it"
                  ? "Usa il controllo date per verificare i calendari aggiornati."
                  : "Use the date checker to verify the latest calendars."}
              </p>
              <button
                type="button"
                onClick={() => document.getElementById("availability")?.scrollIntoView({ behavior: "smooth" })}
                className="mt-3 rounded-full bg-white/10 px-5 py-2 transition hover:bg-white/20"
              >
                {language === "it" ? "Verifica date" : "Check dates"}
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-white/60">
          <p>&copy; 2026 Palma Rosa Residence. {language === "it" ? "Tutti i diritti riservati." : "All rights reserved."}</p>
        </div>
      </div>
    </footer>
  );
}
