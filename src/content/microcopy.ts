/**
 * Tiny playful annotations that sit beside the workspace objects.
 * PERSONALIZE: rewrite these in your own voice before launch — generic wit reads
 * worse than one specific line that actually sounds like you.
 */

/** Only one or two are visible at a time so the hero never looks noisy. */
export const workspaceNotes = [
  { id: "pcb", text: "built > bought" },
  { id: "laptop", text: "currently compiling ideas" },
  { id: "notebook", text: "probably overthinking this" },
] as const;

/** Coffee easter egg: each click advances one step, then holds on the last line. */
export const coffeeNotes = [
  "Debugging fuel.",
  "Second cup. Standard procedure.",
  "Third. Still technically a beverage.",
  "Okay, that's enough caffeine.",
] as const;

/** Shown after the Konami code. Deliberately understated — no score, no game. */
export const konamiNote = "↑↑↓↓←→←→BA — nothing unlocked. Just respect.";
