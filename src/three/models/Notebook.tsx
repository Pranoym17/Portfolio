"use client";

import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import { notebookTexture } from "@/three/textures";

export function Notebook() {
  const sketch = useMemo(() => notebookTexture(), []);

  return (
    <group scale={0.72}>
      {/* Cover: slightly larger footprint than the page block. */}
      <RoundedBox args={[1.46, 0.055, 1.86]} radius={0.03} smoothness={4} position={[0, -0.04, 0]}>
        <meshStandardMaterial color="#3a2a20" roughness={0.82} metalness={0.06} />
      </RoundedBox>

      {/* Page block: lighter edges suggest a stack of sheets. */}
      <RoundedBox args={[1.4, 0.1, 1.8]} radius={0.012} smoothness={3} position={[0, 0.03, 0]}>
        <meshStandardMaterial color="#ded0c0" roughness={0.9} />
      </RoundedBox>

      {/* Thin page-edge striping on the three open sides. */}
      {[0.052, 0.03, 0.008].map((y, index) => (
        <RoundedBox key={index} args={[1.398 - index * 0.004, 0.006, 1.798 - index * 0.004]} radius={0.003} smoothness={2} position={[0, y, 0]}>
          <meshStandardMaterial color={index % 2 === 0 ? "#f3e9de" : "#cdbcab"} roughness={0.95} />
        </RoundedBox>
      ))}

      {/* Top page with the engineering sketch. */}
      <mesh position={[0, 0.081, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.3, 1.72]} />
        <meshStandardMaterial map={sketch} color={sketch ? "#ffffff" : "#f1e8df"} roughness={0.92} />
      </mesh>

      {/* Pencil resting across the lower corner. */}
      <group position={[0.34, 0.115, 0.62]} rotation={[0, -0.42, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.026, 0.026, 0.94, 6]} />
          <meshStandardMaterial color="#c8912f" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.53, 0]}>
          <coneGeometry args={[0.026, 0.12, 6]} />
          <meshStandardMaterial color="#e2cdb2" roughness={0.7} />
        </mesh>
        <mesh position={[0, -0.6, 0]}>
          <coneGeometry args={[0.009, 0.035, 6]} />
          <meshStandardMaterial color="#2a2320" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
}
