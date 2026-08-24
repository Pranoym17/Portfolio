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
    currentlyLearning: "Replace this with what you are genuinely learning right now.",
    interestedIn: "AI systems · software · product · hardware",
    outsideCode: "Replace this with something real about you away from a keyboard.",
  },
  currentlyBuilding: {
    title: "Shared AI Memory Layer",
    description:
      "A persistent memory layer designed to let AI tools share useful context across a workflow.",
    status: "In progress",
    updated: "Update this line with your latest milestone",
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
