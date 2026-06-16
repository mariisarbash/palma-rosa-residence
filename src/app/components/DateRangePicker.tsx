import { useEffect, useMemo, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { it as itLocale, enUS } from "date-fns/locale";
import "react-day-picker/dist/style.css";
import { useLanguage } from "../lib/language";

type Props = {
  checkIn: string;            // ISO yyyy-mm-dd
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
};

function toISO(d: Date | undefined): string {
  if (!d) return "";
  // Local date — we do not want UTC drift.
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromISO(value: string): Date | undefined {
  if (!value) return undefined;
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  return new Date(y, m - 1, d);
}

export default function DateRangePicker({ checkIn, checkOut, onChange }: Props) {
  const { language, t } = useLanguage();
  const [range, setRange] = useState<DateRange | undefined>({
    from: fromISO(checkIn),
    to: fromISO(checkOut),
  });

  const locale = language === "it" ? itLocale : enUS;

  // Two months side-by-side on desktop (like Airbnb), a single month on mobile
  // where there isn't room for both.
  const [numberOfMonths, setNumberOfMonths] = useState(1);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setNumberOfMonths(mq.matches ? 2 : 1);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  function handleSelect(next: DateRange | undefined) {
    setRange(next);
    onChange(toISO(next?.from), toISO(next?.to));
  }

  const nights =
    range?.from && range?.to
      ? Math.round((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

  return (
    <div className="prr-daypicker mx-auto w-fit max-w-full rounded-3xl border border-border bg-card p-4 sm:p-6 md:p-7">
      <DayPicker
        mode="range"
        numberOfMonths={numberOfMonths}
        selected={range}
        onSelect={handleSelect}
        disabled={{ before: today }}
        locale={locale}
        className="mx-auto"
      />

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border px-1 pt-4">
        <div className="text-sm">
          <span className="text-muted-foreground">{t("checkIn")}</span>{" "}
          <span className="font-medium text-foreground">
            {range?.from ? range.from.toLocaleDateString(language === "it" ? "it-IT" : "en-GB") : "—"}
          </span>
          <span className="mx-3 text-muted-foreground">·</span>
          <span className="text-muted-foreground">{t("checkOut")}</span>{" "}
          <span className="font-medium text-foreground">
            {range?.to ? range.to.toLocaleDateString(language === "it" ? "it-IT" : "en-GB") : "—"}
          </span>
        </div>
        {nights > 0 && (
          <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-foreground">
            {nights === 1 ? t("night", { count: nights }) : t("nights", { count: nights })}
          </span>
        )}
      </div>
    </div>
  );
}
