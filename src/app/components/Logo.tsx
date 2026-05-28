interface LogoProps {
  className?: string;
  variant?: "light" | "dark";
  /**
   * Kept for backwards compatibility; the wordmark *is* the logo,
   * so this is now treated as always true.
   */
  showText?: boolean;
}

/**
 * Wordmark in Fraunces — minimal, editorial.
 * Two lines on tight tracking, the second line letter-spaced as eyebrow.
 */
export default function Logo({ className = "", variant = "dark" }: LogoProps) {
  const isLight = variant === "light";

  return (
    <div
      className={`flex flex-col leading-none ${className}`}
      style={{ color: isLight ? "#FAF8F4" : "#1A1814" }}
    >
      <span className="font-serif text-[1.35rem] tracking-tight md:text-2xl">
        Palma Rosa
      </span>
      <span
        className="mt-1 text-[0.65rem] font-medium uppercase"
        style={{ letterSpacing: "0.32em", opacity: 0.75 }}
      >
        Residence
      </span>
    </div>
  );
}
