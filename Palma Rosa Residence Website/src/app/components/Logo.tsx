interface LogoProps {
  className?: string;
  variant?: "light" | "dark";
  showText?: boolean;
}

export default function Logo({ className = "", variant = "dark", showText = true }: LogoProps) {
  const textColor = variant === "light" ? "#ffffff" : "#030213";
  const accentColor = variant === "light" ? "#ffffff" : "#E87B77";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Palm tree icon */}
        <circle cx="20" cy="20" r="19" fill={accentColor} fillOpacity="0.15" />

        {/* Palm trunk */}
        <path
          d="M20 28V16"
          stroke={accentColor}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Palm leaves */}
        <path
          d="M20 16C17 14 14 13 11 14"
          stroke={accentColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M20 16C23 14 26 13 29 14"
          stroke={accentColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M20 16C19 12 18 9 16 6"
          stroke={accentColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M20 16C21 12 22 9 24 6"
          stroke={accentColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M20 16C20 13 20 10 20 7"
          stroke={accentColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Building base */}
        <rect
          x="15"
          y="28"
          width="10"
          height="6"
          rx="1"
          fill={accentColor}
          fillOpacity="0.3"
        />
      </svg>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span
            className="font-serif text-xl tracking-tight"
            style={{ color: textColor }}
          >
            Palma Rosa
          </span>
          <span
            className="text-xs tracking-wide uppercase opacity-70"
            style={{ color: textColor }}
          >
            Residence
          </span>
        </div>
      )}
    </div>
  );
}
