"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/content/site";
import { projects } from "@/content/projects";
import { coffeeNotes, notebookNotes, pcbNotes, workspaceNotes } from "@/content/microcopy";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { WorkspaceFallback } from "@/components/hero/WorkspaceFallback";
import { CursorHint, type CursorHintHandle } from "@/components/hero/CursorHint";
import { ArrowIcon } from "@/components/ui/ArrowIcon";
import { ExternalIcon } from "@/components/ui/ExternalIcon";

const WorkspaceCanvas = dynamic(() => import("@/three/WorkspaceCanvas").then((mod) => mod.WorkspaceCanvas), {
  ssr: false,
  loading: () => <WorkspaceFallback />,
});

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function HeroTransition() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const heroCopyRef = useRef<HTMLDivElement>(null);
  const floatCardRef = useRef<HTMLDivElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);
  const heroDecorRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const reducedMotion = useReducedMotion();
  const compact = useMediaQuery("(max-width: 820px)");
  const [sceneActive, setSceneActive] = useState(true);
  const featured = projects[0];
  const hintRef = useRef<CursorHintHandle>(null);
  const [coffeeStep, setCoffeeStep] = useState(-1);
  const [notebookStep, setNotebookStep] = useState(-1);
  const [pcbNote, setPcbNote] = useState<string | null>(null);
  const [activeNote, setActiveNote] = useState(0);

  // Rotate the workspace annotations so only one is ever on screen.
  useEffect(() => {
    if (reducedMotion || compact) return;
    const timer = window.setInterval(() => {
      setActiveNote((current) => (current + 1) % workspaceNotes.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [reducedMotion, compact]);

  const interactions = useMemo(
    () => ({
      onHint: (label: string | null) => {
        if (label) hintRef.current?.show(label);
        else hintRef.current?.hide();
      },
      onCoffeeClick: () => setCoffeeStep((step) => Math.min(step + 1, coffeeNotes.length - 1)),
      onLaptopOpen: () => window.dispatchEvent(new CustomEvent("workspace:open-terminal")),
      onNotebookTurn: () => setNotebookStep((step) => Math.min(step + 1, notebookNotes.length - 1)),
      onPcbPower: (on: boolean) => setPcbNote(on ? pcbNotes[1] : null),
    }),
    [],
  );

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setSceneActive(entry.isIntersecting), { rootMargin: "120px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useGSAP(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    const copy = heroCopyRef.current;
    const canvas = canvasWrapRef.current;
    const bento = bentoRef.current;
    const floatCard = floatCardRef.current;
    const decor = heroDecorRef.current;
    if (!section || !pin || !copy || !canvas || !bento || !floatCard) return;

    const compactNow = window.matchMedia("(max-width: 820px)").matches;
    if (reducedMotion || compact || compactNow) {
      gsap.set(copy, { autoAlpha: 1, y: 0 });
      gsap.set(canvas, { autoAlpha: 1, scale: 1 });
      gsap.set(floatCard, { autoAlpha: 1 });
      if (decor) gsap.set(decor, { autoAlpha: 1 });
      gsap.set(bento, { autoAlpha: 1, y: 0, pointerEvents: "auto" });
      progressRef.current = 0;
      return;
    }

    gsap.set(bento, { autoAlpha: 0, y: 48, pointerEvents: "none" });

    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=125%",
        scrub: 0.6,
        pin,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;
        },
      },
    });

    timeline
      .to(copy, { y: -52, autoAlpha: 0.12, duration: 0.32 }, 0.18)
      .to(floatCard, { y: 76, rotate: -3, autoAlpha: 0, duration: 0.32 }, 0.28)
      .to(canvas, { xPercent: -10, yPercent: -3, scale: 0.9, duration: 0.4 }, 0.27)
      .to(bento, { autoAlpha: 1, y: 0, duration: 0.34, pointerEvents: "auto" }, 0.52)
      .to(canvas, { autoAlpha: 0, scale: 0.84, duration: 0.24 }, 0.66)
      .to(copy, { autoAlpha: 0, duration: 0.12 }, 0.62);

    // The scroll cue, baseline and workspace annotations belong to the hero only.
    // Without this they hold full opacity through the handoff and bleed over the
    // section that follows.
    if (decor) timeline.to(decor, { autoAlpha: 0, duration: 0.14 }, 0.04);
    timeline.to(".workspace-notes", { autoAlpha: 0, duration: 0.18 }, 0.3);

    return () => timeline.scrollTrigger?.kill();
  }, { scope: sectionRef, dependencies: [reducedMotion, compact] });

  const tags = useMemo(() => ["Software", "AI", "Systems", "Hardware"], []);

  return (
    <section ref={sectionRef} id="home" className={`hero-transition-section ${reducedMotion || compact ? "hero-static" : ""}`} aria-label="Introduction and portfolio snapshot">
      <div ref={pinRef} className="hero-pin">
        <div className="hero-ambient" aria-hidden="true" />

        <div ref={heroCopyRef} className="hero-copy" data-hero-copy>
          <div className="eyebrow"><span>01</span><span>/</span><span>HELLO</span></div>
          <h1 className="hero-name">
            <span>{siteConfig.name.split(" ")[0]}</span>
            <span className="hero-name-last">{siteConfig.name.split(" ").slice(1).join(" ")}</span>
          </h1>
          <p className="hero-role">{siteConfig.role}</p>
          <p className="hero-lead">{siteConfig.heroLead}</p>
          <div className="hero-tags" aria-label="Areas of work">
            {tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
          <div className="hero-actions">
            <a className="button-primary magnetic-button" href="#work">View my work <ArrowIcon /></a>
            <a className="button-secondary" href={siteConfig.resumeUrl} target="_blank" rel="noreferrer">Resume <ExternalIcon /></a>
          </div>
          <button className="availability-pill" type="button" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}>
            <span className="availability-dot" aria-hidden="true" />
            {siteConfig.availability}
          </button>
        </div>

        <div ref={canvasWrapRef} className="workspace-canvas-wrap" aria-hidden="true">
          {sceneActive ? (
            <WorkspaceCanvas progressRef={progressRef} compact={compact} reducedMotion={reducedMotion} interactions={interactions} />
          ) : (
            <WorkspaceFallback />
          )}
        </div>

        {!compact && (
          <div className="workspace-notes" aria-hidden="true">
            {workspaceNotes.map((note, index) => (
              <span
                key={note.id}
                className="workspace-note"
                data-note={note.id}
                // Spec keeps at most one or two annotations on screen at a time.
                data-active={index === activeNote ? "true" : "false"}
              >
                {note.text}
              </span>
            ))}
            {coffeeStep >= 0 && <span className="workspace-note workspace-note-coffee" data-active="true">{coffeeNotes[coffeeStep]}</span>}
            {notebookStep >= 0 && <span className="workspace-note workspace-note-notebook" data-active="true">{notebookNotes[notebookStep]}</span>}
            {pcbNote && <span className="workspace-note workspace-note-pcb" data-active="true">{pcbNote}</span>}
          </div>
        )}

        <div ref={floatCardRef} className="hero-now-card">
          <span className="mini-label">NOW</span>
          <strong>{siteConfig.currentlyBuilding.title}</strong>
          <span>{siteConfig.currentlyBuilding.status}</span>
        </div>

        <div ref={bentoRef} className="hero-bento" aria-label="Portfolio snapshot">
          <article className="bento-card bento-featured">
            <div className="bento-copy">
              <span className="mini-label">FEATURED PROJECT</span>
              <h2>{featured.title}</h2>
              <p>{featured.summary}</p>
              <a href="#work">Explore project <ArrowIcon /></a>
            </div>
            <div className="bento-image">
              <Image src={featured.image} alt="Abstract preview of the featured project interface" fill sizes="(max-width: 820px) 90vw, 50vw" priority />
            </div>
          </article>

          <article className="bento-card bento-now">
            <span className="mini-label">CURRENTLY BUILDING</span>
            <h3>{siteConfig.currentlyBuilding.title}</h3>
            <p>{siteConfig.currentlyBuilding.description}</p>
            <span className="status-line"><i /> {siteConfig.currentlyBuilding.status}</span>
          </article>

          <article className="bento-card bento-about">
            <span className="mini-label">ABOUT</span>
            <h3>Engineer first. <em>Builder always.</em></h3>
            <p>{siteConfig.about}</p>
            <a href="#about">A little more about me <ArrowIcon /></a>
          </article>

          <article className="bento-card bento-experience">
            <span className="mini-label">EXPERIENCE</span>
            <h3>Work, teams &amp; things learned by building.</h3>
            <a href="#experience">View the timeline <ArrowIcon /></a>
          </article>

          <article className="bento-card bento-links">
            <span className="mini-label">QUICK LINKS</span>
            <div className="bento-link-stack">
              <a href={siteConfig.github} target="_blank" rel="noreferrer">GitHub <ExternalIcon /></a>
              <a href={siteConfig.linkedin} target="_blank" rel="noreferrer">LinkedIn <ExternalIcon /></a>
              <a href={siteConfig.resumeUrl} target="_blank" rel="noreferrer">Resume <ExternalIcon /></a>
            </div>
          </article>
        </div>

        <div ref={heroDecorRef} className="hero-decor" aria-hidden="true">
          <div className="hero-grid-line" />
          <div className="scroll-cue"><span>SCROLL</span><i /></div>
        </div>
        <CursorHint ref={hintRef} />
      </div>
    </section>
  );
}
