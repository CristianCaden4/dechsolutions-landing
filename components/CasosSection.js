const CASES = [
  {
    key: 'a',
    tag: 'DISTRIBUCIÓN',
    title: 'Control de inventario y rutas de entrega.',
    reto: 'Inventario descontrolado y rutas sin visibilidad.',
    solucion: 'Sistema centralizado de bodega y despacho.',
    resultado: 'Visibilidad en tiempo real de stock y entregas.',
    before: 'Antes: Excel',
    after: 'Después: Sistema en tiempo real',
    approach: 'diagnóstico de flujo de bodega, diseño de módulo de rutas, integración con ventas.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#64CEFB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"></rect>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
        <circle cx="5.5" cy="18.5" r="2.5"></circle>
        <circle cx="18.5" cy="18.5" r="2.5"></circle>
      </svg>
    ),
  },
  {
    key: 'b',
    tag: 'SERVICIOS',
    title: 'Gestión de casos y facturación para una firma legal.',
    reto: 'Casos y clientes dispersos en documentos sueltos.',
    solucion: 'LexCore como CRM legal y facturación unificada.',
    resultado: 'Trazabilidad completa de cada caso y cliente.',
    before: 'Antes: Documentos sueltos',
    after: 'Después: CRM legal centralizado',
    approach: 'mapeo de flujo de casos, migración de datos, capacitación del equipo.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#64CEFB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    ),
  },
  {
    key: 'a',
    tag: 'COMERCIO',
    title: 'Ventas, inventario y clientes en una sola plataforma.',
    reto: 'Ventas registradas en múltiples hojas sin cruce de información.',
    solucion: 'PYME Core integrando ventas, inventario y clientes.',
    resultado: 'Reportes consolidados y decisiones más rápidas.',
    before: 'Antes: Hojas sueltas',
    after: 'Después: Plataforma unificada',
    approach: 'consolidación de catálogos, configuración de módulos, reportes a medida.',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#64CEFB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 01-8 0"></path>
      </svg>
    ),
  },
];

export default function CasosSection() {
  return (
    <section data-nav-theme="dark" style={{ position: 'relative', background: '#0A0A0A', padding: '100px 0', overflow: 'hidden' }}>
      <div className="wrap-narrow" style={{ position: 'relative' }}>
        <p className="eyebrow">CASOS DE ÉXITO</p>
        <h2 className="section-heading dark" style={{ maxWidth: 820, marginBottom: 64 }}>
          Cómo lo hemos resuelto.
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 56 }}>
          {CASES.map((c, i) => (
            <div key={c.tag} className={`case-row ${c.key}`} data-reveal style={{ transitionDelay: `${i * 0.08}s` }}>
              {c.key === 'b' ? (
                <>
                  <div>
                    <CaseBody c={c} />
                  </div>
                  <div className="case-icon">{c.icon}</div>
                </>
              ) : (
                <>
                  <div className="case-icon">{c.icon}</div>
                  <div>
                    <CaseBody c={c} />
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseBody({ c }) {
  return (
    <>
      <p style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 10px' }}>
        {c.tag}
      </p>
      <h3 style={{ color: '#fff', fontSize: 22, fontWeight: 600, margin: '0 0 20px' }}>{c.title}</h3>
      <div className="case-details-grid">
        <div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 6px' }}>Reto</p>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.5, margin: 0 }}>{c.reto}</p>
        </div>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 6px' }}>Solución</p>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.5, margin: 0 }}>{c.solucion}</p>
        </div>
        <div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 6px' }}>Resultado</p>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, lineHeight: 1.5, margin: 0 }}>{c.resultado}</p>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        <span className="case-tag before">{c.before}</span>
        <span className="case-tag after">{c.after}</span>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, margin: 0 }}>
        Cómo lo abordaríamos: {c.approach}
      </p>
    </>
  );
}
