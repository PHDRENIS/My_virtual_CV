"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useRoomLight } from "@/lib/roomLight";
export default function Lighting() {
  const gl = useThree((s) => s.gl);
  const dark = useRoomLight();

  const glRef = useRef<THREE.WebGLRenderer | null>(null);
  const ambient = useRef<THREE.AmbientLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);
  const dir = useRef<THREE.DirectionalLight>(null);
  const desk = useRef<THREE.PointLight>(null);
  const flickerUntil = useRef(0);
  const prevDark = useRef(dark);

  useEffect(() => {
    glRef.current = gl;
  }, [gl]);

  useEffect(() => {
    if (prevDark.current !== dark) {
      prevDark.current = dark;
      flickerUntil.current = performance.now() + (dark ? 380 : 0);
    }
  }, [dark]);

  useFrame((_, delta) => {
    const k = Math.min(1, delta * 5);
    const flicker =
      performance.now() < flickerUntil.current ? 0.45 + Math.random() * 0.75 : 1;

    const setIntensity = (
      light: THREE.Light | null,
      on: number,
      off: number,
    ) => {
      if (light) {
        light.intensity += ((dark ? off : on) * flicker - light.intensity) * k;
      }
    };
    setIntensity(ambient.current, 1.1, 0.3);
    setIntensity(hemi.current, 0.55, 0.14);
    setIntensity(dir.current, 1.1, 0.24);
    setIntensity(desk.current, 8, 1.6);

    if (glRef.current) {
      const target = dark ? 0.24 : 1;
      glRef.current.toneMappingExposure +=
        (target - glRef.current.toneMappingExposure) * k;
    }
  });

  return (
    <>
      <ambientLight ref={ambient} intensity={1.1} color="#ffffff" />
      <hemisphereLight
        ref={hemi}
        intensity={0.55}
        color="#ffffff"
        groundColor="#d8cfc0"
      />
      <directionalLight
        ref={dir}
        position={[0, 7, 14]}
        intensity={1.1}
        color="#fff2dd"
      />
      <pointLight
        ref={desk}
        position={[0, 2.8, 1.2]}
        intensity={8}
        color="#ffca7a"
        distance={7}
      />
    </>
  );
}
