"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { sections } from "@/content/sections";

const Experience = dynamic(() => import("./Experience"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 flex items-center justify-center bg-[#ece9e2]">
      <p className="animate-pulse text-sm uppercase tracking-widest text-neutral-500">
        Cargando galería…
      </p>
    </div>
  ),
});

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") || canvas.getContext("webgl")
    );
  } catch {
    return false;
  }
}

export default function ExperienceLoader() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(hasWebGL());
  }, []);

  if (supported === null) return null;

  if (!supported) {
    return (
      <div className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-[#ece9e2] p-6">
        <div className="max-w-md space-y-4 text-center">
          <h2 className="text-2xl font-bold text-neutral-800">Galería Neón</h2>
          <p className="text-sm text-white/60">
            Tu navegador no soporta WebGL, pero puedes leer todas las secciones
            aquí:
          </p>
          <ul className="space-y-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`/sections/${s.id}`}
                  className="neon-pill inline-block rounded-full px-4 py-2"
                  style={{ "--neon": s.color } as React.CSSProperties}
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return <Experience />;
}
