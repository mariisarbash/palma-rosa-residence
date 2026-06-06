import { memo } from "react";
import { Check, Image as ImageIcon, X } from "lucide-react";
import type { Apartment, ApartmentStatus } from "../data/apartments";
import { getApartmentFloor } from "../data/apartments";
import { Picture } from "./Picture";
import { useLanguage } from "../lib/language";

type RoomCardProps = {
  apartment: Apartment;
  status: ApartmentStatus;
  onOpen: () => void;
};

function RoomCardImpl({ apartment, status, onOpen }: RoomCardProps) {
  const { t } = useLanguage();
  const floor = getApartmentFloor(apartment);
  const thumb = apartment.photos[0] || "/images/placeholder.svg";

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group block h-full text-left transition-transform duration-300 hover:-translate-y-0.5"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-muted shadow-md">
        <Picture
          src={thumb}
          alt={`${t("apartment")} ${apartment.label}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
        {apartment.photos.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
            <ImageIcon className="h-8 w-8" />
            <span className="text-xs uppercase tracking-[0.16em]">{t("photosComingSoon")}</span>
          </div>
        )}
        <StatusBadge status={status} />
      </div>

      <div className="px-1 pt-5">
        <div className="flex items-baseline justify-between gap-4">
          <h3>{t("apartment")} {apartment.label}</h3>
          {floor && (
            <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {floor === "ground" ? t("groundFloor") : t("firstFloor")}
            </span>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {apartment.people === 1
            ? t("people", { count: apartment.people })
            : t("peoplePlural", { count: apartment.people })}{" "}
          · {t("privateBathroom")} · {t("sofaBed")}
        </p>
      </div>
    </button>
  );
}

/**
 * Cards re-render every time the availability map changes — even when only
 * one apartment's status flips. Memo on (apartment id, status, onOpen)
 * keeps the other 8 cards stable.
 */
const RoomCard = memo(RoomCardImpl, (prev, next) => {
  return (
    prev.apartment.id === next.apartment.id &&
    prev.status === next.status &&
    prev.onOpen === next.onOpen
  );
});

export default RoomCard;

function StatusBadge({ status }: { status: ApartmentStatus }) {
  const { t } = useLanguage();
  if (!status) return null;

  const base =
    "absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.12em] backdrop-blur-md";

  if (status === "loading") {
    return <span className={`${base} bg-white/80 text-foreground`}>{t("checking")}</span>;
  }

  if (status === "unknown") {
    return <span className={`${base} bg-white/80 text-muted-foreground`}>{t("unknown")}</span>;
  }

  const isAvailable = status === "available";
  return (
    <span
      className={`${base} ${
        isAvailable
          ? "bg-foreground/85 text-background"
          : "bg-destructive/90 text-destructive-foreground"
      }`}
    >
      {isAvailable ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {isAvailable ? t("available") : t("unavailable")}
    </span>
  );
}
