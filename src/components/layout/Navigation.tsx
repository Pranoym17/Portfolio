"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/content/site";
import { ExternalIcon } from "@/components/ui/ExternalIcon";

// The `id` values are the section anchors and are referenced by the command
// palette, the terminal and the hero CTA — only the labels and their order are
// presentation. Experience leads because it is the entry recruiters scan first.
const items = [
  { id: "experience", label: "Experience" },
  { id: "work", label: "Projects" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

export function Navigation({ onCommand }: { onCommand: (invoker?: HTMLElement | null) => void }) {
  const [active, setActive] = useState("home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const onHome = pathname === "/";

  useEffect(() => {
    const nodes = ["home", ...items.map((item) => item.id)]
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0, 0.1, 0.3, 0.6] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const closeAndGo = (id: string) => {
    setMobileOpen(false);
    window.setTimeout(() => {
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      else router.push(`/#${id}`);
    }, 50);
  };

  return (
    <header className="site-nav-wrap">
      <nav className="site-nav" aria-label="Primary navigation">
        <a className="brand-mark" href={onHome ? "#home" : "/"} aria-label={`${siteConfig.name}, home`}>
          {siteConfig.shortName}
        </a>
        <div className="nav-links">
          {items.map((item) => (
            <a
              key={item.id}
              href={onHome ? `#${item.id}` : `/#${item.id}`}
              data-active={onHome && active === item.id ? "true" : "false"}
              aria-current={onHome && active === item.id ? "location" : undefined}
            >
              {item.label}
            </a>
          ))}
        </div>
        <div className="nav-actions">
          <button className="command-trigger" type="button" onClick={(event) => onCommand(event.currentTarget)} aria-label="Open command palette">
            <span>Search</span><kbd>⌘K</kbd>
          </button>
          <a className="nav-resume" href={siteConfig.resumeUrl} target="_blank" rel="noreferrer">
            Resume <ExternalIcon />
          </a>
          <button className="mobile-menu-trigger" type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation menu">
            <span /><span />
          </button>
        </div>
      </nav>

      <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay mobile-nav-overlay" />
          <Dialog.Content className="mobile-nav-dialog" aria-describedby={undefined}>
            <div className="mobile-nav-head">
              <Dialog.Title>Navigate</Dialog.Title>
              <Dialog.Close aria-label="Close navigation">×</Dialog.Close>
            </div>
            <div className="mobile-nav-links">
              {items.map((item, index) => (
                <button key={item.id} type="button" onClick={() => closeAndGo(item.id)}>
                  <span>0{index + 1}</span><strong>{item.label}</strong><i aria-hidden="true">↘</i>
                </button>
              ))}
            </div>
            <div className="mobile-nav-secondary">
              <a href={siteConfig.resumeUrl} target="_blank" rel="noreferrer">Resume <ExternalIcon /></a>
              <a href={siteConfig.github} target="_blank" rel="noreferrer">GitHub <ExternalIcon /></a>
              <a href={siteConfig.linkedin} target="_blank" rel="noreferrer">LinkedIn <ExternalIcon /></a>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </header>
  );
}
