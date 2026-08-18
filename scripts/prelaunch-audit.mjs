import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const targets = [
  "src/content/site.ts",
  "src/content/projects.ts",
  "src/content/experience.ts",
];

const placeholders = [
  /you@example\.com/i,
  /yourusername/i,
  /yourdomain\.com/i,
  /sample outcome/i,
  /replace this/i,
  /your university/i,
  /update this line/i,
];

const failures = [];
for (const relative of targets) {
  const full = path.join(root, relative);
  const text = fs.readFileSync(full, "utf8");
  for (const pattern of placeholders) {
    if (pattern.test(text)) failures.push(`${relative}: placeholder ${pattern}`);
  }
}

const shippedPlaceholderHashes = new Map([
  ["public/portrait/portrait-source.png", "29b872c8b59e2cb13ad048c0be8e71a207fca10c20579aaf6fdb18ef565ebd19"],
  ["public/portrait/portrait-fallback.webp", "77e4612e6f5ef6dd63411ec1fe1f9cd61f5632c5877ba18101d7ef8078ed8bc1"],
  ["public/resume/Pranoy-Mukherjee-Resume.pdf", "a8cf66521146ddd428bb38ae2d5027b27bad7ae7aadba593669bc09b18a99310"],
  ["public/projects/edge-vision.webp", "cfc6843def2386641af3346b684ef1e888c6b1def8bc946b8c80cf1bbd58417c"],
  ["public/projects/realtime-dashboard.webp", "2802219d03dac923d28db32556599640598139a2c46b3bc210583e0ebdeda5b6"],
  ["public/projects/shared-ai-memory.webp", "b3ade39c91b3a0a3ee2d2c45e89815859901c5a33986013981fcea569ae6e4c7"],
]);

for (const [relative, shippedHash] of shippedPlaceholderHashes.entries()) {
  const full = path.join(root, relative);
  if (!fs.existsSync(full)) {
    failures.push(`${relative}: missing`);
    continue;
  }
  const hash = crypto.createHash("sha256").update(fs.readFileSync(full)).digest("hex");
  if (hash === shippedHash) failures.push(`${relative}: still uses the shipped placeholder asset`);
}

if (failures.length) {
  console.error("Pre-launch audit blocked public launch:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  console.error("\nComplete docs/CUSTOMIZATION.md, then run this command again.");
  process.exit(1);
}

console.log("Pre-launch audit passed. Template copy and shipped placeholder assets have been replaced.");
