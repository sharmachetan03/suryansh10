import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

const svgToDataUrl = (s) => `data:image/svg+xml;utf8,${encodeURIComponent(s)}`;

const GREEN = "#107C10";
const GREEN_DEEP = "#0A6A0A";
const BG = "#FFFFFF";

// Each icon: { svg, vbW, vbH }
const icons = {
  xbox: {
    vbW: 100,
    vbH: 100,
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
      <circle cx='50' cy='50' r='42' fill='${BG}' stroke='${GREEN}' stroke-width='3'/>
      <path d='M32 68c8-14 12-22 18-22s10 8 18 22c-4 3-11 6-18 6s-14-3-18-6zM30 34c4-6 12-10 20-10 3 0 3 2 1 3-6 2-14 8-19 15-1 2-3 1-2-1v-7zm40 0v7c1 2-1 3-2 1-5-7-13-13-19-15-2-1-2-3 1-3 8 0 16 4 20 10z' fill='${GREEN}'/>
    </svg>`,
  },
  controller: {
    vbW: 120,
    vbH: 80,
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 80'>
      <path d='M22 20 C10 22 4 34 6 48 C8 62 16 72 26 72 C34 72 38 66 44 62 L76 62 C82 66 86 72 94 72 C104 72 112 62 114 48 C116 34 110 22 98 20 C86 18 78 24 72 30 L48 30 C42 24 34 18 22 20 Z' fill='${BG}' stroke='${GREEN}' stroke-width='2.5'/>
      <circle cx='30' cy='42' r='4' fill='${GREEN}'/>
      <circle cx='30' cy='54' r='4' fill='${GREEN}'/>
      <circle cx='24' cy='48' r='4' fill='${GREEN}'/>
      <circle cx='36' cy='48' r='4' fill='${GREEN}'/>
      <circle cx='84' cy='42' r='3.5' fill='${GREEN}'/>
      <circle cx='94' cy='42' r='3.5' fill='${GREEN}'/>
      <circle cx='84' cy='54' r='3.5' fill='${GREEN}'/>
      <circle cx='94' cy='54' r='3.5' fill='${GREEN}'/>
    </svg>`,
  },

  // --- DOOM Slayer helmet ---
  doomHelmet: {
    vbW: 100,
    vbH: 100,
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
      <path d='M22 32 L14 12 L28 28 Z M78 32 L86 12 L72 28 Z' fill='${GREEN}' stroke='${GREEN_DEEP}' stroke-width='1.5' stroke-linejoin='round'/>
      <path d='M22 32 Q30 18 50 18 Q70 18 78 32 L84 55 Q82 78 68 88 L32 88 Q18 78 16 55 Z' fill='${BG}' stroke='${GREEN}' stroke-width='3' stroke-linejoin='round'/>
      <path d='M26 44 L44 50 L44 58 L26 60 Z' fill='${GREEN}'/>
      <path d='M74 44 L56 50 L56 58 L74 60 Z' fill='${GREEN}'/>
      <rect x='47' y='30' width='6' height='34' fill='${GREEN}'/>
      <path d='M38 72 L62 72 L58 84 L42 84 Z' fill='${GREEN}'/>
      <line x1='45' y1='72' x2='45' y2='84' stroke='${BG}' stroke-width='1.2'/>
      <line x1='50' y1='72' x2='50' y2='84' stroke='${BG}' stroke-width='1.2'/>
      <line x1='55' y1='72' x2='55' y2='84' stroke='${BG}' stroke-width='1.2'/>
    </svg>`,
  },

  // --- DOOM wordmark (blocky, official-style) ---
  doomLogo: {
    vbW: 260,
    vbH: 88,
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 260 88'>
      <rect x='2' y='2' width='256' height='84' fill='${BG}' stroke='${GREEN}' stroke-width='2.5'/>
      <!-- D -->
      <path d='M20 18 L20 70 L48 70 Q66 70 66 44 Q66 18 48 18 Z M34 32 L48 32 Q52 32 52 44 Q52 56 48 56 L34 56 Z' fill='${GREEN}' fill-rule='evenodd'/>
      <!-- O -->
      <path d='M72 18 L106 18 Q120 18 120 30 L120 58 Q120 70 106 70 L72 70 Q58 70 58 58 L58 30 Q58 18 72 18 Z M72 32 L72 56 L106 56 L106 32 Z' fill='${GREEN}' fill-rule='evenodd'/>
      <!-- O -->
      <path d='M140 18 L174 18 Q188 18 188 30 L188 58 Q188 70 174 70 L140 70 Q126 70 126 58 L126 30 Q126 18 140 18 Z M140 32 L140 56 L174 56 L174 32 Z' fill='${GREEN}' fill-rule='evenodd'/>
      <!-- M -->
      <path d='M196 70 L196 18 L214 18 L226 42 L238 18 L256 18 L256 70 L242 70 L242 40 L230 62 L222 62 L210 40 L210 70 Z' fill='${GREEN}'/>
    </svg>`,
  },

  // --- CALL OF DUTY wordmark tile ---
  codLogo: {
    vbW: 280,
    vbH: 88,
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 280 88'>
      <rect x='2' y='2' width='276' height='84' fill='${BG}' stroke='${GREEN}' stroke-width='2.5'/>
      <!-- Top row: CALL OF -->
      <text x='140' y='36' font-family='Rajdhani, Impact, sans-serif' font-weight='700' font-size='24' letter-spacing='6' text-anchor='middle' fill='${GREEN}'>CALL OF</text>
      <!-- Center star -->
      <path d='M50 50 L54 58 L62 58 L56 63 L58 71 L50 66 L42 71 L44 63 L38 58 L46 58 Z' fill='${GREEN}'/>
      <path d='M230 50 L234 58 L242 58 L236 63 L238 71 L230 66 L222 71 L224 63 L218 58 L226 58 Z' fill='${GREEN}'/>
      <!-- DUTY big -->
      <text x='140' y='72' font-family='Rajdhani, Impact, sans-serif' font-weight='700' font-size='36' letter-spacing='10' text-anchor='middle' fill='${GREEN}'>DUTY</text>
    </svg>`,
  },

  // --- NEED FOR SPEED wordmark tile (dynamic italic feel) ---
  nfsLogo: {
    vbW: 280,
    vbH: 88,
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 280 88'>
      <rect x='2' y='2' width='276' height='84' fill='${BG}' stroke='${GREEN}' stroke-width='2.5'/>
      <!-- Speed slashes background -->
      <g stroke='${GREEN}' stroke-width='2' opacity='0.35' stroke-linecap='round'>
        <line x1='232' y1='22' x2='268' y2='16'/>
        <line x1='230' y1='34' x2='270' y2='30'/>
        <line x1='232' y1='46' x2='266' y2='44'/>
        <line x1='230' y1='58' x2='268' y2='58'/>
        <line x1='232' y1='70' x2='264' y2='72'/>
      </g>
      <!-- NEED FOR -->
      <text x='16' y='34' font-family='Rajdhani, Impact, sans-serif' font-weight='600' font-size='20' letter-spacing='4' fill='${GREEN_DEEP}' font-style='italic'>NEED FOR</text>
      <!-- SPEED big italic -->
      <text x='16' y='74' font-family='Rajdhani, Impact, sans-serif' font-weight='700' font-size='42' letter-spacing='2' fill='${GREEN}' font-style='italic'>SPEED</text>
    </svg>`,
  },

  // --- Sports car (NFS-flavor) ---
  car: {
    vbW: 140,
    vbH: 70,
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 140 70'>
      <path d='M8 46 L20 30 L48 22 L92 22 L118 32 L132 44 L132 54 L118 56 L112 52 C110 60 100 60 98 52 L44 52 C42 60 32 60 30 52 L14 54 L8 54 Z' fill='${BG}' stroke='${GREEN}' stroke-width='2.5'/>
      <path d='M32 32 L48 24 L88 24 L106 32 Z' fill='${GREEN}' opacity='0.3'/>
      <circle cx='38' cy='54' r='7' fill='${BG}' stroke='${GREEN}' stroke-width='2'/>
      <circle cx='106' cy='54' r='7' fill='${BG}' stroke='${GREEN}' stroke-width='2'/>
      <path d='M120 40 L132 42' stroke='${GREEN}' stroke-width='2'/>
    </svg>`,
  },
};

// Curated set — fewer items, thoughtfully spaced
const bodySpec = [
  { key: "xbox", w: 70, h: 70, count: 2 },
  { key: "controller", w: 112, h: 74, count: 1 },
  { key: "doomLogo", w: 168, h: 56, count: 1 },
  { key: "doomHelmet", w: 78, h: 78, count: 1 },
  { key: "codLogo", w: 176, h: 56, count: 1 },
  { key: "nfsLogo", w: 176, h: 56, count: 1 },
  { key: "car", w: 116, h: 58, count: 1 },
];

export default function PhysicsCanvas() {
  const sceneRef = useRef(null);
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const runnerRef = useRef(null);
  const [gravityOn, setGravityOn] = useState(false);

  useEffect(() => {
    const {
      Engine,
      Render,
      Runner,
      Bodies,
      Composite,
      Mouse,
      MouseConstraint,
      Events,
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
    renderRef.current = render;

    const wallThickness = 60;
    const makeWalls = (w, h) => [
      Bodies.rectangle(w / 2, -wallThickness / 2, w, wallThickness, {
        isStatic: true,
        render: { visible: false },
      }),
      Bodies.rectangle(w / 2, h + wallThickness / 2, w, wallThickness, {
        isStatic: true,
        render: { visible: false },
      }),
      Bodies.rectangle(-wallThickness / 2, h / 2, wallThickness, h, {
        isStatic: true,
        render: { visible: false },
      }),
      Bodies.rectangle(w + wallThickness / 2, h / 2, wallThickness, h, {
        isStatic: true,
        render: { visible: false },
      }),
    ];
    let walls = makeWalls(width, height);
    Composite.add(engine.world, walls);

    const bodies = [];
    const totalCount = bodySpec.reduce((s, sp) => s + sp.count, 0);
    // Grid layout for initial spawn to avoid clumping
    const cols = Math.min(4, Math.max(2, Math.ceil(Math.sqrt(totalCount * (width / height)))));
    const rows = Math.ceil(totalCount / cols);
    const cellW = width / cols;
    const cellH = height / rows;
    let slot = 0;
    bodySpec.forEach((spec) => {
      const icon = icons[spec.key];
      for (let i = 0; i < spec.count; i++) {
        const col = slot % cols;
        const row = Math.floor(slot / cols);
        const cx = cellW * (col + 0.5);
        const cy = cellH * (row + 0.5);
        // small jitter within the cell so it feels organic
        const jx = (Math.random() - 0.5) * cellW * 0.35;
        const jy = (Math.random() - 0.5) * cellH * 0.35;
        const x = Math.max(spec.w / 2 + 10, Math.min(width - spec.w / 2 - 10, cx + jx));
        const y = Math.max(spec.h / 2 + 10, Math.min(height - spec.h / 2 - 10, cy + jy));
        slot++;
        const body = Bodies.rectangle(x, y, spec.w, spec.h, {
          restitution: 0.92,
          friction: 0.02,
          frictionAir: 0.008,
          density: 0.001,
          chamfer: { radius: 4 },
          render: {
            sprite: {
              texture: svgToDataUrl(icon.svg),
              xScale: spec.w / icon.vbW,
              yScale: spec.h / icon.vbH,
            },
          },
        });
        Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 1.8,
          y: (Math.random() - 0.5) * 1.8,
        });
        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.03);
        bodies.push(body);
      }
    });
    Composite.add(engine.world, bodies);

    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.15,
        damping: 0.1,
        render: { visible: false },
      },
    });
    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    Events.on(mouseConstraint, "mousedown", (evt) => {
      const point = evt.mouse.position;
      bodies.forEach((b) => {
        const dx = b.position.x - point.x;
        const dy = b.position.y - point.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < 160 * 160) {
          const factor = 0.02 / Math.max(50, Math.sqrt(dist2));
          Body.applyForce(b, b.position, {
            x: dx * factor * b.mass,
            y: dy * factor * b.mass,
          });
        }
      });
    });

    const zeroGInterval = setInterval(() => {
      if (engine.gravity.y === 0) {
        bodies.forEach((b) => {
          const vx = b.velocity.x;
          const vy = b.velocity.y;
          const speed = Math.hypot(vx, vy);
          if (speed < 0.6) {
            Body.applyForce(b, b.position, {
              x: (Math.random() - 0.5) * 0.0006 * b.mass,
              y: (Math.random() - 0.5) * 0.0006 * b.mass,
            });
          }
        });
      }
    }, 700);

    Render.run(render);
    const runner = Runner.create();
    runnerRef.current = runner;
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
      clearInterval(zeroGInterval);
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

  const toggleGravity = () => {
    if (!engineRef.current) return;
    const nextOn = !gravityOn;
    engineRef.current.gravity.y = nextOn ? 1 : 0;
    if (nextOn) {
      Matter.Composite.allBodies(engineRef.current.world).forEach((b) => {
        if (!b.isStatic) {
          Matter.Body.setVelocity(b, {
            x: b.velocity.x + (Math.random() - 0.5) * 0.5,
            y: b.velocity.y,
          });
        }
      });
    } else {
      Matter.Composite.allBodies(engineRef.current.world).forEach((b) => {
        if (!b.isStatic) {
          Matter.Body.setVelocity(b, {
            x: (Math.random() - 0.5) * 2.4,
            y: (Math.random() - 0.5) * 2.4,
          });
          Matter.Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.05);
        }
      });
    }
    setGravityOn(nextOn);
  };

  return (
    <div
      className="relative w-full h-[52vh] min-h-[380px] overflow-hidden grid-bg scanlines border-b border-neutral-200"
      data-testid="physics-hero"
    >
      <div ref={sceneRef} className="absolute inset-0" />

      {/* Top-left HUD */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
        <span className="hud-tag">
          <span className="hud-pulse">SYSTEM</span> ONLINE
        </span>
        <span className="font-heading text-[10px] tracking-hud text-neutral-500 uppercase">
          Xbox Series · Guest Lobby
        </span>
      </div>

      {/* Top-right Gravity Override */}
      <div className="absolute top-4 right-4 z-10">
        <button
          type="button"
          onClick={toggleGravity}
          aria-pressed={gravityOn}
          data-testid="gravity-toggle"
          className="group flex items-center gap-3 bg-white/90 backdrop-blur border border-neutral-300 hover:border-[#107C10] transition-colors px-4 py-2.5 corner-cut cursor-pointer shadow-sm"
        >
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full transition-all ${gravityOn ? "bg-[#107C10] shadow-[0_0_10px_rgba(16,124,16,0.6)]" : "bg-neutral-400"}`}
          />
          <span className="font-heading text-[11px] font-bold tracking-hud uppercase text-neutral-800">
            Gravity Override
          </span>
          <span
            className={`font-heading text-[11px] font-bold tracking-hud uppercase ${gravityOn ? "text-[#107C10]" : "text-neutral-500"}`}
            data-testid="gravity-state"
          >
            {gravityOn ? "ON" : "0-G"}
          </span>
          <span className="relative inline-block w-10 h-5 rounded-full border border-neutral-300 bg-neutral-100">
            <span
              className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full transition-all duration-300 ${gravityOn ? "left-[calc(100%-1rem)] bg-[#107C10] shadow-[0_0_10px_rgba(16,124,16,0.55)]" : "left-0.5 bg-neutral-400"}`}
            />
          </span>
        </button>
      </div>

      {/* Bottom HUD title overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none px-6 pb-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="hud-tag mb-3">Player_ONE · Suryansh</p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-neutral-900 leading-none">
              Level{" "}
              <span className="text-[#107C10] glow-flicker">10</span> Unlocked
            </h1>
            <p className="font-body text-sm sm:text-base text-neutral-600 mt-2 max-w-xl">
              Double-digit achievement · Family &amp; Friends Multiplayer Event
            </p>
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
      </div>

      {/* Corner brackets */}
      <div className="pointer-events-none absolute inset-3 z-[3]">
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#107C10]" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#107C10]" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#107C10]" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#107C10]" />
      </div>
    </div>
  );
}
