interface LogoProps {
  className?: string;
  variant?: "light" | "dark";
}

export default function Logo({ className = "", variant = "dark" }: LogoProps) {
  const isLight = variant === "light";

  return (
    <div
      className={`flex items-center gap-2.5 leading-none ${className}`}
      style={{ color: isLight ? "#F7F3EC" : "#1F1B16" }}
    >
      {/* Palm frond mark from Figma Make */}
      <svg
        viewBox="30 28 140 112"
        width="34"
        height="34"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <g transform="translate(100, 120)">
          <path d="M0,-84 C10,-52 10,-18 0,0 C-10,-18 -10,-52 0,-84 Z" fill="#C2876A" />
          <g transform="rotate(-24)">
            <path d="M0,-82 C10,-50 10,-17 0,0 C-10,-17 -10,-50 0,-82 Z" fill="#C2876A" opacity="0.88" />
          </g>
          <g transform="rotate(24)">
            <path d="M0,-82 C10,-50 10,-17 0,0 C-10,-17 -10,-50 0,-82 Z" fill="#C2876A" opacity="0.88" />
          </g>
          <g transform="rotate(-50)">
            <path d="M0,-72 C9,-44 9,-15 0,0 C-9,-15 -9,-44 0,-72 Z" fill="#C2876A" opacity="0.60" />
          </g>
          <g transform="rotate(50)">
            <path d="M0,-72 C9,-44 9,-15 0,0 C-9,-15 -9,-44 0,-72 Z" fill="#C2876A" opacity="0.60" />
          </g>
          <line x1="0" y1="0" x2="0" y2="14" stroke="#C2876A" strokeWidth="2" strokeLinecap="round" />
        </g>
      </svg>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span className="text-lg font-semibold tracking-tight md:text-xl">Palma Rosa</span>
        <span
          className="font-display-italic text-[0.95rem] leading-none md:text-base"
          style={{ opacity: 0.85, marginTop: "2px" }}
        >
          Residence
        </span>
      </div>
    </div>
  );
}
