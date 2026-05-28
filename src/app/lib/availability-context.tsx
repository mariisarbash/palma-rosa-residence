import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { visibleApartments as apartments, type ApartmentStatus } from "../data/apartments";
import { fetchAvailability, isAvailable } from "./availability";

type StatusMap = Record<string, ApartmentStatus>;

type AvailabilityContextValue = {
  checkIn: string;
  checkOut: string;
  hasSearched: boolean;
  isChecking: boolean;
  statuses: StatusMap;
  setCheckIn: (value: string) => void;
  setCheckOut: (value: string) => void;
  clearDates: () => void;
  runSearch: () => Promise<void>;
};

const AvailabilityContext = createContext<AvailabilityContextValue | null>(null);

export function AvailabilityProvider({ children }: { children: ReactNode }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [statuses, setStatuses] = useState<StatusMap>({});

  async function runSearch() {
    if (!checkIn || !checkOut || checkOut <= checkIn) return;
    setIsChecking(true);
    setHasSearched(true);
    setStatuses(Object.fromEntries(apartments.map((apt) => [apt.id, "loading"])));

    const results = await Promise.allSettled(
      apartments.map(async (apt) => {
        const bookedRanges = await fetchAvailability(apt);
        return {
          id: apt.id,
          status: isAvailable(bookedRanges, checkIn, checkOut) ? "available" : "unavailable",
        } as const;
      }),
    );

    setStatuses(
      Object.fromEntries(
        results.map((result, index) => {
          const apt = apartments[index];
          return [apt.id, result.status === "fulfilled" ? result.value.status : "unknown"];
        }),
      ),
    );
    setIsChecking(false);
  }

  function clearDates() {
    setCheckIn("");
    setCheckOut("");
    setHasSearched(false);
    setStatuses({});
  }

  const value = useMemo(
    () => ({
      checkIn,
      checkOut,
      hasSearched,
      isChecking,
      statuses,
      setCheckIn,
      setCheckOut,
      clearDates,
      runSearch,
    }),
    [checkIn, checkOut, hasSearched, isChecking, statuses],
  );

  return <AvailabilityContext.Provider value={value}>{children}</AvailabilityContext.Provider>;
}

export function useAvailability() {
  const context = useContext(AvailabilityContext);
  if (!context) throw new Error("useAvailability must be used within AvailabilityProvider");
  return context;
}
