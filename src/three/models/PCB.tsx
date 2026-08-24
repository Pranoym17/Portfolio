"use client";

import { useMemo, useRef } from "react";
import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, MathUtils, Mesh, MeshStandardMaterial, PointLight } from "three";
import { pcbRailGlowTexture, pcbSignalGlowTexture, pcbTexture } from "@/three/textures";

/**
 * The trace artwork is authored on a 1024 x 672 canvas. Physical parts have to
 * land exactly on their silkscreen footprints, so positions are converted from
 * canvas pixels rather than eyeballed — that alignment is most of what makes a
 * board look real instead of decorated.
 *
 * The plane is rotated -PI/2 about X, which maps canvas Y=0 to world -Z.
 */
const TEX_W = 1024;
const TEX_H = 672;
const BOARD_W = 1.56;
const BOARD_D = 1.02;

const px = (x: number) => (x / TEX_W - 0.5) * BOARD_W;
const pz = (y: number) => (y / TEX_H - 0.5) * BOARD_D;
const sx = (w: number) => (w / TEX_W) * BOARD_W;
const sz = (d: number) => (d / TEX_H) * BOARD_D;

/** Mirrors the IC footprints in `pcbTexture`. */
const CHIPS = [
  { x: 138, y: 236, w: 186, h: 178 },
  { x: 556, y: 96, w: 138, h: 104 },
  { x: 648, y: 392, w: 172, h: 128 },
].map((c) => ({
  position: [px(c.x + c.w / 2), 0.052, pz(c.y + c.h / 2)] as [number, number, number],
  size: [sx(c.w) * 0.88, 0.05, sz(c.h) * 0.88] as [number, number, number],
  pin: [-sx(c.w) * 0.34, 0.026, -sz(c.h) * 0.32] as [number, number, number],
}));

/** Small SMD blocks sitting on the horizontal two-pad footprints. */
const PASSIVES = [
  [404, 236],
  [404, 300],
  [372, 466],
  [480, 520],
  [224, 528],
  [300, 152],
].map(([x, y]) => [px(x), 0.037, pz(y)] as [number, number, number]);

/** Electrolytic cans beside the power section. */
const CANS = [
  [470, 268],
  [880, 396],
].map(([x, y]) => [px(x), 0.072, pz(y)] as [number, number, number]);

/**
 * Status LEDs. They light in sequence during the power-up easter egg, which is
 * why each carries its own delay.
 */
const LEDS = [
  { at: [858, 512], delay: 0.18, color: "#ff4b2b" },
  { at: [858, 556], delay: 0.42, color: "#ff7a3d" },
  { at: [858, 600], delay: 0.64, color: "#ffb04a" },
].map((l) => ({
  ...l,
  position: [px(l.at[0]), 0.05, pz(l.at[1])] as [number, number, number],
}));

export function PCB({
  compact = false,
  lit = false,
  powered = false,
}: {
  compact?: boolean;
  lit?: boolean;
  powered?: boolean;
}) {
  const traces = useMemo(() => pcbTexture(), []);
  const railGlow = useMemo(() => pcbRailGlowTexture(), []);
  const signalGlow = useMemo(() => pcbSignalGlowTexture(), []);

  const rail = useRef<MeshStandardMaterial>(null);
  const signal = useRef<MeshStandardMaterial>(null);
  const ledMats = useRef<Array<MeshStandardMaterial | null>>([]);
  const ledLights = useRef<Array<PointLight | null>>([]);
  const halo = useRef<Mesh>(null);
  /** Boot progress, 0 to 1. A ref because it advances every frame. */
  const boot = useRef(0);

  useFrame((state, delta) => {
    // Rails come up fast, the rest follows from this one ramp.
    boot.current = MathUtils.damp(boot.current, powered ? 1 : 0, powered ? 3.4 : 6, delta);
    const b = boot.current;
    const time = state.clock.elapsedTime;

    if (rail.current) {
      rail.current.emissiveIntensity = b * 2.4;
    }
    if (signal.current) {
      // Signals wake after the rails, then carry a faint data shimmer.
      const gate = Math.max(0, (b - 0.28) / 0.72);
      const shimmer = 0.82 + Math.sin(time * 7.5) * 0.18 * gate;
      signal.current.emissiveIntensity = gate * 2.9 * shimmer;
    }

    LEDS.forEach((led, index) => {
      const gate = Math.max(0, Math.min(1, (b - led.delay) / 0.22));
      // Once up, the first LED breathes like a heartbeat and the others hold.
      const pulse = index === 0 ? 0.62 + Math.abs(Math.sin(time * 1.9)) * 0.38 : 1;
      const material = ledMats.current[index];
      if (material) material.emissiveIntensity = 1.2 + gate * pulse * 9;
      const light = ledLights.current[index];
      if (light) {
        light.intensity = 0.22 + gate * pulse * 2.4;
        light.distance = 0.9 + gate * 1.1;
      }
    });

    if (halo.current) {
      const material = halo.current.material as MeshStandardMaterial;
      material.opacity = b * 0.14;
    }
  });

  return (
    <group scale={compact ? 0.7 : 0.95}>
      {/* Board substrate. */}
      <RoundedBox args={[1.6, 0.05, 1.05]} radius={0.018} smoothness={4}>
        <meshStandardMaterial color="#150d08" metalness={0.06} roughness={0.9} />
      </RoundedBox>

      {/* Copper artwork. */}
      <mesh position={[0, 0.032, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[BOARD_W, BOARD_D]} />
        <meshStandardMaterial map={traces} color={traces ? "#ffffff" : "#3a2519"} roughness={0.92} metalness={0.04} />
      </mesh>

      {/* Power rails, lit first on power-up. */}
      <mesh position={[0, 0.034, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[BOARD_W, BOARD_D]} />
        <meshStandardMaterial
          ref={rail}
          map={railGlow}
          emissiveMap={railGlow}
          emissive="#ffb27a"
          emissiveIntensity={0}
          transparent
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Signal traces, a beat behind the rails. */}
      <mesh position={[0, 0.036, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[BOARD_W, BOARD_D]} />
        <meshStandardMaterial
          ref={signal}
          map={signalGlow}
          emissiveMap={signalGlow}
          emissive="#ff6a3d"
          emissiveIntensity={0}
          transparent
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>

      {/* Integrated circuits. */}
      {CHIPS.map((chip, index) => (
        <group key={index} position={chip.position}>
          <RoundedBox args={chip.size} radius={0.01} smoothness={3}>
            <meshPhysicalMaterial color="#131010" metalness={0.44} roughness={0.32} clearcoat={0.32} clearcoatRoughness={0.55} />
          </RoundedBox>
          <mesh position={chip.pin} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.013, 10]} />
            <meshBasicMaterial color="#8c766b" />
          </mesh>
        </group>
      ))}

      {/* SMD passives. */}
      {PASSIVES.map((position, index) => (
        <mesh key={index} position={position}>
          <boxGeometry args={[0.05, 0.022, 0.03]} />
          <meshStandardMaterial color="#1d1613" metalness={0.3} roughness={0.5} />
        </mesh>
      ))}

      {/* Electrolytic cans. */}
      {CANS.map((position, index) => (
        <mesh key={index} position={position}>
          <cylinderGeometry args={[0.046, 0.046, 0.092, 18]} />
          <meshPhysicalMaterial color="#22303a" metalness={0.66} roughness={0.34} />
        </mesh>
      ))}

      {/* Four-pin header on the left edge. */}
      {[-0.14, -0.05, 0.04, 0.13].map((z) => (
        <mesh key={z} position={[-0.72, 0.055, z]}>
          <boxGeometry args={[0.03, 0.06, 0.03]} />
          <meshStandardMaterial color="#d7a665" metalness={0.94} roughness={0.24} />
        </mesh>
      ))}

      {/* Status LEDs. */}
      {LEDS.map((led, index) => (
        <group key={index}>
          <mesh position={led.position}>
            <sphereGeometry args={[0.028, 14, 14]} />
            <meshStandardMaterial
              ref={(node) => {
                ledMats.current[index] = node;
              }}
              color={led.color}
              emissive={led.color}
              emissiveIntensity={lit ? 4.5 : 1.2}
              toneMapped={false}
            />
          </mesh>
          <pointLight
            ref={(node) => {
              ledLights.current[index] = node;
            }}
            position={[led.position[0], led.position[1] + 0.07, led.position[2]]}
            intensity={0.22}
            distance={0.9}
            decay={2}
            color={led.color}
          />
        </group>
      ))}

      {/* Warm bloom over the board once it is running. */}
      <mesh ref={halo} position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[BOARD_W * 1.04, BOARD_D * 1.04]} />
        <meshStandardMaterial color="#ff7a45" transparent opacity={0} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}
