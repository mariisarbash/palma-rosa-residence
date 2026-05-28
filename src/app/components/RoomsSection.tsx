import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { visibleApartments, type Apartment } from "../data/apartments";
import { useAvailability } from "../lib/availability-context";
import { useLanguage } from "../lib/language";
import ApartmentModal from "./ApartmentModal";
import RoomCard from "./RoomCard";

export default function RoomsSection() {
  const { t } = useLanguage();
  const { statuses } = useAvailability();
  const [selected, setSelected] = useState<Apartment | null>(null);

  return (
    <section className="bg-background px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4 text-muted-foreground">{t("eyebrowApartments")}</p>
            <h2 className="mb-5">{t("apartmentsHeading")}</h2>
            <p className="text-muted-foreground">{t("apartmentsIntro")}</p>
          </div>

          <Link to="/disponibilita" className="btn-solid self-start md:self-end">
            {t("checkAvailability")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {visibleApartments.map((apartment, index) => (
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
                onOpen={() => setSelected(apartment)}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <ApartmentModal apartment={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
