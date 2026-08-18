import { ImageResponse } from "next/og";
import { siteConfig } from "@/content/site";

export const alt = `${siteConfig.name} — ${siteConfig.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Point-cloud portrait motif rendered as an inline SVG so the share preview carries
 * the same visual identity as the hero. Uses the silhouette maths from PortraitCloud
 * and a deterministic seed so the image is byte-stable across builds.
 */
function portraitDots() {
  const circles: string[] = [];
  const step = 0.05;
  let index = 0;
  for (let y = 1.75; y >= -1.75; y -= step) {
    for (let x = -1.5; x <= 1.5; x += step) {
      const head = ((x + 0.08) / 0.78) ** 2 + ((y - 0.45) / 1.02) ** 2 < 1;
      const neck = Math.abs(x) < 0.35 && y < -0.25 && y > -0.92;
      const shoulders = (x / 1.42) ** 2 + ((y + 1.38) / 0.72) ** 2 < 1 && y < -0.6;
      const faceCut = x > -0.46 && x < 0.44 && y > 0 && y < 0.92 && Math.sin((x + y) * 8) > 0.72;
      if (!(head || neck || shoulders) || faceCut) continue;

      const seed = ((index * 9301 + 49297) % 233280) / 233280;
      index += 1;
      if (seed > 0.82) continue; // thin the field so it reads as points, not a mass

      const cx = (x + 1.5) * 130;
      const cy = (1.75 - y) * 130;
      const accent = x > 0.12 && y > 0.2 && seed > 0.62;
      const r = accent ? 2.4 : 1.9;
      const fill = accent ? "%23ff4b2b" : "%23cfc2b4";
      const opacity = accent ? 0.95 : 0.5 + seed * 0.4;
      circles.push(`%3Ccircle cx='${cx.toFixed(1)}' cy='${cy.toFixed(1)}' r='${r}' fill='${fill}' opacity='${opacity.toFixed(2)}'/%3E`);
    }
  }
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='390' height='455' viewBox='0 0 390 455'%3E${circles.join("")}%3C/svg%3E`;
}

export default function Image() {
  const year = new Date().getFullYear();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#18130f",
          color: "#f3ede5",
          position: "relative",
          overflow: "hidden",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ position: "absolute", width: 560, height: 560, borderRadius: 999, right: -110, top: 40, backgroundColor: "rgba(255,75,43,.15)" }} />

        {/* Point-cloud portrait on the right. Satori renders this, not the browser,
            so next/image is not available here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={portraitDots()}
          width={390}
          height={455}
          alt=""
          style={{ position: "absolute", right: 96, top: 92 }}
        />

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", position: "relative" }}>
          <div style={{ display: "flex", fontSize: 20, letterSpacing: 5, color: "#ff6b4c" }}>{`PORTFOLIO / ${year}`}</div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 88, lineHeight: 0.94, letterSpacing: -5, fontWeight: 600 }}>{siteConfig.name}</div>
            <div style={{ display: "flex", marginTop: 26, fontSize: 30, color: "#c8b9aa" }}>{siteConfig.role}</div>
          </div>
          <div style={{ display: "flex", fontSize: 22, color: "#b5a496", maxWidth: 620 }}>{siteConfig.heroLead}</div>
        </div>
      </div>
    ),
    size,
  );
}
