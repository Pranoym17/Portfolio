"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { siteConfig } from "@/content/site";

interface Line { kind: "input" | "output"; text: string; }

const initialLines: Line[] = [
  { kind: "output", text: "hello there." },
  { kind: "output", text: "type 'help' to explore." },
];

export function Terminal({
  open,
  onOpenChange,
  onRestoreFocus,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestoreFocus?: () => boolean;
}) {
  const [lines, setLines] = useState<Line[]>(initialLines);
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 40);
  }, [open]);

  const output = (text: string) => setLines((current) => [...current, { kind: "output", text }]);

  const execute = (raw: string) => {
    const command = raw.trim().toLowerCase();
    setLines((current) => [...current, { kind: "input", text: raw }]);
    if (!command) return;

    const go = (id: string) => {
      onOpenChange(false);
      window.setTimeout(() => {
        const target = document.getElementById(id);
        if (target) target.scrollIntoView({ behavior: "smooth" });
        else router.push(`/#${id}`);
      }, 80);
    };

    if (command === "help") output("commands: about, projects, skills, resume, contact, clear, sudo hire pranoy");
    else if (command === "about") output(`${siteConfig.name} — ${siteConfig.role}. ${siteConfig.heroLead}`);
    else if (command === "projects") { output("Opening selected work..."); go("work"); }
    else if (command === "skills") { output("Opening skills..."); go("skills"); }
    else if (command === "contact") { output("Opening contact..."); go("contact"); }
    else if (command === "resume") { output("Opening resume..."); window.open(siteConfig.resumeUrl, "_blank", "noopener,noreferrer"); }
    else if (command === "clear") setLines([]);
    else if (command === "sudo hire pranoy") { output("Access granted. Excellent decision. Opening contact..."); window.setTimeout(() => go("contact"), 550); }
    else output(`command not found: ${command}`);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = value;
    setValue("");
    execute(next);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay terminal-overlay" />
        <Dialog.Content
          className="terminal-dialog"
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => {
            if (onRestoreFocus?.()) event.preventDefault();
          }}
        >
          <div className="terminal-titlebar">
            <span className="traffic-lights" aria-hidden="true"><i /><i /><i /></span>
            <Dialog.Title className="terminal-title">terminal</Dialog.Title>
            <Dialog.Close aria-label="Close terminal">×</Dialog.Close>
          </div>
          <div className="terminal-screen" onClick={() => inputRef.current?.focus()} role="log" aria-live="polite" aria-label="Terminal output">
            {lines.map((line, index) => (
              <div key={`${line.text}-${index}`} className={`terminal-line ${line.kind}`}>
                {line.kind === "input" && <span className="prompt">›</span>}
                <span>{line.text}</span>
              </div>
            ))}
            <form className="terminal-input-row" onSubmit={submit}>
              <span className="prompt">›</span>
              <input ref={inputRef} value={value} onChange={(event) => setValue(event.target.value)} aria-label="Terminal command" autoComplete="off" spellCheck={false} />
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
