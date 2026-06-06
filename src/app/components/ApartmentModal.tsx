import { useEffect, useState, type ReactNode } from "react";
import { Bath, BedDouble, ChevronLeft, ChevronRight, MapPin, MessageCircle, X } from "lucide-react";
import {
  buildWhatsAppHref,
  getApartmentFloor,
  getBathroomLocation,
  RESIDENCE_MAP_URL,
  type Apartment,
} from "../data/apartments";
import { useAvailability } from "../lib/availability-context";
import { useLanguage } from "../lib/language";
import { Picture } from "./Picture";

type ApartmentModalProps = {
  apartment: Apartment | null;
  onClose: () => void;
};

export default function ApartmentModal({ apartment, onClose }: ApartmentModalProps) {
  const { language, t } = useLanguage();
  const { statuses } = useAvailability();
  const [photoIndex, setPhotoIndex] = useState(0);

  useEffect(() => {
    setPhotoIndex(0);
  }, [apartment?.id]);

  useEffect(() => {
    if (!apartment) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [apartment, onClose]);

  if (!apartment) return null;

  const photos = apartment.photos.length ? apartment.photos : ["/images/placeholder.svg"];
  const status = statuses[apartment.id] || null;
  const isUnavailable = status === "unavailable";
  const floor = getApartmentFloor(apartment);
  const bathroomLocation = getBathroomLocation(apartment);
  const activePhoto = photos[photoIndex];

  function stepPhoto(direction: number) {
    setPhotoIndex((current) => (current + direction + photos.length) % photos.length);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 p-4 backdrop-blur-sm" role="presentation" onMouseDown={onClose}>
      <div
        className="relative grid max-h-[92dvh] w-full max-w-6xl overflow-hidden rounded-3xl bg-card shadow-2xl md:grid-cols-[1.25fr_0.75fr]"
        role="dialog"
        aria-modal="true"
        aria-label={`${t("apartment")} ${apartment.label}`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-foreground shadow-lg transition hover:bg-white"
          aria-label={t("close")}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative min-h-[320px] bg-secondary md:min-h-[620px]">
          <Picture
            src={activePhoto}
            alt={`${t("apartment")} ${apartment.label} ${photoIndex + 1}`}
            className="h-full max-h-[64dvh] w-full object-cover md:max-h-none"
            sizes="(min-width: 768px) 60vw, 100vw"
            priority
          />
          {apartment.photos.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-secondary/80 text-muted-foreground">
              {t("photosComingSoon")}
            </div>
          )}
          {photos.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => stepPhoto(-1)}
                className="absolute left-4 top-1/2 rounded-full bg-white/85 p-3 text-foreground shadow-lg transition hover:bg-white"
                aria-label={t("previousPhoto")}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => stepPhoto(1)}
                className="absolute right-4 top-1/2 rounded-full bg-white/85 p-3 text-foreground shadow-lg transition hover:bg-white"
                aria-label={t("nextPhoto")}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 rounded-full bg-zinc-950/55 px-3 py-1 text-sm text-white backdrop-blur-sm">
                {photoIndex + 1} / {photos.length}
              </div>
            </>
          )}
        </div>

        <div className="overflow-y-auto p-6 md:p-8">
          <div className="mb-6">
            <p className="eyebrow mb-3 text-muted-foreground">{t("details")}</p>
            <h2>{t("apartment")} {apartment.label}</h2>
            <p className="mt-2 text-muted-foreground">{apartment.address}</p>
          </div>

          {status && (
            <div
              className={`mb-6 rounded-xl px-4 py-3 text-sm ${
                status === "available"
                  ? "bg-emerald-50 text-emerald-700"
                  : status === "unavailable"
                    ? "bg-red-50 text-red-700"
                    : "bg-secondary text-muted-foreground"
              }`}
            >
              {status === "available" ? t("available") : status === "unavailable" ? t("unavailable") : t("unknown")}
            </div>
          )}

          <div className="mb-6 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <InfoItem icon={<BedDouble className="h-4 w-4" />} label={apartment.people === 1 ? t("people", { count: apartment.people }) : t("peoplePlural", { count: apartment.people })} />
            <InfoItem
              icon={<Bath className="h-4 w-4" />}
              label={bathroomLocation === "ensuite" ? t("privateEnsuiteBathroom") : t("privateCorridorBathroom")}
            />
            {floor && <InfoItem label={floor === "ground" ? t("groundFloor") : t("firstFloor")} />}
            <InfoItem label={t("sofaBed")} />
          </div>

          <section className="mb-6 border-t border-border pt-6">
            <h3 className="mb-3 text-lg">{t("services")}</h3>
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              {["Wi-Fi", language === "it" ? "Lavatrice" : "Washing machine", language === "it" ? "Asciugatrice" : "Dryer", language === "it" ? "Ascensore" : "Elevator"].map((item) => (
                <span key={item} className="rounded-full bg-secondary px-3 py-1">{item}</span>
              ))}
            </div>
          </section>

          <section className="mb-8 border-t border-border pt-6">
            <h3 className="mb-3 text-lg">{t("location")}</h3>
            <p className="mb-3 text-sm text-muted-foreground">
              {language === "it"
                ? "Equidistante dalle fermate M2 Piola, Lambrate e Udine. A Lambrate si trova anche la stazione ferroviaria."
                : "Close to the M2 stops Piola, Lambrate and Udine. Lambrate also has a railway station."}
            </p>
            <a
              href={RESIDENCE_MAP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium underline decoration-1 underline-offset-4"
            >
              <MapPin className="h-4 w-4" />
              {t("mapLink")}
            </a>
          </section>

          {isUnavailable ? (
            <span className="block rounded-2xl bg-secondary px-5 py-4 text-center text-muted-foreground">
              {t("notAvailableSelectedDates")}
            </span>
          ) : (
            <a
              href={buildWhatsAppHref(apartment, language)}
              target="_blank"
              rel="noreferrer"
              className="btn-solid w-full"
            >
              <MessageCircle className="h-4 w-4" />
              {t("contactWhatsApp")}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label }: { icon?: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-3 text-muted-foreground">
      {icon}
      <span>{label}</span>
    </div>
  );
}
