"use client";

import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import { keyboardTexture, screenTexture } from "@/three/textures";

const LID_TILT = -0.34; // ~110 degrees open relative to the base.

export function Laptop({ compact = false }: { compact?: boolean }) {
  // Kept under the portrait's visual weight so the face stays the hero anchor.
  const scale = compact ? 0.72 : 0.86;
  const screen = useMemo(() => screenTexture(), []);
  const keyboard = useMemo(() => keyboardTexture(), []);

  return (
    <group scale={scale}>
      {/* Base: thin chassis with a slightly inset upper deck for a machined edge. */}
      <RoundedBox args={[2.15, 0.055, 1.35]} radius={0.026} smoothness={4} position={[0, -0.38, 0]} rotation={[-0.08, 0, 0]}>
        <meshPhysicalMaterial color="#2b2622" metalness={0.86} roughness={0.29} clearcoat={0.25} clearcoatRoughness={0.5} />
      </RoundedBox>
      <RoundedBox args={[2.09, 0.028, 1.29]} radius={0.018} smoothness={4} position={[0, -0.35, 0]} rotation={[-0.08, 0, 0]}>
        <meshPhysicalMaterial color="#332c27" metalness={0.8} roughness={0.36} />
      </RoundedBox>

      {/* Keyboard + trackpad as a single texture on the deck. */}
      <mesh position={[0, -0.334, 0.012]} rotation={[-Math.PI / 2 - 0.08, 0, 0]}>
        <planeGeometry args={[1.94, 1.16]} />
        <meshStandardMaterial map={keyboard} color={keyboard ? "#ffffff" : "#241e1a"} roughness={0.74} metalness={0.12} />
      </mesh>

      {/* Hinge barrels at the base/lid junction. */}
      {[-0.74, 0.74].map((x) => (
        <mesh key={x} position={[x, -0.352, -0.63]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.036, 0.036, 0.28, 20]} />
          <meshPhysicalMaterial color="#1d1916" metalness={0.9} roughness={0.34} />
        </mesh>
      ))}

      {/* Lid: thin panel with a clearcoated shell. */}
      <group position={[0, -0.352, -0.63]} rotation={[LID_TILT, 0, 0]}>
        <RoundedBox args={[2.09, 1.33, 0.05]} radius={0.028} smoothness={4} position={[0, 0.665, -0.028]}>
          <meshPhysicalMaterial color="#1a1613" metalness={0.82} roughness={0.24} clearcoat={0.4} clearcoatRoughness={0.28} />
        </RoundedBox>

        {/* Bezel + screen. */}
        <mesh position={[0, 0.665, 0.002]}>
          <planeGeometry args={[1.99, 1.23]} />
          <meshStandardMaterial color="#0d0a08" roughness={0.42} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.672, 0.006]}>
          <planeGeometry args={[1.86, 1.1]} />
          <meshStandardMaterial
            map={screen}
            color={screen ? "#ffffff" : "#241610"}
            emissiveMap={screen}
            emissive="#ffffff"
            emissiveIntensity={screen ? 0.62 : 0.3}
            roughness={0.34}
          />
        </mesh>

        {/* Camera dot in the bezel. */}
        <mesh position={[0, 1.258, 0.007]}>
          <circleGeometry args={[0.011, 12]} />
          <meshStandardMaterial color="#0a0806" roughness={0.2} metalness={0.6} />
        </mesh>
      </group>
    </group>
  );
}
