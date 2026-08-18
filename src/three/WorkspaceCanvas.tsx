"use client";

import { Canvas } from "@react-three/fiber";
import { MutableRefObject, Suspense } from "react";
import { WorkspaceScene, type WorkspaceInteractions } from "@/three/WorkspaceScene";

export function WorkspaceCanvas({
  progressRef,
  compact,
  reducedMotion,
  interactions,
}: {
  progressRef: MutableRefObject<number>;
  compact: boolean;
  reducedMotion: boolean;
  interactions?: WorkspaceInteractions;
}) {
  return (
    <Canvas
      className="workspace-canvas"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 7], fov: 42, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <WorkspaceScene progressRef={progressRef} compact={compact} reducedMotion={reducedMotion} interactions={interactions} />
      </Suspense>
    </Canvas>
  );
}
