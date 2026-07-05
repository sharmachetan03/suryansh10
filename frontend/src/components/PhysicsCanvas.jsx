import { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

// Renders a single SVG icon into a data URL for use as a Matter body texture
const svgToDataUrl = (svgString) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;

const ICON_SIZE = 68;
const GREEN = "#1BE61B";
const GREEN_DIM = "#107C10";

// SVG string library — thematic gaming icons
const iconSvgs = {
  xbox: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <defs><filter id='g' x='-30%' y='-30%' width='160%' height='160%'>
      <feGaussianBlur stdDeviation='2.2' result='b'/>
      <feMerge><feMergeNode in='b'/><feMergeNode in='SourceGraphic'/></feMerge>
    </filter></defs>
    <circle cx='50' cy='50' r='42' fill='#0A0A0A' stroke='${GREEN}' stroke-width='3' filter='url(#g)'/>
    <path d='M32 68c8-14 12-22 18-22s10 8 18 22c-4 3-11 6-18 6s-14-3-18-6zM30 34c4-6 12-10 20-10 3 0 3 2 1 3-6 2-14 8-19 15-1 2-3 1-2-1v-7zm40 0v7c1 2-1 3-2 1-5-7-13-13-19-15-2-1-2-3 1-3 8 0 16 4 20 10z' fill='${GREEN}'/>
  </svg>`,
  controller: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 80'>
    <path d='M22 20 C10 22 4 34 6 48 C8 62 16 72 26 72 C34 72 38 66 44 62 L76 62 C82 66 86 72 94 72 C104 72 112 62 114 48 C116 34 110 22 98 20 C86 18 78 24 72 30 L48 30 C42 24 34 18 22 20 Z' fill='#0F0F0F' stroke='${GREEN}' stroke-width='2.5'/>
    <circle cx='30' cy='42' r='4' fill='${GREEN}'/>
    <circle cx='30' cy='54' r='4' fill='${GREEN}'/>
    <circle cx='24' cy='48' r='4' fill='${GREEN}'/>
    <circle cx='36' cy='48' r='4' fill='${GREEN}'/>
    <circle cx='84' cy='42' r='3.5' fill='${GREEN}'/>
    <circle cx='94' cy='42' r='3.5' fill='${GREEN}'/>
    <circle cx='84' cy='54' r='3.5' fill='${GREEN}'/>
    <circle cx='94' cy='54' r='3.5' fill='${GREEN}'/>
  </svg>`,
  skull: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <path d='M50 8C30 8 16 22 16 42v14c0 4 3 8 7 9l4 1v14c0 3 3 6 6 6h6v-8h6v8h10v-8h6v8h6c3 0 6-3 6-6V66l4-1c4-1 7-5 7-9V42C84 22 70 8 50 8z' fill='#111' stroke='${GREEN}' stroke-width='2.5'/>
    <ellipse cx='36' cy='46' rx='7' ry='9' fill='${GREEN}'/>
    <ellipse cx='64' cy='46' rx='7' ry='9' fill='${GREEN}'/>
    <path d='M46 62l4 6 4-6h-8z' fill='${GREEN}'/>
    <path d='M20 78l14 8M80 78l-14 8' stroke='${GREEN}' stroke-width='2' stroke-linecap='round'/>
  </svg>`,
  flame: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 100'>
    <path d='M40 6 C46 24 62 32 62 56 C62 76 52 92 40 92 C28 92 18 76 18 56 C18 44 26 40 30 32 C34 24 34 16 40 6 Z' fill='#0F0F0F' stroke='${GREEN}' stroke-width='2.5'/>
    <path d='M40 30 C44 42 52 48 52 62 C52 74 46 84 40 84 C34 84 28 74 28 62 C28 54 32 52 34 48 C36 42 36 38 40 30 Z' fill='${GREEN}' opacity='0.85'/>
  </svg>`,
  car: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 140 70'>
    <path d='M8 46 L20 30 L48 22 L92 22 L118 32 L132 44 L132 54 L118 56 L112 52 C110 60 100 60 98 52 L44 52 C42 60 32 60 30 52 L14 54 L8 54 Z' fill='#0F0F0F' stroke='${GREEN}' stroke-width='2.5'/>
    <path d='M32 32 L48 24 L88 24 L106 32 Z' fill='${GREEN}' opacity='0.4'/>
    <circle cx='38' cy='54' r='7' fill='#0A0A0A' stroke='${GREEN}' stroke-width='2'/>
    <circle cx='106' cy='54' r='7' fill='#0A0A0A' stroke='${GREEN}' stroke-width='2'/>
    <path d='M120 40 L132 42' stroke='${GREEN}' stroke-width='2'/>
  </svg>`,
  // Text-based logos
  xboxText: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 60'>
    <rect x='1' y='1' width='218' height='58' fill='#0A0A0A' stroke='${GREEN}' stroke-width='2'/>
    <text x='110' y='40' font-family='Rajdhani, sans-serif' font-weight='700' font-size='30' text-anchor='middle' fill='${GREEN}' letter-spacing='4'>XBOX</text>
  </svg>`,
  codText: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 60'>
    <rect x='1' y='1' width='218' height='58' fill='#0A0A0A' stroke='${GREEN_DIM}' stroke-width='2'/>
    <text x='110' y='38' font-family='Rajdhani, sans-serif' font-weight='700' font-size='24' text-anchor='middle' fill='${GREEN}' letter-spacing='2'>CALL·OF·DUTY</text>
  </svg>`,
  doomText: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'>
    <rect x='1' y='1' width='198' height='58' fill='#0A0A0A' stroke='${GREEN_DIM}' stroke-width='2'/>
    <text x='100' y='42' font-family='Rajdhani, sans-serif' font-weight='700' font-size='34' text-anchor='middle' fill='${GREEN}' letter-spacing='8'>DOOM</text>
  </svg>`,
  nfsText: `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'>
    <rect x='1' y='1' width='198' height='58' fill='#0A0A0A' stroke='${GREEN_DIM}' stroke-width='2'/>
    <text x='100' y='40' font-family='Rajdhani, sans-serif' font-weight='700' font-size='26' text-anchor='middle' fill='${GREEN}' letter-spacing='3'>NEED · SPEED</text>
  </svg>`,
};

const bodySpec = [
  { key: "xbox", size: 68, count: 3 },
  { key: "controller", size: 84, count: 2, aspect: 120 / 80 },
  { key: "skull", size: 60, count: 2 },
  { key: "flame", size: 64, count: 2, aspect: 80 / 100 },
  { key: "car", size: 96, count: 2, aspect: 140 / 70 },
  { key: "xboxText", size: 110, count: 1, aspect: 220 / 60 },
  { key: "codText", size: 130, count: 1, aspect: 220 / 60 },
  { key: "doomText", size: 100, count: 1, aspect: 200 / 60 },
  { key: "nfsText", size: 120, count: 1, aspect: 200 / 60 },
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

    // Invisible walls (thick, positioned just outside viewport)
    const wallThickness = 60;
    const walls = [
      Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, {
        isStatic: true,
        render: { visible: false },
      }),
      Bodies.rectangle(
        width / 2,
        height + wallThickness / 2,
        width,
        wallThickness,
        { isStatic: true, render: { visible: false } },
      ),
      Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, {
        isStatic: true,
        render: { visible: false },
      }),
      Bodies.rectangle(
        width + wallThickness / 2,
        height / 2,
        wallThickness,
        height,
        { isStatic: true, render: { visible: false } },
      ),
    ];
    Composite.add(engine.world, walls);

    // Create the floating icon bodies
    const bodies = [];
    bodySpec.forEach((spec) => {
      const aspect = spec.aspect || 1;
      const w = spec.size;
      const h = spec.size / aspect;
      for (let i = 0; i < spec.count; i++) {
        const x = 60 + Math.random() * (width - 120);
        const y = 40 + Math.random() * (height - 80);
        const body = Bodies.rectangle(x, y, w, h, {
          restitution: 0.92,
          friction: 0.02,
          frictionAir: 0.008,
          density: 0.001,
          chamfer: { radius: 4 },
          render: {
            sprite: {
              texture: svgToDataUrl(iconSvgs[spec.key]),
              xScale: w / (aspect > 1 ? 220 : 100),
              yScale: h / (aspect > 1 && aspect > 1.5 ? 60 : aspect < 1 ? 100 : aspect === 1 ? 100 : 80),
            },
          },
        });
        // random initial impulse for weightless drift
        Body.setVelocity(body, {
          x: (Math.random() - 0.5) * 2.4,
          y: (Math.random() - 0.5) * 2.4,
        });
        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);
        bodies.push(body);
      }
    });
    Composite.add(engine.world, bodies);

    // Mouse constraint for drag interactivity
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

    // Give a push on click for a satisfying kick even without drag
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

    // Zero-G station-keeping: apply tiny drift & re-inject velocity when things slow
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

    // Handle resize
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      render.canvas.width = w;
      render.canvas.height = h;
      render.options.width = w;
      render.options.height = h;
      Render.setPixelRatio(render, window.devicePixelRatio);
      // Reposition walls
      Composite.remove(engine.world, walls);
      const newWalls = [
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
      Composite.add(engine.world, newWalls);
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
      // Nudge everything so nothing is perfectly still
      Matter.Composite.allBodies(engineRef.current.world).forEach((b) => {
        if (!b.isStatic) {
          Matter.Body.setVelocity(b, {
            x: b.velocity.x + (Math.random() - 0.5) * 0.5,
            y: b.velocity.y,
          });
        }
      });
    } else {
      // Give a fresh weightless drift
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
      className="relative w-full h-[52vh] min-h-[380px] overflow-hidden grid-bg scanlines"
      data-testid="physics-hero"
    >
      {/* Canvas mount */}
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
          className="group flex items-center gap-3 bg-black/70 backdrop-blur border border-[#333] hover:border-[#107C10] transition-colors px-4 py-2.5 corner-cut cursor-pointer"
        >
          <span
            className={`inline-block w-2.5 h-2.5 rounded-full transition-all ${gravityOn ? "bg-[#1BE61B] shadow-[0_0_10px_#1BE61B]" : "bg-neutral-600"}`}
          />
          <span className="font-heading text-[11px] font-bold tracking-hud uppercase text-white">
            Gravity Override
          </span>
          <span
            className={`font-heading text-[11px] font-bold tracking-hud uppercase ${gravityOn ? "text-[#1BE61B] glow-text" : "text-neutral-500"}`}
            data-testid="gravity-state"
          >
            {gravityOn ? "ON" : "0-G"}
          </span>
          {/* Toggle track */}
          <span className="relative inline-block w-10 h-5 rounded-full border border-[#333] bg-[#0A0A0A]">
            <span
              className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full transition-all duration-300 ${gravityOn ? "left-[calc(100%-1rem)] bg-[#1BE61B] shadow-[0_0_10px_#1BE61B]" : "left-0.5 bg-neutral-500"}`}
            />
          </span>
        </button>
      </div>

      {/* Bottom HUD title overlay */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none px-6 pb-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="hud-tag mb-3">Player_ONE · Suryansh</p>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-white leading-none">
              Level <span className="text-[#1BE61B] glow-text glow-flicker">10</span> Unlocked
            </h1>
            <p className="font-body text-sm sm:text-base text-neutral-400 mt-2 max-w-xl">
              Double-digit achievement · Family &amp; Friends Multiplayer Event
            </p>
          </div>
          <div className="hidden md:flex flex-col items-end gap-1 text-right">
            <span className="font-heading text-[10px] tracking-hud uppercase text-neutral-500">
              Ping
            </span>
            <span className="font-mono-hud text-[#1BE61B] glow-text text-sm">
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
