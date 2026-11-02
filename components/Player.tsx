"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { input } from "@/lib/input";
import { collideCircle } from "@/lib/collisions";
import { COLLIDERS, PLAYER_START } from "@/lib/level";

const SPEED = 4.2;
const SPRINT = 7;
const RADIUS = 0.45;

export default function Player({ onInteract }: { onInteract: () => void }) {
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);
  const interactWas = useRef(false);

  useEffect(() => {
    camera.rotation.order = "YXZ";
    camera.position.set(PLAYER_START.x, PLAYER_START.y, PLAYER_START.z);
  }, [camera]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => input.keys.add(e.code);
    const up = (e: KeyboardEvent) => input.keys.delete(e.code);
    const blur = () => input.keys.clear();
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, []);

  useEffect(() => {
    const el = gl.domElement;
    const onDown = (e: PointerEvent) => {
      if (input.flying || !input.moveEnabled) return;
      drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY };
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!drag.current || drag.current.id !== e.pointerId) return;
      const dx = e.clientX - drag.current.x;
      const dy = e.clientY - drag.current.y;
      drag.current.x = e.clientX;
      drag.current.y = e.clientY;
      input.yaw -= dx * 0.0032;
      input.pitch = THREE.MathUtils.clamp(
        input.pitch - dy * 0.0032,
        -1.25,
        1.25,
      );
    };
    const onUp = (e: PointerEvent) => {
      if (drag.current?.id === e.pointerId) drag.current = null;
    };
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
  }, [gl]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);

    if (!input.flying) {
      camera.rotation.set(input.pitch, input.yaw, 0);
    }

    if (input.moveEnabled && !input.flying) {
      const k = input.keys;
      let f =
        (k.has("KeyW") || k.has("ArrowUp") ? 1 : 0) -
        (k.has("KeyS") || k.has("ArrowDown") ? 1 : 0);
      let r =
        (k.has("KeyD") || k.has("ArrowRight") ? 1 : 0) -
        (k.has("KeyA") || k.has("ArrowLeft") ? 1 : 0);
      f += input.joystick.y;
      r += input.joystick.x;
      const len = Math.hypot(f, r);
      if (len > 0.01) {
        if (len > 1) {
          f /= len;
          r /= len;
        }
        const speed =
          k.has("ShiftLeft") || k.has("ShiftRight") ? SPRINT : SPEED;
        const sin = Math.sin(input.yaw);
        const cos = Math.cos(input.yaw);
        const p = {
          x: camera.position.x + (-sin * f + cos * r) * speed * delta,
          z: camera.position.z + (-cos * f - sin * r) * speed * delta,
        };
        collideCircle(p, RADIUS, COLLIDERS);
        camera.position.x = p.x;
        camera.position.z = p.z;
      }
    }

    const pressed = input.keys.has("KeyE");
    if (pressed && !interactWas.current) onInteract();
    interactWas.current = pressed;
  });

  return null;
}
