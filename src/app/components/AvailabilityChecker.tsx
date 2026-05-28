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
    <section className="bg-secondary px-6 py-24 md:py-32">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <p className="eyebrow mb-4 text-muted-foreground">{t("availability")}</p>
          <h2 className="mb-5">
            {language === "it" ? "Verifica le date" : "Check the dates"}
          </h2>
          <p className="mx-auto max-w-xl text-muted-foreground">
            {language === "it"
              ? "Seleziona check-in e check-out per vedere in tempo reale quali dei 10 appartamenti sono liberi."
              : "Pick your check-in and check-out to see in real time which of the 10 apartments are free."}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border border-border bg-card p-6 md:p-10"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <label className="block">
              <span className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {t("checkIn")}
              </span>
              <input
                type="date"
                min={today}
                value={checkIn}
                onChange={(event) => handleCheckIn(event.target.value)}
                className="w-full border-b border-border bg-transparent px-0 py-3 text-foreground outline-none transition focus:border-foreground"
              />
            </label>

            <label className="block">
              <span className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {t("checkOut")}
              </span>
              <input
                type="date"
                min={checkIn ? addDays(checkIn, 1) : today}
                value={checkOut}
                onChange={(event) => setCheckOut(event.target.value)}
                className="w-full border-b border-border bg-transparent px-0 py-3 text-foreground outline-none transition focus:border-foreground"
              />
            </label>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={runSearch}
              disabled={!canSearch}
              className="inline-flex flex-1 items-center justify-center gap-2 bg-foreground px-6 py-4 text-sm font-medium uppercase tracking-[0.12em] text-background transition hover:opacity-90 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Search className="h-4 w-4" />
              {isChecking ? t("checking") : t("checkAvailability")}
            </button>
            {(checkIn || checkOut || hasSearched) && (
              <button
                onClick={clearDates}
                className="inline-flex items-center justify-center gap-2 border border-border px-6 py-4 text-sm font-medium uppercase tracking-[0.12em] text-foreground transition hover:bg-muted active:translate-y-px"
              >
                <X className="h-4 w-4" />
                {t("clearDates")}
              </button>
            )}
          </div>

          {hasSearched && !isChecking && (
            <p className="mt-8 text-center text-sm text-muted-foreground">
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
