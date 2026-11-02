"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import gsap from "gsap";
import SectionContent from "./SectionContent";
import type { Section } from "@/content/sections";

export default function SectionPanel({
  section,
  onClose,
}: {
  section: Section;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      gsap.fromTo(
        ref.current,
        { y: 48, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, ease: "power3.out", delay: 0.85 },
      );
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-20 flex items-end justify-center p-4 sm:items-center"
      style={{ "--neon": section.color } as CSSProperties}
    >
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        ref={ref}
        className="relative max-h-[82vh] w-full max-w-2xl overflow-y-auto rounded-2xl border bg-[#0a0a14]/95 p-6 sm:p-8"
        style={{
          borderColor: `${section.color}55`,
          boxShadow: `0 0 48px ${section.color}30`,
        }}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: section.color }}
            >
              {section.subtitle}
            </p>
            <h2
              className="neon-title mt-1 text-3xl font-bold"
              style={{ "--neon": section.color } as CSSProperties}
            >
              {section.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded-full border border-white/15 px-3 py-1 text-sm text-white/70 transition hover:border-white/40 hover:text-white"
          >
            Cerrar ✕
          </button>
        </div>
        <SectionContent section={section} />
      </div>
    </div>
  );
}
