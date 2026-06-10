import { useId } from "react";

export type SegmentedOption<T extends string> = {
  value: T;
  label: string;
};

type SegmentedControlProps<T extends string> = {
  /** Visible label rendered before the control and used as the group's name. */
  label: string;
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

/**
 * A 3-state pill segmented control matching the site's rounded-full button
 * language. Used for the availability filters (bathroom / floor). Each option
 * is a real button with `aria-pressed`; the set is grouped under the label for
 * screen readers and is fully keyboard-navigable via native tab order.
 */
export default function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const labelId = useId();

  return (
    <div className="flex items-center gap-3">
      <span
        id={labelId}
        className="text-xs uppercase tracking-[0.14em] text-muted-foreground"
      >
        {label}
      </span>
      <div
        role="group"
        aria-labelledby={labelId}
        className="inline-flex rounded-full border border-border bg-muted/60 p-0.5"
      >
        {options.map((option) => {
          const active = option.value === value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.value)}
              className={`inline-flex h-11 items-center rounded-full px-4 text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)] ${
                active
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
