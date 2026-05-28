import type { Apartment } from "../data/apartments";

type BookedRange = {
  start: string;
  end: string;
};

const cache = new Map<string, BookedRange[]>();

export async function fetchAvailability(apt: Apartment) {
  if (apt.alwaysAvailable) return [];
  if (cache.has(apt.icalId)) return cache.get(apt.icalId) || [];

  const res = await fetch(`/api/ical?apt=${encodeURIComponent(apt.icalId)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data = (await res.json()) as { events?: BookedRange[]; error?: string };
  if (data.error === "fetch_failed") throw new Error("iCal fetch failed");

  const events = data.events || [];
  cache.set(apt.icalId, events);
  return events;
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
