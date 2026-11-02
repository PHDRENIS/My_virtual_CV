"use client";

import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import { FURNITURE } from "@/lib/level";
import type { FurnitureItem } from "@/lib/level";

function FurniturePiece({ item }: { item: FurnitureItem }) {
  const { scene } = useGLTF(item.model);
  const object = useMemo(() => {
    const clone = scene.clone(true);
    if (item.color) {
      clone.traverse((o) => {
        const mesh = o as THREE.Mesh;
        if (mesh.isMesh) {
          mesh.material = new THREE.MeshStandardMaterial({
            color: item.color,
            roughness: 0.75,
          });
        }
      });
    }
    return clone;
  }, [scene, item]);
  return (
    <group
      position={item.position}
      rotation-y={item.rotY ?? 0}
      scale={item.scale ?? 2.2}
    >
      <primitive object={object} position={item.offset ?? [0, 0, 0]} />
    </group>
  );
}

export default function Furniture() {
  return (
    <group>
      {FURNITURE.map((item, i) => (
        <FurniturePiece key={`${item.model}-${i}`} item={item} />
      ))}
    </group>
  );
}

for (const item of FURNITURE) {
  useGLTF.preload(item.model);
}
