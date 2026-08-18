"use client";

import { useMemo } from "react";
import { Vector2 } from "three";

/**
 * Cup profile revolved with LatheGeometry: a footed base, a slight waist and a
 * rolled lip read as ceramic far better than a plain cylinder.
 */
function useCupProfile() {
  return useMemo(() => {
    const points: Vector2[] = [];
    // Outer wall, bottom to lip.
    points.push(new Vector2(0.0, -0.36));
    points.push(new Vector2(0.3, -0.36));
    points.push(new Vector2(0.33, -0.33));
    points.push(new Vector2(0.315, -0.24));
    points.push(new Vector2(0.35, -0.05));
    points.push(new Vector2(0.395, 0.18));
    points.push(new Vector2(0.41, 0.34));
    points.push(new Vector2(0.415, 0.36));
    // Rolled lip, back down the inner wall.
    points.push(new Vector2(0.39, 0.365));
    points.push(new Vector2(0.375, 0.3));
    points.push(new Vector2(0.335, 0.05));
    points.push(new Vector2(0.3, -0.2));
    points.push(new Vector2(0.0, -0.24));
    return points;
  }, []);
}

export function Coffee() {
  const profile = useCupProfile();

  return (
    <group scale={0.54}>
      {/* Ceramic body. */}
      <mesh>
        <latheGeometry args={[profile, 48]} />
        <meshPhysicalMaterial
          color="#ece2d6"
          roughness={0.32}
          metalness={0.02}
          clearcoat={0.55}
          clearcoatRoughness={0.22}
        />
      </mesh>

      {/* Coffee surface with a specular glint. */}
      <mesh position={[0, 0.28, 0]}>
        <circleGeometry args={[0.352, 48]} />
        <meshPhysicalMaterial
          color="#2a1610"
          roughness={0.12}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.06}
        />
      </mesh>

      {/* Handle. */}
      <mesh position={[0.4, 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.2, 0.045, 14, 28, Math.PI * 1.5]} />
        <meshPhysicalMaterial color="#ece2d6" roughness={0.34} clearcoat={0.5} clearcoatRoughness={0.24} />
      </mesh>

      {/* Saucer. */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.62, 0.58, 0.045, 40]} />
        <meshPhysicalMaterial color="#e4d9cc" roughness={0.38} clearcoat={0.4} />
      </mesh>

      {/* Barely-there steam. */}
      {[0, 1, 2].map((index) => (
        <mesh key={index} position={[-0.1 + index * 0.1, 0.62 + index * 0.05, 0]} rotation={[0, 0, 0.16]}>
          <cylinderGeometry args={[0.007, 0.011, 0.42, 6]} />
          <meshBasicMaterial color="#ad8b77" transparent opacity={0.14} />
        </mesh>
      ))}
    </group>
  );
}
