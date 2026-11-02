import { useMemo } from "react";
import * as THREE from "three";

function makeSkyTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createLinearGradient(0, 0, 0, 256);
  gradient.addColorStop(0, "#5fa8e6");
  gradient.addColorStop(0.55, "#a8cdea");
  gradient.addColorStop(0.8, "#e3edf2");
  gradient.addColorStop(1, "#f0f2ea");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 16, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function Tree({
  position,
  scale,
  variant,
}: {
  position: [number, number, number];
  scale: number;
  variant: number;
}) {
  const foliage = variant % 2 === 0 ? "#8fbf7f" : "#7fb273";
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.13, 0.18, 1.2, 8]} />
        <meshStandardMaterial color="#8a6b4f" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.75, 12, 12]} />
        <meshStandardMaterial color={foliage} roughness={0.9} />
      </mesh>
      <mesh position={[0.3, 2.1, 0.1]}>
        <sphereGeometry args={[0.5, 12, 12]} />
        <meshStandardMaterial color={foliage} roughness={0.9} />
      </mesh>
      <mesh position={[-0.28, 2.0, -0.1]}>
        <sphereGeometry args={[0.42, 12, 12]} />
        <meshStandardMaterial color={foliage} roughness={0.9} />
      </mesh>
    </group>
  );
}

function Cloud({
  position,
  scale,
}: {
  position: [number, number, number];
  scale: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh scale={[1, 0.6, 1]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial color="#ffffff" fog={false} transparent opacity={0.95} />
      </mesh>
      <mesh position={[0.9, -0.1, 0.1]} scale={[1, 0.55, 1]}>
        <sphereGeometry args={[0.7, 12, 12]} />
        <meshBasicMaterial color="#ffffff" fog={false} transparent opacity={0.95} />
      </mesh>
      <mesh position={[-0.85, -0.12, -0.05]} scale={[1, 0.5, 1]}>
        <sphereGeometry args={[0.6, 12, 12]} />
        <meshBasicMaterial color="#ffffff" fog={false} transparent opacity={0.95} />
      </mesh>
    </group>
  );
}

const TREES: Array<{ pos: [number, number, number]; scale: number }> = [
  { pos: [-14, 0, 14], scale: 2.6 },
  { pos: [-6, 0, 18], scale: 3.2 },
  { pos: [4, 0, 17], scale: 2.2 },
  { pos: [12, 0, 14], scale: 3.0 },
  { pos: [17, 0, 3], scale: 2.8 },
  { pos: [19, 0, -5], scale: 3.4 },
  { pos: [16, 0, 10], scale: 2.4 },
  { pos: [22, 0, -1], scale: 3.1 },
];

const CLOUDS: Array<{ pos: [number, number, number]; scale: number }> = [
  { pos: [-20, 20, 40], scale: 5 },
  { pos: [10, 24, 45], scale: 6 },
  { pos: [25, 19, 30], scale: 4 },
  { pos: [-5, 26, 55], scale: 7 },
  { pos: [30, 22, 15], scale: 4 },
];

export default function Outside() {
  const skyTexture = useMemo(() => makeSkyTexture(), []);

  return (
    <group>
      <mesh>
        <sphereGeometry args={[90, 32, 16]} />
        <meshBasicMaterial
          map={skyTexture}
          side={THREE.BackSide}
          fog={false}
        />
      </mesh>

      <mesh position={[-18, 38, 55]}>
        <sphereGeometry args={[4, 16, 16]} />
        <meshBasicMaterial color="#fff6da" fog={false} />
      </mesh>

      <mesh position={[0, -0.02, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[85, 48]} />
        <meshStandardMaterial color="#ccd6bb" roughness={1} />
      </mesh>

      {TREES.map((tree, i) => (
        <Tree
          key={`tree-${i}`}
          position={tree.pos}
          scale={tree.scale}
          variant={i}
        />
      ))}

      {CLOUDS.map((cloud, i) => (
        <Cloud key={`cloud-${i}`} position={cloud.pos} scale={cloud.scale} />
      ))}
    </group>
  );
}
