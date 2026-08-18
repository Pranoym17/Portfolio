"use client";

import { MutableRefObject, RefObject, useCallback, useRef, useState } from "react";
import { Group, MathUtils } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import { PortraitCloud } from "@/three/PortraitCloud";
import { Laptop } from "@/three/models/Laptop";
import { PCB } from "@/three/models/PCB";
import { Notebook } from "@/three/models/Notebook";
import { Coffee } from "@/three/models/Coffee";
import { Headphones } from "@/three/models/Headphones";

function ease(value: number) {
  return value * value * (3 - 2 * value);
}

export interface WorkspaceInteractions {
  /** Contextual cursor label ("OPEN", "DRAG", …). Null clears it. */
  onHint?: (hint: string | null) => void;
  /** Coffee easter egg — cycles the microcopy. */
  onCoffeeClick?: () => void;
  /** Double-clicking the laptop reveals the hidden terminal. */
  onLaptopOpen?: () => void;
}

export function WorkspaceScene({
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
  const root = useRef<Group>(null);
  const portrait = useRef<Group>(null);
  const laptop = useRef<Group>(null);
  const pcb = useRef<Group>(null);
  const notebook = useRef<Group>(null);
  const coffee = useRef<Group>(null);
  const headphones = useRef<Group>(null);
  const { pointer, viewport } = useThree();
  // The LED is the only hover state that must reach the material, so it is the one
  // piece of React state here; everything else stays in the render loop.
  const [led, setLed] = useState(false);

  const hint = useCallback(
    (label: string | null) => {
      if (compact) return; // touch devices have no hover, so no cursor label
      interactions?.onHint?.(label);
    },
    [compact, interactions],
  );

  useFrame((state, delta) => {
    const p = ease(Math.min(1, Math.max(0, progressRef.current)));
    const px = reducedMotion ? 0 : pointer.x;
    const py = reducedMotion ? 0 : pointer.y;
    // Must track the same breakpoint that decides which objects render below —
    // a world-unit threshold here would strand the notebook and coffee at the origin.
    const desktop = !compact;
    // Objects sit closer together when the canvas is narrow so nothing drifts off-frame.
    const spread = Math.min(1, viewport.width / 6.4);

    if (root.current) {
      root.current.rotation.y = MathUtils.damp(root.current.rotation.y, px * 0.035, 4, delta);
      root.current.rotation.x = MathUtils.damp(root.current.rotation.x, -py * 0.018, 4, delta);
      root.current.position.y = MathUtils.damp(root.current.position.y, p * 0.08, 4, delta);
    }

    const setGroup = (
      ref: RefObject<Group | null>,
      from: [number, number, number],
      to: [number, number, number],
      baseRot: [number, number, number],
      floatStrength: number,
    ) => {
      const group = ref.current;
      if (!group) return;
      const t = Math.min(1, p * 1.18);
      const idle = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.55 + from[0]) * floatStrength;
      group.position.x = MathUtils.lerp(from[0], to[0], t) * spread + px * 0.035;
      group.position.y = MathUtils.lerp(from[1], to[1], t) + idle + py * 0.02;
      group.position.z = MathUtils.lerp(from[2], to[2], t);
      group.rotation.x = MathUtils.damp(group.rotation.x, baseRot[0] - py * 0.025, 4, delta);
      group.rotation.y = MathUtils.damp(group.rotation.y, baseRot[1] + px * 0.04, 4, delta);
      group.rotation.z = MathUtils.damp(group.rotation.z, baseRot[2] + idle * 0.05, 4, delta);
    };

    if (desktop) {
      // Portrait anchors right of centre; everything else orbits it and stays clear
      // of the face box (roughly x 0..1.7, y 0.9..1.9).
      // Detail faces (PCB traces, notebook sketch) sit on +Y, so their groups need a
      // POSITIVE x-rotation to tip those surfaces toward the camera at +Z.
      setGroup(portrait, [0.85, 0.45, -0.3], [0.2, 0.12, -0.45], [0, -0.03, 0], 0.025);
      setGroup(laptop, [-0.9, -1.42, 0.7], [-1.75, -0.78, -0.12], [0.05, -0.2, -0.04], 0.032);
      setGroup(pcb, [1.58, -1.36, 0.5], [1.95, -0.82, 0.05], [0.5, 0.24, -0.1], 0.042);
      setGroup(notebook, [-1.68, -0.3, 0.32], [1.92, 0.82, -0.08], [0.62, 0.12, 0.16], 0.028);
      // Upper-left gap: the top-right is occupied by the "Currently building" HTML card.
      setGroup(coffee, [-1.32, 1.22, 0.45], [-1.82, 0.88, 0], [-0.15, 0.16, -0.12], 0.035);
      // Second personal object. The low centre-right gap between the laptop and the
      // board is the only slot wide enough for the headband — upper-left fouls the
      // hero copy and the notebook, which is why the earlier attempt was pulled.
      setGroup(headphones, [0.42, -1.68, 0.62], [0.15, -1.82, -0.05], [0.26, 0.42, -0.12], 0.03);
    } else {
      setGroup(portrait, [0, 0.55, 0], [0, 0.1, -0.5], [0, 0, 0], 0.018);
      setGroup(laptop, [0, -1.72, 0.35], [-0.7, -1.05, 0], [-0.12, -0.05, 0], 0.02);
      setGroup(pcb, [0.92, -0.62, 0.45], [0.95, -0.85, -0.1], [0.46, 0.2, -0.1], 0.025);
    }
  });

  return (
    <>
      {/* Studio rig: warm key, soft fill, orange rim grazing the object edges. */}
      <ambientLight intensity={1.1} color="#f0dfce" />
      <directionalLight position={[-4, 5, 6]} intensity={2.4} color="#ffd9bd" />
      <pointLight position={[4, 1.5, 4]} intensity={44} distance={11} decay={2} color="#ff4b2b" />
      <pointLight position={[-2, -2, 3]} intensity={16} distance={8} decay={2} color="#c97652" />
      {/* Low back-rim so the clearcoated lid and board edges separate from the ground. */}
      <directionalLight position={[2.5, -1.5, -5]} intensity={0.9} color="#ff7a52" />

      <group ref={root}>
        <group ref={portrait}><PortraitCloud progressRef={progressRef} compact={compact} reducedMotion={reducedMotion} /></group>

        <group
          ref={laptop}
          onPointerOver={() => hint("OPEN")}
          onPointerOut={() => hint(null)}
          onDoubleClick={(event) => {
            event.stopPropagation();
            interactions?.onLaptopOpen?.();
          }}
        >
          <Laptop compact={compact} />
        </group>

        <group ref={pcb} onPointerOver={() => { setLed(true); hint("HOVER"); }} onPointerOut={() => { setLed(false); hint(null); }}>
          <PCB compact={compact} lit={led} />
        </group>

        {!compact && (
          <group ref={notebook} onPointerOver={() => hint("DRAG")} onPointerOut={() => hint(null)}>
            <Notebook />
          </group>
        )}

        {!compact && (
          <group
            ref={coffee}
            onPointerOver={() => hint("CLICK")}
            onPointerOut={() => hint(null)}
            onClick={(event) => {
              event.stopPropagation();
              interactions?.onCoffeeClick?.();
            }}
          >
            <Coffee />
          </group>
        )}

        {/* Decorative — no pointer hint, since there is no interaction behind it. */}
        {!compact && (
          <group ref={headphones}>
            <Headphones scale={0.54} />
          </group>
        )}

      </group>

      {!compact && (
        <ContactShadows position={[0.6, -2.25, -1.1]} opacity={0.2} scale={7} blur={2.8} far={3.4} color="#050403" />
      )}
    </>
  );
}
