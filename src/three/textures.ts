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

    ctx.fillStyle = "rgba(243, 237, 229, 0.34)";
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
export function pcbTexture() {
  return make("pcb", 512, 336, (ctx) => {
    ctx.fillStyle = "#2f1e15";
    ctx.fillRect(0, 0, 512, 336);

    // Subtle soldermask mottling so the surface is not perfectly flat.
    for (let i = 0; i < 220; i += 1) {
      ctx.fillStyle = `rgba(255, 241, 226, ${Math.random() * 0.025})`;
      ctx.fillRect(Math.random() * 512, Math.random() * 336, 3, 3);
    }

    ctx.strokeStyle = "#c98a54";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const traces: Array<Array<[number, number]>> = [
      [[40, 60], [150, 60], [178, 88], [178, 190], [206, 218], [330, 218]],
      [[40, 110], [110, 110], [140, 140], [300, 140], [326, 114], [468, 114]],
      [[62, 286], [62, 232], [96, 198], [230, 198], [258, 170], [400, 170]],
      [[470, 250], [372, 250], [344, 278], [180, 278]],
      [[214, 44], [214, 96], [246, 128], [430, 128]],
    ];
    traces.forEach((path, index) => {
      ctx.lineWidth = index % 2 === 0 ? 5 : 3.4;
      ctx.globalAlpha = index % 2 === 0 ? 0.9 : 0.62;
      ctx.beginPath();
      path.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
      ctx.stroke();
    });
    ctx.globalAlpha = 1;

    // Vias / pads.
    const pads: Array<[number, number]> = [
      [40, 60], [330, 218], [468, 114], [400, 170], [180, 278], [430, 128], [62, 286], [214, 44],
    ];
    pads.forEach(([x, y]) => {
      ctx.fillStyle = "#d7a665";
      ctx.beginPath();
      ctx.arc(x, y, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#2f1e15";
      ctx.beginPath();
      ctx.arc(x, y, 3.2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Silkscreen outlines where the components sit.
    ctx.strokeStyle = "rgba(243, 237, 229, 0.26)";
    ctx.lineWidth = 1.6;
    ([[92, 132, 78, 56], [252, 74, 66, 48], [352, 196, 84, 60]] as Array<[number, number, number, number]>).forEach(
      ([x, y, w, h]) => ctx.strokeRect(x, y, w, h),
    );
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
