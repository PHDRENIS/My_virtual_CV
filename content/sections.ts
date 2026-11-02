export type SectionId =
  | "skills"
  | "soft-skills"
  | "resume"
  | "projects"
  | "contact";

export interface SectionItem {
  name: string;
  level?: string;
  description?: string;
}

export interface ProjectItem {
  name: string;
  description: string;
  tech: string[];
  link?: string;
}

export interface LinkItem {
  label: string;
  url: string;
}

export interface ContactItem {
  icon: string;
  label: string;
  /** Valor que se muestra (y que se copia si es copiable). */
  value: string;
  /** Valor a copiar si difiere del mostrado. */
  copyValue?: string;
  /** Link al que se puede entrar desde el dato. */
  url?: string;
  /** Texto del link secundario (p. ej. "abrir" / "llamar"). */
  urlLabel?: string;
  /** El click principal copia el valor al portapapeles. */
  copyable?: boolean;
}

export interface Section {
  id: SectionId;
  title: string;
  subtitle: string;
  color: string;
  description: string;
  items: SectionItem[];
  projects?: ProjectItem[];
  links?: LinkItem[];
  contact?: ContactItem[];
}

export const sections: Section[] = [
  {
    id: "skills",
    title: "Skills",
    subtitle: "Habilidades técnicas",
    color: "#00e5ff",
    description:
      "Tecnologías y herramientas con las que trabajo día a día, orientadas al ciclo completo del dato.",
    items: [
      { name: "Python", level: "Intermedio" },
      { name: "SQL" },
      { name: "PyTorch" },
      { name: "TensorFlow" },
      { name: "Machine Learning / DRL" },
      { name: "Visión Computacional" },
      { name: "Apache Spark (PySpark)" },
      { name: "PostgreSQL" },
      { name: "MongoDB" },
      { name: "Next.js" },
      { name: "Streamlit" },
      { name: "Docker" },
      { name: "Git" },
    ],
  },
  {
    id: "soft-skills",
    title: "Habilidades sociales",
    subtitle: "Trabajo en equipo y comunicación",
    color: "#b96bff",
    description:
      "Cómo trabajo con otras personas y enfrento los problemas.",
    items: [
      {
        name: "Comunicación técnica y efectiva",
        description:
          "Capacidad para traducir conceptos de software complejos a lenguajes claros para equipos no técnicos, clientes y stakeholders.",
      },
      {
        name: "Pensamiento analítico y resolución de problemas",
        description:
          "Enfoque metódico para descomponer incidencias complejas, depurar código y encontrar soluciones eficientes bajo presión.",
      },
      {
        name: "Liderazgo técnico y toma de decisiones",
        description:
          "Habilidad para guiar iniciativas tecnológicas, orientar a otros colaboradores, proponer mejores prácticas de desarrollo y tomar decisiones fundamentadas en el diseño de soluciones.",
      },
      {
        name: "Aprendizaje ágil y adaptabilidad",
        description:
          "Facilidad para adoptar e integrar nuevas tecnologías, frameworks y herramientas de Inteligencia Artificial según los requerimientos del proyecto.",
      },
      {
        name: "Colaboración en equipo",
        description:
          "Experiencia trabajando en entornos colaborativos con control de versiones, retroalimentación continua y metodologías ágiles.",
      },
    ],
  },
  {
    id: "resume",
    title: "Resume",
    subtitle: "Resumen profesional",
    color: "#ffb400",
    description:
      "Ingeniero en Inteligencia Artificial (IPN) especializado en el diseño e implementación de soluciones end-to-end. Experiencia práctica en Visión Computacional, Deep Reinforcement Learning y procesamiento de Big Data. Capaz de abarcar el ciclo completo del dato: desde la ingesta y entrenamiento de modelos (PyTorch, TensorFlow) hasta su despliegue en aplicaciones web funcionales (Next.js, Streamlit) y entornos contenedorizados (Docker).",
    items: [
      { name: "Ingeniería en Inteligencia Artificial · IPN", level: "2022 – 2026" },
      { name: "Inglés", level: "Intermedio" },
      { name: "Certificación CENLEX IPN" },
    ],
  },
  {
    id: "projects",
    title: "Proyectos",
    subtitle: "Proyectos destacados",
    color: "#ff3d81",
    description:
      "Una selección de proyectos en los que he trabajado, del entrenamiento de modelos al despliegue.",
    items: [],
    projects: [
      {
        name: "Reconstrucción 3D y Fusión de Sensores",
        description:
          "Pipeline completo para la reconstrucción 3D de escenas interiores mediante completamiento de profundidad. Fine-tuning de modelos YOLO para segmentación y redes EfficientNet UNet para mapas de profundidad, integrado con un sistema de fusión de nubes de puntos y algoritmos geométricos.",
        tech: ["Python", "PyTorch", "YOLO", "SUN RGB-D"],
        link: "https://github.com/PHDRENIS/Reconstruccion_3D",
      },
      {
        name: "Steam Data Lab: Sistema de Recomendación",
        description:
          "Motor de recomendación de videojuegos capaz de procesar grandes volúmenes de datos con Big Data: ingesta masiva con Apache Spark, modelo híbrido con NLP sobre reseñas, contenedorización en Docker y una interfaz interactiva desarrollada en Streamlit.",
        tech: ["PySpark", "NLP", "Streamlit", "Docker"],
        link: "https://github.com/PHDRENIS/Steam-Data-Lab",
      },
      {
        name: "Plataforma de Recomendación de Libros",
        description:
          "Aplicación web inteligente para la biblioteca central Miguel L. Lira de Tlaxcala que integra búsquedas semánticas y recomendación de libros. Frontend desarrollado con Next.js y backend en Python para las peticiones del motor de recomendación.",
        tech: ["Next.js", "Python", "Búsqueda Vectorial"],
      },
      {
        name: "Entrenamiento de Agentes DRL",
        description:
          "Estudio e implementación de arquitecturas DQN y Res-DQN para la resolución autónoma de videojuegos de Atari, logrando convergencia rápida y menor volatilidad en entornos complejos con PyTorch.",
        tech: ["PyTorch", "Deep Q-Networks (DQN, Res-DQN)"],
        link: "https://github.com/PHDRENIS/Proyecto_Redes",
      },
    ],
  },
  {
    id: "contact",
    title: "Contacto",
    subtitle: "Hablemos",
    color: "#39ff8b",
    description:
      "¿Interesado en trabajar juntos? Cualquiera de estos medios sirve; el teléfono y el correo se copian al hacer click.",
    items: [],
    contact: [
      {
        icon: "📞",
        label: "Teléfono",
        value: "238 102 2171",
        copyValue: "2381022171",
        url: "tel:+522381022171",
        urlLabel: "llamar",
        copyable: true,
      },
      {
        icon: "📧",
        label: "Email",
        value: "renealejanso@gmail.com",
        url: "mailto:renealejanso@gmail.com",
        urlLabel: "abrir",
        copyable: true,
      },
      {
        icon: "📍",
        label: "Ubicación",
        value: "Puebla, Puebla",
      },
      {
        icon: "💻",
        label: "GitHub",
        value: "github.com/PHDRENIS",
        url: "https://github.com/PHDRENIS",
        urlLabel: "abrir",
      },
      {
        icon: "🔗",
        label: "LinkedIn",
        value: "linkedin.com/in/rene-alejandro-santos-mora-a35902357",
        url: "https://www.linkedin.com/in/rene-alejandro-santos-mora-a35902357/",
        urlLabel: "abrir",
      },
    ],
  },
];

export function getSection(id: string): Section | undefined {
  return sections.find((s) => s.id === id);
}
