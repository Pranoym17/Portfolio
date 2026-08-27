export type ProjectCategory = "software" | "ai" | "systems" | "hardware";

export type ArchitectureNodeType =
  | "client"
  | "api"
  | "database"
  | "ai"
  | "hardware"
  | "service";

export interface ArchitectureNode {
  id: string;
  label: string;
  type: ArchitectureNodeType;
  x: number;
  y: number;
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  label?: string;
}

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  kicker: string;
  summary: string;
  description: string;
  featured: boolean;
  technologies: string[];
  role: string;
  problem: string;
  solution: string;
  outcome?: string;
  image: string;
  /**
   * Optional larger view, used once the card is open and on the deep-dive page.
   * A tight crop reads best in the small collapsed card, while a full interface
   * shot only becomes legible at the larger size. Falls back to `image`.
   */
  imageExpanded?: string;
  accent: string;
  status?: string;
  github?: string;
  demo?: string;
  architecture: {
    nodes: ArchitectureNode[];
    edges: ArchitectureEdge[];
  };
  challenges: string[];
  nextSteps: string[];
  /**
   * One honest paragraph about what went wrong. Optional because a fabricated
   * failure is worse than none — fill it only where you have a real answer.
   */
  whatWentWrong?: string;
}

export interface Experience {
  id: string;
  start: string;
  end?: string;
  organization: string;
  role: string;
  description: string;
  highlights: string[];
  technologies?: string[];
  /**
   * Optional organization logo, e.g. "/logos/mcmaster.svg". Square-ish artwork
   * reads best. When absent the timeline falls back to an initials monogram, so
   * an entry never looks unfinished for want of a logo.
   */
  logo?: string;
  /** Alt text for `logo`. Defaults to the organization name. */
  logoAlt?: string;
}

export interface Skill {
  name: string;
  category: "software" | "ai" | "systems" | "hardware";
  projectSlugs: string[];
}
