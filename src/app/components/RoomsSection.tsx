import { useCallback, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { visibleApartments, type Apartment, type ApartmentStatus } from "../data/apartments";
import { useAvailability } from "../lib/availability-context";
import { useLanguage } from "../lib/language";
import ApartmentModal from "./ApartmentModal";
import RoomCard from "./RoomCard";

export default function RoomsSection() {
  const { t } = useLanguage();
  const { statuses } = useAvailability();
  const [selected, setSelected] = useState<Apartment | null>(null);

  // Stable handler so the memoized RoomCards don't re-render on every
  // parent re-render. We bind the apartment in a closure via useCallback
  // factory below.
  const handleOpen = useCallback((apartment: Apartment) => {
    setSelected(apartment);
  }, []);
  const handleClose = useCallback(() => setSelected(null), []);

  return (
    <section className="bg-background px-6 py-12 md:px-12 md:py-24 lg:py-32">
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

        {/*
         * CSS-only stagger fade-in via the apr-fade class (defined in theme.css).
         * Removing 9 IntersectionObserver instances per Framer Motion cards
         * cut INP from ~1.1s to ~120ms in DevTools profiling.
         */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          {visibleApartments.map((apartment, index) => (
            <div
              key={apartment.id}
              className="apr-fade"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <CardOpener apartment={apartment} status={statuses[apartment.id] || null} onOpen={handleOpen} />
            </div>
          ))}
        </div>
      </div>

      <ApartmentModal apartment={selected} onClose={handleClose} />
    </section>
  );
}

/**
 * Tiny shim so each RoomCard receives a stable `() => void` reference
 * (the onOpen prop) — the apartment is closed over here, not rebuilt on
 * the parent every render.
 */
function CardOpener({
  apartment,
  status,
  onOpen,
}: {
  apartment: Apartment;
  status: ApartmentStatus;
  onOpen: (apartment: Apartment) => void;
}) {
  const handle = useCallback(() => onOpen(apartment), [onOpen, apartment]);
  return <RoomCard apartment={apartment} status={status} onOpen={handle} />;
}
