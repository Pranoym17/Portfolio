"use client";

import { useEffect, useRef } from "react";

const SEQUENCE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight",
  "b", "a",
];

/** Fires once each time the Konami code is entered. Ignores typing in fields. */
export function useKonami(onUnlock: () => void) {
  const index = useRef(0);
  const handler = useRef(onUnlock);

  // Refs must not be written during render; sync in an effect instead.
  useEffect(() => {
    handler.current = onUnlock;
  }, [onUnlock]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable) return;

      const expected = SEQUENCE[index.current];
      const key = expected.length === 1 ? event.key.toLowerCase() : event.key;

      if (key === expected) {
        index.current += 1;
        if (index.current === SEQUENCE.length) {
          index.current = 0;
          handler.current();
        }
        return;
      }
      // Restart, but allow the failed key to begin a fresh attempt.
      index.current = event.key === SEQUENCE[0] ? 1 : 0;
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
