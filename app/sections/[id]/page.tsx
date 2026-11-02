import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import SectionContent from "@/components/SectionContent";
import { sections, getSection } from "@/content/sections";
import type { CSSProperties } from "react";

export function generateStaticParams() {
  return sections.map((s) => ({ id: s.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const section = getSection(id);
  if (!section) return { title: "Sección no encontrada" };
  return {
    title: `${section.title} — Galería Neón`,
    description: section.description,
  };
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const section = getSection(id);
  if (!section) notFound();

  const index = sections.findIndex((s) => s.id === section.id);
  const next = sections[(index + 1) % sections.length];

  return (
    <main
      className="min-h-screen bg-[#05050a] px-6 py-14"
      style={{ "--neon": section.color } as CSSProperties}
    >
      <div className="mx-auto max-w-2xl space-y-10">
        <header className="space-y-2">
          <Link
            href="/"
            className="text-sm text-white/50 underline underline-offset-4 hover:text-white"
          >
            ← Volver a la galería 3D
          </Link>
          <p
            className="text-xs font-semibold uppercase tracking-widest"
            style={{ color: section.color }}
          >
            {section.subtitle}
          </p>
          <h1
            className="neon-title text-4xl font-bold"
            style={{ "--neon": section.color } as CSSProperties}
          >
            {section.title}
          </h1>
        </header>

        <SectionContent section={section} />

        <nav className="flex justify-between border-t border-white/10 pt-6">
          <Link href="/" className="text-sm text-white/50 hover:text-white">
            Galería
          </Link>
          <Link
            href={`/sections/${next.id}`}
            className="text-sm text-white/50 hover:text-white"
          >
            Siguiente: {next.title} →
          </Link>
        </nav>
      </div>
    </main>
  );
}
