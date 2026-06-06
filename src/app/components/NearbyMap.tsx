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

/** Inline SVG for the lucide `Home` icon — used for the residence pin. */
const HOUSE_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1Z"/>
  </svg>`;

/*
 * Wayfinding palette: categories must stay distinguishable on the map, but
 * the hues are de-saturated and warmed so they sit with the residence's
 * warm-neutral system instead of reading as a generic rainbow.
 */
const CATEGORY_COLORS: Record<PoiCategory, string> = {
  residence:   "#1F1B16",
  transport:   "#5B7A99", // muted slate-blue
  university:  "#B8893D", // muted ochre
  supermarket: "#6E8B5A", // sage
  pharmacy:    "#B05A4E", // muted brick
  breakfast:   "#9A6A43", // warm brown
  hospital:    "#8A6E9E", // muted plum
};

/**
 * Custom DivIcon factory. The residence gets a large dark pill with a house
 * glyph; every other category gets a coloured circle pin so categories are
 * immediately distinguishable on the map.
 */
function makeIcon(category: PoiCategory, isResidence = false) {
  if (isResidence) {
    return L.divIcon({
      className: "prr-pin prr-pin--residence",
      html: `
        <span style="
          position:relative;
          display:flex; align-items:center; justify-content:center;
          width:44px; height:44px; border-radius:9999px;
          background:#1F1B16; color:#F7F3EC;
          border:3px solid #F7F3EC;
          box-shadow: 0 6px 22px rgba(0,0,0,0.32);
        ">${HOUSE_SVG}</span>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
      popupAnchor: [0, -22],
    });
  }

  const color = CATEGORY_COLORS[category];
  return L.divIcon({
    className: "prr-pin",
    html: `
      <span style="
        display:block;
        width:18px; height:18px; border-radius:9999px;
        background:${color};
        border:2.5px solid #ffffff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.28);
      "></span>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -9],
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
    <section className="bg-background px-6 py-12 md:px-12 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 max-w-2xl md:mb-10">
          <p className="eyebrow mb-4 text-muted-foreground">{t("eyebrowNearby")}</p>
          <h2 className="mb-5">{t("nearbyHeading")}</h2>
          <p className="text-muted-foreground">{t("nearbyIntro")}</p>
        </div>

        {/* Filter chips — il pallino colorato funge anche da legenda per i marker sulla mappa */}
        <div className="mb-6 flex flex-wrap gap-2 md:mb-8">
          {filters.map(({ key, label, Icon }) => {
            const on = active.has(key);
            return (
              <button
                key={key}
                onClick={() => toggle(key)}
                aria-pressed={on}
                className={`inline-flex min-h-[44px] items-center gap-2 rounded-full border px-3 py-2 text-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground md:px-4 ${
                  on
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span
                  className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                  style={{
                    backgroundColor: CATEGORY_COLORS[key],
                    opacity: on ? 1 : 0.6,
                    outline: on ? "1.5px solid rgba(255,255,255,0.35)" : "none",
                    outlineOffset: "1px",
                  }}
                />
                <Icon className="h-3.5 w-3.5 md:h-4 md:w-4" />
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
            style={{ height: "clamp(340px, 50vh, 560px)", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              subdomains="abcd"
              maxZoom={20}
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
                      <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        <Icon className="h-3 w-3" />
                        {t(`poi${capitalize(poi.category)}` as never) as string}
                      </div>
                      <div className="mb-1 font-medium text-foreground">{poi.name}</div>
                      {poi.description && (
                        <p className="mb-2 text-sm text-muted-foreground">
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
