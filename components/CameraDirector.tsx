"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { input } from "@/lib/input";
import { PAINTING_SPOTS } from "@/lib/level";
import type { SectionId } from "@/content/sections";

function syncLookFromCamera(camera: THREE.Camera) {
  const e = new THREE.Euler().setFromQuaternion(camera.quaternion, "YXZ");
  input.yaw = e.y;
  input.pitch = e.x;
}

export default function CameraDirector({ openId }: { openId: SectionId | null }) {
  const camera = useThree((s) => s.camera);
  const saved = useRef<{ pos: THREE.Vector3; yaw: number; pitch: number } | null>(
    null,
  );

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dur = reduced ? 0.01 : 1.5;

    if (openId) {
      const spot = PAINTING_SPOTS[openId];
      if (!saved.current) {
        saved.current = {
          pos: camera.position.clone(),
          yaw: input.yaw,
          pitch: input.pitch,
        };
      }
      input.flying = true;
      const dirX = Math.sin(spot.rotY);
      const dirZ = Math.cos(spot.rotY);
      const look = { x: spot.x, y: spot.y, z: spot.z };
      const tl = gsap.timeline({
        onComplete: () => {
          input.flying = false;
          syncLookFromCamera(camera);
        },
      });
      tl.to(
        camera.position,
        {
          x: spot.x + dirX * 3.3,
          y: 1.9,
          z: spot.z + dirZ * 3.3,
          duration: dur,
          ease: "power2.inOut",
        },
        0,
      );
      tl.to(
        look,
        {
          duration: dur,
          ease: "power2.inOut",
          onUpdate: () => camera.lookAt(look.x, look.y, look.z),
        },
        0,
      );
      return () => {
        tl.kill();
      };
    }

    if (saved.current) {
      const s = saved.current;
      saved.current = null;
      input.flying = true;
      const fwdX = -Math.sin(s.yaw);
      const fwdZ = -Math.cos(s.yaw);
      const look = {
        x: camera.position.x + fwdX * 6,
        y: s.pos.y + Math.sin(s.pitch) * 6,
        z: camera.position.z + fwdZ * 6,
      };
      const tl = gsap.timeline({
        onComplete: () => {
          input.flying = false;
          input.moveEnabled = true;
          input.yaw = s.yaw;
          input.pitch = s.pitch;
          camera.rotation.set(s.pitch, s.yaw, 0);
        },
      });
      tl.to(
        camera.position,
        {
          x: s.pos.x,
          y: s.pos.y,
          z: s.pos.z,
          duration: dur,
          ease: "power2.inOut",
        },
        0,
      );
      tl.to(
        look,
        {
          duration: dur,
          ease: "power2.inOut",
          onUpdate: () => camera.lookAt(look.x, look.y, look.z),
        },
        0,
      );
      return () => {
        tl.kill();
      };
    }
  }, [openId, camera]);

  return null;
}
