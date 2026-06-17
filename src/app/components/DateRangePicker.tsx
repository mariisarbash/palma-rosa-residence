import { useEffect, useMemo, useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { it as itLocale, enUS } from "date-fns/locale";
import { useLanguage } from "../lib/language";

type Props = {
  checkIn: string; // ISO yyyy-mm-dd
  checkOut: string;
  onChange: (checkIn: string, checkOut: string) => void;
  // Optional footer with an integrated search pill + clear link.
  onSearch?: () => void;
  isSearching?: boolean;
  searchSummary?: string; // result text shown on the left after a search
  onClear?: () => void; // resets dates + search state (falls back to onChange)
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

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function DateRangePicker({
  checkIn,
  checkOut,
  onChange,
  onSearch,
  isSearching = false,
  searchSummary,
  onClear,
}: Props) {
  const { language, t } = useLanguage();
  const [range, setRange] = useState<DateRange | undefined>({
    from: fromISO(checkIn),
    to: fromISO(checkOut),
  });

  const locale = language === "it" ? itLocale : enUS;
  const localeStr = language === "it" ? "it-IT" : "en-GB";

  // Two months side-by-side on desktop (like Airbnb), one on mobile.
  const [numberOfMonths, setNumberOfMonths] = useState(1);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const sync = () => setNumberOfMonths(mq.matches ? 2 : 1);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  function handleSelect(next: DateRange | undefined) {
    setRange(next);
    onChange(toISO(next?.from), toISO(next?.to));
  }

  function handleClear() {
    setRange(undefined);
    // onClear resets search state too; otherwise just empty the dates.
    if (onClear) onClear();
    else onChange("", "");
  }

  const nights =
    range?.from && range?.to
      ? Math.round((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

  // Which field the next click fills — drives the header highlight.
  const step = !range?.from ? "in" : !range?.to ? "out" : "done";
  const canSearch = Boolean(range?.from && range?.to && onSearch && !isSearching);

  const fmt = (d: Date) =>
    d.toLocaleDateString(localeStr, { weekday: "short", day: "numeric", month: "short" });

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-border bg-background">
      {/* ── Date fields header ──────────────────────────────── */}
      <div className="flex items-stretch border-b border-border">
        {/* Arrivo — click to restart the selection */}
        <button
          type="button"
          onClick={() => step !== "in" && handleClear()}
          className={cx(
            "flex flex-1 flex-col gap-0.5 px-5 py-4 text-left transition-colors sm:px-6",
            step === "in" ? "bg-foreground" : "cursor-pointer hover:bg-foreground/[0.04]",
          )}
        >
          <span
            className={cx(
              "text-[10px] font-medium uppercase tracking-[0.14em]",
              step === "in" ? "text-background/55" : "text-muted-foreground",
            )}
          >
            {t("checkIn")}
          </span>
          <span
            className={cx(
              "text-sm font-medium",
              step === "in" ? "text-background" : range?.from ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {range?.from ? fmt(range.from) : t("selectCheckIn")}
          </span>
        </button>

        {/* Nights badge / divider */}
        <div className="flex items-center justify-center border-x border-border px-3 sm:px-4">
          {nights > 0 ? (
            <span className="rounded-full bg-accent px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-accent-foreground">
              {nights === 1 ? t("night", { count: nights }) : t("nights", { count: nights })}
            </span>
          ) : (
            <span className="text-[10px] text-foreground/20">·</span>
          )}
        </div>

        {/* Partenza */}
        <div
          className={cx(
            "flex flex-1 flex-col gap-0.5 px-5 py-4 transition-colors sm:px-6",
            step === "out" ? "bg-foreground" : "",
          )}
        >
          <span
            className={cx(
              "text-[10px] font-medium uppercase tracking-[0.14em]",
              step === "out" ? "text-background/55" : "text-muted-foreground",
            )}
          >
            {t("checkOut")}
          </span>
          <span
            className={cx(
              "text-sm font-medium",
              step === "out" ? "text-background" : range?.to ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {range?.to ? fmt(range.to) : t("selectCheckOut")}
          </span>
        </div>
      </div>

      {/* ── Calendar ────────────────────────────────────────── */}
      <div className="px-4 py-6 sm:px-7">
        <DayPicker
          mode="range"
          numberOfMonths={numberOfMonths}
          selected={range}
          onSelect={handleSelect}
          disabled={{ before: today }}
          locale={locale}
          className="w-full"
          classNames={{
            months: "flex flex-col md:flex-row gap-6 md:gap-10",
            month: "flex flex-col gap-3 w-full min-w-0",
            caption: "relative flex items-center justify-center h-10 mb-1",
            caption_label: "text-[11px] font-medium uppercase tracking-[0.16em] text-foreground",
            nav: "flex items-center",
            nav_button: cx(
              "absolute flex h-8 w-8 items-center justify-center rounded-full",
              "text-muted-foreground transition-colors",
              "hover:bg-foreground/[0.08] hover:text-foreground",
            ),
            nav_button_previous: "left-0",
            nav_button_next: "right-0",
            table: "w-full border-collapse",
            head_row: "flex w-full",
            head_cell:
              "flex-1 py-2 text-center text-[10px] font-medium uppercase tracking-[0.10em] text-muted-foreground",
            row: "flex w-full mt-0.5",
            cell: cx(
              "relative flex-1 p-0 text-center",
              // cream band behind any selected (in-range) day
              "[&:has([aria-selected])]:bg-secondary",
              // round the band's caps at the real range ends…
              "[&:has(.rdp-range-start)]:rounded-l-full",
              "[&:has(.rdp-range-end)]:rounded-r-full",
              // …and where it wraps across a row edge
              "first:[&:has([aria-selected])]:rounded-l-full",
              "last:[&:has([aria-selected])]:rounded-r-full",
            ),
            day: cx(
              "relative mx-auto flex h-9 w-9 items-center justify-center",
              "rounded-full text-[13px] cursor-pointer transition-colors duration-100",
              "hover:bg-foreground/[0.08]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1",
            ),
            day_selected: "bg-foreground text-background hover:bg-foreground/90",
            // Middle days: transparent pill so the cell's cream band shows through
            day_range_middle: "!bg-transparent !text-foreground hover:!bg-foreground/[0.08]",
            day_range_start: "rdp-range-start bg-foreground text-background hover:bg-foreground/90",
            day_range_end: "rdp-range-end bg-foreground text-background hover:bg-foreground/90",
            // Today: small terracotta dot under the number
            day_today:
              "font-semibold after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:h-[3px] after:w-[3px] after:rounded-full after:bg-accent after:content-['']",
            day_disabled: "opacity-25 cursor-not-allowed hover:bg-transparent",
            day_hidden: "invisible",
          }}
          components={{
            IconLeft: () => <ChevronLeft className="h-4 w-4" />,
            IconRight: () => <ChevronRight className="h-4 w-4" />,
          }}
        />
      </div>

      {/* ── Footer: result summary + clear + search pill ────── */}
      {(range?.from || range?.to || onSearch) && (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t border-border px-5 pb-6 pt-3 sm:px-7">
          {/* Left: live status / result summary after a search */}
          <span className="text-xs text-muted-foreground">
            {isSearching ? t("checking") : searchSummary ?? ""}
          </span>

          {/* Right: clear link + search pill */}
          <div className="ml-auto flex items-center gap-4">
            {(range?.from || range?.to) && (
              <button
                type="button"
                onClick={handleClear}
                className="text-[11px] text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"
              >
                {t("clear")}
              </button>
            )}

            {onSearch && (
              <button
                type="button"
                onClick={onSearch}
                disabled={!canSearch}
                className={cx(
                  "flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-medium uppercase tracking-[0.12em] transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
                  canSearch
                    ? "cursor-pointer bg-foreground text-background hover:bg-foreground/90"
                    : "cursor-not-allowed bg-foreground/15 text-foreground/30",
                )}
              >
                <Search className="h-3.5 w-3.5" />
                {isSearching ? "…" : t("verify")}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
