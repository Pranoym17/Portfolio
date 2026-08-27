import type { Project } from "@/types/portfolio";

export const projects: Project[] = [
  {
    slug: "cortex-lab",
    title: "Cortex Lab",
    category: "ai",
    kicker: "AI / Cloud Systems",
    summary: "A browser workspace for designing multimodal experiments and predicting cortical response.",
    description:
      "A cloud-deployed neuroscience research platform. Researchers build a timed experiment out of text, image, audio, microphone and video blocks, submit it for GPU inference, watch progress stream back live, and inspect the predicted activation on an interactive 3D cortical surface. Experiments are private until explicitly published, after which they can be browsed, forked or embedded. Outputs are simulated average-subject predictions, meant for research exploration rather than diagnosis.",
    featured: true,
    technologies: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL", "Celery", "AWS", "Terraform", "WebGL"],
    role: "Solo. Architecture and every layer of it: frontend, API, asynchronous inference pipeline, cloud infrastructure and CI/CD.",
    problem:
      "Experiment design, model inference and result visualisation for this kind of work normally live in separate tools and local scripts. That makes a study awkward to reproduce and close to impossible to hand to someone else.",
    solution:
      "One workspace that covers the whole loop. A timeline builder handles five stimulus modalities, a durable job pipeline dispatches GPU inference without blocking the API, progress and activation chunks stream back over server-sent events, and a WebGL viewer plays the result over a 20,484-vertex cortical surface. Analysis tools sit on top: a versioned cognitive-state classifier, representational similarity analysis with JSON and CSV export, and a cancellable stimulus optimizer that can promote a winning candidate into a new experiment.",
    outcome:
      "Deployed at cortex-lab.uk on Terraform-managed AWS infrastructure, with 245 backend tests passing and 3 integration tests skipped.",
    image: "/projects/cortex-lab.webp",
    accent: "#ff4b2b",
    status: "Live",
    github: "https://github.com/Pranoym17/in-silico-Cortex-Lab",
    demo: "https://cortex-lab.uk/",
    architecture: {
      nodes: [
        { id: "client", label: "Next.js Client", type: "client", x: 10, y: 50 },
        { id: "api", label: "FastAPI on ECS", type: "api", x: 33, y: 50 },
        { id: "queue", label: "SQS + Celery", type: "service", x: 57, y: 24 },
        { id: "gpu", label: "Modal GPU", type: "ai", x: 84, y: 24 },
        { id: "store", label: "RDS + S3", type: "database", x: 57, y: 76 },
        { id: "redis", label: "Redis / SSE", type: "service", x: 84, y: 76 },
      ],
      edges: [
        { from: "client", to: "api" },
        { from: "api", to: "queue", label: "job" },
        { from: "queue", to: "gpu", label: "inference" },
        { from: "api", to: "store" },
        { from: "gpu", to: "store", label: "artifacts" },
        { from: "queue", to: "redis", label: "progress" },
      ],
    },
    challenges: [
      "Inference runs for minutes on GPU hardware, so the whole path had to be asynchronous and resumable rather than a request that blocks.",
      "Streaming activation chunks to the browser while a job is still running, without holding a connection open on the API itself.",
      "Keeping private experiments, uploads and result artifacts from ever surfacing through the public library routes.",
    ],
    nextSteps: [
      "Push the cognitive-state classifier past its current fourteen-state artifact.",
      "Add richer comparison tooling across published experiments.",
    ],
  },
  {
    slug: "sprintern",
    title: "Sprintern",
    category: "software",
    kicker: "Software / Product",
    summary: "Internship postings from nine sources, deduplicated into one feed with real-time alerts.",
    description:
      "An internship discovery platform with real users. It polls community-maintained job repositories, normalises and deduplicates what it finds, matches postings against each user's filters, and delivers them as instant Telegram alerts or a curated daily email digest. Users track applications from saved through to offer, and administrators can add, preview or disable a source without touching application code.",
    featured: true,
    technologies: ["Next.js", "TypeScript", "FastAPI", "Python", "PostgreSQL", "Redis", "Supabase", "Playwright"],
    role: "Solo. Ingestion pipeline, REST API, background workers, database security model and frontend.",
    problem:
      "Internship postings are scattered across community-maintained repositories that each use a different table format, and the same role frequently appears in several of them at once.",
    solution:
      "An ingestion pipeline that polls each source with conditional requests, tolerates schema drift, and merges duplicates on a canonical fingerprint. Matching runs against user-defined filters and fans out to Telegram and email through a Postgres-backed job queue with idempotency keys and leased claims. Row-level security in the database sits behind the API's own ownership checks, so a mistake in one layer still cannot expose another user's data.",
    outcome:
      "In production at sprintern.ca with real users, aggregating nine sources into a single feed of 1,000+ live postings.",
    image: "/projects/sprintern.webp",
    accent: "#ff7358",
    status: "Live",
    github: "https://github.com/Pranoym17/Sprintern",
    demo: "https://sprintern.ca/",
    architecture: {
      nodes: [
        { id: "sources", label: "GitHub Sources", type: "service", x: 9, y: 28 },
        { id: "ingest", label: "Ingest + Dedupe", type: "service", x: 33, y: 28 },
        { id: "db", label: "Postgres + RLS", type: "database", x: 50, y: 62 },
        { id: "api", label: "FastAPI", type: "api", x: 72, y: 28 },
        { id: "notify", label: "Telegram + Email", type: "service", x: 72, y: 80 },
        { id: "app", label: "Next.js App", type: "client", x: 90, y: 54 },
      ],
      edges: [
        { from: "sources", to: "ingest", label: "poll" },
        { from: "ingest", to: "db" },
        { from: "db", to: "api" },
        { from: "api", to: "app" },
        { from: "db", to: "notify", label: "matches" },
      ],
    },
    challenges: [
      "The same posting shows up across several repositories, so deduplication had to merge on company, title, location and term without collapsing two genuinely different roles at one employer.",
      "Upstream repositories change their table format without warning, so every row is validated and rejects are surfaced for review rather than failing quietly.",
      "Alerts must never double-send, which pushed the queue toward idempotency keys, leased claims and exponential backoff.",
    ],
    nextSteps: [
      "Expand ingestion beyond GitHub-hosted sources.",
      "Surface application deadlines more prominently in the daily digest.",
    ],
  },
  {
    slug: "spatial-mapping",
    title: "Spatial Mapping System",
    category: "hardware",
    kicker: "Hardware / Embedded",
    summary: "A rotating time-of-flight scanner that reconstructs indoor spaces as 3D point clouds.",
    description:
      "A standalone embedded LIDAR-style scanner. A VL53L1X time-of-flight sensor is rotated through 360° by a stepper motor to capture one planar distance scan; moving the rig along the perpendicular axis and scanning again builds a full 3D point cloud of a hallway or room. Everything runs bare-metal in C on a TI TM4C123 (ARM Cortex-M4), with I2C to the sensor, UART to the host, and a button-driven state machine covering start/stop, rotation direction, angular step and homing.",
    featured: false,
    technologies: ["Embedded C", "ARM Cortex-M4", "I2C", "UART", "Stepper Control", "Python"],
    role: "Solo. Firmware, hardware bring-up, serial protocol design and PC-side reconstruction.",
    problem:
      "Commercial LIDAR is expensive. The exercise was to reach a usable indoor 3D scan using a single low-cost time-of-flight sensor, a stepper motor and a microcontroller.",
    solution:
      "A finite state machine drives the sensor and motor from four debounced buttons, with four status LEDs reporting measurement and transmission state. Distance samples are buffered on-chip, then streamed to a host over UART where polar samples are converted to Cartesian coordinates and rendered as a point cloud.",
    outcome:
      "Scanned an assigned campus location and reconstructed it as a 3D model that matched the real space. Angular resolution is switchable between 11.25° and 45° per step.",
    image: "/projects/spatial-mapping.webp",
    accent: "#e9442b",
    architecture: {
      nodes: [
        { id: "tof", label: "VL53L1X ToF", type: "hardware", x: 12, y: 30 },
        { id: "motor", label: "Stepper Motor", type: "hardware", x: 12, y: 72 },
        { id: "mcu", label: "TM4C123 MCU", type: "hardware", x: 42, y: 51 },
        { id: "link", label: "UART Link", type: "service", x: 66, y: 51 },
        { id: "host", label: "PC Reconstruction", type: "client", x: 88, y: 51 },
      ],
      edges: [
        { from: "tof", to: "mcu", label: "I2C" },
        { from: "mcu", to: "motor", label: "step / dir" },
        { from: "mcu", to: "link" },
        { from: "link", to: "host", label: "samples" },
      ],
    },
    challenges: [
      "The I2C bus speed was fixed by assignment, so the driver had to be parameterised and its timing verified on a mixed-signal oscilloscope rather than assumed from the datasheet.",
      "Converting polar samples to Cartesian coordinates on a microcontroller without hardware floating point meant watching for precision loss.",
      "Finding the real throughput bottleneck across sensor sampling, on-chip buffering and serial transmission.",
    ],
    nextSteps: [
      "Automate the linear displacement axis so a full 3D scan needs no manual repositioning.",
      "Stream scans continuously instead of buffering and then transmitting.",
    ],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
