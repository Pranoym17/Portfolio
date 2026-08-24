import Image from "next/image";
import { experience } from "@/content/experience";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/ui/Reveal";

/** Fallback mark for entries with no logo yet — first letters of the first two words. */
function monogram(organization: string) {
  return organization
    .split(/[\s/]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function ExperienceTimeline() {
  return (
    <section id="experience" className="page-section experience-section">
      <SectionHeader index="02" label="EXPERIENCE">
        Learning by <em>building.</em>
      </SectionHeader>
      <div className="experience-layout">
        <div className="experience-note" aria-hidden="true">
          <span>notes / timeline</span>
          <svg viewBox="0 0 220 180" fill="none">
            <path d="M12 148C44 86 64 116 92 70C118 29 150 68 205 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 8" />
            <path d="M168 24L205 23L191 55" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p>Keep the story short enough to scan, detailed enough to ask about.</p>
        </div>
        <ol className="experience-list">
          {experience.map((item, index) => (
            <li key={item.id}>
              <Reveal className="experience-item">
                <div className="experience-year">
                  <span>{item.start}</span>
                  {item.end && <small>— {item.end}</small>}
                </div>
                <div className="experience-dot" aria-hidden="true"><i /></div>
                <div className="experience-content">
                  <div className="experience-org">
                    {item.logo ? (
                      <Image
                        className="experience-logo"
                        src={item.logo}
                        alt={item.logoAlt ?? item.organization}
                        width={40}
                        height={40}
                      />
                    ) : (
                      <span className="experience-monogram" aria-hidden="true">{monogram(item.organization)}</span>
                    )}
                    <span className="mini-label">{item.organization}</span>
                  </div>
                  <h3>{item.role}</h3>
                  <p>{item.description}</p>
                  {item.highlights.length > 0 && (
                    <ul>
                      {item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                    </ul>
                  )}
                  {item.technologies && <div className="tech-row">{item.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>}
                </div>
                <span className="experience-index" aria-hidden="true">0{index + 1}</span>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
