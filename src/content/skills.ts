import type { Skill } from "@/types/portfolio";

/**
 * Every skill links to the project slugs that actually demonstrate it. This is
 * the evidence model that replaces proficiency bars, so the rule is strict: if a
 * skill has no project behind it, it does not belong on the page. Tools used only
 * in a role live in that role's entry in `experience.ts` instead.
 */
export const skills: Skill[] = [
  { name: "TypeScript", category: "software", projectSlugs: ["cortex-lab", "sprintern"] },
  { name: "React", category: "software", projectSlugs: ["cortex-lab", "sprintern"] },
  { name: "Next.js", category: "software", projectSlugs: ["cortex-lab", "sprintern"] },
  { name: "Python", category: "software", projectSlugs: ["cortex-lab", "sprintern"] },
  { name: "WebGL", category: "software", projectSlugs: ["cortex-lab"] },
  { name: "Playwright", category: "software", projectSlugs: ["sprintern"] },

  { name: "GPU Inference", category: "ai", projectSlugs: ["cortex-lab"] },
  { name: "ML Pipelines", category: "ai", projectSlugs: ["cortex-lab"] },

  { name: "FastAPI", category: "systems", projectSlugs: ["cortex-lab", "sprintern"] },
  { name: "PostgreSQL", category: "systems", projectSlugs: ["cortex-lab", "sprintern"] },
  { name: "Redis", category: "systems", projectSlugs: ["cortex-lab", "sprintern"] },
  { name: "Celery", category: "systems", projectSlugs: ["cortex-lab"] },
  { name: "Distributed Jobs", category: "systems", projectSlugs: ["cortex-lab", "sprintern"] },
  { name: "AWS", category: "systems", projectSlugs: ["cortex-lab"] },
  { name: "Terraform", category: "systems", projectSlugs: ["cortex-lab"] },
  { name: "CI/CD", category: "systems", projectSlugs: ["cortex-lab"] },

  { name: "Embedded C", category: "hardware", projectSlugs: ["spatial-mapping"] },
  { name: "ARM Cortex-M4", category: "hardware", projectSlugs: ["spatial-mapping"] },
  { name: "I2C", category: "hardware", projectSlugs: ["spatial-mapping"] },
  { name: "UART", category: "hardware", projectSlugs: ["spatial-mapping"] },
  { name: "Stepper Control", category: "hardware", projectSlugs: ["spatial-mapping"] },
];
