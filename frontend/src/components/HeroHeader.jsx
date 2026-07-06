import { useEffect, useRef, useMemo } from "react";
import Matter from "matter-js";

const XBOX_GREEN = "#22C55E";
const XBOX_GREEN_DEEP = "#107C10";
const DOOM_FIRE = "#F97316";
const DOOM_RED = "#DC2626";
const COD_STEEL = "#94A3B8";
const NFS_PINK = "#EC4899";

const svgToDataUrl = (s) => `data:image/svg+xml;utf8,${encodeURIComponent(s)}`;

// ---- Central Xbox X sphere (rendered as static DOM, not physics) ----
const XboxSphere = () => (
  <div
    className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
    data-testid="xbox-sphere"
  >
    <div className="relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] lg:w-[380px] lg:h-[380px]">
      {/* Outer soft aura */}
      <div
        className="absolute inset-0 rounded-full xbox-pulse"
        style={{
          background:
            "radial-gradient(circle, rgba(34,197,94,0.35) 0%, rgba(34,197,94,0.12) 45%, transparent 70%)",
          filter: "blur(6px)",
        }}
      />
      {/* Outer rotating dashed ring */}
      <div
        className="absolute inset-4 rounded-full ring-spin"
        style={{
          border: "1.5px dashed rgba(34,197,94,0.55)",
          maskImage:
            "radial-gradient(circle, transparent 55%, black 56%, black 100%)",
        }}
      />
      {/* Inner rotating tick ring */}
      <div className="absolute inset-8 rounded-full ring-spin-reverse">
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
          {[...Array(48)].map((_, i) => {
            const angle = (i / 48) * Math.PI * 2;
            const x1 = 100 + Math.cos(angle) * 92;
            const y1 = 100 + Math.sin(angle) * 92;
            const x2 = 100 + Math.cos(angle) * (i % 6 === 0 ? 82 : 88);
            const y2 = 100 + Math.sin(angle) * (i % 6 === 0 ? 82 : 88);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={XBOX_GREEN}
                strokeWidth={i % 6 === 0 ? 2 : 1}
                opacity={i % 6 === 0 ? 0.85 : 0.35}
              />
            );
          })}
        </svg>
      </div>
      {/* Xbox X sphere */}
      <svg
        viewBox="0 0 220 220"
        className="absolute inset-[18%] w-[64%] h-[64%] drop-shadow-[0_0_40px_rgba(34,197,94,0.55)]"
      >
        <defs>
          <radialGradient id="xoBig" cx="0.35" cy="0.3" r="0.75">
            <stop offset="0" stopColor="#F0FDF4" />
            <stop offset="0.35" stopColor="#4ADE80" />
            <stop offset="0.75" stopColor="#16A34A" />
            <stop offset="1" stopColor="#052E16" />
          </radialGradient>
          <radialGradient id="xoRim" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0.85" stopColor="#22C55E" stopOpacity="0" />
            <stop offset="0.95" stopColor="#4ADE80" stopOpacity="0.9" />
            <stop offset="1" stopColor="#22C55E" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="110" cy="110" r="100" fill="url(#xoBig)" />
        <circle cx="110" cy="110" r="100" fill="url(#xoRim)" />
        <circle
          cx="110"
          cy="110"
          r="100"
          fill="none"
          stroke="#BBF7D0"
          strokeWidth="1.5"
          opacity="0.7"
        />
        {/* The X mark */}
        <g
          stroke="#F0FDF4"
          strokeWidth="14"
          strokeLinecap="round"
          opacity="0.98"
          style={{ filter: "drop-shadow(0 0 6px rgba(240,253,244,0.75))" }}
        >
          <path d="M60 60 L160 160" />
          <path d="M160 60 L60 160" />
        </g>
        {/* Specular highlight */}
        <ellipse
          cx="82"
          cy="78"
          rx="30"
          ry="14"
          fill="white"
          opacity="0.42"
        />
      </svg>
    </div>
  </div>
);

// ---- Emblem SVGs (fiery DOOM, steel COD, hot-pink NFS) ----
const doomEmblemSvg = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'>
  <defs>
    <radialGradient id='dgo' cx='0.5' cy='0.5' r='0.55'>
      <stop offset='0' stop-color='${DOOM_FIRE}' stop-opacity='0.5'/>
      <stop offset='1' stop-color='${DOOM_FIRE}' stop-opacity='0'/>
    </radialGradient>
    <linearGradient id='dfire' x1='0.5' y1='0' x2='0.5' y2='1'>
      <stop offset='0' stop-color='#FBBF24'/>
      <stop offset='0.55' stop-color='${DOOM_FIRE}'/>
      <stop offset='1' stop-color='${DOOM_RED}'/>
    </linearGradient>
  </defs>
  <circle cx='80' cy='80' r='78' fill='url(#dgo)'/>
  <path d='M80 14 L134 44 L134 116 L80 146 L26 116 L26 44 Z' fill='#1A0500' stroke='url(#dfire)' stroke-width='3'/>
  <g transform='translate(30 30)'>
    <path d='M22 32 L14 12 L28 28 Z M78 32 L86 12 L72 28 Z' fill='url(#dfire)'/>
    <path d='M22 32 Q30 18 50 18 Q70 18 78 32 L84 55 Q82 78 68 88 L32 88 Q18 78 16 55 Z' fill='#2A0800' stroke='url(#dfire)' stroke-width='2.5'/>
    <rect x='47' y='30' width='6' height='34' fill='url(#dfire)'/>
    <path d='M26 44 L44 50 L44 58 L26 60 Z' fill='url(#dfire)'/>
    <path d='M74 44 L56 50 L56 58 L74 60 Z' fill='url(#dfire)'/>
    <path d='M38 72 L62 72 L58 84 L42 84 Z' fill='url(#dfire)'/>
  </g>
  <g fill='#FBBF24'>
    <circle cx='18' cy='42' r='2'/>
    <circle cx='142' cy='58' r='1.6'/>
    <circle cx='24' cy='118' r='1.8'/>
    <circle cx='140' cy='108' r='2.2'/>
    <circle cx='80' cy='6' r='1.4'/>
  </g>
</svg>`;

const codEmblemSvg = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'>
  <defs>
    <radialGradient id='cgo' cx='0.5' cy='0.5' r='0.55'>
      <stop offset='0' stop-color='${COD_STEEL}' stop-opacity='0.4'/>
      <stop offset='1' stop-color='${COD_STEEL}' stop-opacity='0'/>
    </radialGradient>
    <linearGradient id='steel' x1='0.5' y1='0' x2='0.5' y2='1'>
      <stop offset='0' stop-color='#F1F5F9'/>
      <stop offset='0.55' stop-color='${COD_STEEL}'/>
      <stop offset='1' stop-color='#475569'/>
    </linearGradient>
  </defs>
  <circle cx='80' cy='80' r='78' fill='url(#cgo)'/>
  <path d='M80 16 L134 30 L132 88 Q130 118 80 142 Q30 118 28 88 L26 30 Z' fill='#1E293B' stroke='url(#steel)' stroke-width='3'/>
  <path d='M80 24 L124 36 L122 86 Q120 112 80 132 Q40 112 38 86 L36 36 Z' fill='none' stroke='#64748B' stroke-width='1' opacity='0.6'/>
  <path d='M80 40 L88 62 L112 62 L92 76 L100 100 L80 86 L60 100 L68 76 L48 62 L72 62 Z' fill='url(#steel)' stroke='#F1F5F9' stroke-width='1'/>
  <g stroke='url(#steel)' stroke-width='3.2' stroke-linecap='round'>
    <line x1='54' y1='110' x2='106' y2='124'/>
    <line x1='106' y1='110' x2='54' y2='124'/>
  </g>
  <circle cx='54' cy='110' r='3.5' fill='#F1F5F9'/>
  <circle cx='106' cy='110' r='3.5' fill='#F1F5F9'/>
</svg>`;

const nfsEmblemSvg = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 160'>
  <defs>
    <radialGradient id='ngo' cx='0.5' cy='0.5' r='0.55'>
      <stop offset='0' stop-color='${NFS_PINK}' stop-opacity='0.42'/>
      <stop offset='1' stop-color='${NFS_PINK}' stop-opacity='0'/>
    </radialGradient>
    <linearGradient id='npink' x1='0' y1='0' x2='1' y2='0'>
      <stop offset='0' stop-color='#F43F5E'/>
      <stop offset='0.5' stop-color='${NFS_PINK}'/>
      <stop offset='1' stop-color='#F43F5E'/>
    </linearGradient>
  </defs>
  <ellipse cx='110' cy='80' rx='108' ry='78' fill='url(#ngo)'/>
  <g stroke='url(#npink)' stroke-width='2' stroke-linecap='round' opacity='0.7'>
    <line x1='10' y1='30' x2='60' y2='38'/>
    <line x1='160' y1='38' x2='210' y2='30'/>
    <line x1='10' y1='130' x2='60' y2='122'/>
    <line x1='160' y1='122' x2='210' y2='130'/>
  </g>
  <path d='M110 20 L136 80 L110 140 L84 80 Z' fill='url(#npink)' opacity='0.28'/>
  <g fill='#F43F5E' stroke='${NFS_PINK}' stroke-width='2' stroke-linejoin='round' opacity='0.9'>
    <path d='M84 62 L20 46 L58 66 Z'/>
    <path d='M84 80 L2 80 L48 88 Z'/>
    <path d='M84 98 L20 114 L58 94 Z'/>
    <path d='M136 62 L200 46 L162 66 Z'/>
    <path d='M136 80 L218 80 L172 88 Z'/>
    <path d='M136 98 L200 114 L162 94 Z'/>
  </g>
  <path d='M110 20 L136 80 L110 140 L84 80 Z' fill='none' stroke='url(#npink)' stroke-width='3'/>
  <g>
    <path d='M92 90 L96 80 L108 76 L124 76 L134 82 L138 90 L138 96 L134 96 C133 100 129 100 128 96 L104 96 C103 100 99 100 98 96 L92 96 Z' fill='#1E1B22' stroke='${NFS_PINK}' stroke-width='1.2'/>
    <circle cx='102' cy='96' r='2.4' fill='${NFS_PINK}'/>
    <circle cx='130' cy='96' r='2.4' fill='${NFS_PINK}'/>
    <path d='M100 82 L130 82' stroke='${NFS_PINK}' stroke-width='0.6' opacity='0.7'/>
  </g>
</svg>`;

const bodyDefs = [
  { key: "doom", w: 130, h: 130, svg: doomEmblemSvg, vbW: 160, vbH: 160 },
  { key: "cod", w: 130, h: 130, svg: codEmblemSvg, vbW: 160, vbH: 160 },
  { key: "nfs", w: 170, h: 124, svg: nfsEmblemSvg, vbW: 220, vbH: 160 },
];

// ---- Particle field ----
const ParticleField = ({ color, count = 20, region }) => {
  const particles = useMemo(() => {
    const list = [];
    for (let i = 0; i < count; i++) {
      let leftMin = 0,
        leftMax = 100,
        topMin = 0,
        topMax = 100;
      if (region === "tl") {
        leftMax = 55;
        topMax = 55;
      }
      if (region === "tr") {
        leftMin = 45;
        topMax = 55;
      }
      if (region === "b") {
        topMin = 50;
      }
      list.push({
        size: 2 + Math.random() * 3.5,
        left: leftMin + Math.random() * (leftMax - leftMin),
        top: topMin + Math.random() * (topMax - topMin),
        delay: -Math.random() * 6,
        duration: 5 + Math.random() * 5,
        driftX: Math.round((Math.random() - 0.5) * 50),
        driftY: Math.round((Math.random() - 0.5) * 50),
      });
    }
    return list;
  }, [count, region]);
  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full particle-drift"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: color,
            boxShadow: `0 0 ${p.size * 2.5}px ${color}, 0 0 ${p.size * 5}px ${color}55`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            "--dx": `${p.driftX}px`,
            "--dy": `${p.driftY}px`,
            opacity: 0.55,
          }}
        />
      ))}
    </div>
  );
};

export default function HeroHeader() {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);

  useEffect(() => {
    const {
      Engine,
      Render,
      Runner,
      Bodies,
      Composite,
      Mouse,
      MouseConstraint,
      Body,
    } = Matter;

    const container = sceneRef.current;
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const engine = Engine.create();
    engine.gravity.y = 0;
    engine.gravity.x = 0;
    engineRef.current = engine;

    const render = Render.create({
      element: container,
      engine,
      options: {
        width,
        height,
        wireframes: false,
        background: "transparent",
        pixelRatio: window.devicePixelRatio,
      },
    });

    // walls
    const wt = 60;
    const makeWalls = (w, h) => [
      Bodies.rectangle(w / 2, -wt / 2, w, wt, {
        isStatic: true,
        render: { visible: false },
      }),
      Bodies.rectangle(w / 2, h + wt / 2, w, wt, {
        isStatic: true,
        render: { visible: false },
      }),
      Bodies.rectangle(-wt / 2, h / 2, wt, h, {
        isStatic: true,
        render: { visible: false },
      }),
      Bodies.rectangle(w + wt / 2, h / 2, wt, h, {
        isStatic: true,
        render: { visible: false },
      }),
    ];
    let walls = makeWalls(width, height);
    Composite.add(engine.world, walls);

    // Invisible circular exclusion zone (so emblems don't cover the Xbox)
    const xboxGuard = Bodies.circle(width / 2, height / 2, 120, {
      isStatic: true,
      render: { visible: false },
      restitution: 0.9,
    });
    Composite.add(engine.world, xboxGuard);

    // Positions: DOOM top-left, COD top-right, NFS bottom
    const positions = [
      { x: width * 0.18, y: height * 0.28 },
      { x: width * 0.82, y: height * 0.28 },
      { x: width * 0.5, y: height * 0.82 },
    ];

    const bodies = [];
    bodyDefs.forEach((def, i) => {
      const p = positions[i];
      const b = Bodies.rectangle(p.x, p.y, def.w, def.h, {
        restitution: 0.9,
        friction: 0.02,
        frictionAir: 0.02,
        density: 0.001,
        chamfer: { radius: 10 },
        render: {
          sprite: {
            texture: svgToDataUrl(def.svg),
            xScale: def.w / def.vbW,
            yScale: def.h / def.vbH,
          },
        },
      });
      Body.setVelocity(b, {
        x: (Math.random() - 0.5) * 1.2,
        y: (Math.random() - 0.5) * 1.2,
      });
      Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.015);
      bodies.push(b);
    });
    Composite.add(engine.world, bodies);

    const mouse = Mouse.create(render.canvas);
    const mc = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.12,
        damping: 0.15,
        render: { visible: false },
      },
    });
    Composite.add(engine.world, mc);
    render.mouse = mouse;

    // Drift keeper + gentle repulsion from Xbox center for orbital feel
    const iv = setInterval(() => {
      const cx = render.options.width / 2;
      const cy = render.options.height / 2;
      bodies.forEach((b) => {
        const dx = b.position.x - cx;
        const dy = b.position.y - cy;
        const dist = Math.hypot(dx, dy);
        // Gentle radial push if too close to center
        if (dist < 180 && dist > 1) {
          const push = (180 - dist) * 0.00003;
          Body.applyForce(b, b.position, {
            x: (dx / dist) * push * b.mass,
            y: (dy / dist) * push * b.mass,
          });
        }
        // Zero-G drift maintenance
        const speed = Math.hypot(b.velocity.x, b.velocity.y);
        if (speed < 0.4) {
          Body.applyForce(b, b.position, {
            x: (Math.random() - 0.5) * 0.00045 * b.mass,
            y: (Math.random() - 0.5) * 0.00045 * b.mass,
          });
        }
      });
    }, 650);

    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      render.canvas.width = w;
      render.canvas.height = h;
      render.options.width = w;
      render.options.height = h;
      Render.setPixelRatio(render, window.devicePixelRatio);
      Composite.remove(engine.world, walls);
      walls = makeWalls(w, h);
      Composite.add(engine.world, walls);
      Body.setPosition(xboxGuard, { x: w / 2, y: h / 2 });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearInterval(iv);
      Render.stop(render);
      Runner.stop(runner);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      if (render.canvas && render.canvas.parentNode) {
        render.canvas.parentNode.removeChild(render.canvas);
      }
      render.textures = {};
    };
  }, []);

  return (
    <header
      className="relative overflow-hidden border-b border-neutral-200 bg-white"
      data-testid="hero-header"
    >
      <div className="grid-bg absolute inset-0 opacity-60" />
      <div className="scanlines absolute inset-0 pointer-events-none" />

      {/* Top HUD */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex items-start justify-between gap-4">
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

      {/* Title */}
      <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <p className="hud-tag mb-4">Player_ONE · Suryansh</p>
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-neutral-900 leading-none">
          Level <span className="text-[#107C10] glow-flicker">10</span> Unlocked
        </h1>
        <p className="font-body text-sm sm:text-base text-neutral-600 mt-3 max-w-xl">
          Double-digit achievement · Family &amp; Friends Multiplayer Event
        </p>
      </div>

      {/* Anti-gravity zero-G composition */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-14">
        <div className="flex items-center justify-between mb-4 relative z-30">
          <span className="hud-tag">Featured Games</span>
          <span className="font-heading text-[10px] tracking-hud uppercase text-neutral-500 hidden sm:inline">
            Installed · 3
          </span>
        </div>
        <div
          className="relative w-full h-[460px] sm:h-[520px] lg:h-[560px] border border-neutral-200 overflow-hidden corner-cut"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(34,197,94,0.08) 0%, rgba(255,255,255,0.9) 55%, #FFFFFF 100%)",
          }}
          data-testid="anti-gravity-stage"
        >
          <div className="absolute inset-0 opacity-30 grid-bg" />

          {/* Particle fields */}
          <ParticleField color={XBOX_GREEN} count={26} />
          <ParticleField color={DOOM_FIRE} count={14} region="tl" />
          <ParticleField color={COD_STEEL} count={12} region="tr" />
          <ParticleField color={NFS_PINK} count={16} region="b" />

          {/* Static Xbox X sphere (bigger, centered, non-floating) */}
          <XboxSphere />

          {/* Physics canvas for 3 orbiting emblems */}
          <div
            ref={sceneRef}
            className="absolute inset-0 z-20"
            data-testid="anti-gravity-canvas"
          />

          {/* Corner brackets */}
          <div className="pointer-events-none absolute inset-2 z-30">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#107C10]" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#107C10]" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#107C10]" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#107C10]" />
          </div>
        </div>
      </div>
    </header>
  );
}
