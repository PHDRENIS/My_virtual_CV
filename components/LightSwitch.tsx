"use client";

import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { roomLight, useRoomLight } from "@/lib/roomLight";
import { makeLabelTexture } from "@/lib/paintingTexture";

const ACCENT = "#b96bff";

export default function LightSwitch({
  position,
  rotY = 0,
}: {
  position: [number, number, number];
  rotY?: number;
}) {
  const dark = useRoomLight();
  const label = useMemo(() => makeLabelTexture("MODO OBSCURO", ACCENT), []);
  const [hovered, setHovered] = useState(false);

  const nub = useRef<THREE.Mesh>(null);
  const plate = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    const k = Math.min(1, delta * 10);
    if (nub.current) {
      const target = dark ? 0.45 : -0.45;
      nub.current.rotation.x += (target - nub.current.rotation.x) * k;
    }
    if (plate.current) {
      const target = (dark ? 0.3 : 0) + (hovered ? 0.25 : 0);
      plate.current.emissiveIntensity +=
        (target - plate.current.emissiveIntensity) * k;
    }
  });

  const toggle = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    roomLight.toggle();
  };
  const over = () => {
    document.body.style.cursor = "pointer";
    setHovered(true);
  };
  const out = () => {
    document.body.style.cursor = "";
    setHovered(false);
  };

  return (
    <group position={position} rotation-y={rotY}>
      <mesh position={[0, 0, 0.02]} onClick={toggle} onPointerOver={over} onPointerOut={out}>
        <boxGeometry args={[0.36, 0.52, 0.035]} />
        <meshStandardMaterial
          ref={plate}
          color="#eceae4"
          emissive={ACCENT}
          emissiveIntensity={0}
          roughness={0.45}
        />
      </mesh>
      <mesh
        ref={nub}
        position={[0, 0, 0.048]}
        onClick={toggle}
        onPointerOver={over}
        onPointerOut={out}
      >
        <boxGeometry args={[0.13, 0.24, 0.05]} />
        <meshStandardMaterial color="#f7f5f0" roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.42, 0.018]}>
        <planeGeometry args={[0.42, 0.126]} />
        <meshBasicMaterial map={label} transparent toneMapped={false} />
      </mesh>
    </group>
  );
}
