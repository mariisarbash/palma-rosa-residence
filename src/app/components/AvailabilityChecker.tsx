import { Calendar, Search, X } from "lucide-react";
import { motion } from "motion/react";
import { apartments } from "../data/apartments";
import { useAvailability } from "../lib/availability-context";
import { addDays, getTodayISO } from "../lib/availability";
import { useLanguage } from "../lib/language";

export default function AvailabilityChecker() {
  const { language, t } = useLanguage();
  const { checkIn, checkOut, setCheckIn, setCheckOut, clearDates, runSearch, isChecking, hasSearched, statuses } =
    useAvailability();

  const today = getTodayISO();
  const canSearch = Boolean(checkIn && checkOut && checkOut > checkIn && !isChecking);
  const availableCount = apartments.filter((apt) => statuses[apt.id] === "available").length;

  function handleCheckIn(nextCheckIn: string) {
    setCheckIn(nextCheckIn);
    if (checkOut && nextCheckIn && checkOut <= nextCheckIn) setCheckOut("");
  }

  return (
    <section className="py-20 px-6 bg-primary text-primary-foreground">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="mb-4 text-white">{t("availability")}</h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            {language === "it"
              ? "Seleziona le date per controllare in tempo reale i calendari dei 10 appartamenti."
              : "Select your dates to check the calendars for all 10 apartments in real time."}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-md md:p-8"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm text-white/90">
                <Calendar className="h-4 w-4" />
                {t("checkIn")}
              </span>
              <input
                type="date"
                min={today}
                value={checkIn}
                onChange={(event) => handleCheckIn(event.target.value)}
                className="w-full rounded-lg border border-white/30 bg-white/95 px-4 py-3 text-foreground outline-none transition focus:ring-2 focus:ring-white/60"
              />
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm text-white/90">
                <Calendar className="h-4 w-4" />
                {t("checkOut")}
              </span>
              <input
                type="date"
                min={checkIn ? addDays(checkIn, 1) : today}
                value={checkOut}
                onChange={(event) => setCheckOut(event.target.value)}
                className="w-full rounded-lg border border-white/30 bg-white/95 px-4 py-3 text-foreground outline-none transition focus:ring-2 focus:ring-white/60"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={runSearch}
              disabled={!canSearch}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-white px-6 py-4 text-lg font-medium text-primary transition-all duration-300 hover:bg-white/90 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Search className="h-5 w-5" />
              {isChecking ? t("checking") : t("checkAvailability")}
            </button>
            {(checkIn || checkOut || hasSearched) && (
              <button
                onClick={clearDates}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 px-6 py-4 text-white transition hover:bg-white/10 active:translate-y-px"
              >
                <X className="h-5 w-5" />
                {t("clearDates")}
              </button>
            )}
          </div>

          {hasSearched && !isChecking && (
            <p className="mt-5 text-center text-sm text-white/80">
              {availableCount > 0
                ? language === "it"
                  ? `${availableCount} appartamenti disponibili nelle date selezionate.`
                  : `${availableCount} apartments available for the selected dates.`
                : language === "it"
                  ? "Nessun appartamento risulta disponibile nelle date selezionate."
                  : "No apartments appear available for the selected dates."}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
