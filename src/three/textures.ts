import { CanvasTexture, LinearFilter, SRGBColorSpace, Texture } from "three";

/**
 * Procedural CanvasTextures for the workspace props. Generated once per page and
 * shared between instances so the scene stays at zero asset download cost.
 */

const cache = new Map<string, Texture>();

function make(key: string, width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void): Texture | null {
  if (typeof document === "undefined") return null;
  const cached = cache.get(key);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  draw(ctx);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  texture.minFilter = LinearFilter;
  cache.set(key, texture);
  return texture;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Stylized project UI shown on the laptop screen. Echoes the featured bento card. */
export function screenTexture() {
  return make("screen", 1024, 640, (ctx) => {
    ctx.fillStyle = "#15100d";
    ctx.fillRect(0, 0, 1024, 640);

    // Ambient accent bloom behind the content.
    const glow = ctx.createRadialGradient(760, 130, 20, 760, 130, 460);
    glow.addColorStop(0, "rgba(255, 75, 43, 0.30)");
    glow.addColorStop(1, "rgba(255, 75, 43, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1024, 640);

    // Window chrome.
    ctx.fillStyle = "rgba(255, 241, 226, 0.05)";
    ctx.fillRect(0, 0, 1024, 54);
    ctx.fillStyle = "rgba(255, 241, 226, 0.16)";
    [30, 58, 86].forEach((x) => {
      ctx.beginPath();
      ctx.arc(x, 27, 7, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = "rgba(255, 241, 226, 0.07)";
    roundRect(ctx, 360, 14, 300, 26, 13);
    ctx.fill();

    // Eyebrow + accent rule.
    ctx.fillStyle = "#ff4b2b";
    ctx.fillRect(64, 108, 92, 5);
    ctx.font = "600 21px ui-monospace, monospace";
    ctx.fillText("FEATURED", 64, 154);

    // Headline blocks (type suggestion, not readable text).
    ctx.fillStyle = "rgba(243, 237, 229, 0.92)";
    roundRect(ctx, 64, 186, 520, 26, 6);
    ctx.fill();
    roundRect(ctx, 64, 228, 392, 26, 6);
    ctx.fill();

    ctx.fillStyle = "rgba(255, 249, 240, 0.6)";
    [292, 322, 352].forEach((y, i) => {
      roundRect(ctx, 64, y, [470, 430, 330][i], 12, 5);
      ctx.fill();
    });

    // Tech pills.
    ctx.fillStyle = "rgba(255, 241, 226, 0.10)";
    let x = 64;
    [110, 92, 130, 84].forEach((w) => {
      roundRect(ctx, x, 404, w, 34, 17);
      ctx.fill();
      x += w + 14;
    });

    // Right-side panel with a data plot.
    ctx.fillStyle = "rgba(255, 241, 226, 0.045)";
    roundRect(ctx, 640, 108, 320, 330, 18);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 241, 226, 0.10)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.strokeStyle = "rgba(255, 241, 226, 0.07)";
    ctx.lineWidth = 1;
    for (let i = 1; i < 5; i += 1) {
      ctx.beginPath();
      ctx.moveTo(664, 140 + i * 58);
      ctx.lineTo(936, 140 + i * 58);
      ctx.stroke();
    }

    const points = [0.42, 0.55, 0.38, 0.68, 0.6, 0.86, 0.74, 0.95];
    ctx.beginPath();
    points.forEach((p, i) => {
      const px = 664 + (i / (points.length - 1)) * 272;
      const py = 410 - p * 240;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.strokeStyle = "#ff4b2b";
    ctx.lineWidth = 3.5;
    ctx.stroke();
    ctx.lineTo(936, 410);
    ctx.lineTo(664, 410);
    ctx.closePath();
    const fill = ctx.createLinearGradient(0, 150, 0, 410);
    fill.addColorStop(0, "rgba(255, 75, 43, 0.28)");
    fill.addColorStop(1, "rgba(255, 75, 43, 0)");
    ctx.fillStyle = fill;
    ctx.fill();

    // Status footer.
    ctx.fillStyle = "rgba(255, 241, 226, 0.05)";
    ctx.fillRect(0, 586, 1024, 54);
    ctx.fillStyle = "#7fbf8c";
    ctx.beginPath();
    ctx.arc(78, 613, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(243, 237, 229, 0.4)";
    roundRect(ctx, 100, 606, 150, 12, 5);
    ctx.fill();
  });
}

/** Keyboard + trackpad suggestion drawn as one texture instead of per-key meshes. */
export function keyboardTexture() {
  return make("keyboard", 1024, 640, (ctx) => {
    ctx.fillStyle = "#241e1a";
    ctx.fillRect(0, 0, 1024, 640);

    const cols = 14;
    const rows = 5;
    const padX = 74;
    const padY = 58;
    const areaW = 1024 - padX * 2;
    const areaH = 400;
    const keyW = areaW / cols;
    const keyH = areaH / rows;

    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        // Bottom row: fuse the middle keys into a spacebar.
        if (r === rows - 1 && c > 3 && c < 9) continue;
        const w = keyW - 7;
        const h = keyH - 7;
        const x = padX + c * keyW;
        const y = padY + r * keyH;
        ctx.fillStyle = "#15110e";
        roundRect(ctx, x, y, w, h, 6);
        ctx.fill();
        ctx.fillStyle = "rgba(255, 241, 226, 0.055)";
        roundRect(ctx, x, y, w, h * 0.42, 6);
        ctx.fill();
      }
    }

    // Spacebar.
    const sx = padX + 4 * keyW;
    const sy = padY + (rows - 1) * keyH;
    ctx.fillStyle = "#15110e";
    roundRect(ctx, sx, sy, keyW * 5 - 7, keyH - 7, 6);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 241, 226, 0.055)";
    roundRect(ctx, sx, sy, keyW * 5 - 7, (keyH - 7) * 0.42, 6);
    ctx.fill();

    // Trackpad.
    ctx.fillStyle = "rgba(255, 241, 226, 0.035)";
    roundRect(ctx, 362, 486, 300, 118, 12);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 241, 226, 0.09)";
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

/** Copper trace artwork for the PCB top face. */
/* ---------------------------------------------------------------------------
 * PCB artwork.
 *
 * A board reads as fake when traces bend at arbitrary angles and pads sit at
 * random. Real layouts obey conventions, so this geometry is generated from
 * them rather than hand-placed:
 *   - traces bend only at 45 degrees, never at an arbitrary angle
 *   - signals leave a chip as parallel bundles at a constant pitch
 *   - vias stitch the ground pour on a regular grid
 *   - every part has a silkscreen outline and a reference designator
 *
 * The same geometry drives the glow map, so the powered-up trace animation
 * lines up exactly with the copper underneath it.
 * ------------------------------------------------------------------------- */

const PCB_W = 1024;
const PCB_H = 672;

type Pt = [number, number];

/** A 45-degree-only route for a mostly-horizontal run: straight, diagonal, straight. */
function route45(x1: number, y1: number, x2: number, y2: number): Pt[] {
  const span = Math.abs(y2 - y1);
  const dir = x2 >= x1 ? 1 : -1;
  const slack = Math.max(0, Math.abs(x2 - x1) - span) / 2;
  const a = x1 + dir * slack;
  const b = a + dir * span;
  return [[x1, y1], [a, y1], [b, y2], [x2, y2]];
}

/** The same, for a mostly-vertical run. */
function route45V(x1: number, y1: number, x2: number, y2: number): Pt[] {
  const span = Math.abs(x2 - x1);
  const dir = y2 >= y1 ? 1 : -1;
  const slack = Math.max(0, Math.abs(y2 - y1) - span) / 2;
  const a = y1 + dir * slack;
  const b = a + dir * span;
  return [[x1, y1], [x1, a], [x2, b], [x2, y2]];
}

/** Parallel bundle at a fixed pitch — how a bus actually leaves a chip. */
function bus(x1: number, y1: number, x2: number, y2: number, count: number, pitch: number): Pt[][] {
  return Array.from({ length: count }, (_, i) => route45(x1, y1 + i * pitch, x2, y2 + i * pitch));
}

function busV(x1: number, y1: number, x2: number, y2: number, count: number, pitch: number): Pt[][] {
  return Array.from({ length: count }, (_, i) => route45V(x1 + i * pitch, y1, x2 + i * pitch, y2));
}

const IC = {
  u1: { x: 138, y: 236, w: 186, h: 178, label: "U1", sub: "MCU" },
  u2: { x: 556, y: 96, w: 138, h: 104, label: "U2", sub: "RF" },
  u3: { x: 648, y: 392, w: 172, h: 128, label: "U3", sub: "PWR" },
};

/** Signal traces — thin copper. */
const PCB_SIGNALS: Pt[][] = [
  ...bus(IC.u1.x + IC.u1.w, 268, IC.u2.x, 118, 5, 19),
  ...bus(IC.u1.x + IC.u1.w, 350, IC.u3.x, 416, 6, 19),
  ...busV(700, IC.u3.y + IC.u3.h, 700, 634, 6, 22),
  ...bus(IC.u2.x + IC.u2.w, 122, 972, 214, 4, 20),
  ...bus(IC.u1.x, 300, 52, 214, 4, 20),
];

/** Power rails — wide copper, routed around the board edge. */
const PCB_RAILS: Pt[][] = [
  [[52, 60], [880, 60], [948, 128], [948, 300]],
  [[52, 612], [300, 612], [340, 572], [612, 572]],
];

const PCB_VIAS: Pt[] = (() => {
  const out: Pt[] = [];
  const clear = (x: number, y: number, box: { x: number; y: number; w: number; h: number }) =>
    x > box.x - 24 && x < box.x + box.w + 24 && y > box.y - 24 && y < box.y + box.h + 24;
  for (let x = 60; x <= PCB_W - 60; x += 68) {
    for (let y = 96; y <= PCB_H - 96; y += 68) {
      if (clear(x, y, IC.u1) || clear(x, y, IC.u2) || clear(x, y, IC.u3)) continue;
      out.push([x, y]);
    }
  }
  return out;
})();

/** Two-pad SMD footprints with their reference designators. */
const PCB_PASSIVES: Array<{ x: number; y: number; label: string; vertical?: boolean }> = [
  { x: 404, y: 236, label: "R1" },
  { x: 404, y: 300, label: "R2" },
  { x: 470, y: 268, label: "C1", vertical: true },
  { x: 372, y: 466, label: "C2" },
  { x: 480, y: 520, label: "R3" },
  { x: 880, y: 396, label: "C3", vertical: true },
  { x: 224, y: 528, label: "R4" },
  { x: 300, y: 152, label: "C4" },
];

/** Gold edge-connector fingers along the bottom edge. */
const PCB_FINGERS = Array.from({ length: 9 }, (_, i) => 316 + i * 44);

function pcbStroke(ctx: CanvasRenderingContext2D, paths: Pt[][], width: number) {
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  paths.forEach((path) => {
    ctx.beginPath();
    path.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.stroke();
  });
}

/** The copper layer: what the board looks like unpowered. */
export function pcbTexture() {
  return make("pcb", PCB_W, PCB_H, (ctx) => {
    ctx.fillStyle = "#150d08";
    ctx.fillRect(0, 0, PCB_W, PCB_H);

    // Hatched ground pour. Real boards show this as a regular crosshatch.
    ctx.strokeStyle = "rgba(224, 170, 116, 0.20)";
    ctx.lineWidth = 1.4;
    for (let i = -PCB_H; i < PCB_W; i += 16) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + PCB_H, PCB_H);
      ctx.stroke();
    }

    // Soldermask mottling so the surface is not perfectly flat.
    for (let i = 0; i < 320; i += 1) {
      ctx.fillStyle = "rgba(255, 241, 226, " + (Math.random() * 0.022).toFixed(4) + ")";
      ctx.fillRect(Math.random() * PCB_W, Math.random() * PCB_H, 3, 3);
    }

    ctx.strokeStyle = "#f0c58c";
    pcbStroke(ctx, PCB_SIGNALS, 7);
    ctx.strokeStyle = "#ffe0b4";
    pcbStroke(ctx, PCB_RAILS, 15);

    // Via stitching.
    PCB_VIAS.forEach(([x, y]) => {
      ctx.fillStyle = "#f0c58c";
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#120b06";
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Edge connector.
    PCB_FINGERS.forEach((x) => {
      ctx.fillStyle = "#ffd9a0";
      ctx.fillRect(x, PCB_H - 46, 26, 46);
    });

    // SMD passives: two pads, a silkscreen box, a designator.
    ctx.textBaseline = "middle";
    PCB_PASSIVES.forEach(({ x, y, label, vertical }) => {
      const w = vertical ? 22 : 46;
      const h = vertical ? 46 : 22;
      ctx.strokeStyle = "rgba(255, 249, 240, 0.4)";
      ctx.lineWidth = 1.4;
      ctx.strokeRect(x - w / 2 - 5, y - h / 2 - 5, w + 10, h + 10);
      ctx.fillStyle = "#ffd9a0";
      if (vertical) {
        ctx.fillRect(x - 11, y - 23, 22, 15);
        ctx.fillRect(x - 11, y + 8, 22, 15);
      } else {
        ctx.fillRect(x - 23, y - 11, 15, 22);
        ctx.fillRect(x + 8, y - 11, 15, 22);
      }
      ctx.fillStyle = "rgba(255, 249, 240, 0.75)";
      ctx.font = "600 15px ui-monospace, monospace";
      ctx.fillText(label, x - w / 2 - 4, y - h / 2 - 16);
    });

    // IC silkscreen: outline, pin-1 notch, pin rows, designator and function.
    Object.values(IC).forEach(({ x, y, w, h, label, sub }) => {
      ctx.strokeStyle = "rgba(255, 249, 240, 0.7)";
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, w, h);
      ctx.beginPath();
      ctx.arc(x + 18, y + 18, 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = "#ffd9a0";
      const pins = Math.max(4, Math.floor(h / 26));
      for (let i = 0; i < pins; i += 1) {
        const py = y + 18 + i * ((h - 36) / Math.max(1, pins - 1)) - 5;
        ctx.fillRect(x - 15, py, 15, 10);
        ctx.fillRect(x + w, py, 15, 10);
      }
      ctx.fillStyle = "rgba(255, 252, 246, 0.92)";
      ctx.font = "700 20px ui-monospace, monospace";
      ctx.fillText(label, x + 34, y + 24);
      ctx.font = "600 14px ui-monospace, monospace";
      ctx.fillStyle = "rgba(255, 249, 240, 0.6)";
      ctx.fillText(sub, x + 34, y + 46);
    });

    // Mounting holes.
    ([[46, 46], [PCB_W - 46, 46], [46, PCB_H - 46], [PCB_W - 46, PCB_H - 46]] as Pt[]).forEach(([x, y]) => {
      ctx.fillStyle = "#c98a54";
      ctx.beginPath();
      ctx.arc(x, y, 17, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1b1109";
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
    });

    // Board legend.
    ctx.fillStyle = "rgba(255, 249, 240, 0.7)";
    ctx.font = "600 17px ui-monospace, monospace";
    ctx.fillText("PM-01  REV A", 84, PCB_H - 76);
    ctx.fillText("BUILT > BOUGHT", 706, 642);
  });
}

/**
 * Emissive companions to `pcbTexture`. The same trace geometry drawn as light on
 * black, so raising a material's emissive intensity lights the copper along its
 * real path instead of glowing the whole board.
 *
 * Rails and signals are separate layers on purpose: the power-up sequence brings
 * the rails alive first and the data lines a beat later, which is what makes it
 * read as a board booting rather than a panel fading up.
 */
export function pcbRailGlowTexture() {
  return make("pcb-glow-rail", PCB_W, PCB_H, (ctx) => {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, PCB_W, PCB_H);
    ctx.strokeStyle = "#ffb27a";
    pcbStroke(ctx, PCB_RAILS, 15);
    ctx.fillStyle = "#ffc596";
    PCB_FINGERS.forEach((x) => ctx.fillRect(x, PCB_H - 46, 26, 46));
  });
}

export function pcbSignalGlowTexture() {
  return make("pcb-glow-signal", PCB_W, PCB_H, (ctx) => {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, PCB_W, PCB_H);
    ctx.strokeStyle = "#ff6a3d";
    pcbStroke(ctx, PCB_SIGNALS, 7);
    ctx.fillStyle = "#ff8a52";
    PCB_VIAS.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
  });
}

/** Faint engineering sketch on the notebook's top page. */
export function notebookTexture() {
  return make("notebook", 512, 680, (ctx) => {
    ctx.fillStyle = "#f1e8df";
    ctx.fillRect(0, 0, 512, 680);

    // Ruled lines.
    ctx.strokeStyle = "rgba(140, 116, 100, 0.22)";
    ctx.lineWidth = 1;
    for (let y = 70; y < 680; y += 38) {
      ctx.beginPath();
      ctx.moveTo(46, y);
      ctx.lineTo(466, y);
      ctx.stroke();
    }
    // Margin.
    ctx.strokeStyle = "rgba(255, 75, 43, 0.30)";
    ctx.beginPath();
    ctx.moveTo(70, 20);
    ctx.lineTo(70, 660);
    ctx.stroke();

    const ink = "rgba(58, 44, 36, 0.62)";
    ctx.strokeStyle = ink;
    ctx.fillStyle = ink;
    ctx.lineWidth = 2.4;
    ctx.lineJoin = "round";

    // A small system diagram: two boxes feeding a third.
    const boxes: Array<[number, number, number, number]> = [
      [104, 132, 120, 62],
      [286, 132, 120, 62],
      [190, 300, 140, 68],
    ];
    boxes.forEach(([x, y, w, h]) => {
      ctx.beginPath();
      // Slightly wobbly rectangle so it reads as hand-drawn.
      ctx.moveTo(x + 2, y);
      ctx.lineTo(x + w, y + 3);
      ctx.lineTo(x + w - 2, y + h);
      ctx.lineTo(x, y + h - 2);
      ctx.closePath();
      ctx.stroke();
    });

    // Arrows into the lower box.
    const arrow = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      const angle = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 12 * Math.cos(angle - 0.4), y2 - 12 * Math.sin(angle - 0.4));
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 12 * Math.cos(angle + 0.4), y2 - 12 * Math.sin(angle + 0.4));
      ctx.stroke();
    };
    arrow(164, 196, 226, 296);
    arrow(346, 196, 292, 296);
    arrow(260, 370, 260, 430);

    // Content lines inside the boxes.
    ctx.fillStyle = "rgba(58, 44, 36, 0.30)";
    ([[120, 152, 78], [120, 168, 54], [302, 152, 84], [302, 168, 48], [212, 326, 96], [212, 344, 68]] as Array<
      [number, number, number]
    >).forEach(([x, y, w]) => ctx.fillRect(x, y, w, 5));

    // Accent circle highlighting the important node.
    ctx.strokeStyle = "rgba(255, 75, 43, 0.55)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(260, 334, 108, 62, 0.05, 0, Math.PI * 2);
    ctx.stroke();

    // Scribbled notes below.
    ctx.strokeStyle = "rgba(58, 44, 36, 0.34)";
    ctx.lineWidth = 2.2;
    [452, 490, 528, 566].forEach((y, i) => {
      ctx.beginPath();
      ctx.moveTo(104, y);
      ctx.lineTo(104 + [250, 300, 190, 260][i], y + (i % 2 === 0 ? 2 : -2));
      ctx.stroke();
    });
  });
}
