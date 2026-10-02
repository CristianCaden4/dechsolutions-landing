'use client';

import { useEffect, useRef, useState } from 'react';
import { useScrollProgress, prefersReducedMotion, ease } from './scroll/engine';
import SplitHeading from './fx/SplitHeading';
import Kicker from './fx/Kicker';

const INDUSTRIES = [
  {
    name: 'Comercio',
    pills: ['Producto', 'Inventario', 'Venta', 'Cliente'],
    icon: (
      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#64CEFB" strokeWidth="1.2">
        <path d="M6 2 3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 01-8 0"></path>
      </svg>
    ),
  },
  {
    name: 'Distribución',
    pills: ['Bodega', 'Pedido', 'Ruta', 'Cliente'],
    icon: (
      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#64CEFB" strokeWidth="1.2">
        <rect x="1" y="3" width="15" height="13"></rect>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
        <circle cx="5.5" cy="18.5" r="2.5"></circle>
        <circle cx="18.5" cy="18.5" r="2.5"></circle>
      </svg>
    ),
  },
  {
    name: 'Servicios',
    pills: ['Lead', 'Propuesta', 'Servicio', 'Pago'],
    icon: (
      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#64CEFB" strokeWidth="1.2">
        <rect x="2" y="7" width="20" height="14" rx="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    ),
  },
  {
    name: 'Manufactura',
    pills: ['Materia prima', 'Producción', 'Inventario', 'Venta'],
    icon: (
      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#64CEFB" strokeWidth="1.2">
        <path d="M2 20h20V10l-6 5v-5l-6 5v-5l-6 5z"></path>
        <path d="M2 20V9"></path>
      </svg>
    ),
  },
  {
    name: 'Empresas en crecimiento',
    pills: ['Proceso', 'Digitalización', 'Automatización', 'Escala'],
    icon: (
      <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#64CEFB" strokeWidth="1.2">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
      </svg>
    ),
  },
];

export default function IndustriesSection() {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const dist = useRef(0);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  // Scroll room is the horizontal travel times DWELL, so the pan reads as a deliberate journey.
const DWELL = 1.5;

// The section is as tall as the horizontal distance the track must travel.
  useEffect(() => {
    const size = () => {
      if (prefersReducedMotion()) {
        sectionRef.current.style.height = '';
        return;
      }
      const track = trackRef.current;
      const vp = viewportRef.current;
      dist.current = Math.max(0, track.scrollWidth - vp.clientWidth);
      sectionRef.current.style.height = `${window.innerHeight + dist.current * DWELL}px`;
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(trackRef.current);
    window.addEventListener('resize', size);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', size);
    };
  }, []);

  useScrollProgress(
    sectionRef,
    (p) => {
      if (prefersReducedMotion()) return;
      const x = -p * dist.current;
      trackRef.current.style.transform = `translate3d(${x}px, 0, 0)`;
      barRef.current.style.transform = `scaleX(${0.08 + 0.92 * p})`;
      // depth: the card nearest a focal point that sweeps left to right comes forward,
      // so the first and the last card each get their moment
      const vw = viewportRef.current.clientWidth;
      const focal = vw * (0.24 + 0.52 * p);
      const cards = trackRef.current.children;
      let best = 0;
      let bestD = Infinity;
      for (let i = 0; i < cards.length; i++) {
        const r = cards[i].getBoundingClientRect();
        const c = r.left + r.width / 2 - focal;
        const d = Math.abs(c) / vw;
        if (d < bestD) {
          bestD = d;
          best = i;
        }
        const k = ease.clamp(1 - d * 1.8);
        cards[i].style.setProperty('--focus', k.toFixed(3));
        // signed offset from the focal point drives the coverflow turn
        cards[i].style.setProperty('--off', Math.max(-1, Math.min(1, c / (vw * 0.5))).toFixed(3));
      }
      if (best !== activeRef.current) {
        activeRef.current = best;
        setActive(best);
      }
    },
    { mode: 'pin', ease: 0.1 }
  );

  // buttons and dots scroll the page to the matching point of the pan
  const goTo = (i) => {
    const clamped = Math.max(0, Math.min(INDUSTRIES.length - 1, i));
    if (prefersReducedMotion()) {
      viewportRef.current.scrollTo({ left: trackRef.current.children[clamped].offsetLeft, behavior: 'auto' });
      setActive(clamped);
      return;
    }
    const top = sectionRef.current.getBoundingClientRect().top + window.scrollY;
    const p = clamped / (INDUSTRIES.length - 1);
    window.scrollTo({ top: top + p * dist.current * DWELL, behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} data-nav-theme="light" className="industries" aria-labelledby="industries-title">
      <div className="industries-sticky">
        <div className="wrap industries-head">
          <div>
            <Kicker light>Industrias</Kicker>
            <SplitHeading id="industries-title" className="section-heading light" text="Tecnología para operaciones reales." />
          </div>
          <div className="industries-controls">
            <button className="industry-arrow-btn" aria-label="Anterior" onClick={() => goTo(active - 1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button className="industry-arrow-btn" aria-label="Siguiente" onClick={() => goTo(active + 1)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>

        <div ref={viewportRef} className="industries-viewport">
          <div ref={trackRef} className="industries-track">
            {INDUSTRIES.map((ind) => (
              <article key={ind.name} className="industry-card">
                <div className="industry-card-icon" aria-hidden="true">
                  {ind.icon}
                </div>
                <h3>{ind.name}</h3>
                <div className="industry-flow">
                  {ind.pills.map((p, k) => (
                    <span key={p} className="industry-pill" style={{ '--k': k }}>
                      {p}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="wrap industries-foot">
          <div className="industries-bar">
            <span ref={barRef} />
          </div>
          <div className="industries-dots">
            {INDUSTRIES.map((ind, i) => (
              <button
                key={ind.name}
                aria-label={`Ir a ${ind.name}`}
                onClick={() => goTo(i)}
                className={`industry-dot ${active === i ? 'is-on' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
