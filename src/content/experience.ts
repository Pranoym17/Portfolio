import type { Experience } from "@/types/portfolio";

/**
 * Reverse-chronological timeline. Newest first — the order here is the order rendered.
 *
 * TO ADD A REAL ROLE: overwrite one of the placeholder slots below. Only
 * `organization`, `role`, `start` and `description` are required; `end`,
 * `highlights`, `technologies`, `logo` and `logoAlt` are all optional and the
 * timeline degrades cleanly when they are missing.
 *
 * LOGOS: drop a square-ish file into `public/logos/` and set
 * `logo: "/logos/company.svg"`. Without one the entry shows an initials
 * monogram, so a missing logo never looks broken.
 *
 * The strings marked REPLACE keep `npm run prelaunch` blocking and search
 * indexing off until real content lands. That is deliberate — do not soften
 * them just to make the audit pass.
 */
export const experience: Experience[] = [
  {
    id: "role-current",
    start: "2026",
    end: "Now",
    organization: "Your current role / project",
    role: "Computer Engineering Student",
    // logo: "/logos/your-org.svg",
    description:
      "Replace this entry with your most relevant current role, internship, research position, team or sustained project.",
    highlights: [
      "Lead with the work you personally owned.",
      "Add one technically specific contribution.",
      "Add one outcome, lesson or impact point.",
    ],
    technologies: ["TypeScript", "Python"],
  },
  {
    id: "role-previous",
    start: "2025",
    organization: "Previous experience",
    role: "Engineering / Software Experience",
    // logo: "/logos/your-org.svg",
    description:
      "Replace this slot with an internship, design team, research role, hackathon leadership or substantial independent build.",
    highlights: [
      "Keep entries concise enough to scan.",
      "Use project links where the experience produced something visible.",
    ],
  },
  {
    id: "education",
    start: "2024",
    end: "2028",
    organization: "McMaster University",
    role: "Computer Engineering",
    // logo: "/logos/mcmaster.svg",
    description:
      "Third-year Computer Engineering student, expected to graduate in April 2028.",
    highlights: [],
  },
];
