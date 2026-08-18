"use client";

import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import { pcbTexture } from "@/three/textures";

/** Surface-mount parts laid out to match the silkscreen outlines in the trace texture. */
const chips: Array<{ position: [number, number, number]; size: [number, number, number] }> = [
  { position: [-0.31, 0.055, -0.02], size: [0.26, 0.055, 0.19] },
  { position: [0.19, 0.055, -0.29], size: [0.22, 0.05, 0.16] },
  { position: [0.5, 0.055, 0.18], size: [0.28, 0.06, 0.2] },
];

const capacitors: Array<[number, number, number]> = [
  [-0.62, 0.075, 0.3],
  [-0.46, 0.07, 0.32],
  [0.66, 0.072, -0.22],
];

export function PCB({ compact = false, lit = false }: { compact?: boolean; lit?: boolean }) {
  const traces = useMemo(() => pcbTexture(), []);

  return (
    <group scale={compact ? 0.64 : 0.78}>
      {/* Board substrate. */}
      <RoundedBox args={[1.6, 0.05, 1.05]} radius={0.045} smoothness={4}>
        <meshStandardMaterial color="#2f1e15" metalness={0.15} roughness={0.68} />
      </RoundedBox>

      {/* Trace artwork on the top face. */}
      <mesh position={[0, 0.026, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.56, 1.02]} />
        <meshStandardMaterial map={traces} color={traces ? "#ffffff" : "#3a2519"} roughness={0.6} metalness={0.22} />
      </mesh>

      {/* Integrated circuits with a beveled top and legs implied by a darker skirt. */}
      {chips.map((chip, index) => (
        <group key={index} position={chip.position}>
          <RoundedBox args={chip.size} radius={0.012} smoothness={3}>
            <meshPhysicalMaterial color="#141110" metalness={0.42} roughness={0.34} clearcoat={0.3} clearcoatRoughness={0.6} />
          </RoundedBox>
          {/* Pin-1 marker. */}
          <mesh position={[-chip.size[0] / 2 + 0.035, chip.size[1] / 2 + 0.001, -chip.size[2] / 2 + 0.035]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.014, 10]} />
            <meshBasicMaterial color="#8c766b" />
          </mesh>
        </group>
      ))}

      {/* Electrolytic capacitors. */}
      {capacitors.map((position, index) => (
        <mesh key={index} position={position}>
          <cylinderGeometry args={[0.052, 0.052, 0.1, 18]} />
          <meshPhysicalMaterial color="#22303a" metalness={0.68} roughness={0.32} />
        </mesh>
      ))}

      {/* Header pins along the front edge. */}
      {[-0.48, -0.22, 0.04, 0.3, 0.56].map((x) => (
        <mesh key={x} position={[x, 0.055, 0.4]}>
          <boxGeometry args={[0.032, 0.06, 0.032]} />
          <meshStandardMaterial color="#d7a665" metalness={0.95} roughness={0.22} />
        </mesh>
      ))}

      {/* Status LED — brightens on hover (easter egg). */}
      <mesh position={[0.55, 0.055, 0.24]}>
        <sphereGeometry args={[0.038, 16, 16]} />
        <meshStandardMaterial
          color="#ff4b2b"
          emissive="#ff4b2b"
          emissiveIntensity={lit ? 7.5 : 2.6}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        position={[0.55, 0.12, 0.24]}
        intensity={lit ? 2.6 : 0.55}
        distance={lit ? 1.9 : 0.9}
        decay={2}
        color="#ff4b2b"
      />
    </group>
  );
}
