export default function App() {
  return (
    <div
      style={{ background: "#F7F3EC", minHeight: "100vh" }}
      className="flex items-center justify-center"
    >
      <svg
        viewBox="0 0 200 200"
        width="200"
        height="200"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Palma Rosa Residence"
      >
        <defs>
          <style>{`
            @import url('https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap');
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital@1&display=swap');
          `}</style>
        </defs>

        {/* Background */}
        <rect width="200" height="200" fill="#F7F3EC" />

        {/* ── Palm frond mark ── */}
        {/* 5 leaf-shaped fronds radiating fan-like from a common base */}
        <g transform="translate(100, 120)">

          {/* Frond shape: elongated leaf, tip at y=-82, base at y=0, max width ±9 */}
          {/* Center frond */}
          <path
            d="M0,-84 C10,-52 10,-18 0,0 C-10,-18 -10,-52 0,-84 Z"
            fill="#C2876A"
          />

          {/* Left-near frond (-24°) */}
          <g transform="rotate(-24)">
            <path
              d="M0,-82 C10,-50 10,-17 0,0 C-10,-17 -10,-50 0,-82 Z"
              fill="#C2876A"
              opacity="0.88"
            />
          </g>

          {/* Right-near frond (+24°) */}
          <g transform="rotate(24)">
            <path
              d="M0,-82 C10,-50 10,-17 0,0 C-10,-17 -10,-50 0,-82 Z"
              fill="#C2876A"
              opacity="0.88"
            />
          </g>

          {/* Left-far frond (-50°) */}
          <g transform="rotate(-50)">
            <path
              d="M0,-72 C9,-44 9,-15 0,0 C-9,-15 -9,-44 0,-72 Z"
              fill="#C2876A"
              opacity="0.60"
            />
          </g>

          {/* Right-far frond (+50°) */}
          <g transform="rotate(50)">
            <path
              d="M0,-72 C9,-44 9,-15 0,0 C-9,-15 -9,-44 0,-72 Z"
              fill="#C2876A"
              opacity="0.60"
            />
          </g>

          {/* Stem nub */}
          <line x1="0" y1="0" x2="0" y2="14" stroke="#C2876A" strokeWidth="2" strokeLinecap="round" />
        </g>

      </svg>
    </div>
  );
}
