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
  flame: {
    vbW: 80,
    vbH: 100,
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 100'>
      <path d='M40 6 C46 24 62 32 62 56 C62 76 52 92 40 92 C28 92 18 76 18 56 C18 44 26 40 30 32 C34 24 34 16 40 6 Z' fill='${BG}' stroke='${GREEN}' stroke-width='2.5'/>
      <path d='M40 30 C44 42 52 48 52 62 C52 74 46 84 40 84 C34 84 28 74 28 62 C28 54 32 52 34 48 C36 42 36 38 40 30 Z' fill='${GREEN}' opacity='0.85'/>
    </svg>`,
  },
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

  // --- DOOM Slayer helmet — the horned Slayer mask silhouette ---
  doomHelmet: {
    vbW: 100,
    vbH: 100,
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
      <!-- Horns -->
      <path d='M22 32 L14 12 L28 28 Z M78 32 L86 12 L72 28 Z' fill='${GREEN}' stroke='${GREEN_DEEP}' stroke-width='1.5' stroke-linejoin='round'/>
      <!-- Helmet dome -->
      <path d='M22 32 Q30 18 50 18 Q70 18 78 32 L84 55 Q82 78 68 88 L32 88 Q18 78 16 55 Z' fill='${BG}' stroke='${GREEN}' stroke-width='3' stroke-linejoin='round'/>
      <!-- Angular visor / eyes -->
      <path d='M26 44 L44 50 L44 58 L26 60 Z' fill='${GREEN}'/>
      <path d='M74 44 L56 50 L56 58 L74 60 Z' fill='${GREEN}'/>
      <!-- Center forehead strip -->
      <rect x='47' y='30' width='6' height='34' fill='${GREEN}'/>
      <!-- Cheek plates -->
      <path d='M26 66 L36 70 L34 82 L24 78 Z' fill='none' stroke='${GREEN}' stroke-width='2'/>
      <path d='M74 66 L64 70 L66 82 L76 78 Z' fill='none' stroke='${GREEN}' stroke-width='2'/>
      <!-- Mouth grille -->
      <path d='M38 72 L62 72 L58 84 L42 84 Z' fill='${GREEN}'/>
      <line x1='45' y1='72' x2='45' y2='84' stroke='${BG}' stroke-width='1.2'/>
      <line x1='50' y1='72' x2='50' y2='84' stroke='${BG}' stroke-width='1.2'/>
      <line x1='55' y1='72' x2='55' y2='84' stroke='${BG}' stroke-width='1.2'/>
    </svg>`,
  },

  // --- Call of Duty — military shield with star and crossed dog tags ---
  codShield: {
    vbW: 100,
    vbH: 100,
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
      <!-- Shield outer -->
      <path d='M50 6 L84 18 L82 55 Q80 78 50 94 Q20 78 18 55 L16 18 Z' fill='${BG}' stroke='${GREEN}' stroke-width='3' stroke-linejoin='round'/>
      <!-- Shield inner accent -->
      <path d='M50 14 L76 24 L74 54 Q72 72 50 84 Q28 72 26 54 L24 24 Z' fill='none' stroke='${GREEN}' stroke-width='1' opacity='0.5'/>
      <!-- 5-point star -->
      <path d='M50 26 L55.5 42 L72 42 L58.5 52 L64 68 L50 58 L36 68 L41.5 52 L28 42 L44.5 42 Z' fill='${GREEN}'/>
      <!-- Crossed rifles below star -->
      <g stroke='${GREEN}' stroke-width='2.5' stroke-linecap='round'>
        <line x1='32' y1='72' x2='68' y2='82'/>
        <line x1='68' y1='72' x2='32' y2='82'/>
      </g>
      <!-- Rifle butts -->
      <circle cx='32' cy='72' r='2.5' fill='${GREEN}'/>
      <circle cx='68' cy='72' r='2.5' fill='${GREEN}'/>
    </svg>`,
  },

  // --- COD skull with beret (alt icon for variety) ---
  codSkull: {
    vbW: 100,
    vbH: 100,
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
      <!-- Beret -->
      <path d='M22 30 Q28 12 60 14 Q84 16 82 32 L82 36 L20 36 Z' fill='${GREEN}' stroke='${GREEN_DEEP}' stroke-width='2' stroke-linejoin='round'/>
      <circle cx='72' cy='22' r='4' fill='${BG}'/>
      <!-- Skull -->
      <path d='M50 34 C30 34 20 46 20 62 v10 c0 3 2 5 5 6 l3 1 v10 c0 2 2 4 4 4 h4 v-6 h4 v6 h6 v-6 h4 v6 h4 c2 0 4-2 4-4 V79 l3-1 c3-1 5-3 5-6 V62 C80 46 70 34 50 34 z' fill='${BG}' stroke='${GREEN}' stroke-width='2.5'/>
      <ellipse cx='38' cy='60' rx='6' ry='7' fill='${GREEN}'/>
      <ellipse cx='62' cy='60' rx='6' ry='7' fill='${GREEN}'/>
      <path d='M47 72 L50 78 L53 72 Z' fill='${GREEN}'/>
    </svg>`,
  },

  // --- NFS — bold angular "N" mark with speed slashes (Need for Speed style) ---
  nfsMark: {
    vbW: 120,
    vbH: 80,
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 80'>
      <!-- Backdrop plate -->
      <path d='M6 12 L114 12 L108 68 L0 68 Z' fill='${BG}' stroke='${GREEN}' stroke-width='2.5' stroke-linejoin='round'/>
      <!-- Bold N with speed skew -->
      <path d='M22 60 L30 20 L44 20 L58 46 L64 20 L78 20 L70 60 L56 60 L42 34 L36 60 Z' fill='${GREEN}'/>
      <!-- Speed slashes trailing -->
      <g stroke='${GREEN}' stroke-width='3' stroke-linecap='round'>
        <line x1='84' y1='26' x2='104' y2='24'/>
        <line x1='82' y1='40' x2='106' y2='38'/>
        <line x1='80' y1='54' x2='102' y2='52'/>
      </g>
    </svg>`,
  },

  // --- NFS — winged racing emblem alt ---
  nfsWing: {
    vbW: 140,
    vbH: 70,
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 140 70'>
      <!-- Central diamond -->
      <path d='M70 12 L82 35 L70 58 L58 35 Z' fill='${GREEN}' stroke='${GREEN_DEEP}' stroke-width='1.5'/>
      <!-- Left wing feathers -->
      <g fill='${BG}' stroke='${GREEN}' stroke-width='2' stroke-linejoin='round'>
        <path d='M58 30 L20 22 L40 32 Z'/>
        <path d='M58 35 L10 35 L36 40 Z'/>
        <path d='M58 40 L20 48 L40 42 Z'/>
      </g>
      <!-- Right wing feathers -->
      <g fill='${BG}' stroke='${GREEN}' stroke-width='2' stroke-linejoin='round'>
        <path d='M82 30 L120 22 L100 32 Z'/>
        <path d='M82 35 L130 35 L104 40 Z'/>
        <path d='M82 40 L120 48 L100 42 Z'/>
      </g>
      <!-- Center "S" swoosh -->
      <path d='M65 28 Q72 32 75 35 Q72 38 65 42' fill='none' stroke='${BG}' stroke-width='2' stroke-linecap='round'/>
    </svg>`,
  },

  // --- Xbox wordmark tile (kept as light text plate) ---
  xboxText: {
    vbW: 220,
    vbH: 60,
    svg: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 60'>
      <rect x='1' y='1' width='218' height='58' fill='${BG}' stroke='${GREEN}' stroke-width='2'/>
      <text x='110' y='40' font-family='Rajdhani, sans-serif' font-weight='700' font-size='30' text-anchor='middle' fill='${GREEN_DEEP}' letter-spacing='4'>XBOX</text>
    </svg>`,
  },
};

// Spec: which bodies, size, count
const bodySpec = [
  { key: "xbox", w: 68, h: 68, count: 3 },
  { key: "controller", w: 108, h: 72, count: 2 },
  { key: "flame", w: 52, h: 65, count: 2 },
  { key: "car", w: 108, h: 54, count: 2 },
  { key: "doomHelmet", w: 78, h: 78, count: 2 },
  { key: "codShield", w: 72, h: 72, count: 1 },
  { key: "codSkull", w: 68, h: 68, count: 1 },
  { key: "nfsMark", w: 108, h: 72, count: 1 },
  { key: "nfsWing", w: 120, h: 60, count: 1 },
  { key: "xboxText", w: 110, h: 30, count: 1 },
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
    bodySpec.forEach((spec) => {
      const icon = icons[spec.key];
      for (let i = 0; i < spec.count; i++) {
        const x = 60 + Math.random() * (width - 120);
        const y = 40 + Math.random() * (height - 80);
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
          x: (Math.random() - 0.5) * 2.4,
          y: (Math.random() - 0.5) * 2.4,
        });
        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);
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
