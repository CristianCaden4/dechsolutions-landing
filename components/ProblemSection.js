const FRAGMENTED = ['Excel', 'Procesos manuales', 'Información dispersa', 'Software aislado', 'Tareas repetitivas'];
const CONNECTED = ['Sistemas integrados', 'Procesos automatizados', 'Información centralizada', 'Visibilidad en tiempo real'];

export default function ProblemSection() {
  return (
    <section data-nav-theme="dark" style={{ position: 'relative', background: '#0A0A0A', padding: '100px 0', overflow: 'hidden' }}>
      <div className="dotted-bg" />
      <div className="wrap" style={{ position: 'relative' }}>
        <p className="eyebrow">EL PROBLEMA</p>
        <h2 className="section-heading dark" style={{ maxWidth: 820 }}>
          Tu empresa no debería adaptarse a un software rígido.
        </h2>
        <p className="section-sub dark" style={{ marginBottom: 64 }}>
          La tecnología debería adaptarse a tu negocio y a la forma en que realmente funciona.
        </p>

        <div className="problem-grid">
          <div className="problem-card frag">
            <p style={{ color: '#f87171', fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', margin: '0 0 18px' }}>
              Operación fragmentada
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {FRAGMENTED.map((tag, i) => (
                <span key={tag} className="problem-tag frag" style={{ animationDuration: `${3.6 + i * 0.3}s` }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="problem-arrow">
            <div className="problem-arrow-dot" />
          </div>

          <div className="problem-card conn">
            <p style={{ color: 'var(--accent)', fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', margin: '0 0 18px' }}>
              Operación conectada
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CONNECTED.map((tag, i) => (
                <span key={tag} className="problem-tag conn" style={{ animationDuration: `${3.8 + i * 0.3}s` }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
