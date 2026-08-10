const STEPS = [
  { n: '01', title: 'Entendemos', desc: 'Conocemos tu operación, procesos y objetivos.' },
  { n: '02', title: 'Analizamos', desc: 'Identificamos problemas, oportunidades y necesidades tecnológicas.' },
  { n: '03', title: 'Diseñamos', desc: 'Definimos la solución, arquitectura y experiencia.' },
  { n: '04', title: 'Construimos', desc: 'Desarrollamos, integramos e implementamos.' },
  { n: '05', title: 'Evolucionamos', desc: 'Medimos, mejoramos y hacemos crecer la tecnología junto a tu empresa.' },
];

export default function MethodologySection() {
  return (
    <section id="metodologia" data-nav-theme="light" style={{ background: '#FAFAFA', padding: '100px 0' }}>
      <div className="wrap-narrow">
        <p className="eyebrow">CÓMO TRABAJAMOS</p>
        <h2 className="section-heading light">No empezamos escribiendo código.</h2>
        <p className="section-sub light" style={{ marginBottom: 72 }}>
          Primero entendemos el problema. Después diseñamos la tecnología correcta para resolverlo.
        </p>

        <div style={{ position: 'relative' }}>
          <div className="timeline-track" />
          <div className="timeline-fill reveal-line" data-reveal />
          <div className="timeline-grid">
            {STEPS.map((step, i) => (
              <div key={step.n} data-reveal style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="timeline-dot" />
                <p style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 700, margin: '0 0 6px' }}>{step.n}</p>
                <h3 style={{ color: 'var(--ink)', fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>{step.title}</h3>
                <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.5, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
