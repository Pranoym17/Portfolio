"use client";

import Image from "next/image";
import Link from "next/link";
import { flushSync } from "react-dom";
import { CSSProperties, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { projects } from "@/content/projects";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { ExternalIcon } from "@/components/ui/ExternalIcon";
import { ArchitectureDiagram } from "@/components/projects/ArchitectureDiagram";
import { useReducedMotion } from "@/hooks/useReducedMotion";

if (typeof window !== "undefined") gsap.registerPlugin(Flip);

export function SelectedWork() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [view, setView] = useState<Record<string, "product" | "xray">>({});
  const reducedMotion = useReducedMotion();

  useGSAP(() => {
    // Keeps GSAP context scoped to the project section and makes cleanup predictable.
  }, { scope: gridRef });

  const toggleProject = (slug: string) => {
    const grid = gridRef.current;
    if (!grid) return setExpanded((current) => current === slug ? null : slug);
    const state = reducedMotion ? null : Flip.getState(grid.querySelectorAll("[data-project-card]"));
    flushSync(() => setExpanded((current) => current === slug ? null : slug));
    if (state) {
      Flip.from(state, {
        duration: 0.68,
        ease: "power3.inOut",
        absolute: true,
        nested: true,
        prune: true,
      });
    }
  };

  return (
    <section id="work" className="page-section work-section">
      <SectionHeader index="03" label="SELECTED WORK">
        Things I&apos;ve actually <em>brought to life.</em>
      </SectionHeader>

      <div ref={gridRef} className="project-grid">
        {projects.map((project, index) => {
          const isExpanded = expanded === project.slug;
          const currentView = view[project.slug] ?? "product";
          return (
            <article
              key={project.slug}
              data-project-card
              data-expanded={isExpanded ? "true" : "false"}
              className="project-card"
              style={{ "--project-accent": project.accent } as CSSProperties}
            >
              <div className="project-card-topline">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{project.kicker}</span>
                {project.status && <span className="project-status">{project.status}</span>}
              </div>

              <div className="project-main-button">
                <div className="project-copy">
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <div className="tech-row">
                    {project.technologies.slice(0, 5).map((technology) => <span key={technology}>{technology}</span>)}
                  </div>
                </div>
                <div className="project-preview">
                  <Image
                    // The collapsed card is small, so it gets the tight crop; the
                    // full interface shot only reads once the card is open.
                    src={isExpanded && project.imageExpanded ? project.imageExpanded : project.image}
                    alt={`Visual preview for ${project.title}`}
                    fill
                    sizes="(max-width: 820px) 92vw, 46vw"
                    // The first card is the LCP element on compact viewports.
                    priority={index === 0}
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  <span className="project-open-label" aria-hidden="true">{isExpanded ? "Close" : "Open"} <ArrowIcon /></span>
                </div>
                <button
                  className="project-card-trigger"
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={`project-details-${project.slug}`}
                  aria-label={`${isExpanded ? "Close" : "Open"} ${project.title}`}
                  onClick={() => toggleProject(project.slug)}
                />
              </div>

              {isExpanded && (
                <div id={`project-details-${project.slug}`} className="project-expanded">
                  <div className="project-view-tabs" role="group" aria-label="Project view">
                    <button type="button" data-active={currentView === "product" ? "true" : "false"} aria-pressed={currentView === "product"} onClick={() => setView((current) => ({ ...current, [project.slug]: "product" }))}>Product</button>
                    <button type="button" data-active={currentView === "xray" ? "true" : "false"} aria-pressed={currentView === "xray"} onClick={() => setView((current) => ({ ...current, [project.slug]: "xray" }))}>X-Ray</button>
                  </div>

                  {currentView === "product" ? (
                    <div className="project-detail-grid">
                      <div className="project-detail-block"><span className="mini-label">THE PROBLEM</span><p>{project.problem}</p></div>
                      <div className="project-detail-block"><span className="mini-label">THE SOLUTION</span><p>{project.solution}</p></div>
                      <div className="project-detail-block"><span className="mini-label">MY ROLE</span><p>{project.role}</p></div>
                      <div className="project-detail-block"><span className="mini-label">OUTCOME</span><p>{project.outcome}</p></div>
                    </div>
                  ) : (
                    <ArchitectureDiagram nodes={project.architecture.nodes} edges={project.architecture.edges} />
                  )}

                  <div className="project-expanded-actions">
                    <Link className="button-primary" href={`/work/${project.slug}`}>View deep dive <ArrowIcon /></Link>
                    {project.github && <a className="button-secondary" href={project.github} target="_blank" rel="noreferrer">GitHub <ExternalIcon /></a>}
                    {project.demo && <a className="button-secondary" href={project.demo} target="_blank" rel="noreferrer">Live demo <ExternalIcon /></a>}
                    <button className="button-secondary" type="button" onClick={() => toggleProject(project.slug)}>Close project</button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
