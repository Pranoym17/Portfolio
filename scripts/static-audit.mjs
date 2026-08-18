import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const ignored = new Set(["node_modules", ".next", ".git", "playwright-report", "test-results"]);
const textExtensions = new Set([".ts", ".tsx", ".js", ".mjs", ".css", ".md", ".json"]);
const files = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (textExtensions.has(path.extname(entry.name))) files.push(full);
  }
}
walk(root);

let fatal = false;
const warnings = [];
const fatalRules = [
  { re: /\beval\s*\(/, message: "eval() is forbidden" },
  { re: /dangerouslySetInnerHTML/, message: "dangerouslySetInnerHTML requires manual review" },
  { re: /child_process|execSync|spawnSync/, message: "shell execution should not exist in the portfolio" },
];
const placeholderRules = [
  /you@example\.com/,
  /yourusername/,
  /yourdomain\.com/,
  /Sample outcome/i,
  /Replace this/i,
  /Your University/i,
];

for (const file of files) {
  const rel = path.relative(root, file).split(path.sep).join("/");
  // `placeholders.ts` defines the marker patterns themselves, so scanning it
  // would report its own rule list as unfinished content forever.
  if (
    rel.startsWith("scripts/") ||
    rel.startsWith("docs/") ||
    rel === "README.md" ||
    rel === "src/content/placeholders.ts"
  ) continue;
  const text = fs.readFileSync(file, "utf8");
  for (const rule of fatalRules) {
    if (rule.re.test(text)) {
      console.error(`FATAL ${rel}: ${rule.message}`);
      fatal = true;
    }
  }
  for (const rule of placeholderRules) {
    if (rule.test(text)) warnings.push(`${rel}: contains customization placeholder matching ${rule}`);
  }
}

const bannedFeatures = [
  { re: /spotify/i, label: "Spotify" },
  { re: /currently vibing/i, label: "music widget" },
  { re: /visitor count/i, label: "visitor counter" },
  { re: /count[- ]?up/i, label: "count-up statistics" },
  { re: /\bblog\b/i, label: "blog" },
];
for (const file of files.filter((f) => f.includes(`${path.sep}src${path.sep}`))) {
  const text = fs.readFileSync(file, "utf8");
  for (const feature of bannedFeatures) {
    if (feature.re.test(text)) {
      console.error(`FATAL ${path.relative(root, file)}: excluded feature found (${feature.label})`);
      fatal = true;
    }
  }
}

if (warnings.length) {
  console.warn("\nCustomization warnings (expected before you replace sample content):");
  for (const warning of warnings) console.warn(`- ${warning}`);
}

if (fatal) process.exit(1);
console.log(`\nStatic audit passed across ${files.length} source/document files.`);
