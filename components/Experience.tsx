"use client";

import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Player from "./Player";
import Room from "./Room";
import Paintings from "./Paintings";
import CameraDirector from "./CameraDirector";
import SectionPanel from "./SectionPanel";
import TouchJoystick from "./TouchJoystick";
import Lighting from "./Lighting";
import IntroScreen from "./IntroScreen";
import { input } from "@/lib/input";
import { useRoomLight } from "@/lib/roomLight";
import { detectInitialTier } from "@/lib/quality";
import type { QualityTier } from "@/lib/quality";
import { sections } from "@/content/sections";
import type { SectionId } from "@/content/sections";

export default function Experience() {
  const [tier, setTier] = useState<QualityTier>("medium");
  const [hovered, setHovered] = useState<SectionId | null>(null);
  const [openId, setOpenId] = useState<SectionId | null>(null);
  const [hintVisible, setHintVisible] = useState(true);
  const [coarse, setCoarse] = useState(false);
  const [entered, setEntered] = useState(false);
  const hoveredRef = useRef<SectionId | null>(null);
  const openRef = useRef<SectionId | null>(null);

  useEffect(() => {
    input.moveEnabled = entered;
  }, [entered]);
  const dark = useRoomLight();

  useEffect(() => {
    openRef.current = openId;
  }, [openId]);

  useEffect(() => {
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (!entered) return;
    const t = setTimeout(() => setHintVisible(false), 9000);
    return () => clearTimeout(t);
  }, [entered]);

  useEffect(() => {
    let alive = true;
    detectInitialTier()
      .then((t) => {
        if (alive) setTier(t);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const handleHover = useCallback((id: SectionId | null) => {
    hoveredRef.current = id;
    setHovered(id);
  }, []);

  const openSection = useCallback((id: SectionId) => {
    if (!openRef.current) {
      openRef.current = id;
      setOpenId(id);
      input.moveEnabled = false;
      input.keys.clear();
    }
  }, []);

  const closeSection = useCallback(() => {
    if (openRef.current) {
      openRef.current = null;
      setOpenId(null);
    }
  }, []);

  const tryInteract = useCallback(() => {
    if (!openRef.current && hoveredRef.current) openSection(hoveredRef.current);
  }, [openSection]);

  const openSection_ = sections.find((s) => s.id === openId) ?? null;
  const hoveredSection = sections.find((s) => s.id === hovered) ?? null;

  return (
    <div
      className={
        dark ? "fixed inset-0 select-none dark-room" : "fixed inset-0 select-none"
      }
    >
      <Canvas
        className="world-canvas touch-none"
        dpr={
          tier === "low"
            ? 1
            : tier === "medium"
              ? 1.35
              : Math.min(window.devicePixelRatio, 2)
        }
        camera={{ fov: 72, near: 0.1, far: 150, position: [0, 1.6, 5.2] }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#ece9e2"]} />
        <fog attach="fog" args={["#ece9e2", 30, 90]} />
        <PerformanceMonitor
          flipflops={3}
          onFallback={() => setTier("low")}
          onIncline={() =>
            setTier((t) => (t === "low" ? "medium" : "high"))
          }
          onDecline={() =>
            setTier((t) => (t === "high" ? "medium" : "low"))
          }
        />
        <Lighting />
        <Room />
        <Paintings hovered={hovered} onHover={handleHover} onOpen={openSection} />
        <Player onInteract={tryInteract} />
        <CameraDirector openId={openId} />
      </Canvas>

      <div className="vignette pointer-events-none fixed inset-0" />

      {entered && hintVisible && !openId && (
        <div className="pointer-events-none fixed top-4 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-center text-xs text-white/70 sm:text-sm">
          {coarse
            ? "Joystick para moverte · Arrastra para mirar · Toca una pintura"
            : "WASD / flechas para moverte · Arrastra para mirar · E para interactuar · Shift para correr"}
        </div>
      )}

      {entered && hovered && !openId && hoveredSection && (
        <button
          onClick={() => openSection(hoveredSection.id)}
          className="fixed bottom-10 left-1/2 z-10 -translate-x-1/2 text-sm font-medium"
          style={{
            color: hoveredSection.color,
            textShadow: `0 0 14px ${hoveredSection.color}88`,
          }}
        >
          {coarse ? "Toca para ver" : "Pulsa E para ver"} — {hoveredSection.title}
        </button>
      )}

      {coarse && <TouchJoystick />}

      {openSection_ && (
        <SectionPanel section={openSection_} onClose={closeSection} />
      )}

      {!entered && (
        <IntroScreen onEnter={() => setEntered(true)} />
      )}
    </div>
  );
}
