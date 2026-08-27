import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/content/projects";
import { ArchitectureDiagram } from "@/components/projects/ArchitectureDiagram";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { ExternalIcon } from "@/components/ui/ExternalIcon";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [{ url: project.image }],
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <main className="case-study-page">
      <div className="case-study-nav">
        <Link href="/#work">← Selected work</Link>
        <span>{project.kicker}</span>
      </div>

      <header className="case-study-hero">
        <div>
          <span className="mini-label">CASE STUDY</span>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
          <div className="tech-row">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
        </div>
        <div className="case-study-image">
          <Image src={project.imageExpanded ?? project.image} alt={`Preview of ${project.title}`} fill priority sizes="(max-width: 820px) 94vw, 48vw" />
        </div>
      </header>

      <section className="case-study-chapter chapter-split">
        <div><span className="mini-label">01 / THE CHALLENGE</span><h2>What needed to change.</h2></div>
        <p>{project.problem}</p>
      </section>

      <section className="case-study-chapter chapter-split">
        <div><span className="mini-label">02 / THE IDEA</span><h2>The system I chose to build.</h2></div>
        <div><p>{project.solution}</p><p className="case-role"><strong>My role:</strong> {project.role}</p></div>
      </section>

      <section className="case-study-chapter">
        <div className="chapter-heading"><span className="mini-label">03 / ARCHITECTURE</span><h2>Under the surface.</h2></div>
        <ArchitectureDiagram nodes={project.architecture.nodes} edges={project.architecture.edges} />
      </section>

      <section className="case-study-chapter chapter-split">
        <div><span className="mini-label">04 / WHAT GOT HARD</span><h2>The interesting parts rarely stay simple.</h2></div>
        <ul className="challenge-list">{project.challenges.map((challenge) => <li key={challenge}>{challenge}</li>)}</ul>
      </section>

      <section className="case-study-chapter chapter-split">
        <div><span className="mini-label">05 / RESULT</span><h2>What came out the other side.</h2></div>
        <p>{project.outcome}</p>
      </section>

      {project.whatWentWrong && (
        <section className="case-study-chapter chapter-split">
          <div><span className="mini-label">06 / WHAT WENT WRONG</span><h2>The part I would rather skip.</h2></div>
          <p>{project.whatWentWrong}</p>
        </section>
      )}

      <section className="case-study-chapter chapter-split">
        <div><span className="mini-label">{project.whatWentWrong ? "07" : "06"} / NEXT</span><h2>What I would improve next.</h2></div>
        <ul className="challenge-list">{project.nextSteps.map((step) => <li key={step}>{step}</li>)}</ul>
      </section>

      <div className="case-study-actions">
        {project.github && <a className="button-secondary" href={project.github} target="_blank" rel="noreferrer">GitHub <ExternalIcon /></a>}
        {project.demo && <a className="button-secondary" href={project.demo} target="_blank" rel="noreferrer">Live demo <ExternalIcon /></a>}
      </div>

      <Link className="next-project" href={`/work/${nextProject.slug}`}>
        <span className="mini-label">NEXT PROJECT</span>
        <strong>{nextProject.title}</strong>
        <ArrowIcon />
      </Link>
    </main>
  );
}
