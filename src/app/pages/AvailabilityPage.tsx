import { useCallback, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useAvailability } from "../lib/availability-context";
import { useLanguage } from "../lib/language";
import {
  getApartmentFloor,
  getBathroomLocation,
  visibleApartments,
  type Apartment,
  type ApartmentStatus,
} from "../data/apartments";
import DateRangePicker from "../components/DateRangePicker";
import RoomCard from "../components/RoomCard";
import ApartmentModal from "../components/ApartmentModal";
import SegmentedControl from "../components/SegmentedControl";

type BathroomFilter = "all" | "ensuite" | "corridor";
type FloorFilter = "all" | "ground" | "first";

/**
 * Sort rank by availability status: available first, the uncertain/loading
 * middle, unavailable last. Before a search every status is null → equal rank,
 * so the original A1…B4 order is preserved (Array.sort is stable).
 */
const STATUS_ORDER: Record<NonNullable<ApartmentStatus>, number> = {
  available: 0,
  loading: 1,
  unknown: 2,
  unavailable: 3,
};

function statusRank(status: ApartmentStatus) {
  return status ? STATUS_ORDER[status] : 1;
}

export default function AvailabilityPage() {
  const { language, t } = useLanguage();
  const {
    checkIn,
    checkOut,
    setCheckIn,
    setCheckOut,
    clearDates,
    runSearch,
    isChecking,
    hasSearched,
    statuses,
  } = useAvailability();

  const [selected, setSelected] = useState<Apartment | null>(null);
  const [bathroomFilter, setBathroomFilter] = useState<BathroomFilter>("all");
  const [floorFilter, setFloorFilter] = useState<FloorFilter>("all");

  const canSearch = Boolean(checkIn && checkOut && checkOut > checkIn && !isChecking);
  const filtersActive = bathroomFilter !== "all" || floorFilter !== "all";

  // Filter first (removes non-matching cards), then sort what remains by
  // availability. Pure derivation — no extra observers, stable React keys.
  const displayed = useMemo(() => {
    const filtered = visibleApartments.filter(
      (apt) =>
        (bathroomFilter === "all" || getBathroomLocation(apt) === bathroomFilter) &&
        (floorFilter === "all" || getApartmentFloor(apt) === floorFilter),
    );
    return [...filtered].sort(
      (a, b) => statusRank(statuses[a.id]) - statusRank(statuses[b.id]),
    );
  }, [bathroomFilter, floorFilter, statuses]);

  const availableCount = displayed.filter((a) => statuses[a.id] === "available").length;
  const unknownCount = displayed.filter((a) => statuses[a.id] === "unknown").length;
  const allUnknown = hasSearched && displayed.length > 0 && unknownCount === displayed.length;

  const handleRangeChange = useCallback(
    (nextIn: string, nextOut: string) => {
      setCheckIn(nextIn);
      setCheckOut(nextOut);
    },
    [setCheckIn, setCheckOut],
  );
  const handleOpen = useCallback((apartment: Apartment) => setSelected(apartment), []);
  const handleClose = useCallback(() => setSelected(null), []);
  const clearFilters = useCallback(() => {
    setBathroomFilter("all");
    setFloorFilter("all");
  }, []);

  return (
    <>
      <section className="bg-secondary px-6 pb-20 pt-32 md:px-12 md:pb-24 md:pt-40">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-4 text-muted-foreground">{t("eyebrowAvailability")}</p>
          <h1 className="mb-5">{t("availabilityHeading")}</h1>
          <p className="mx-auto max-w-xl text-muted-foreground">{t("availabilityIntro")}</p>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <DateRangePicker
            checkIn={checkIn}
            checkOut={checkOut}
            onChange={handleRangeChange}
          />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={runSearch}
              disabled={!canSearch}
              className="btn-solid flex-1"
            >
              <Search className="h-4 w-4" />
              {isChecking ? t("checking") : t("checkAvailability")}
            </button>
            {(checkIn || checkOut || hasSearched) && (
              <button onClick={clearDates} className="btn-outline">
                <X className="h-4 w-4" />
                {t("clearDates")}
              </button>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <SegmentedControl
              label={t("filterBathroom")}
              value={bathroomFilter}
              onChange={setBathroomFilter}
              options={[
                { value: "all", label: t("filterAll") },
                { value: "ensuite", label: t("bathroomEnsuiteShort") },
                { value: "corridor", label: t("bathroomCorridorShort") },
              ]}
            />
            <SegmentedControl
              label={t("filterFloor")}
              value={floorFilter}
              onChange={setFloorFilter}
              options={[
                { value: "all", label: t("filterAll") },
                { value: "ground", label: t("floorGroundShort") },
                { value: "first", label: t("floorFirstShort") },
              ]}
            />
          </div>

          {hasSearched && !isChecking && displayed.length > 0 && (
            <p className="apr-fade mt-6 text-center text-sm text-muted-foreground">
              {allUnknown
                ? t("availabilityCheckFailed")
                : availableCount > 0
                  ? t("availabilityResult", { count: availableCount })
                  : t("availabilityNoResult")}
            </p>
          )}
        </div>
      </section>

      <section className="bg-background px-6 py-20 md:px-12 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-baseline justify-between">
            <h2>{t("apartmentsHeading")}</h2>
            <span className="text-sm text-muted-foreground">
              {filtersActive
                ? t("apartmentsCountFiltered", {
                    shown: displayed.length,
                    total: visibleApartments.length,
                  })
                : t("apartmentsCount", { count: visibleApartments.length })}
            </span>
          </div>

          {displayed.length === 0 ? (
            <div className="apr-fade flex flex-col items-center gap-5 py-16 text-center">
              <p className="text-muted-foreground">{t("noFilterResults")}</p>
              <button onClick={clearFilters} className="btn-outline">
                <X className="h-4 w-4" />
                {t("clearFilters")}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {displayed.map((apartment, index) => (
                <div
                  key={apartment.id}
                  className="apr-fade"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <CardOpener
                    apartment={apartment}
                    status={statuses[apartment.id] || null}
                    onOpen={handleOpen}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <ApartmentModal apartment={selected} onClose={handleClose} />
      </section>

      {/* Keep checkIn/checkOut/lang in DOM for share-able searches later. */}
      <input type="hidden" value={`${checkIn}_${checkOut}_${language}`} aria-hidden />
    </>
  );
}

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
