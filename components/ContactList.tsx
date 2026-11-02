"use client";

import { useRef, useState } from "react";
import type { ContactItem } from "@/content/sections";

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  }
}

export default function ContactList({
  items,
  color,
}: {
  items: ContactItem[];
  color: string;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = async (item: ContactItem) => {
    const ok = await copyText(item.copyValue ?? item.value);
    if (!ok) return;
    setCopied(item.label);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(null), 2000);
  };

  const accent = { color, textShadow: `0 0 12px ${color}55` };

  return (
    <ul className="space-y-3 text-sm">
      {items.map((item) => (
        <li key={item.label} className="flex flex-wrap items-baseline gap-x-2">
          <span aria-hidden className="text-base leading-none">
            {item.icon}
          </span>
          <span className="text-white/50">{item.label}:</span>

          {item.copyable ? (
            <button
              type="button"
              onClick={() => handleCopy(item)}
              title="Click para copiar"
              className="cursor-pointer bg-transparent p-0 text-left font-medium underline decoration-dotted underline-offset-4 transition-colors hover:decoration-solid"
              style={accent}
            >
              {copied === item.label ? "¡Copiado ✓!" : item.value}
            </button>
          ) : (
            <span className="font-medium text-white/85">{item.value}</span>
          )}

          {item.url && (
            <a
              href={item.url}
              target={item.url.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="text-xs text-white/45 underline underline-offset-4 hover:text-white/80"
            >
              {item.urlLabel ?? "abrir"} ↗
            </a>
          )}
        </li>
      ))}
    </ul>
  );
}
