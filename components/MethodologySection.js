'use client';

import { useEffect, useRef } from 'react';
import { useScrollProgress, ease } from './scroll/engine';
import SplitHeading from './fx/SplitHeading';

const STEPS = [
  { n: '01', title: 'Entendemos', desc: 'Conocemos tu operación, procesos y objetivos.' },
  { n: '02', title: 'Analizamos', desc: 'Identificamos problemas, oportunidades y necesidades tecnológicas.' },
  { n: '03', title: 'Diseñamos', desc: 'Definimos la solución, arquitectura y experiencia.' },
  { n: '04', title: 'Construimos', desc: 'Desarrollamos, integramos e implementamos.' },
  { n: '05', title: 'Evolucionamos', desc: 'Medimos, mejoramos y hacemos crecer la tecnología junto a tu empresa.' },
];

export default function MethodologySection() {
  const traceRef = useRef(null);
  const basePathRef = useRef(null);
  const fillPathRef = useRef(null);
  const headRef = useRef(null);
  const geo = useRef({ len: 0, stops: [] });

  // Build an orthogonal "circuit" path through every node, with rounded elbows.
  useEffect(() => {
    const trace = traceRef.current;
    const build = () => {
      const box = trace.getBoundingClientRect();
      const nodes = [...trace.querySelectorAll('.trace-node')].map((n) => {
        const r = n.getBoundingClientRect();
        return [r.left - box.left + r.width / 2, r.top - box.top + r.height / 2];
      });
      if (!nodes.length) return;
      const R = 18;
      let d = `M ${nodes[0][0]} ${nodes[0][1] - 40}`;
      d += ` L ${nodes[0][0]} ${nodes[0][1]}`;
      for (let i = 1; i < nodes.length; i++) {
        const [x0, y0] = nodes[i - 1];
        const [x1, y1] = nodes[i];
        if (Math.abs(x1 - x0) < 1) {
          d += ` L ${x1} ${y1}`;
          continue;
        }
        const midY = (y0 + y1) / 2;
        const sx = Math.sign(x1 - x0);
        const r = Math.min(R, Math.abs(x1 - x0) / 2, Math.abs(midY - y0));
        d += ` L ${x0} ${midY - r} Q ${x0} ${midY} ${x0 + sx * r} ${midY}`;
        d += ` L ${x1 - sx * r} ${midY} Q ${x1} ${midY} ${x1} ${midY + r}`;
        d += ` L ${x1} ${y1}`;
      }
      const last = nodes[nodes.length - 1];
      d += ` L ${last[0]} ${last[1] + 40}`;
      [basePathRef.current, fillPathRef.current].forEach((p) => p.setAttribute('d', d));
      const svg = basePathRef.current.ownerSVGElement;
      svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
      const path = fillPathRef.current;
      const len = path.getTotalLength();
      path.style.strokeDasharray = `${len}`;
      // where along the path each node sits
      const stops = nodes.map(([nx, ny]) => {
        let best = 0;
        let bestD = Infinity;
        for (let s = 0; s <= 200; s++) {
          const pt = path.getPointAtLength((s / 200) * len);
          const dd = (pt.x - nx) ** 2 + (pt.y - ny) ** 2;
          if (dd < bestD) {
            bestD = dd;
            best = s / 200;
          }
        }
        return best;
      });
      geo.current = { len, stops };
    };
    build();
    const ro = new ResizeObserver(build);
    ro.observe(trace);
    return () => ro.disconnect();
  }, []);

  useScrollProgress(
    traceRef,
    (p) => {
      const { len, stops } = geo.current;
      if (!len) return;
      // drawn while the trace crosses the middle of the screen
      const f = ease.range(p, 0.22, 0.72);
      fillPathRef.current.style.strokeDashoffset = `${len * (1 - f)}`;
      const pt = fillPathRef.current.getPointAtLength(len * f);
      headRef.current.setAttribute('cx', pt.x);
      headRef.current.setAttribute('cy', pt.y);
      headRef.current.style.opacity = f > 0.001 && f < 0.999 ? 1 : 0;
      traceRef.current.querySelectorAll('.trace-step').forEach((el, i) => {
        el.classList.toggle('is-on', f >= stops[i] - 0.005);
      });
    },
    { mode: 'view', reducedValue: 0.72 }
  );

  return (
    <section id="metodologia" data-nav-theme="light" className="method" aria-labelledby="method-title">
      <div className="wrap-narrow">
        <div className="method-head">
          <SplitHeading
            id="method-title"
            className="section-heading light"
            text="No empezamos escribiendo código."
            highlight={{ word: 'código', className: 'method-code mono' }}
          />
          <div>
            <p className="method-kicker">Cómo trabajamos</p>
            <p className="section-sub light">
              Primero entendemos el problema. Después diseñamos la tecnología correcta para resolverlo.
            </p>
          </div>
        </div>

        <div ref={traceRef} className="trace">
          <svg className="trace-svg" aria-hidden="true" preserveAspectRatio="none">
            <path ref={basePathRef} className="trace-base" />
            <path ref={fillPathRef} className="trace-fill" />
            <circle ref={headRef} r="5" className="trace-head" />
          </svg>
          <ol className="trace-list">
            {STEPS.map((step, i) => (
              <li key={step.n} className={`trace-step ${i % 2 ? 'right' : 'left'}`}>
                <span className="trace-node" aria-hidden="true" />
                <div className="trace-card">
                  <p className="trace-n mono">{step.n}</p>
                  <h3>{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
