import { useEffect, useRef, useMemo } from "react";
import Matter from "matter-js";

const XBOX_GREEN = "#22C55E";
const XBOX_GREEN_DEEP = "#107C10";

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

// ---- Small Xbox X orb SVG (for orbiting bodies) ----
const smallXboxSvg = `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>
  <defs>
    <radialGradient id='sxo' cx='0.35' cy='0.3' r='0.75'>
      <stop offset='0' stop-color='#F0FDF4'/>
      <stop offset='0.35' stop-color='#4ADE80'/>
      <stop offset='0.75' stop-color='#16A34A'/>
      <stop offset='1' stop-color='#052E16'/>
    </radialGradient>
    <radialGradient id='sxg' cx='0.5' cy='0.5' r='0.5'>
      <stop offset='0.55' stop-color='${XBOX_GREEN}' stop-opacity='0'/>
      <stop offset='0.85' stop-color='${XBOX_GREEN}' stop-opacity='0.35'/>
      <stop offset='1' stop-color='${XBOX_GREEN}' stop-opacity='0'/>
    </radialGradient>
  </defs>
  <circle cx='60' cy='60' r='58' fill='url(#sxg)'/>
  <circle cx='60' cy='60' r='42' fill='url(#sxo)' stroke='${XBOX_GREEN}' stroke-width='1.5'/>
  <circle cx='60' cy='60' r='42' fill='none' stroke='#BBF7D0' stroke-width='0.8' opacity='0.55'/>
  <g stroke='#F0FDF4' stroke-width='6' stroke-linecap='round' opacity='0.96'>
    <path d='M40 40 L80 80'/>
    <path d='M80 40 L40 80'/>
  </g>
  <ellipse cx='50' cy='46' rx='11' ry='6' fill='white' opacity='0.4'/>
</svg>`;

const bodyDefs = [
  { key: "x1", w: 84, h: 84, vbW: 120, vbH: 120 },
  { key: "x2", w: 72, h: 72, vbW: 120, vbH: 120 },
  { key: "x3", w: 96, h: 96, vbW: 120, vbH: 120 },
  { key: "x4", w: 68, h: 68, vbW: 120, vbH: 120 },
  { key: "x5", w: 88, h: 88, vbW: 120, vbH: 120 },
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

    // Positions: 6 spread across corners/edges, orbiting the central Xbox
    const positions = [
      { x: width * 0.15, y: height * 0.25 },
      { x: width * 0.85, y: height * 0.25 },
      { x: width * 0.12, y: height * 0.78 },
      { x: width * 0.88, y: height * 0.78 },
      { x: width * 0.5, y: height * 0.15 },
      { x: width * 0.5, y: height * 0.86 },
    ];

    const bodies = [];
    bodyDefs.forEach((def, i) => {
      const p = positions[i];
      const b = Bodies.rectangle(p.x, p.y, def.w, def.h, {
        restitution: 0.9,
        friction: 0.02,
        frictionAir: 0.02,
        density: 0.001,
        chamfer: { radius: def.w / 2 },
        render: {
          sprite: {
            texture: svgToDataUrl(smallXboxSvg),
            xScale: def.w / def.vbW,
            yScale: def.h / def.vbH,
          },
        },
      });
      Body.setVelocity(b, {
        x: (Math.random() - 0.5) * 1.4,
        y: (Math.random() - 0.5) * 1.4,
      });
      Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.02);
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

          {/* Particle field - all green now */}
          <ParticleField color={XBOX_GREEN} count={40} />
          <ParticleField color={XBOX_GREEN_DEEP} count={16} region="b" />

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
