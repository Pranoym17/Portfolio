import { experience } from "@/content/experience";
import { hasPlaceholder } from "@/content/placeholders";
import { projects } from "@/content/projects";

export const siteConfig = {
  name: "Pranoy Mukherjee",
  shortName: "PM",
  role: "Computer Engineering",
  location: "Toronto, Canada",
  availability: "Open to opportunities",
  heroLead:
    "I build systems that run in production, from GPU inference on AWS to a payments ledger that works on feature phones.",
  about:
    "Third-year Computer Engineering student at McMaster. Most of what I build ends up deployed and used: a cloud research platform, an internship alert service with real users, an embedded scanner that maps rooms. I like owning the whole path, from the architecture call to the thing someone opens in a browser.",
  email: "pranoym101@gmail.com",
  github: "https://github.com/Pranoym17",
  linkedin: "https://www.linkedin.com/in/pranoy-mukherjee/",
  resumeUrl: "/resume/Pranoy-Mukherjee-Resume.pdf",
  url: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000",
  /** PERSONALIZE: the three small cards beside the About copy. */
  personal: {
    currentlyLearning: "Hand-writing CUDA kernels for Glassbox, mostly learning where the memory bandwidth actually goes.",
    interestedIn: "AI systems · software · product · hardware",
    outsideCode: "Out walking the city, or attempting a recipe well past my skill level.",
  },
  currentlyBuilding: {
    title: "Glassbox",
    description:
      "A deep learning engine in Rust with hand-written CUDA kernels: a tensor library, tape-based autograd, and a live visualizer that animates the forward and backward passes while a GPT-style model trains.",
    status: "In progress",
    updated: "Training a GPT-style model end to end on a local GPU, with every step streaming to the graph view.",
  },
} as const;

/**
 * Prevent accidental search indexing while template placeholders remain.
 *
 * This scans the actual content modules rather than three fixed fields: contact
 * details land long before the real projects and experience do, so checking only
 * email/GitHub/LinkedIn would open indexing on a site that is still mostly filler.
 */
export const isTemplateSite =
  siteConfig.url.includes("localhost") ||
  hasPlaceholder(siteConfig) ||
  hasPlaceholder(experience) ||
  hasPlaceholder(projects);
