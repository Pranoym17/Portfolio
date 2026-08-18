"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export interface CursorHintHandle {
  show: (text: string) => void;
  hide: () => void;
}

/**
 * Small contextual label that trails the native cursor over interactive workspace
 * objects ("OPEN", "DRAG", "VIEW"). Deliberately imperative: hover and pointer
 * movement are high-frequency, and routing them through React state would
 * re-render the hero on every mouse move.
 */
export const CursorHint = forwardRef<CursorHintHandle>(function CursorHint(_props, ref) {
  const node = useRef<HTMLDivElement>(null);
  const visible = useRef(false);

  useImperativeHandle(ref, () => ({
    show(text: string) {
      const element = node.current;
      if (!element) return;
      element.textContent = text;
      element.dataset.visible = "true";
      visible.current = true;
    },
    hide() {
      const element = node.current;
      if (!element) return;
      element.dataset.visible = "false";
      visible.current = false;
    },
  }), []);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (!visible.current) return;
      const element = node.current;
      if (!element) return;
      element.style.transform = `translate3d(${event.clientX + 18}px, ${event.clientY + 18}px, 0)`;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return <div ref={node} className="cursor-hint" data-visible="false" aria-hidden="true" />;
});
