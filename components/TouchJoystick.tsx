"use client";

import { useEffect, useRef, useState } from "react";
import { input } from "@/lib/input";

const R = 44;

export default function TouchJoystick() {
  const [coarse, setCoarse] = useState(false);
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const pid = useRef<number | null>(null);

  useEffect(() => {
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  if (!coarse) return null;

  const setKnob = (dx: number, dy: number) => {
    if (knobRef.current) {
      knobRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
    }
  };

  const onMove = (e: React.PointerEvent) => {
    if (pid.current !== e.pointerId || !baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    let dx = e.clientX - (rect.left + rect.width / 2);
    let dy = e.clientY - (rect.top + rect.height / 2);
    const d = Math.hypot(dx, dy);
    if (d > R) {
      dx = (dx / d) * R;
      dy = (dy / d) * R;
    }
    setKnob(dx, dy);
    input.joystick.x = dx / R;
    input.joystick.y = -dy / R;
  };

  const onDown = (e: React.PointerEvent) => {
    pid.current = e.pointerId;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    onMove(e);
  };

  const onUp = () => {
    pid.current = null;
    input.joystick.x = 0;
    input.joystick.y = 0;
    setKnob(0, 0);
  };

  return (
    <div
      ref={baseRef}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      className="fixed bottom-8 left-8 z-10 flex size-28 touch-none items-center justify-center rounded-full border border-cyan-400/40 bg-white/5"
      aria-label="Joystick de movimiento"
    >
      <div
        ref={knobRef}
        className="size-12 rounded-full border border-cyan-300/70 bg-cyan-400/20 shadow-[0_0_16px_rgba(0,229,255,0.5)]"
      />
    </div>
  );
}
