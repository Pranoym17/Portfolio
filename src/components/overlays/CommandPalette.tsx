"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { projects } from "@/content/projects";
import { siteConfig } from "@/content/site";

interface CommandItem {
  label: string;
  keywords: string;
  action: () => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  onTerminal,
  onRestoreFocus,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTerminal: () => void;
  onRestoreFocus?: () => boolean;
}) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const items = useMemo<CommandItem[]>(() => {
    const navigateTo = (id: string) => {
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      else router.push(`/#${id}`);
    };

    const base: CommandItem[] = [
      { label: "View selected work", keywords: "projects work portfolio", action: () => navigateTo("work") },
      { label: "Experience", keywords: "experience jobs internship timeline", action: () => navigateTo("experience") },
      { label: "Skills", keywords: "skills technology stack", action: () => navigateTo("skills") },
      { label: "About", keywords: "about background computer engineering", action: () => navigateTo("about") },
      { label: "Contact", keywords: "email contact linkedin", action: () => navigateTo("contact") },
      { label: "Open resume", keywords: "cv resume pdf", action: () => window.open(siteConfig.resumeUrl, "_blank", "noopener,noreferrer") },
      { label: "Open GitHub", keywords: "github code repos", action: () => window.open(siteConfig.github, "_blank", "noopener,noreferrer") },
      { label: "Open terminal", keywords: "terminal command secret", action: onTerminal },
    ];
    for (const project of projects) {
      base.push({
        label: `Project: ${project.title}`,
        keywords: `${project.title} ${project.category} ${project.technologies.join(" ")}`,
        action: () => router.push(`/work/${project.slug}`),
      });
    }
    return base;
  }, [onTerminal, router]);

  const filtered = items.filter((item) => `${item.label} ${item.keywords}`.toLowerCase().includes(query.toLowerCase().trim()));

  const run = (action: () => void) => {
    onOpenChange(false);
    setQuery("");
    window.setTimeout(action, 60);
  };

  return (
    <Dialog.Root open={open} onOpenChange={(value) => { onOpenChange(value); if (!value) setQuery(""); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content
          className="command-dialog"
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => {
            if (onRestoreFocus?.()) event.preventDefault();
          }}
        >
          <Dialog.Title className="sr-only">Command palette</Dialog.Title>
          <div className="command-search-row">
            <span aria-hidden="true">⌕</span>
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="What are you looking for?"
              aria-label="Search portfolio commands"
            />
            <kbd>ESC</kbd>
          </div>
          <div className="command-results" aria-label="Commands">
            {filtered.slice(0, 8).map((item) => (
              <button key={item.label} type="button" onClick={() => run(item.action)}>
                <span>{item.label}</span><span aria-hidden="true">↵</span>
              </button>
            ))}
            {filtered.length === 0 && <p className="command-empty">No match. Try “Python”, “resume” or “hardware”.</p>}
          </div>
          <div className="command-footer"><span>Tip: press <kbd>~</kbd> for the hidden terminal.</span></div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
