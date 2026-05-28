import { Bath, BedDouble, Check, ChevronRight, Image, X } from "lucide-react";
import type { Apartment, ApartmentStatus } from "../data/apartments";
import { getApartmentFloor } from "../data/apartments";
import { useLanguage } from "../lib/language";

type RoomCardProps = {
  apartment: Apartment;
  status: ApartmentStatus;
  onOpen: () => void;
};

export default function RoomCard({ apartment, status, onOpen }: RoomCardProps) {
  const { t } = useLanguage();
  const floor = getApartmentFloor(apartment);
  const thumb = apartment.photos[0] || "/images/placeholder.svg";

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group h-full overflow-hidden rounded-2xl bg-white text-left shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl active:translate-y-0"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={thumb}
          alt={`${t("apartment")} ${apartment.label}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {apartment.photos.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-secondary text-muted-foreground">
            <Image className="h-9 w-9" />
            <span className="text-sm">{t("photosComingSoon")}</span>
          </div>
        )}
        <StatusBadge status={status} />
      </div>

      <div className="p-6">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl">{t("apartment")} {apartment.label}</h3>
            <p className="text-sm text-muted-foreground">{apartment.zone}</p>
          </div>
          <ChevronRight className="mt-1 h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
        </div>

        <div className="mb-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <BedDouble className="h-4 w-4" />
            {apartment.people === 1 ? t("people", { count: apartment.people }) : t("peoplePlural", { count: apartment.people })}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Bath className="h-4 w-4" />
            {t("privateBathroom")}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          {floor && (
            <span className="rounded-full bg-accent px-3 py-1 text-accent-foreground">
              {floor === "ground" ? t("groundFloor") : t("firstFloor")}
            </span>
          )}
          <span className="rounded-full bg-secondary px-3 py-1 text-muted-foreground">
            {t("sofaBed")}
          </span>
        </div>
      </div>
    </button>
  );
}

function StatusBadge({ status }: { status: ApartmentStatus }) {
  const { t } = useLanguage();
  if (!status) return null;

  if (status === "loading") {
    return (
      <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-sm text-foreground backdrop-blur-sm">
        {t("checking")}
      </span>
    );
  }

  const isAvailable = status === "available";
  const label = status === "unknown" ? t("unknown") : isAvailable ? t("available") : t("unavailable");

  return (
    <span
      className={`absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-white backdrop-blur-sm ${
        isAvailable ? "bg-emerald-600" : status === "unknown" ? "bg-zinc-600" : "bg-red-600"
      }`}
    >
      {isAvailable ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
      {label}
    </span>
  );
}
