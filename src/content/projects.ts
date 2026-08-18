import type { Project } from "@/types/portfolio";

export const projects: Project[] = [
  {
    slug: "shared-ai-memory",
    title: "Shared AI Memory Layer",
    category: "ai",
    kicker: "AI / Systems",
    summary: "Persistent context that can move with you across AI tools.",
    description:
      "A production-minded memory layer concept for storing, retrieving and sharing useful context across assistants, coding tools and agent workflows.",
    featured: true,
    technologies: ["TypeScript", "Python", "Vector Search", "PostgreSQL", "Agents"],
    role: "Architecture, product design and implementation",
    problem:
      "AI tools are often isolated from one another. Context gets recreated repeatedly, and useful decisions disappear between sessions and products.",
    solution:
      "Design a shared memory service with scoped retrieval, durable state, structured events and user-controlled access boundaries.",
    outcome:
      "Currently being developed. Replace this line with the strongest concrete outcome once the project is shipped.",
    image: "/projects/shared-ai-memory.webp",
    accent: "#ff4b2b",
    status: "Currently building",
    github: "https://github.com/yourusername",
    architecture: {
      nodes: [
        { id: "clients", label: "AI Clients", type: "client", x: 14, y: 48 },
        { id: "api", label: "Memory API", type: "api", x: 40, y: 48 },
        { id: "policy", label: "Policy Layer", type: "service", x: 64, y: 28 },
        { id: "vector", label: "Vector Index", type: "ai", x: 64, y: 68 },
        { id: "db", label: "Durable Store", type: "database", x: 88, y: 48 },
      ],
      edges: [
        { from: "clients", to: "api" },
        { from: "api", to: "policy" },
        { from: "api", to: "vector" },
        { from: "policy", to: "db" },
        { from: "vector", to: "db" },
      ],
    },
    challenges: [
      "Keeping memory useful without making retrieval noisy.",
      "Designing access boundaries that remain understandable to users.",
      "Balancing structured state with semantic retrieval.",
    ],
    nextSteps: [
      "Add your real deployment architecture.",
      "Replace sample copy with measured results.",
      "Link the live demo and repository once public.",
    ],
  },
  {
    slug: "realtime-systems-dashboard",
    title: "Realtime Systems Dashboard",
    category: "software",
    kicker: "Software / Product",
    summary: "A dense operational interface made fast, calm and easy to scan.",
    description:
      "A sample portfolio case study showing how to present a software product with live state, clear information hierarchy and resilient frontend behavior. Replace it with one of your strongest projects.",
    featured: true,
    technologies: ["React", "TypeScript", "Next.js", "WebSockets", "PostgreSQL"],
    role: "Frontend architecture and product engineering",
    problem:
      "Operational tools can become visually noisy as data density rises, making the most important state harder to understand quickly.",
    solution:
      "Build a component system that prioritizes status, exceptions and fast drill-down while keeping live updates predictable.",
    outcome:
      "Sample outcome text - replace with a real result, user impact, benchmark or deployment detail.",
    image: "/projects/realtime-dashboard.webp",
    accent: "#ff7358",
    github: "https://github.com/yourusername",
    architecture: {
      nodes: [
        { id: "browser", label: "Browser", type: "client", x: 12, y: 50 },
        { id: "next", label: "Next.js", type: "service", x: 36, y: 50 },
        { id: "api", label: "Realtime API", type: "api", x: 62, y: 28 },
        { id: "events", label: "Event Stream", type: "service", x: 62, y: 72 },
        { id: "db", label: "PostgreSQL", type: "database", x: 88, y: 50 },
      ],
      edges: [
        { from: "browser", to: "next" },
        { from: "next", to: "api" },
        { from: "next", to: "events" },
        { from: "api", to: "db" },
        { from: "events", to: "db" },
      ],
    },
    challenges: [
      "Keeping high-frequency UI updates from triggering unnecessary rendering.",
      "Designing empty, loading, degraded and error states intentionally.",
      "Maintaining a clear visual hierarchy under dense data.",
    ],
    nextSteps: [
      "Replace this sample with your real project.",
      "Add product screenshots and concrete results.",
      "Add one technical tradeoff you can discuss in an interview.",
    ],
  },
  {
    slug: "edge-vision-controller",
    title: "Edge Vision Controller",
    category: "hardware",
    kicker: "Hardware / Embedded",
    summary: "A hardware-software system where sensing, compute and interface meet.",
    description:
      "A sample mixed hardware/software case study that demonstrates how the portfolio can present embedded or computer-engineering work without reducing it to a flat list of parts.",
    featured: true,
    technologies: ["C++", "Python", "Embedded Linux", "Computer Vision", "Serial I/O"],
    role: "System design, embedded integration and interface development",
    problem:
      "Embedded projects are difficult to explain quickly because the interesting work spans hardware, firmware, data flow and application behavior.",
    solution:
      "Present the system as one coherent pipeline from sensor input through edge processing to operator feedback.",
    outcome:
      "Sample outcome text - replace with measured latency, accuracy, reliability or demo results.",
    image: "/projects/edge-vision.webp",
    accent: "#e9442b",
    github: "https://github.com/yourusername",
    architecture: {
      nodes: [
        { id: "sensor", label: "Sensor", type: "hardware", x: 12, y: 50 },
        { id: "edge", label: "Edge Compute", type: "hardware", x: 38, y: 50 },
        { id: "vision", label: "Vision Pipeline", type: "ai", x: 64, y: 30 },
        { id: "control", label: "Control Loop", type: "service", x: 64, y: 70 },
        { id: "ui", label: "Operator UI", type: "client", x: 88, y: 50 },
      ],
      edges: [
        { from: "sensor", to: "edge" },
        { from: "edge", to: "vision" },
        { from: "edge", to: "control" },
        { from: "vision", to: "ui" },
        { from: "control", to: "ui" },
      ],
    },
    challenges: [
      "Coordinating timing across hardware and application boundaries.",
      "Making system state observable during debugging.",
      "Explaining technical depth visually to non-specialist viewers.",
    ],
    nextSteps: [
      "Replace this sample with your real hardware project.",
      "Add a system photo or board render.",
      "Add measured performance or reliability results.",
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
