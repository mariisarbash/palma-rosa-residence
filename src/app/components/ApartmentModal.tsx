import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
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

// Drag past this many px (downwards) on the mobile sheet handle to dismiss.
const DISMISS_THRESHOLD = 110;

export default function ApartmentModal({ apartment, onClose }: ApartmentModalProps) {
  const { language, t } = useLanguage();
  const { statuses } = useAvailability();
  const [photoIndex, setPhotoIndex] = useState(0);

  // Live drag offset for the mobile bottom-sheet (0 = resting). Desktop never
  // sets this because the drag handle is hidden at md+.
  const [dragY, setDragY] = useState(0);
  const dragStartY = useRef<number | null>(null);

  useEffect(() => {
    setPhotoIndex(0);
    setDragY(0);
  }, [apartment?.id]);

  useEffect(() => {
    if (!apartment) return;
    // iOS Safari ignores `overflow: hidden` on <body> for touch scrolling, so
    // the page kept scrolling behind the sheet — the toolbar retracted, the
    // dynamic viewport height changed, and the pinned CTA slid out of view.
    // The position:fixed technique truly freezes the page (and the toolbar),
    // keeping the sheet — and its footer — anchored to the visible viewport.
    const { body } = document;
    const scrollY = window.scrollY;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
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

  // --- Mobile sheet drag-to-dismiss -------------------------------------
  function handleDragStart(event: PointerEvent<HTMLDivElement>) {
    dragStartY.current = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function handleDragMove(event: PointerEvent<HTMLDivElement>) {
    if (dragStartY.current === null) return;
    // Only track downward movement; ignore upward pulls.
    setDragY(Math.max(0, event.clientY - dragStartY.current));
  }
  function handleDragEnd() {
    if (dragStartY.current === null) return;
    dragStartY.current = null;
    setDragY((current) => {
      if (current > DISMISS_THRESHOLD) onClose();
      return 0;
    });
  }

  return (
    <div
      className="apr-scrim fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/70 backdrop-blur-sm md:items-center md:p-4"
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        className="apr-sheet relative flex max-h-[92svh] w-full max-w-6xl flex-col overflow-hidden rounded-t-3xl bg-card shadow-2xl md:max-h-[92dvh] md:flex-row md:rounded-3xl"
        role="dialog"
        aria-modal="true"
        aria-label={`${t("apartment")} ${apartment.label}`}
        onMouseDown={(event) => event.stopPropagation()}
        style={dragY ? { transform: `translateY(${dragY}px)`, transition: "none" } : undefined}
      >
        {/* Drag handle — mobile only. Doubles as the dismiss gesture target. */}
        <div
          className="absolute inset-x-0 top-0 z-20 flex h-9 touch-none items-center justify-center md:hidden"
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
        >
          <span className="h-1.5 w-12 rounded-full bg-white/70 shadow-sm" />
        </div>

        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2 text-foreground shadow-lg transition hover:bg-white"
          aria-label={t("close")}
        >
          <X className="h-5 w-5" />
        </button>

        {/* PHOTO — fixed header on mobile, full-height left column on desktop */}
        <div className="relative h-[38svh] w-full shrink-0 bg-secondary md:h-auto md:min-h-[620px] md:w-[58%]">
          <Picture
            src={activePhoto}
            alt={`${t("apartment")} ${apartment.label} ${photoIndex + 1}`}
            className="h-full w-full object-cover"
            sizes="(min-width: 768px) 58vw, 100vw"
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
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-3 text-foreground shadow-lg transition hover:bg-white"
                aria-label={t("previousPhoto")}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => stepPhoto(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 p-3 text-foreground shadow-lg transition hover:bg-white"
                aria-label={t("nextPhoto")}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-zinc-950/55 px-3 py-1 text-sm text-white backdrop-blur-sm">
                {photoIndex + 1} / {photos.length}
              </div>
            </>
          )}
        </div>

        {/* CONTENT COLUMN — owns the scroll + a pinned CTA footer */}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6 md:p-8">
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

            <section className="border-t border-border pt-6">
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
          </div>

          {/* Pinned CTA — always reachable without scrolling to the bottom */}
          <div className="shrink-0 border-t border-border bg-card p-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:p-6">
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
