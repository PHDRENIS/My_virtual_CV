"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function IntroScreen({ onEnter }: { onEnter: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const leaving = useRef(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: "power2.out" },
    );
    const content = el.querySelector<HTMLElement>(".intro-content");
    if (content) {
      gsap.fromTo(
        content,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.1, ease: "power3.out" },
      );
    }
  }, []);

  const enter = () => {
    const el = root.current;
    if (!el || leaving.current) return;
    leaving.current = true;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      gsap.to(el, { opacity: 0, duration: 0.3, onComplete: onEnter });
      return;
    }

    const content = el.querySelector<HTMLElement>(".intro-content");
    const left = el.querySelector<HTMLElement>(".intro-left");
    const right = el.querySelector<HTMLElement>(".intro-right");
    if (!content || !left || !right) {
      onEnter();
      return;
    }

    const tl = gsap.timeline({ onComplete: onEnter });
    tl.to(content, { opacity: 0, scale: 0.96, duration: 0.35, ease: "power2.in" });
    tl.to(left, { xPercent: -102, duration: 1.1, ease: "power3.inOut" }, "-=0.2");
    tl.to(right, { xPercent: 102, duration: 1.1, ease: "power3.inOut" }, "<");
  };

  return (
    <div
      ref={root}
      role="button"
      tabIndex={0}
      aria-label="Click para entrar"
      onClick={enter}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          enter();
        }
      }}
      className="fixed inset-0 z-40 cursor-pointer overflow-hidden"
    >
      <div className="intro-left absolute inset-y-0 left-0 w-1/2 bg-white" />
      <div className="intro-right absolute inset-y-0 right-0 w-1/2 bg-white" />

      <div className="intro-content relative z-10 flex h-full flex-col items-center justify-center gap-10 px-6 text-center">
        <h1 className="text-4xl font-bold text-[#16161d] sm:text-6xl">
          Bienvenido a{" "}
          <span
            className="font-bold"
            style={{ color: "#ff3d81", textShadow: "0 0 24px #ff3d8166" }}
          >
            mi vida
          </span>
        </h1>
        <p
          className="text-lg font-medium transition-transform hover:scale-105"
          style={{ color: "#ff3d81", textShadow: "0 0 14px #ff3d8177" }}
        >
          Click para entrar
        </p>
        <p className="text-xs uppercase tracking-widest text-neutral-400">
          Rene Santos
        </p>
      </div>
    </div>
  );
}
