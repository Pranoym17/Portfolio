"use client";

import * as Tooltip from "@radix-ui/react-tooltip";
import { skills } from "@/content/skills";
import { projects } from "@/content/projects";
import { SectionHeader } from "@/components/ui/SectionHeader";

const categories = [
  { id: "software", label: "Software" },
  { id: "ai", label: "AI / Data" },
  { id: "systems", label: "Systems" },
  { id: "hardware", label: "Hardware" },
] as const;

export function SkillsGrid() {
  return (
    <section id="skills" className="page-section skills-section">
      <SectionHeader index="04" label="SKILLS">
        Tools are useful. <em>Proof is better.</em>
      </SectionHeader>
      <Tooltip.Provider delayDuration={160}>
        <div className="skills-grid">
          {categories.map((category) => {
            const categorySkills = skills.filter((skill) => skill.category === category.id);
            return (
              <article key={category.id} className="skill-category">
                <div className="skill-category-head">
                  <span className="mini-label">{category.label}</span>
                </div>
                <div className="skill-list">
                  {categorySkills.map((skill) => {
                    const usedIn = skill.projectSlugs.map((slug) => projects.find((project) => project.slug === slug)).filter(Boolean);
                    return (
                      <Tooltip.Root key={skill.name}>
                        <Tooltip.Trigger asChild>
                          <button type="button" className="skill-chip">{skill.name}<span aria-hidden="true">↗</span></button>
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content className="skill-tooltip" sideOffset={10}>
                            <strong>{skill.name}</strong>
                            <span>Used in</span>
                            <ul>{usedIn.map((project) => <li key={project!.slug}>{project!.title}</li>)}</ul>
                            <Tooltip.Arrow className="tooltip-arrow" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </Tooltip.Provider>
    </section>
  );
}
