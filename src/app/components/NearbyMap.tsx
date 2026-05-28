import { useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Bus,
  GraduationCap,
  ShoppingBasket,
  Pill,
  Coffee,
  HeartPulse,
  Home,
  ExternalLink,
} from "lucide-react";
import { motion } from "motion/react";
import { useLanguage } from "../lib/language";
import { RESIDENCE_COORDS, poiCategories, pois, type PoiCategory } from "../data/poi";

const ICONS: Record<PoiCategory, typeof Home> = {
  residence: Home,
  transport: Bus,
  university: GraduationCap,
  supermarket: ShoppingBasket,
  pharmacy: Pill,
  breakfast: Coffee,
  hospital: HeartPulse,
};

/**
 * Custom DivIcon factory — gives every category a coloured circular pin
 * styled with our CSS vars instead of the default Leaflet PNG markers.
 */
function makeIcon(category: PoiCategory, isResidence = false) {
  const bg = isResidence ? "var(--foreground)" : "var(--card)";
  const ring = isResidence ? "var(--foreground)" : "rgba(31,27,22,0.18)";
  const dot = isResidence ? "var(--background)" : "var(--foreground)";
  const size = isResidence ? 40 : 30;

  return L.divIcon({
    className: "prr-pin",
    html: `
      <span style="
        display:flex; align-items:center; justify-content:center;
        width:${size}px; height:${size}px; border-radius:9999px;
        background:${bg}; border:1.5px solid ${ring};
        box-shadow: 0 4px 14px rgba(0,0,0,0.18);
        color:${dot}; font-weight:600; font-size:${isResidence ? 14 : 12}px;
      ">${category[0].toUpperCase()}</span>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

export default function NearbyMap() {
  const { language, t } = useLanguage();
  const [active, setActive] = useState<Set<PoiCategory>>(
    () => new Set(poiCategories),
  );

  function toggle(cat: PoiCategory) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      // Don't allow turning everything off; keep at least one filter.
      if (next.size === 0) return prev;
      return next;
    });
  }

  const visible = useMemo(
    () => pois.filter((p) => p.category === "residence" || active.has(p.category)),
    [active],
  );

  const filters: { key: PoiCategory; label: string; Icon: typeof Home }[] = [
    { key: "transport", label: t("poiTransport"), Icon: Bus },
    { key: "university", label: t("poiUniversity"), Icon: GraduationCap },
    { key: "supermarket", label: t("poiSupermarket"), Icon: ShoppingBasket },
    { key: "pharmacy", label: t("poiPharmacy"), Icon: Pill },
    { key: "breakfast", label: t("poiBreakfast"), Icon: Coffee },
    { key: "hospital", label: t("poiHospital"), Icon: HeartPulse },
  ];

  return (
    <section className="bg-background px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl">
          <p className="eyebrow mb-4 text-muted-foreground">{t("eyebrowNearby")}</p>
          <h2 className="mb-5">{t("nearbyHeading")}</h2>
          <p className="text-muted-foreground">{t("nearbyIntro")}</p>
        </div>

        {/* Filter chips */}
        <div className="mb-8 flex flex-wrap gap-2">
          {filters.map(({ key, label, Icon }) => {
            const on = active.has(key);
            return (
              <button
                key={key}
                onClick={() => toggle(key)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition ${
                  on
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl"
        >
          <MapContainer
            center={[RESIDENCE_COORDS.lat, RESIDENCE_COORDS.lng]}
            zoom={15}
            scrollWheelZoom={false}
            style={{ height: "560px", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {visible.map((poi) => {
              const Icon = ICONS[poi.category];
              return (
                <Marker
                  key={poi.id}
                  position={[poi.lat, poi.lng]}
                  icon={makeIcon(poi.category, poi.category === "residence")}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-neutral-500">
                        <Icon className="h-3 w-3" />
                        {t(`poi${capitalize(poi.category)}` as never) as string}
                      </div>
                      <div className="mb-1 font-medium">{poi.name}</div>
                      {poi.description && (
                        <p className="mb-2 text-sm text-neutral-600">
                          {poi.description[language] || poi.description.it || ""}
                        </p>
                      )}
                      <a
                        href={poi.gmaps}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium underline decoration-1 underline-offset-4"
                      >
                        {t("nearbyOpenMaps")}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </motion.div>
      </div>
    </section>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
