import type { Experience } from "@/types/portfolio";

/**
 * Reverse-chronological timeline. Newest first; the order here is the order rendered.
 *
 * Only `organization`, `role`, `start` and `description` are required; `end`,
 * `highlights`, `technologies`, `logo` and `logoAlt` are optional and the
 * timeline degrades cleanly when they are missing.
 *
 * LOGOS: drop a square-ish file into `public/logos/` and set
 * `logo: "/logos/company.svg"`. Without one the entry shows an initials
 * monogram, so a missing logo never looks broken.
 */
export const experience: Experience[] = [
  {
    id: "tradexim",
    start: "Jun 2026",
    end: "Aug 2026",
    organization: "TradExim",
    role: "Technical Architect",
    // logo: "/logos/tradexim.svg",
    description:
      "Technical lead on a digital trade platform that tokenises capital equipment and settles cross-border B2B and B2G export transactions on a permissioned blockchain. Directed a two-engineer team and owned the architecture across contracts, backend and infrastructure.",
    highlights: [
      "Designed and deployed a five-node permissioned Hyperledger Besu network on GCP, and wrote eight Solidity contracts covering tokenisation, fractional investment, escrow settlement and pull-based revenue distribution.",
      "Built twelve Node.js Cloud Functions bridging Firestore and the chain in both directions, and fixed a deploy-time regression that had been silently reverting private VPC networking on every release.",
      "Audited the live deployment rather than the code and found half of the 'complete' backend had never actually shipped, closing the gap to a verified twelve of twelve.",
    ],
    technologies: ["Solidity", "Hyperledger Besu", "Node.js", "Terraform", "GCP", "Firebase"],
  },
  {
    id: "finavator",
    start: "May 2026",
    end: "Aug 2026",
    organization: "Finavator",
    role: "AI Engineer",
    // logo: "/logos/finavator.svg",
    description:
      "Built and deployed an AI operations platform for financial services, producing grounded meeting briefs, regulatory alerts and newsletters from an indexed corpus combined with live research. Toronto.",
    highlights: [
      "Built retrieval-augmented generation workflows that deduplicate evidence, preserve provenance and require citations, with validation that rejects unsupported source IDs rather than letting a claim through unbacked.",
      "Designed a human-in-the-loop draft lifecycle with immutable revisions, diff review and audited approval gates, so nothing exports without a reviewer explicitly applying it.",
      "Shipped streaming generation over server-sent events and verified the system with 540+ backend tests and 70 Playwright end-to-end tests across three viewports.",
    ],
    technologies: ["Python", "FastAPI", "Next.js", "TypeScript", "Pinecone", "PostgreSQL"],
  },
  {
    id: "maboko-cash",
    start: "Feb 2026",
    end: "May 2026",
    organization: "Maboko Cash",
    role: "Full-Stack Developer",
    // logo: "/logos/maboko-cash.svg",
    description:
      "Backend lead on a mobile-money wallet platform for the Democratic Republic of Congo, built for a market that transacts in Congolese Francs on feature phones as often as smartphones. Remote.",
    highlights: [
      "Architected a double-entry ledger where every transfer writes paired debit and credit entries inside one transaction, using pessimistic row locks acquired in deterministic order to eliminate deadlocks.",
      "Built a USSD channel for feature phones with a hashed idempotency key on a unique constraint, so a gateway retry replays a cached response instead of charging twice.",
      "Integrated M-Pesa, Airtel Money and Orange Money behind a single strategy interface, with HMAC-verified webhooks and a 52-endpoint admin portal logging before/after snapshots of every mutation.",
    ],
    technologies: ["TypeScript", "NestJS", "PostgreSQL", "TypeORM", "Socket.IO"],
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
