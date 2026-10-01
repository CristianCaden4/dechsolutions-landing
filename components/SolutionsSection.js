'use client';

import { useRef } from 'react';
import { useScrollProgress, ease } from './scroll/engine';

const SOLUTIONS = [
  {
    title: 'Software a la medida',
    desc: 'Creamos sistemas ajustados a la forma real en que trabaja tu empresa.',
    size: 'wide',
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
    size: 'banner',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64CEFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
      </svg>
    ),
  },
];

const HEADING = 'Construimos la tecnología que tu operación necesita.';

function SolutionCard({ s, i }) {
  const ref = useRef(null);

  useScrollProgress(
    ref,
    (p) => {
      const k = ease.outCubic(ease.range(p, 0.05 + (i % 3) * 0.06, 0.7 + (i % 3) * 0.06));
      ref.current.style.setProperty('--in', k.toFixed(4));
    },
    { mode: 'enter' }
  );

  const onMove = (e) => {
    const el = ref.current;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--sx', `${(x * 100).toFixed(1)}%`);
    el.style.setProperty('--sy', `${(y * 100).toFixed(1)}%`);
    el.style.setProperty('--rx', `${((0.5 - y) * 6).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((x - 0.5) * 6).toFixed(2)}deg`);
  };
  const onLeave = () => {
    ref.current.style.setProperty('--rx', '0deg');
    ref.current.style.setProperty('--ry', '0deg');
  };

  return (
    <div ref={ref} className={`solution-card ${s.size ? `solution-card--${s.size}` : ''}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div className="solution-card__inner">
        <span className="solution-card__icon">{s.icon}</span>
        <h3>{s.title}</h3>
        <p>{s.desc}</p>
        {s.size === 'wide' && (
          <div className="code-ghost mono" aria-hidden="true">
            <span>
              <i>const</i> sistema = construir(<b>tuOperación</b>);
            </span>
            <span>
              sistema.<i>adaptar</i>(procesosReales);
            </span>
            <span>
              sistema.<i>conectar</i>(ventas, inventario, clientes);
            </span>
          </div>
        )}
        {s.size === 'banner' && (
          <div className="transform-line" aria-hidden="true">
            {Array.from({ length: 14 }).map((_, k) => (
              <span key={k} style={{ '--y': `${Math.round(Math.sin(k * 2.3) * 24 * Math.max(0, 1 - k / 7))}px` }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SolutionsSection() {
  const headRef = useRef(null);
  const words = HEADING.split(' ');

  useScrollProgress(
    headRef,
    (p) => {
      const lit = ease.range(p, 0.08, 0.62) * words.length;
      headRef.current.querySelectorAll('.lit-word').forEach((el, i) => {
        el.style.opacity = (0.16 + 0.84 * ease.clamp(lit - i)).toFixed(3);
      });
    },
    { mode: 'enter', reducedValue: 1 }
  );

  return (
    <section id="soluciones" data-nav-theme="light" className="solutions" aria-labelledby="solutions-title">
      <div className="wrap">
        <div className="badge-row">
          <span className="badge-num">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          </span>
          <span className="badge-pill">Soluciones detalladas</span>
        </div>
        <h2 ref={headRef} id="solutions-title" className="section-heading light solutions-heading" aria-label={HEADING}>
          {words.map((wd, i) => (
            <span key={i} className="lit-word" aria-hidden="true">
              {wd}{' '}
            </span>
          ))}
        </h2>
        <p className="section-sub light">
          Te ayudamos a ordenar la operación, ahorrar tiempo y tomar decisiones con información confiable.
        </p>

        <div className="solutions-grid">
          {SOLUTIONS.map((s, i) => (
            <SolutionCard key={s.title} s={s} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
