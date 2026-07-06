import { useEffect, useRef, useMemo } from "react";
import Matter from "matter-js";

const XBOX_GREEN = "#22C55E";
const DOOM_RED = "#EF4444";
const COD_ORANGE = "#F97316";
const NFS_CYAN = "#22D3EE";

const svgToDataUrl = (s) => `data:image/svg+xml;utf8,${encodeURIComponent(s)}`;

// --- SVG artwork (original stylized emblems) ---
const xboxSphereSvg = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 220'>
  <defs>
    <radialGradient id='xg' cx='0.5' cy='0.5' r='0.5'>
      <stop offset='0' stop-color='${XBOX_GREEN}' stop-opacity='0.55'/>
      <stop offset='0.4' stop-color='${XBOX_GREEN}' stop-opacity='0.18'/>
      <stop offset='1' stop-color='${XBOX_GREEN}' stop-opacity='0'/>
    </radialGradient>
    <radialGradient id='xo' cx='0.35' cy='0.32' r='0.7'>
      <stop offset='0' stop-color='#BBF7D0'/>
      <stop offset='0.5' stop-color='${XBOX_GREEN}'/>
      <stop offset='1' stop-color='#052E16'/>
    </radialGradient>
  </defs>
  <circle cx='110' cy='110' r='105' fill='url(#xg)'/>
  <circle cx='110' cy='110' r='68' fill='url(#xo)' stroke='${XBOX_GREEN}' stroke-width='2.5'/>
  <circle cx='110' cy='110' r='68' fill='none' stroke='#BBF7D0' stroke-width='1' opacity='0.6'/>
  <g stroke='#F0FDF4' stroke-width='9' stroke-linecap='round' opacity='0.95'>
    <path d='M82 82 L138 138'/>
    <path d='M138 82 L82 138'/>
  </g>
  <ellipse cx='92' cy='88' rx='22' ry='11' fill='white' opacity='0.4'/>
</svg>`;

const doomEmblemSvg = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'>
  <defs>
    <radialGradient id='dg' cx='0.5' cy='0.5' r='0.55'>
      <stop offset='0' stop-color='${DOOM_RED}' stop-opacity='0.4'/>
      <stop offset='1' stop-color='${DOOM_RED}' stop-opacity='0'/>
    </radialGradient>
  </defs>
  <circle cx='80' cy='80' r='78' fill='url(#dg)'/>
  <path d='M80 14 L134 44 L134 116 L80 146 L26 116 L26 44 Z' fill='#170202' stroke='${DOOM_RED}' stroke-width='2.5'/>
  <g transform='translate(30 30)'>
    <path d='M22 32 L14 12 L28 28 Z M78 32 L86 12 L72 28 Z' fill='${DOOM_RED}'/>
    <path d='M22 32 Q30 18 50 18 Q70 18 78 32 L84 55 Q82 78 68 88 L32 88 Q18 78 16 55 Z' fill='#1A0000' stroke='${DOOM_RED}' stroke-width='2.5'/>
    <rect x='47' y='30' width='6' height='34' fill='${DOOM_RED}'/>
    <path d='M26 44 L44 50 L44 58 L26 60 Z' fill='${DOOM_RED}'/>
    <path d='M74 44 L56 50 L56 58 L74 60 Z' fill='${DOOM_RED}'/>
    <path d='M38 72 L62 72 L58 84 L42 84 Z' fill='${DOOM_RED}'/>
  </g>
</svg>`;

const codEmblemSvg = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 160'>
  <defs>
    <radialGradient id='cg' cx='0.5' cy='0.5' r='0.55'>
      <stop offset='0' stop-color='${COD_ORANGE}' stop-opacity='0.42'/>
      <stop offset='1' stop-color='${COD_ORANGE}' stop-opacity='0'/>
    </radialGradient>
  </defs>
  <circle cx='80' cy='80' r='78' fill='url(#cg)'/>
  <path d='M80 16 L134 30 L132 88 Q130 118 80 142 Q30 118 28 88 L26 30 Z' fill='#150E06' stroke='${COD_ORANGE}' stroke-width='3'/>
  <path d='M80 40 L88 62 L112 62 L92 76 L100 100 L80 86 L60 100 L68 76 L48 62 L72 62 Z' fill='${COD_ORANGE}'/>
  <g stroke='${COD_ORANGE}' stroke-width='2.8' stroke-linecap='round'>
    <line x1='54' y1='110' x2='106' y2='124'/>
    <line x1='106' y1='110' x2='54' y2='124'/>
  </g>
  <circle cx='54' cy='110' r='3' fill='${COD_ORANGE}'/>
  <circle cx='106' cy='110' r='3' fill='${COD_ORANGE}'/>
</svg>`;

const nfsEmblemSvg = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 140'>
  <defs>
    <radialGradient id='ng' cx='0.5' cy='0.5' r='0.55'>
      <stop offset='0' stop-color='${NFS_CYAN}' stop-opacity='0.42'/>
      <stop offset='1' stop-color='${NFS_CYAN}' stop-opacity='0'/>
    </radialGradient>
  </defs>
  <ellipse cx='100' cy='70' rx='98' ry='68' fill='url(#ng)'/>
  <path d='M100 26 L120 70 L100 114 L80 70 Z' fill='${NFS_CYAN}' stroke='#164E63' stroke-width='2'/>
  <g fill='#0E7490' stroke='${NFS_CYAN}' stroke-width='2' stroke-linejoin='round'>
    <path d='M80 56 L22 44 L54 62 Z'/>
    <path d='M80 70 L8 70 L48 78 Z'/>
    <path d='M80 84 L22 96 L54 78 Z'/>
  </g>
  <g fill='#0E7490' stroke='${NFS_CYAN}' stroke-width='2' stroke-linejoin='round'>
    <path d='M120 56 L178 44 L146 62 Z'/>
    <path d='M120 70 L192 70 L152 78 Z'/>
    <path d='M120 84 L178 96 L146 78 Z'/>
  </g>
  <g stroke='${NFS_CYAN}' stroke-width='1.5' stroke-linecap='round' opacity='0.7'>
    <line x1='30' y1='28' x2='68' y2='32'/>
    <line x1='132' y1='32' x2='170' y2='28'/>
    <line x1='30' y1='112' x2='68' y2='108'/>
    <line x1='132' y1='108' x2='170' y2='112'/>
  </g>
</svg>`;

const bodyDefs = [
  { key: "xbox", w: 220, h: 220, svg: xboxSphereSvg, vbW: 220, vbH: 220 },
  { key: "doom", w: 150, h: 150, svg: doomEmblemSvg, vbW: 160, vbH: 160 },
  { key: "cod", w: 150, h: 150, svg: codEmblemSvg, vbW: 160, vbH: 160 },
  { key: "nfs", w: 190, h: 130, svg: nfsEmblemSvg, vbW: 200, vbH: 140 },
];

// --- CSS particle field ---
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

    const positions = [
      { x: width / 2, y: height / 2 },
      { x: width * 0.24, y: height * 0.32 },
      { x: width * 0.76, y: height * 0.32 },
      { x: width * 0.5, y: height * 0.82 },
    ];

    const bodies = [];
    bodyDefs.forEach((def, i) => {
      const p = positions[i] || { x: width / 2, y: height / 2 };
      const b = Bodies.rectangle(p.x, p.y, def.w, def.h, {
        restitution: 0.9,
        friction: 0.02,
        frictionAir: 0.018,
        density: def.key === "xbox" ? 0.0018 : 0.001,
        chamfer: { radius: 12 },
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

    // Zero-G drift keeper + soft centering for Xbox
    const iv = setInterval(() => {
      bodies.forEach((b, i) => {
        if (i === 0) {
          const cx = render.options.width / 2;
          const cy = render.options.height / 2;
          const dx = cx - b.position.x;
          const dy = cy - b.position.y;
          Body.applyForce(b, b.position, {
            x: dx * 0.0000018 * b.mass,
            y: dy * 0.0000018 * b.mass,
          });
        }
        const speed = Math.hypot(b.velocity.x, b.velocity.y);
        if (speed < 0.35) {
          Body.applyForce(b, b.position, {
            x: (Math.random() - 0.5) * 0.0004 * b.mass,
            y: (Math.random() - 0.5) * 0.0004 * b.mass,
          });
        }
      });
    }, 700);

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
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex items-start justify-between gap-4">
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
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
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
        <div className="flex items-center justify-between mb-4 relative z-20">
          <span className="hud-tag">Featured Games</span>
          <span className="font-heading text-[10px] tracking-hud uppercase text-neutral-500 hidden sm:inline">
            Installed · 3
          </span>
        </div>
        <div
          className="relative w-full h-[440px] sm:h-[500px] lg:h-[520px] border border-neutral-200 overflow-hidden corner-cut"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(34,197,94,0.06) 0%, rgba(255,255,255,0.9) 55%, #FFFFFF 100%)",
          }}
          data-testid="anti-gravity-stage"
        >
          {/* Inner grid backdrop */}
          <div className="absolute inset-0 opacity-30 grid-bg" />

          {/* Particle fields */}
          <ParticleField color={XBOX_GREEN} count={26} />
          <ParticleField color={DOOM_RED} count={14} region="tl" />
          <ParticleField color={COD_ORANGE} count={14} region="tr" />
          <ParticleField color={NFS_CYAN} count={16} region="b" />

          {/* Physics canvas */}
          <div
            ref={sceneRef}
            className="absolute inset-0 z-10"
            data-testid="anti-gravity-canvas"
          />

          {/* Corner brackets */}
          <div className="pointer-events-none absolute inset-2 z-20">
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
