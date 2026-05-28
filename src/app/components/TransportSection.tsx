import { motion } from "motion/react";
import { Clock, ExternalLink, MapPin, Train } from "lucide-react";
import { RESIDENCE_ADDRESS, RESIDENCE_MAP_URL } from "../data/apartments";
import { useLanguage } from "../lib/language";

export default function TransportSection() {
  const { language } = useLanguage();
  const stops = [
    { name: "Piola M2", note: language === "it" ? "Linea verde" : "Green line" },
    { name: "Lambrate M2", note: language === "it" ? "Metro e stazione ferroviaria" : "Metro and railway station" },
    { name: "Udine M2", note: language === "it" ? "Linea verde" : "Green line" },
  ];

  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4">{language === "it" ? "Trasporti" : "Transport"}</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {language === "it"
              ? "Il residence si trova in Via Privata Mario Bianco, in una posizione comoda per la M2."
              : "The residence is on Via Privata Mario Bianco, with convenient access to the M2 line."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl border border-border bg-secondary/40 p-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-primary p-3 text-white">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3>{language === "it" ? "Indirizzo" : "Address"}</h3>
                <p className="text-sm text-muted-foreground">{RESIDENCE_ADDRESS}</p>
              </div>
            </div>
            <a
              href={RESIDENCE_MAP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm text-primary shadow-sm transition hover:shadow-md"
            >
              {language === "it" ? "Apri su Google Maps" : "Open in Google Maps"}
              <ExternalLink className="h-4 w-4" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-border bg-white p-8 shadow-lg"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-emerald-700 p-3 text-white">
                <Train className="h-6 w-6" />
              </div>
              <div>
                <h3>Metro M2</h3>
                <p className="text-sm text-muted-foreground">
                  {language === "it" ? "Piola, Lambrate e Udine sono le fermate di riferimento" : "Piola, Lambrate and Udine are the reference stops"}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {stops.map((stop) => (
                <div key={stop.name} className="flex items-start gap-3 rounded-xl bg-secondary/45 p-4">
                  <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-medium">{stop.name}</p>
                    <p className="text-sm text-muted-foreground">{stop.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
