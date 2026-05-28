interface LogoProps {
  className?: string;
  variant?: "light" | "dark";
  showText?: boolean;
}

/**
 * Wordmark: "Palma Rosa" set in General Sans medium with the word
 * "Residence" rendered in italic Cormorant — a tiny piece of expressivity
 * the user asked back in. Two lines on tight stacking.
 */
export default function Logo({ className = "", variant = "dark" }: LogoProps) {
  const isLight = variant === "light";

  return (
    <div
      className={`flex flex-col leading-none ${className}`}
      style={{ color: isLight ? "#F7F3EC" : "#1F1B16" }}
    >
      <span className="text-lg font-semibold tracking-tight md:text-xl">
        Palma Rosa
      </span>
      <span
        className="font-display-italic text-[0.95rem] leading-none md:text-base"
        style={{ opacity: 0.85, marginTop: "2px" }}
      >
        Residence
      </span>
    </div>
  );
}
