"use client";

/**
 * Personal object, rendered alongside the coffee cup.
 *
 * An earlier pass put these in the upper-left slot at [-1.3, 1.15, 0.5], where the
 * headband collided with the hero copy column and tangled with the notebook. They
 * now sit low and centre-right instead — resting on the implied desk between the
 * laptop and the board, which is where headphones actually live — and the coffee
 * keeps the upper-left gap. See `WorkspaceScene`.
 */

import { useMemo } from "react";
import { CatmullRomCurve3, Vector3 } from "three";
import { RoundedBox } from "@react-three/drei";

/** One ear cup: housing, cushioned pad and a brushed metal plate. */
function EarCup({ side }: { side: 1 | -1 }) {
  return (
    <group position={[side * 0.52, -0.1, 0]} rotation={[0, 0, side * -0.06]}>
      {/* Housing. */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.32, 0.17, 32]} />
        <meshPhysicalMaterial color="#3b322c" metalness={0.55} roughness={0.38} clearcoat={0.35} clearcoatRoughness={0.4} />
      </mesh>
      {/* Brushed plate facing outward. */}
      <mesh position={[side * 0.09, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.24, 0.012, 32]} />
        <meshPhysicalMaterial color="#6b5c50" metalness={0.9} roughness={0.28} />
      </mesh>
      {/* Accent ring. */}
      <mesh position={[side * 0.098, 0, 0]} rotation={[0, side * Math.PI / 2, 0]}>
        <ringGeometry args={[0.185, 0.205, 40]} />
        <meshStandardMaterial color="#ff4b2b" emissive="#ff4b2b" emissiveIntensity={0.5} toneMapped={false} />
      </mesh>
      {/* Memory-foam pad on the inner face. */}
      <mesh position={[side * -0.085, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.2, 0.085, 14, 30]} />
        <meshStandardMaterial color="#241f1c" roughness={0.9} />
      </mesh>
      {/* Yoke connecting the cup to the headband. */}
      <mesh position={[side * 0.02, 0.3, 0]} rotation={[0, 0, side * 0.12]}>
        <boxGeometry args={[0.05, 0.24, 0.11]} />
        <meshPhysicalMaterial color="#7a6a5d" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
}

export function Headphones({ scale = 0.62 }: { scale?: number }) {
  // Headband swept as a tube so it reads as one continuous arc.
  const band = useMemo(
    () =>
      new CatmullRomCurve3([
        new Vector3(-0.54, 0.18, 0),
        new Vector3(-0.42, 0.52, 0),
        new Vector3(0, 0.68, 0),
        new Vector3(0.42, 0.52, 0),
        new Vector3(0.54, 0.18, 0),
      ]),
    [],
  );

  return (
    <group scale={scale}>
      {/* Headband arc. */}
      <mesh>
        <tubeGeometry args={[band, 40, 0.065, 14, false]} />
        <meshPhysicalMaterial color="#3d332c" metalness={0.6} roughness={0.4} clearcoat={0.3} />
      </mesh>
      {/* Padded strip along the top of the band. */}
      <RoundedBox args={[0.72, 0.075, 0.13]} radius={0.035} smoothness={3} position={[0, 0.63, 0]}>
        <meshStandardMaterial color="#2a2320" roughness={0.88} />
      </RoundedBox>

      <EarCup side={1} />
      <EarCup side={-1} />
    </group>
  );
}
