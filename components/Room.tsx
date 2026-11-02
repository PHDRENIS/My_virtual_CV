import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { ROOM, WALLS, COLORS } from "@/lib/level";
import { roomLight } from "@/lib/roomLight";
import { makeFloorTexture } from "@/lib/floorTexture";
import { makeMiniArtTexture } from "@/lib/paintingTexture";
import Furniture from "./Furniture";
import Outside from "./Outside";
import LightSwitch from "./LightSwitch";

const WALL_COLOR = "#f4f1ea";
const FRAME_COLOR = "#1d1d21";

function PendantLamp({
  x,
  z,
  withLight,
}: {
  x: number;
  z: number;
  withLight?: boolean;
}) {
  const bulbLight = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    if (bulbLight.current) {
      const target = roomLight.isDark() ? 0.7 : 8;
      bulbLight.current.intensity +=
        (target - bulbLight.current.intensity) * Math.min(1, delta * 5);
    }
  });

  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 3.85, 0]}>
        <cylinderGeometry args={[0.014, 0.014, 1.5, 8]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.6} />
      </mesh>
      <mesh position={[0, 2.95, 0]}>
        <coneGeometry args={[0.38, 0.45, 32, 1, true]} />
        <meshStandardMaterial
          color={FRAME_COLOR}
          roughness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 2.82, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color="#ffe8c4" toneMapped={false} />
      </mesh>
      {withLight && (
        <pointLight
          ref={bulbLight}
          position={[0, 2.75, 0]}
          intensity={8}
          color="#ffd9a8"
          distance={7}
        />
      )}
    </group>
  );
}

function WindowSection({ width }: { width: number }) {
  const h = 2.6;
  const t = 0.09;
  const d = 0.14;
  return (
    <group>
      <mesh position={[0, h + t / 2, 0]}>
        <boxGeometry args={[width + t * 2, t, d]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.5} />
      </mesh>
      <mesh position={[0, t / 2, 0]}>
        <boxGeometry args={[width + t * 2, t, d]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.5} />
      </mesh>
      <mesh position={[-width / 2 - t / 2, h / 2 + t, 0]}>
        <boxGeometry args={[t, h, d]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.5} />
      </mesh>
      <mesh position={[width / 2 + t / 2, h / 2 + t, 0]}>
        <boxGeometry args={[t, h, d]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.5} />
      </mesh>
      <mesh position={[0, h / 2 + t, -d / 4]}>
        <boxGeometry args={[0.05, h, 0.05]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.5} />
      </mesh>
      <mesh position={[0, h / 2 + t, 0.02]}>
        <planeGeometry args={[width, h]} />
        <meshStandardMaterial
          color="#dcebf5"
          transparent
          opacity={0.18}
          roughness={0.15}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

function BayWindow() {
  const angle = Math.PI / 7;
  const sideW = 2.2;
  return (
    <group position={[0, 0, ROOM.depth / 2 - 0.02]}>
      <group>
        <WindowSection width={3.6} />
      </group>
      <group
        position={[-1.8 - Math.cos(angle) * (sideW / 2), 0, Math.sin(angle) * (sideW / 2)]}
        rotation-y={angle}
      >
        <WindowSection width={sideW} />
      </group>
      <group
        position={[1.8 + Math.cos(angle) * (sideW / 2), 0, Math.sin(angle) * (sideW / 2)]}
        rotation-y={-angle}
      >
        <WindowSection width={sideW} />
      </group>
    </group>
  );
}

function CeilingFan({ position }: { position: [number, number, number] }) {
  const { scene } = useGLTF("/models/ceilingFan.glb");
  const ref = useRef<THREE.Group>(null);
  const object = useMemo(() => scene.clone(true), [scene]);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 1.4;
  });
  return (
    <group position={position} scale={3}>
      <group ref={ref}>
        <primitive object={object} />
      </group>
    </group>
  );
}

function SmallFrame({
  position,
  rotY,
  accent,
  seed,
}: {
  position: [number, number, number];
  rotY: number;
  accent: string;
  seed: number;
}) {
  const texture = useMemo(() => makeMiniArtTexture(seed, accent), [accent, seed]);
  return (
    <group position={position} rotation-y={rotY}>
      <mesh>
        <boxGeometry args={[0.72, 0.92, 0.05]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.032]}>
        <planeGeometry args={[0.6, 0.8]} />
        <meshStandardMaterial
          map={texture}
          emissive="#ffffff"
          emissiveMap={texture}
          emissiveIntensity={0.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function WallPhoto({
  src,
  position,
  rotY = 0,
  scale = 1,
}: {
  src: string;
  position: [number, number, number];
  rotY?: number;
  scale?: number;
}) {
  const raw = useTexture(src);

  let aspect = 0.75;
  const img = raw.image as
    | { naturalWidth?: number; width?: number; naturalHeight?: number; height?: number }
    | undefined;
  if (img) {
    const w = img.naturalWidth ?? img.width ?? 3;
    const h = img.naturalHeight ?? img.height ?? 4;
    if (w > 0 && h > 0) aspect = w / h;
  }

  const tex = useMemo(() => {
    const t = raw.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    t.needsUpdate = true;
    return t;
  }, [raw]);

  const maxH = 0.9 * scale;
  const maxW = 1.15 * scale;
  let planeW = maxH * aspect;
  let planeH = maxH;
  if (planeW > maxW) {
    planeW = maxW;
    planeH = maxW / aspect;
  }

  return (
    <group position={position} rotation-y={rotY}>
      <mesh>
        <boxGeometry args={[planeW + 0.1, planeH + 0.1, 0.05]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, 0.032]}>
        <planeGeometry args={[planeW, planeH]} />
        <meshStandardMaterial
          map={tex}
          emissive="#ffffff"
          emissiveMap={tex}
          emissiveIntensity={0.35}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export default function Room() {
  const floorTexture = useMemo(() => makeFloorTexture(), []);

  return (
    <group>
      <Furniture />

      <mesh rotation-x={-Math.PI / 2}>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial map={floorTexture} roughness={0.7} />
      </mesh>

      <mesh position={[0, ROOM.height, 0]} rotation-x={Math.PI / 2}>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial color="#f7f5f0" roughness={0.95} />
      </mesh>

      {WALLS.map((w, i) => (
        <mesh key={i} position={[w.cx, ROOM.height / 2, w.cz]}>
          <boxGeometry args={[w.hx * 2, ROOM.height, w.hz * 2]} />
          <meshStandardMaterial color={WALL_COLOR} roughness={0.95} />
        </mesh>
      ))}

      {[-6.6, 6.6].map((x) => (
        <group
          key={`back-window-${x}`}
          position={[x, 0, -ROOM.depth / 2 + 0.02]}
        >
          <WindowSection width={3.4} />
        </group>
      ))}

      {(
        [
          [0, 0.045, -ROOM.depth / 2 + 0.06, ROOM.width - 0.2, 0.09, 0.06],
          [0, 0.045, ROOM.depth / 2 - 0.06, ROOM.width - 0.2, 0.09, 0.06],
          [-ROOM.width / 2 + 0.06, 0.045, 0, 0.06, 0.09, ROOM.depth - 0.2],
          [ROOM.width / 2 - 0.06, 0.045, 0, 0.06, 0.09, ROOM.depth - 0.2],
        ] as const
      ).map((s, i) => (
        <mesh key={`baseboard-${i}`} position={[s[0], s[1], s[2]]}>
          <boxGeometry args={[s[3], s[4], s[5]]} />
          <meshStandardMaterial color={FRAME_COLOR} roughness={0.6} />
        </mesh>
      ))}

      <mesh position={[-3.4, 0.21, 4.6]}>
        <cylinderGeometry args={[0.55, 0.58, 0.42, 32]} />
        <meshStandardMaterial color={COLORS.mint} roughness={0.9} />
      </mesh>

      <mesh position={[0, 0.225, 6.95]}>
        <boxGeometry args={[3.2, 0.45, 0.8]} />
        <meshStandardMaterial color={COLORS.white} roughness={0.8} />
      </mesh>

      <SmallFrame position={[-11.95, 2.3, 2.2]} rotY={Math.PI / 2} accent="#00e5ff" seed={1} />
      <SmallFrame position={[7.6, 2.3, 7.46]} rotY={Math.PI} accent="#ff3d81" seed={2} />
      <SmallFrame position={[-7.6, 2.3, 7.46]} rotY={Math.PI} accent="#39ff8b" seed={3} />

      {(
        [
          { src: "/photos/photo-1.jpg", position: [-10, 2.3, -7.46], rotY: 0 },
          { src: "/photos/photo-2.jpg", position: [-3.2, 2.3, -7.46], rotY: 0 },
          { src: "/photos/photo-3.jpg", position: [3.2, 2.3, -7.46], rotY: 0 },
          { src: "/photos/photo-4.jpg", position: [10, 2.3, -7.46], rotY: 0 },
          { src: "/photos/photo-5.jpg", position: [-6, 2.3, 7.46], rotY: Math.PI },
          { src: "/photos/photo-6.jpg", position: [6, 2.3, 7.46], rotY: Math.PI },
          {
            src: "/photos/photo-7.png",
            position: [11.8, 2.3, 5.4],
            rotY: -Math.PI / 2,
            scale: 1.3,
          },
          {
            src: "/photos/photo-8.jpg",
            position: [-11.8, 2.3, -6.45],
            rotY: Math.PI / 2,
          },
        ] as const
      ).map((p) => (
        <WallPhoto key={p.src} src={p.src} position={[...p.position]} rotY={p.rotY} />
      ))}

      <CeilingFan position={[0, ROOM.height, 1.0]} />

      <LightSwitch position={[4.63, 1.45, -7.46]} />

      <BayWindow />

      <group
        position={[ROOM.width / 2 - 0.02, 1.0, -1.5]}
        rotation-y={-Math.PI / 2}
      >
        <WindowSection width={2.4} />
      </group>

      <PendantLamp x={-4.5} z={6.3} withLight />
      <PendantLamp x={4.5} z={6.3} withLight />

      <Outside />
    </group>
  );
}
