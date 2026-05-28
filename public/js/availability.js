(function () {
  'use strict';

  // Session cache: icalId → Array<{ start: string, end: string }>
  const _cache = new Map();

  /**
   * Fetch booked date ranges for an apartment.
   * Returns [] immediately for alwaysAvailable apartments.
   * Throws on network error so callers can handle unknown state.
   */
  async function fetchAvailability(apt) {
    if (apt.alwaysAvailable) return [];
    if (_cache.has(apt.icalId)) return _cache.get(apt.icalId);

    const res = await fetch(`/api/ical?apt=${encodeURIComponent(apt.icalId)}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    if (data.error === 'fetch_failed') throw new Error('iCal fetch failed');

    const events = data.events || [];
    _cache.set(apt.icalId, events);
    return events;
  }

  /**
   * Check if an apartment is available for a requested stay.
   *
   * Algorithm: stay [checkIn, checkOut) conflicts with booked [s, e) when:
   *   s < checkOut  AND  e > checkIn
   *
   * Uses pure ISO string comparison — no Date objects, no timezone bugs.
   * Boundary: if a booking ends on the same day a new stay starts → NOT a conflict.
   */
  function isAvailable(bookedRanges, checkIn, checkOut) {
    for (const range of bookedRanges) {
      if (range.start < checkOut && range.end > checkIn) return false;
    }
    return true;
  }

  window.Availability = { fetchAvailability, isAvailable };
})();
