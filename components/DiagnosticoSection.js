'use client';

import { useState } from 'react';

const SITUATIONS = [
  { text: 'Controlamos procesos en Excel', tag: 'excel' },
  { text: 'No tenemos control del inventario', tag: 'erp' },
  { text: 'Necesitamos automatizar tareas repetitivas', tag: 'automation' },
  { text: 'El software actual no se adapta', tag: 'erp' },
  { text: 'Queremos centralizar la operación', tag: 'erp' },
  { text: 'Perdemos tiempo copiando información', tag: 'automation' },
  { text: 'Tenemos muchos procesos manuales', tag: 'automation' },
  { text: 'Queremos organizar mejor las ventas', tag: 'erp' },
  { text: 'Necesitamos controlar compras', tag: 'erp' },
  { text: 'Tenemos información duplicada', tag: 'integration' },
  { text: 'Queremos que nuestros sistemas se comuniquen', tag: 'integration' },
  { text: 'Necesitamos trazabilidad', tag: 'integration' },
  { text: 'Queremos crecer sin perder el control', tag: 'growth' },
  { text: 'Dependemos demasiado de Excel', tag: 'excel' },
  { text: 'Queremos usar mejor nuestros datos', tag: 'data' },
];

const RECOMMENDATIONS = {
  erp: 'Tu operación necesita un ERP modular como PYME Core, para centralizar ventas, compras, inventario y reportes en un solo lugar.',
  automation: 'Tu empresa se beneficiaría de automatizar procesos manuales y repetitivos para ganar tiempo y reducir errores.',
  integration: 'Necesitas que tus sistemas se comuniquen entre sí — un trabajo de integración y sincronización de información.',
  excel: 'Es momento de migrar de hojas de Excel a un sistema centralizado que reduzca el trabajo manual y el riesgo de errores.',
  growth: 'Tu negocio está listo para escalar con tecnología que crezca junto con la operación, sin perder el control.',
  data: 'Tu negocio está listo para usar mejor sus datos: reportes confiables y visibilidad en tiempo real.',
};

export default function DiagnosticoSection() {
  const [selected, setSelected] = useState({});
  const [analyzed, setAnalyzed] = useState(false);

  const toggle = (i) => {
    setSelected((s) => ({ ...s, [i]: !s[i] }));
  };

  const selectedIdxs = Object.keys(selected).filter((k) => selected[k]);
  const selectedCount = selectedIdxs.length;

  const tagCounts = {};
  selectedIdxs.forEach((i) => {
    const tag = SITUATIONS[i].tag;
    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
  });
  let topTag = null;
  let topCount = 0;
  Object.keys(tagCounts).forEach((tag) => {
    if (tagCounts[tag] > topCount) {
      topCount = tagCounts[tag];
      topTag = tag;
    }
  });
  const recommendation = topTag
    ? RECOMMENDATIONS[topTag]
    : 'Selecciona al menos una situación para ver una recomendación.';

  return (
    <section id="diagnostico" data-nav-theme="dark" style={{ position: 'relative', background: '#0A0A0A', padding: '100px 0', overflow: 'hidden' }}>
      <div className="dotted-bg" />
      <div className="wrap-narrow" style={{ position: 'relative' }}>
        <p className="eyebrow">DIAGNÓSTICO · SIN IA · SIN API</p>
        <h2 className="section-heading dark" style={{ maxWidth: 700, fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>
          ¿Qué necesita tu empresa para trabajar con más control?
        </h2>
        <p className="section-sub dark" style={{ marginBottom: 40 }}>
          Selecciona las situaciones que se parecen a tu operación. El resultado se genera en esta
          página, sin enviar información a servidores.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 32 }}>
          {SITUATIONS.map((s, i) => (
            <button
              key={s.text}
              className={`diag-pill ${selected[i] ? 'selected' : ''}`}
              onClick={() => toggle(i)}
            >
              {s.text}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: 0 }}>{selectedCount} seleccionadas</p>
          <button className="btn-analyze" onClick={() => setAnalyzed(true)}>
            Analizar
          </button>
        </div>

        {analyzed && (
          <div style={{ marginTop: 32, border: '1px solid rgba(100,206,251,0.3)', background: 'rgba(100,206,251,0.06)', borderRadius: 16, padding: '24px 28px' }}>
            <p style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 10px' }}>
              RECOMENDACIÓN
            </p>
            <p style={{ color: '#fff', fontSize: 16, lineHeight: 1.6, margin: 0 }}>{recommendation}</p>
          </div>
        )}
      </div>
    </section>
  );
}
