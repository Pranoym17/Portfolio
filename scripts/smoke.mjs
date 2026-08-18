const base = (process.env.BASE_URL || process.argv[2] || "").replace(/\/$/, "");
if (!base) {
  console.error("Usage: BASE_URL=https://your-site.com npm run smoke");
  process.exit(1);
}

const checks = [
  ["/", [200]],
  ["/api/health", [200]],
  ["/work/shared-ai-memory", [200]],
  ["/definitely-not-a-page", [404]],
];

let failed = false;
for (const [path, allowed] of checks) {
  try {
    const response = await fetch(`${base}${path}`, { redirect: "manual" });
    const ok = allowed.includes(response.status);
    console.log(`${ok ? "PASS" : "FAIL"} ${path} -> ${response.status}`);
    if (!ok) failed = true;
  } catch (error) {
    console.error(`FAIL ${path}: ${error instanceof Error ? error.message : String(error)}`);
    failed = true;
  }
}
if (failed) process.exit(1);
console.log("Deployment smoke test passed.");
