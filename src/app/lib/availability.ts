import type { Apartment } from "../data/apartments";

type BookedRange = {
  start: string;
  end: string;
};

const cache = new Map<string, BookedRange[]>();

async function fetchOnce(icalId: string) {
  const res = await fetch(`/api/ical?apt=${encodeURIComponent(icalId)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as { events?: BookedRange[]; error?: string };
  if (data.error === "fetch_failed") throw new Error("iCal fetch failed");
  return data.events || [];
}

/**
 * Fetch booked ranges for an apartment with a single retry. The upstream
 * iCal source (Spotahome) occasionally rate-limits or times out when many
 * apartments are queried concurrently, so a quick second chance avoids the
 * UI dumping every apartment into the "Da verificare" state.
 */
export async function fetchAvailability(apt: Apartment) {
  if (apt.alwaysAvailable) return [];
  const cached = cache.get(apt.icalId);
  if (cached) return cached;

  let lastError: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const events = await fetchOnce(apt.icalId);
      cache.set(apt.icalId, events);
      return events;
    } catch (err) {
      lastError = err;
      // Small back-off before retrying.
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  // eslint-disable-next-line no-console
  console.warn(`[availability] ${apt.icalId} failed after retry:`, lastError);
  throw lastError;
}

export function isAvailable(bookedRanges: BookedRange[], checkIn: string, checkOut: string) {
  return !bookedRanges.some((range) => range.start < checkOut && range.end > checkIn);
}

export function getTodayISO() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(dateString: string, days: number) {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);
  const nextYear = date.getFullYear();
  const nextMonth = String(date.getMonth() + 1).padStart(2, "0");
  const nextDay = String(date.getDate()).padStart(2, "0");
  return `${nextYear}-${nextMonth}-${nextDay}`;
}
