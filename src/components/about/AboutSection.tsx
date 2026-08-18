"use client";

import Image from "next/image";
import { useState } from "react";
import { siteConfig } from "@/content/site";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function AboutSection() {
  const [noteMoved, setNoteMoved] = useState(false);
  const [pcbOn, setPcbOn] = useState(false);
  const [coffeeClicks, setCoffeeClicks] = useState(0);

  return (
    <section id="about" className="page-section about-section">
      <SectionHeader index="05" label="ABOUT">
        Curious about how things <em>work.</em>
      </SectionHeader>
      <div className="about-grid">
        <div className="about-copy-card">
          <p className="about-lead">{siteConfig.about}</p>
          <p>
            The goal of this portfolio is the same as the goal of the work inside it: make the complex part feel considered, and make the part people use feel simple.
          </p>
          <div className="about-mini-grid">
            <div><span className="mini-label">CURRENTLY LEARNING</span><strong>{siteConfig.personal.currentlyLearning}</strong></div>
            <div><span className="mini-label">INTERESTED IN</span><strong>{siteConfig.personal.interestedIn}</strong></div>
            <div><span className="mini-label">OUTSIDE CODE</span><strong>{siteConfig.personal.outsideCode}</strong></div>
          </div>
        </div>

        <div className="about-portrait-card">
          <Image src="/portrait/portrait-fallback.webp" alt={`Point-cloud portrait of ${siteConfig.name}`} fill sizes="(max-width: 820px) 92vw, 36vw" />
          <span className="portrait-file-label">portrait.scan</span>
        </div>

        <div className="playful-objects" aria-label="Small interactive details">
          <button
            type="button"
            className="desk-note"
            data-moved={noteMoved ? "true" : "false"}
            aria-pressed={noteMoved}
            onClick={() => setNoteMoved((value) => !value)}
            aria-label="Move the sticky note"
          >
            <span>tiny reminder</span>
            <strong>Ship the thing.</strong>
          </button>
          <div className="hidden-under-note" aria-hidden={!noteMoved}>You found the unnecessary detail. Good.</div>

          <button type="button" className="mini-pcb" data-on={pcbOn ? "true" : "false"} aria-pressed={pcbOn} onClick={() => setPcbOn((value) => !value)} aria-label="Toggle the circuit board LED">
            <span className="pcb-chip" /><span className="pcb-trace" /><span className="pcb-led" />
          </button>

          <button
            type="button"
            className="coffee-button"
            onClick={() => setCoffeeClicks((value) => value + 1)}
            aria-label="Click the coffee cup"
          >
            <span className="coffee-cup" aria-hidden="true"><i /></span>
            <span className="coffee-copy">{coffeeClicks < 2 ? "debugging fuel" : coffeeClicks < 5 ? "still debugging" : "okay, that's enough caffeine"}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
