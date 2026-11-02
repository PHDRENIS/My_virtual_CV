import type { Section } from "@/content/sections";
import type { CSSProperties } from "react";
import ContactList from "./ContactList";

export default function SectionContent({ section }: { section: Section }) {
  const style = { "--neon": section.color } as CSSProperties;
  const titleGlow = { textShadow: `0 0 16px ${section.color}88` };
  return (
    <div className="space-y-6" style={style}>
      <p className="leading-relaxed text-white/80">{section.description}</p>

      {section.items.length > 0 &&
        (section.items.some((i) => i.description) ? (
          <ul className="space-y-3">
            {section.items.map((item) => (
              <li key={item.name}>
                <p className="text-sm font-semibold text-white/90">
                  {item.name}
                  {item.level ? (
                    <span className="font-normal text-white/50">
                      {" "}
                      · {item.level}
                    </span>
                  ) : null}
                </p>
                {item.description && (
                  <p className="mt-0.5 text-sm leading-relaxed text-white/70">
                    {item.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-white/80">
            {section.items.map((item) => (
              <li key={item.name} className="text-sm">
                {item.name}
                {item.level ? (
                  <span className="text-white/50"> · {item.level}</span>
                ) : null}
              </li>
            ))}
          </ul>
        ))}

      {section.projects && (
        <div className="space-y-5">
          {section.projects.map((p) => (
            <article key={p.name}>
              <h3
                className="font-semibold"
                style={{ color: section.color, ...titleGlow }}
              >
                {p.name}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-white/70">
                {p.description}
              </p>
              <p className="mt-2 text-xs text-white/50">{p.tech.join(" · ")}</p>
              {p.link && (
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-sm underline underline-offset-4"
                  style={{ color: section.color }}
                >
                  Ver proyecto →
                </a>
              )}
            </article>
          ))}
        </div>
      )}

      {section.contact && <ContactList items={section.contact} color={section.color} />}

      {section.links && (
        <ul className="flex flex-wrap gap-x-5 gap-y-2">
          {section.links.map((l) => (
            <li key={l.url}>
              <a
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-medium underline underline-offset-4"
                style={{ color: section.color }}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
