"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Navigation } from "@/components/layout/Navigation";
import { CommandPalette } from "@/components/overlays/CommandPalette";
import { Terminal } from "@/components/overlays/Terminal";
import { konamiNote } from "@/content/microcopy";
import { useKonami } from "@/hooks/useKonami";

export function ClientShell({ children }: { children: ReactNode }) {
  const [commandOpen, setCommandOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [konami, setKonami] = useState(false);
  // Radix cannot restore focus for us because these overlays are opened from
  // controls outside the dialog, so remember the invoker before the overlay mounts.
  const invokerRef = useRef<HTMLElement | null>(null);

  // WebKit does not focus a <button> on click, so callers pass the element directly
  // where they have it; keyboard shortcuts fall back to the focused element.
  const rememberInvoker = useCallback((element?: HTMLElement | null) => {
    if (element) {
      invokerRef.current = element;
      return;
    }
    const active = document.activeElement;
    invokerRef.current = active instanceof HTMLElement && active !== document.body ? active : null;
  }, []);

  const restoreInvoker = useCallback(() => {
    const invoker = invokerRef.current;
    invokerRef.current = null;
    if (!invoker?.isConnected) return false;
    invoker.focus();
    return true;
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        rememberInvoker();
        setCommandOpen((value) => !value);
        return;
      }
      if (!typing && event.key === "~") {
        event.preventDefault();
        rememberInvoker();
        setTerminalOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [rememberInvoker]);

  // Double-clicking the 3D laptop opens the terminal (see WorkspaceScene).
  useEffect(() => {
    const open = () => {
      invokerRef.current = null;
      setTerminalOpen(true);
    };
    window.addEventListener("workspace:open-terminal", open);
    return () => window.removeEventListener("workspace:open-terminal", open);
  }, []);

  useKonami(() => setKonami(true));

  useEffect(() => {
    if (!konami) return;
    const timer = window.setTimeout(() => setKonami(false), 4200);
    return () => window.clearTimeout(timer);
  }, [konami]);

  return (
    <>
      <Navigation
        onCommand={(element) => {
          rememberInvoker(element);
          setCommandOpen(true);
        }}
      />
      {children}
      <CommandPalette
        open={commandOpen}
        onOpenChange={setCommandOpen}
        onRestoreFocus={restoreInvoker}
        onTerminal={() => {
          rememberInvoker();
          setTerminalOpen(true);
        }}
      />
      <Terminal open={terminalOpen} onOpenChange={setTerminalOpen} onRestoreFocus={restoreInvoker} />
      {konami && <div className="konami-note" role="status">{konamiNote}</div>}
    </>
  );
}
