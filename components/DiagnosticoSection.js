'use client';

import { useEffect, useRef, useState } from 'react';
import RollButton from './RollButton';
import { prefersReducedMotion } from './scroll/engine';
import SplitHeading from './fx/SplitHeading';
import Kicker from './fx/Kicker';

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
  integration: 'Necesitas que tus sistemas se comuniquen entre sí: un trabajo de integración y sincronización de información.',
  excel: 'Es momento de migrar de hojas de Excel a un sistema centralizado que reduzca el trabajo manual y el riesgo de errores.',
  growth: 'Tu negocio está listo para escalar con tecnología que crezca junto con la operación, sin perder el control.',
  data: 'Tu negocio está listo para usar mejor sus datos: reportes confiables y visibilidad en tiempo real.',
};

function useTypewriter(text, active) {
  const [out, setOut] = useState('');
  useEffect(() => {
    if (!active) return undefined;
    if (prefersReducedMotion()) {
      setOut(text);
      return undefined;
    }
    let i = 0;
    setOut('');
    const id = setInterval(() => {
      i += 2;
      setOut(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [text, active]);
  return out;
}

export default function DiagnosticoSection() {
  const [selected, setSelected] = useState({});
  const [phase, setPhase] = useState('idle'); // idle | scanning | done
  const [runId, setRunId] = useState(0);
  const panelRef = useRef(null);

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

  const typed = useTypewriter(recommendation, phase === 'done' ? runId : 0);

  const analyze = () => {
    setRunId((n) => n + 1);
    if (prefersReducedMotion()) {
      setPhase('done');
      return;
    }
    setPhase('scanning');
    setTimeout(() => setPhase('done'), 1100);
  };

  return (
    <section id="diagnostico" data-nav-theme="dark" className="diag" aria-labelledby="diag-title">
      <div className="dotted-bg" />
      <div className="wrap diag-layout">
        <div className="diag-copy">
          <div className="diag-labels">
            <Kicker>Diagnóstico</Kicker>
            <span className="diag-flag">Sin IA</span>
            <span className="diag-flag">Sin API</span>
          </div>
          <SplitHeading id="diag-title" className="section-heading dark" text="¿Qué necesita tu empresa para trabajar con más control?" />
          <p className="section-sub dark">
            Selecciona las situaciones que se parecen a tu operación. El resultado se genera en esta página, sin enviar
            información a servidores.
          </p>
          <div className="diag-actions">
            <p className="diag-count">
              <span className="mono">{selectedCount}</span> seleccionadas
            </p>
            <RollButton variant="accent" onClick={analyze} disabled={phase === 'scanning'}>
              Analizar
            </RollButton>
          </div>
        </div>

        <div ref={panelRef} className={`diag-panel liquid-glass ${phase === 'scanning' ? 'is-scanning' : ''}`}>
          <div className="diag-panel__bar mono" aria-hidden="true">
            <span className="status-dot" />
            diagnóstico.local
            <span className="diag-panel__state">{phase === 'scanning' ? 'analizando…' : phase === 'done' ? 'listo' : 'esperando'}</span>
          </div>
          <div className="diag-pills">
            {SITUATIONS.map((s, i) => (
              <button
                key={s.text}
                className={`diag-pill ${selected[i] ? 'selected' : ''}`}
                aria-pressed={!!selected[i]}
                onClick={() => toggle(i)}
                style={{ '--i': i }}
              >
                <span className="diag-pill__check" aria-hidden="true" />
                {s.text}
              </button>
            ))}
          </div>
          <span className="diag-scan" aria-hidden="true" />

          <div className={`diag-result ${phase === 'done' ? 'is-on' : ''}`} aria-live="polite">
            {phase === 'done' && (
              <>
                <p className="diag-result__label mono">RECOMENDACIÓN</p>
                <p className="diag-result__text">
                  <span className="sr-only">{recommendation}</span>
                  <span aria-hidden="true">
                    {typed}
                    <span className="caret" />
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
