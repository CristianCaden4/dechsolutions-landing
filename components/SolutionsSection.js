const SOLUTIONS = [
  {
    title: 'Software a la medida',
    desc: 'Creamos sistemas ajustados a la forma real en que trabaja tu empresa.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64CEFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    ),
  },
  {
    title: 'PYME Core ERP',
    desc: 'Centralizamos ventas, compras, inventario, clientes y reportes en una base modular.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64CEFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="6" rx="8" ry="3"></ellipse>
        <path d="M4 6v12a8 3 0 0016 0V6"></path>
        <path d="M4 12a8 3 0 0016 0"></path>
      </svg>
    ),
  },
  {
    title: 'LexCore',
    desc: 'El sistema legal que centraliza casos, clientes y facturación para abogados y firmas jurídicas.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64CEFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 11l-5-9L6 11"></path>
        <path d="M2 16l4-5 4 5a4 4 0 01-8 0z"></path>
        <path d="M14 16l4-5 4 5a4 4 0 01-8 0z"></path>
        <path d="M11 2v18"></path>
        <path d="M6 20h10"></path>
      </svg>
    ),
  },
  {
    title: 'Automatización de procesos',
    desc: 'Eliminamos tareas repetitivas para que tu equipo ahorre tiempo y reduzca errores.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64CEFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
      </svg>
    ),
  },
  {
    title: 'IA aplicada al negocio',
    desc: 'Usamos inteligencia artificial solo cuando ayuda a decidir mejor o analizar datos útiles.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64CEFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l1.6 4.8L18 9.4l-4.4 1.6L12 16l-1.6-5-4.4-1.6 4.4-1.6L12 3z"></path>
        <path d="M19 15l0.7 2.1L22 17.8l-2.3 0.7L19 20.6l-0.7-2.1L16 17.8l2.3-0.7z"></path>
      </svg>
    ),
  },
  {
    title: 'Transformación tecnológica',
    desc: 'Convertimos procesos dispersos en una operación más ordenada y preparada para crecer.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64CEFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
      </svg>
    ),
  },
];

export default function SolutionsSection() {
  return (
    <section id="soluciones" data-nav-theme="light" style={{ background: '#fff', padding: '100px 0' }}>
      <div className="wrap">
        <p className="eyebrow">SOLUCIONES DETALLADAS</p>
        <h2 className="section-heading light" style={{ maxWidth: 820 }}>
          Construimos la tecnología que tu operación necesita.
        </h2>
        <p className="section-sub light">
          Te ayudamos a ordenar la operación, ahorrar tiempo y tomar decisiones con información confiable.
        </p>

        <div className="solutions-grid">
          {SOLUTIONS.map((s, i) => (
            <div
              key={s.title}
              className="solution-card"
              data-reveal
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              {s.icon}
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
