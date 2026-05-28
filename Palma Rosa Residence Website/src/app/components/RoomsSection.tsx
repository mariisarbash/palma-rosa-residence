import { useState } from "react";
import { motion } from "motion/react";
import { apartments, type Apartment } from "../data/apartments";
import { useAvailability } from "../lib/availability-context";
import { useLanguage } from "../lib/language";
import ApartmentModal from "./ApartmentModal";
import RoomCard from "./RoomCard";

export default function RoomsSection() {
  const { language, t } = useLanguage();
  const { statuses, hasSearched } = useAvailability();
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);

  return (
    <section className="bg-secondary/30 px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-4 text-left md:flex-row md:items-end">
          <div>
            <h2 className="mb-4">{t("apartments")}</h2>
            <p className="max-w-2xl text-muted-foreground">
              {language === "it"
                ? "10 appartamenti nel complesso Palma Rosa Residence, tutti con bagno privato."
                : "10 apartments in the Palma Rosa Residence complex, all with private bathrooms."}
            </p>
          </div>
          <span className="rounded-full bg-white px-4 py-2 text-sm text-muted-foreground shadow-sm">
            {t("listings", { count: apartments.length })}
          </span>
        </div>

        {hasSearched && (
          <div className="mb-6 rounded-xl border border-border bg-white p-4 text-sm text-muted-foreground">
            {language === "it"
              ? "Le etichette sulle card riflettono le date cercate nella sezione disponibilita."
              : "Card labels reflect the dates searched in the availability section."}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {apartments.map((apartment, index) => (
            <motion.div
              key={apartment.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
            >
              <RoomCard
                apartment={apartment}
                status={statuses[apartment.id] || null}
                onOpen={() => setSelectedApartment(apartment)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <ApartmentModal apartment={selectedApartment} onClose={() => setSelectedApartment(null)} />
    </section>
  );
}
