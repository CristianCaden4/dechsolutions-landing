'use client';

import { useRef } from 'react';
import { useScrollProgress, ease } from './scroll/engine';
import SplitHeading from './fx/SplitHeading';

const CASES = [
  {
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

// deterministic "messy spreadsheet": which cells are filled, flagged red, or knocked out of line
const CELLS = Array.from({ length: 36 }, (_, i) => ({
  fill: (i * 7) % 5 !== 0,
  red: i % 11 === 3 || i % 13 === 7,
  skew: i % 9 === 4 ? ((i % 2) * 2 - 1) * 3 : 0,
  w: 40 + ((i * 37) % 55),
}));

function CaseVisual({ c, flip }) {
  const ref = useRef(null);
  useScrollProgress(
    ref,
    (p) => {
      // wipe while the panel crosses the middle of the screen
      const k = ease.inOutCubic(ease.range(p, 0.3, 0.62));
      ref.current.style.setProperty('--wipe', k.toFixed(4));
    },
    { mode: 'view' }
  );
  return (
    <div ref={ref} className={`case-visual ${flip ? 'flip' : ''}`} aria-hidden="true">
      <div className="case-before">
        <div className="sheet-grid">
          {CELLS.map((cell, i) => (
            <span key={i} className={`sheet-cell ${cell.red ? 'red' : ''}`} style={{ transform: `rotate(${cell.skew}deg)` }}>
              {cell.fill && <i style={{ width: `${cell.w}%` }} />}
            </span>
          ))}
        </div>
        <span className="case-chip before">{c.before}</span>
      </div>
      {/* the wipe is two layers sliding against each other: pure transforms, no repaint */}
      <div className="case-after">
        <div className="case-after__inner">
        <div className="after-board">
          <div className="after-icon">{c.icon}</div>
          {[0, 1, 2].map((k) => (
            <div key={k} className="after-row" style={{ '--k': k }}>
              <span className="mock-dot" />
              <span className="mock-skel w55" />
              <span className="mock-pill">OK</span>
            </div>
          ))}
        </div>
        <span className="case-chip after">{c.after}</span>
        </div>
      </div>
      <span className="case-scanline" />
    </div>
  );
}

export default function CasosSection() {
  return (
    <section data-nav-theme="dark" className="casos" aria-labelledby="casos-title">
      <span className="section-rule" data-reveal aria-hidden="true" />
      <div className="wrap">
        <div className="badge-row dark">
          <span className="badge-num">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
          <span className="badge-pill">Casos de éxito</span>
        </div>
        <SplitHeading id="casos-title" className="section-heading dark casos-heading" text="Cómo lo hemos resuelto." />

        <div className="casos-list">
          {CASES.map((c, i) => (
            <article key={c.tag} className={`case-row ${i % 2 ? 'flip' : ''}`}>
              <CaseVisual c={c} flip={i % 2 === 1} />
              <div className="case-body" data-stagger>
                <p className="case-tag-label">{c.tag}</p>
                <h3>{c.title}</h3>
                <dl className="case-details-grid">
                  <div>
                    <dt>Reto</dt>
                    <dd>{c.reto}</dd>
                  </div>
                  <div>
                    <dt>Solución</dt>
                    <dd>{c.solucion}</dd>
                  </div>
                  <div>
                    <dt>Resultado</dt>
                    <dd>{c.resultado}</dd>
                  </div>
                </dl>
                <div className="case-tags">
                  <span className="case-tag before">{c.before}</span>
                  <span className="case-tag after">{c.after}</span>
                </div>
                <p className="case-approach">Cómo lo abordaríamos: {c.approach}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
