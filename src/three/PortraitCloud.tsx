"use client";

import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";

const vertexShader = `
  attribute float aSeed;
  attribute vec3 aColor;
  varying vec3 vColor;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uDisperse;
  uniform float uRepulsion;

  void main() {
    vec3 p = position;
    float phase = aSeed * 6.28318530718;
    p.x += sin(uTime * 0.42 + phase) * 0.007;
    p.y += cos(uTime * 0.35 + phase * 1.7) * 0.009;

    vec2 delta = p.xy - uPointer;
    float dist = max(length(delta), 0.0001);
    float force = 1.0 - smoothstep(0.0, 0.62, dist);
    p.xy += normalize(delta) * force * 0.22 * uRepulsion;

    vec3 scatterDir = normalize(vec3(
      sin(aSeed * 91.7) + 0.25,
      cos(aSeed * 77.3),
      sin(aSeed * 43.1)
    ));
    p += scatterDir * uDisperse * (0.35 + aSeed * 1.2);

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    float perspective = clamp(6.4 / -mvPosition.z, 0.65, 2.2);
    gl_PointSize = (2.0 + aSeed * 1.45) * perspective;
    gl_Position = projectionMatrix * mvPosition;
    vColor = aColor;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;
    float alpha = smoothstep(0.5, 0.14, dist);
    gl_FragColor = vec4(vColor, alpha * 0.92);
  }
`;

type PointBuffers = {
  positions: Float32Array;
  seeds: Float32Array;
  colors: Float32Array;
};

function fallbackBuffers(compact: boolean): PointBuffers {
  const points: number[] = [];
  const seeds: number[] = [];
  const colors: number[] = [];
  const step = compact ? 0.075 : 0.055;
  let index = 0;
  for (let y = -1.65; y <= 1.55; y += step) {
    for (let x = -1.15; x <= 1.15; x += step) {
      const head = ((x + 0.08) / 0.78) ** 2 + ((y - 0.45) / 1.02) ** 2 < 1;
      const neck = Math.abs(x) < 0.35 && y < -0.25 && y > -0.92;
      const shoulders = ((x / 1.42) ** 2 + ((y + 1.38) / 0.72) ** 2 < 1) && y < -0.6;
      const faceCut = x > -0.46 && x < 0.44 && y > 0.0 && y < 0.92 && Math.sin((x + y) * 8) > 0.72;
      if ((head || neck || shoulders) && !faceCut) {
        const seed = ((index * 9301 + 49297) % 233280) / 233280;
        const z = Math.cos(Math.min(1, Math.abs(x) / 1.4) * Math.PI * 0.5) * 0.12 + seed * 0.045;
        points.push(x, y, z);
        seeds.push(seed);
        const accent = x > 0.12 && y > 0.2 && seed > 0.6;
        colors.push(accent ? 1 : 0.78, accent ? 0.3 : 0.82, accent ? 0.16 : 0.78);
        index += 1;
      }
    }
  }
  return { positions: new Float32Array(points), seeds: new Float32Array(seeds), colors: new Float32Array(colors) };
}

async function imageBuffers(src: string, compact: boolean): Promise<PointBuffers> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const width = compact ? 110 : 150;
      const height = Math.round(width * (img.height / img.width));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) return reject(new Error("Canvas unavailable"));
      context.clearRect(0, 0, width, height);
      context.drawImage(img, 0, 0, width, height);
      const pixels = context.getImageData(0, 0, width, height).data;
      const positions: number[] = [];
      const seeds: number[] = [];
      const colors: number[] = [];
      const stride = compact ? 3 : 2;
      let index = 0;
      for (let y = 0; y < height; y += stride) {
        for (let x = 0; x < width; x += stride) {
          const i = (y * width + x) * 4;
          const alpha = pixels[i + 3] / 255;
          if (alpha < 0.18) continue;
          const luminance = (pixels[i] * 0.2126 + pixels[i + 1] * 0.7152 + pixels[i + 2] * 0.0722) / 255;
          const seed = ((index * 9301 + 49297) % 233280) / 233280;
          const px = ((x / width) - 0.5) * 2.45;
          const py = (0.5 - (y / height)) * 3.3;
          const radial = 1 - Math.min(1, Math.abs(px) / 1.4);
          const z = radial * 0.14 + (1 - luminance) * 0.08 + seed * 0.025;
          positions.push(px, py, z);
          seeds.push(seed);
          const accent = px > 0.05 && py > 0.15 && seed > 0.58;
          colors.push(accent ? 1.0 : 0.78, accent ? 0.30 : 0.83, accent ? 0.16 : 0.79);
          index += 1;
        }
      }
      resolve({ positions: new Float32Array(positions), seeds: new Float32Array(seeds), colors: new Float32Array(colors) });
    };
    img.onerror = () => reject(new Error("Portrait source failed to load"));
    img.src = src;
  });
}

export function PortraitCloud({
  progressRef,
  compact,
  reducedMotion,
}: {
  progressRef: MutableRefObject<number>;
  compact: boolean;
  reducedMotion: boolean;
}) {
  const [buffers, setBuffers] = useState<PointBuffers>(() => fallbackBuffers(compact));
  const material = useRef<THREE.ShaderMaterial>(null);
  const { pointer } = useThree();

  useEffect(() => {
    let cancelled = false;
    imageBuffers("/portrait/portrait-source.png", compact)
      .then((next) => { if (!cancelled && next.positions.length > 300) setBuffers(next); })
      .catch(() => { /* fallback already rendered */ });
    return () => { cancelled = true; };
  }, [compact]);

  const geometry = useMemo(() => {
    const next = new THREE.BufferGeometry();
    next.setAttribute("position", new THREE.BufferAttribute(buffers.positions, 3));
    next.setAttribute("aSeed", new THREE.BufferAttribute(buffers.seeds, 1));
    next.setAttribute("aColor", new THREE.BufferAttribute(buffers.colors, 3));
    next.computeBoundingSphere();
    return next;
  }, [buffers]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = state.clock.elapsedTime;
    material.current.uniforms.uPointer.value.set(pointer.x * 1.3, pointer.y * 1.6);
    material.current.uniforms.uRepulsion.value = reducedMotion ? 0 : 1;
    const p = progressRef.current;
    material.current.uniforms.uDisperse.value = reducedMotion ? 0 : Math.max(0, (p - 0.44) / 0.5);
  });

  return (
    <points geometry={geometry} scale={compact ? 0.82 : 1}>
      <shaderMaterial
        ref={material}
        transparent
        depthWrite={false}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uPointer: { value: new THREE.Vector2() },
          uDisperse: { value: 0 },
          uRepulsion: { value: 1 },
        }}
      />
    </points>
  );
}
