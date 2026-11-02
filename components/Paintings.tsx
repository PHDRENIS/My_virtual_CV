"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { sections } from "@/content/sections";
import type { Section, SectionId } from "@/content/sections";
import { PAINTING_SPOTS } from "@/lib/level";
import type { PaintingSpot } from "@/lib/level";
import { makePaintingTexture } from "@/lib/paintingTexture";

const DEFAULT_SIZE = { w: 2.4, h: 3 };
const PAINTING_SIZES: Partial<Record<SectionId, { w: number; h: number }>> = {
  resume: { w: 3.0, h: 3.75 },
};

function Painting({
  section,
  spot,
  active,
  onOpen,
}: {
  section: Section;
  spot: PaintingSpot;
  active: boolean;
  onOpen: (id: SectionId) => void;
}) {
  const size = PAINTING_SIZES[section.id] ?? DEFAULT_SIZE;
  const texture = useMemo(
    () => makePaintingTexture(section.title, section.subtitle, section.color),
    [section],
  );
  const frameMat = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    if (frameMat.current) {
      const target = active ? 1.8 : 0.55;
      frameMat.current.emissiveIntensity +=
        (target - frameMat.current.emissiveIntensity) * Math.min(1, delta * 6);
    }
  });

  return (
    <group position={[spot.x, spot.y, spot.z]} rotation-y={spot.rotY}>
      <mesh>
        <boxGeometry args={[size.w + 0.18, size.h + 0.18, 0.12]} />
        <meshStandardMaterial
          ref={frameMat}
          color="#0c0c16"
          emissive={section.color}
          emissiveIntensity={0.55}
          roughness={0.4}
        />
      </mesh>
      <mesh
        position={[0, 0, 0.08]}
        onClick={(e) => {
          e.stopPropagation();
          onOpen(section.id);
        }}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        <planeGeometry args={[size.w, size.h]} />
        <meshStandardMaterial
          map={texture}
          emissive="#ffffff"
          emissiveMap={texture}
          emissiveIntensity={0.85}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export default function Paintings({
  hovered,
  onHover,
  onOpen,
}: {
  hovered: SectionId | null;
  onHover: (id: SectionId | null) => void;
  onOpen: (id: SectionId) => void;
}) {
  const hoveredRef = useRef<SectionId | null>(null);

  useFrame(({ camera }) => {
    let best: SectionId | null = null;
    let bestD = 3.6;
    for (const s of sections) {
      const spot = PAINTING_SPOTS[s.id];
      const d = Math.hypot(camera.position.x - spot.x, camera.position.z - spot.z);
      if (d < bestD) {
        bestD = d;
        best = s.id;
      }
    }
    if (best !== hoveredRef.current) {
      hoveredRef.current = best;
      onHover(best);
    }
  });

  return (
    <group>
      {sections.map((s) => (
        <Painting
          key={s.id}
          section={s}
          spot={PAINTING_SPOTS[s.id]}
          active={hovered === s.id}
          onOpen={onOpen}
        />
      ))}
    </group>
  );
}
