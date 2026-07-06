// Beautifully aligned, stable header with three colorful game tiles
// Replaces the previous anti-gravity physics canvas

const GameTile = ({ brand, publisher, title, tag, accent, bg, children }) => (
  <div
    data-testid={`game-tile-${brand}`}
    className={`relative aspect-[3/2] overflow-hidden corner-cut border transition-all duration-300 hover:-translate-y-1 group`}
    style={{
      background: bg,
      borderColor: `${accent}55`,
    }}
  >
    {/* Watermark artwork */}
    <div className="absolute inset-0 pointer-events-none">{children}</div>

    {/* Corner brackets */}
    <div className="pointer-events-none absolute inset-2 z-10">
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l" style={{ borderColor: accent }} />
      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r" style={{ borderColor: accent }} />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l" style={{ borderColor: accent }} />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r" style={{ borderColor: accent }} />
    </div>

    {/* Copy layer */}
    <div className="relative z-10 h-full p-5 sm:p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span
          className="font-heading text-[10px] tracking-hud uppercase font-bold"
          style={{ color: `${accent}CC` }}
        >
          {publisher}
        </span>
        <span
          className="w-2 h-2 rounded-full shadow-[0_0_8px_currentColor]"
          style={{ backgroundColor: accent, color: accent }}
        />
      </div>
      <div>
        <h3
          className="font-heading font-bold uppercase leading-none"
          style={{ color: accent }}
        >
          {title}
        </h3>
        <p className="mt-2 font-body text-[11px] tracking-hud uppercase text-neutral-300">
          {tag}
        </p>
      </div>
    </div>
  </div>
);

export default function HeroHeader() {
  return (
    <header
      className="relative overflow-hidden border-b border-neutral-200 bg-white"
      data-testid="hero-header"
    >
      <div className="grid-bg absolute inset-0 opacity-60" />
      <div className="scanlines absolute inset-0 pointer-events-none" />

      {/* Top HUD */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="hud-tag">
            <span className="hud-pulse">SYSTEM</span> ONLINE
          </span>
          <span className="font-heading text-[10px] tracking-hud text-neutral-500 uppercase">
            Xbox Series · Guest Lobby
          </span>
        </div>
        <div className="hidden md:flex flex-col items-end gap-1 text-right">
          <span className="font-heading text-[10px] tracking-hud uppercase text-neutral-500">
            Ping
          </span>
          <span className="font-mono-hud text-[#107C10] text-sm font-semibold">
            12ms · Bangalore Server
          </span>
        </div>
      </div>

      {/* Title block */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <p className="hud-tag mb-4">Player_ONE · Suryansh</p>
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-neutral-900 leading-none">
          Level <span className="text-[#107C10] glow-flicker">10</span> Unlocked
        </h1>
        <p className="font-body text-sm sm:text-base text-neutral-600 mt-3 max-w-xl">
          Double-digit achievement · Family &amp; Friends Multiplayer Event
        </p>
      </div>

      {/* Featured game tiles */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12">
        <div className="flex items-center justify-between mb-4">
          <span className="hud-tag">Featured Games</span>
          <span className="font-heading text-[10px] tracking-hud uppercase text-neutral-500 hidden sm:inline">
            Installed · 3
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6" data-testid="game-tiles-row">
          {/* DOOM */}
          <GameTile
            brand="doom"
            publisher="id · Software"
            title="DOOM"
            tag="Rip &amp; Tear"
            accent="#EF4444"
            bg="linear-gradient(135deg, #1B0000 0%, #3D0808 55%, #0A0000 100%)"
          >
            {/* Slayer helmet silhouette watermark */}
            <svg
              viewBox="0 0 100 100"
              className="absolute -right-6 -bottom-6 w-44 h-44 opacity-25"
              fill="none"
              stroke="#EF4444"
              strokeWidth="2"
            >
              <path d="M22 32 L14 12 L28 28 Z M78 32 L86 12 L72 28 Z" fill="#EF4444" />
              <path d="M22 32 Q30 18 50 18 Q70 18 78 32 L84 55 Q82 78 68 88 L32 88 Q18 78 16 55 Z" />
              <rect x="47" y="30" width="6" height="34" fill="#EF4444" />
              <path d="M26 44 L44 50 L44 58 L26 60 Z" fill="#EF4444" />
              <path d="M74 44 L56 50 L56 58 L74 60 Z" fill="#EF4444" />
              <path d="M38 72 L62 72 L58 84 L42 84 Z" fill="#EF4444" />
            </svg>
            {/* Diagonal grunge lines */}
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(135deg, #EF4444 0, #EF4444 1px, transparent 1px, transparent 18px)",
              }}
            />
            <style>
              {`[data-testid="game-tile-doom"] h3 { font-size: 3rem; letter-spacing: 0.14em; text-shadow: 0 0 18px rgba(239,68,68,0.55); }`}
            </style>
          </GameTile>

          {/* CALL OF DUTY */}
          <GameTile
            brand="cod"
            publisher="Activision"
            title="Call of Duty"
            tag="Modern Warfare · 2026"
            accent="#F97316"
            bg="linear-gradient(135deg, #0F0F0D 0%, #1E1A10 55%, #0A0906 100%)"
          >
            {/* Camo diagonals */}
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, #F97316 0, #F97316 1px, transparent 1px, transparent 14px)",
              }}
            />
            {/* Star + crossed rifles watermark */}
            <svg
              viewBox="0 0 100 100"
              className="absolute -right-5 -top-5 w-44 h-44 opacity-30"
              fill="none"
              stroke="#F97316"
              strokeWidth="2"
            >
              <path d="M50 6 L84 18 L82 55 Q80 78 50 94 Q20 78 18 55 L16 18 Z" />
              <path d="M50 26 L55.5 42 L72 42 L58.5 52 L64 68 L50 58 L36 68 L41.5 52 L28 42 L44.5 42 Z" fill="#F97316" />
              <g strokeLinecap="round" strokeWidth="2.5">
                <line x1="32" y1="72" x2="68" y2="82" />
                <line x1="68" y1="72" x2="32" y2="82" />
              </g>
            </svg>
            <style>
              {`[data-testid="game-tile-cod"] h3 { font-size: 1.75rem; letter-spacing: 0.18em; color: #FFFFFF; text-shadow: 0 0 14px rgba(249,115,22,0.4); }
                [data-testid="game-tile-cod"] h3::first-line { color: #F97316; }`}
            </style>
          </GameTile>

          {/* NEED FOR SPEED */}
          <GameTile
            brand="nfs"
            publisher="Electronic Arts"
            title="Need for Speed"
            tag="Unbound · Street Kings"
            accent="#22D3EE"
            bg="linear-gradient(135deg, #05121C 0%, #0B1F3A 45%, #1B0530 100%)"
          >
            {/* Speed slashes */}
            <div className="absolute inset-0">
              <svg viewBox="0 0 100 60" preserveAspectRatio="none" className="w-full h-full opacity-40">
                <defs>
                  <linearGradient id="nfs-slash" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#22D3EE" stopOpacity="0" />
                    <stop offset="1" stopColor="#22D3EE" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
                <g stroke="url(#nfs-slash)" strokeWidth="0.4" strokeLinecap="round">
                  <line x1="10" y1="10" x2="80" y2="12" />
                  <line x1="20" y1="24" x2="90" y2="22" />
                  <line x1="5" y1="38" x2="70" y2="36" />
                  <line x1="30" y1="50" x2="95" y2="48" />
                </g>
              </svg>
            </div>
            {/* Racing wing emblem */}
            <svg
              viewBox="0 0 140 70"
              className="absolute -right-8 -bottom-6 w-56 h-28 opacity-30"
              fill="none"
              stroke="#22D3EE"
              strokeWidth="1.5"
            >
              <path d="M70 12 L82 35 L70 58 L58 35 Z" fill="#22D3EE" />
              <path d="M58 30 L20 22 L40 32 Z M58 35 L10 35 L36 40 Z M58 40 L20 48 L40 42 Z" />
              <path d="M82 30 L120 22 L100 32 Z M82 35 L130 35 L104 40 Z M82 40 L120 48 L100 42 Z" />
            </svg>
            <style>
              {`[data-testid="game-tile-nfs"] h3 { font-size: 1.9rem; letter-spacing: 0.06em; font-style: italic; text-shadow: 0 0 14px rgba(34,211,238,0.55); }`}
            </style>
          </GameTile>
        </div>
      </div>

      {/* Corner brackets on hero */}
      <div className="pointer-events-none absolute inset-3 z-[3]">
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#107C10]" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#107C10]" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#107C10]" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#107C10]" />
      </div>
    </header>
  );
}
