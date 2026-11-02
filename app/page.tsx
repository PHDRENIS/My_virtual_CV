import ExperienceLoader from "@/components/ExperienceLoader";
import { sections } from "@/content/sections";

export default function Home() {
  return (
    <main className="fixed inset-0 overflow-hidden bg-[#ece9e2]">
      <h1 className="sr-only">Galería Neón — Portfolio 3D</h1>
      <p className="sr-only">
        Portfolio personal interactivo: recorre una galería 3D estilo neón y
        acércate a las pinturas para conocer mis skills, habilidades blandas,
        proyectos y contacto.
      </p>
      <ExperienceLoader />
      <ul className="sr-only">
        {sections.map((s) => (
          <li key={s.id}>
            <a href={`/sections/${s.id}`}>{s.title}</a>
          </li>
        ))}
      </ul>
      <noscript>
        <ul>
          {sections.map((s) => (
            <li key={s.id}>
              <a href={`/sections/${s.id}`}>{s.title}</a>
            </li>
          ))}
        </ul>
      </noscript>
    </main>
  );
}
