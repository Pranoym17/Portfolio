import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public");
const projectsFile = path.join(root, "src/content/projects.ts");
const source = fs.readFileSync(projectsFile, "utf8");
const paths = [...source.matchAll(/image:\s*["'](\/projects\/[^"']+)["']/g)].map((match) => match[1]);
const failures = [];

for (const assetPath of paths) {
  const diskPath = path.join(publicDir, assetPath.replace(/^\//, ""));
  if (!fs.existsSync(diskPath)) failures.push(`Missing project image: ${assetPath}`);
}

const required = [
  "/portrait/portrait-source.png",
  "/portrait/portrait-fallback.webp",
  "/resume/Pranoy-Mukherjee-Resume.pdf",
];
for (const assetPath of required) {
  if (!fs.existsSync(path.join(publicDir, assetPath.replace(/^\//, "")))) failures.push(`Missing required asset: ${assetPath}`);
}

const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});
const files = walk(publicDir);
const total = files.reduce((sum, file) => sum + fs.statSync(file).size, 0);
const heavy = files.filter((file) => fs.statSync(file).size > 4 * 1024 * 1024);

if (heavy.length) {
  for (const file of heavy) failures.push(`Asset exceeds 4 MB: ${path.relative(publicDir, file)}`);
}

if (failures.length) {
  console.error("Asset audit failed:\n");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Asset audit passed: ${files.length} files, ${(total / 1024 / 1024).toFixed(2)} MB total public payload.`);
