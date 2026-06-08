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
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-muted shadow-md md:aspect-[4/5] md:rounded-3xl">
        <Picture
          src={thumb}
          alt={`${t("apartment")} ${apartment.label}`}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          sizes="(min-width: 1024px) 33vw, 50vw"
        />
        {apartment.photos.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
            <ImageIcon className="h-8 w-8" />
            <span className="text-xs uppercase tracking-[0.16em]">{t("photosComingSoon")}</span>
          </div>
        )}
        <StatusBadge status={status} />
      </div>

      <div className="px-1 pt-3 md:pt-5">
        <div className="flex flex-col gap-0.5 md:flex-row md:items-baseline md:justify-between md:gap-4">
          <h3 className="text-base md:text-xl">{t("apartment")} {apartment.label}</h3>
          {floor && (
            <span className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground md:text-xs">
              {floor === "ground" ? t("groundFloor") : t("firstFloor")}
            </span>
          )}
        </div>
        <p className="mt-1.5 text-xs text-muted-foreground md:mt-2 md:text-sm">
          {apartment.people === 1
            ? t("people", { count: apartment.people })
            : t("peoplePlural", { count: apartment.people })}{" "}
          · {t("privateBathroom")}
          <span className="hidden md:inline"> · {t("sofaBed")}</span>
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
    "absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-[0.1em] backdrop-blur-md md:left-4 md:top-4 md:gap-1.5 md:px-3 md:py-1 md:text-[0.7rem] md:tracking-[0.12em]";

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
