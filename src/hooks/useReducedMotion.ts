"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";

export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
