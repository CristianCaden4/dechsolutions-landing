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

// Phones (and phones held sideways) get a native swipe carousel instead of the pinned pan:
// the same coverflow, driven by the finger, without five screens of vertical scroll.
const SWIPE_MQ = '(max-width: 767px), (max-height: 520px) and (orientation: landscape)';

// Scroll room is the horizontal travel times DWELL, so the pan reads as a deliberate journey.
const DWELL = 1.5;

export default function IndustriesSection() {
  const sectionRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const dist = useRef(0);
  const vpWidth = useRef(1);
  const centers = useRef([]);
  const lastVars = useRef([]);
  const swipe = useRef(false);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  // depth: the card nearest the focal point comes forward; `x` is the track's offset, `p` the 0..1 progress
  const paint = (x, p, focal) => {
    barRef.current.style.transform = `scaleX(${0.08 + 0.92 * p})`;
    const vw = vpWidth.current;
    const cards = trackRef.current.children;
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < cards.length; i++) {
      const c = centers.current[i] + x - focal;
      const d = Math.abs(c) / vw;
      if (d < bestD) {
        bestD = d;
        best = i;
      }
      const focus = ease.clamp(1 - d * 1.8).toFixed(3);
      // signed offset from the focal point drives the coverflow turn
      const off = Math.max(-1, Math.min(1, c / (vw * 0.5))).toFixed(3);
      const last = lastVars.current[i] || (lastVars.current[i] = {});
      if (last.focus !== focus) cards[i].style.setProperty('--focus', (last.focus = focus));
      if (last.off !== off) cards[i].style.setProperty('--off', (last.off = off));
    }
    if (best !== activeRef.current) {
      activeRef.current = best;
      setActive(best);
    }
  };

  // swipe mode: the viewport scrolls natively, so its scrollLeft is the progress
  const paintSwipe = () => {
    const vp = viewportRef.current;
    const max = vp.scrollWidth - vp.clientWidth;
    paint(-vp.scrollLeft, max > 0 ? vp.scrollLeft / max : 0, vpWidth.current / 2);
  };

  // Pinned mode: the section is as tall as the horizontal distance the track must travel.
  useEffect(() => {
    const size = () => {
      const track = trackRef.current;
      const vp = viewportRef.current;
      swipe.current = window.matchMedia(SWIPE_MQ).matches;
      // card centres relative to the track, cached so the scroll callbacks never read layout
      vpWidth.current = vp.clientWidth;
      centers.current = [...track.children].map((c) => c.offsetLeft + c.offsetWidth / 2);
      if (prefersReducedMotion() || swipe.current) {
        sectionRef.current.style.height = '';
        track.style.transform = '';
        if (swipe.current && !prefersReducedMotion()) paintSwipe();
        return;
      }
      dist.current = Math.max(0, track.scrollWidth - vp.clientWidth);
      sectionRef.current.style.height = `${window.innerHeight + dist.current * DWELL}px`;
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(trackRef.current);
    window.addEventListener('resize', size);

    let queued = false;
    const onSwipe = () => {
      if (!swipe.current || queued || prefersReducedMotion()) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        paintSwipe();
      });
    };
    const vp = viewportRef.current;
    vp.addEventListener('scroll', onSwipe, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', size);
      vp.removeEventListener('scroll', onSwipe);
    };
  }, []);

  useScrollProgress(
    sectionRef,
    (p) => {
      if (prefersReducedMotion() || swipe.current) return;
      const x = -p * dist.current;
      trackRef.current.style.transform = `translate3d(${x}px, 0, 0)`;
      // a focal point that sweeps left to right, so the first and the last card each get their moment
      paint(x, p, vpWidth.current * (0.24 + 0.52 * p));
    },
    { mode: 'pin', ease: 0.1 }
  );

  // buttons and dots move to the matching card: by scrolling the page (pinned) or the carousel (swipe)
  const goTo = (i) => {
    const clamped = Math.max(0, Math.min(INDUSTRIES.length - 1, i));
    const vp = viewportRef.current;
    if (prefersReducedMotion()) {
      vp.scrollTo({ left: trackRef.current.children[clamped].offsetLeft, behavior: 'auto' });
      setActive(clamped);
      return;
    }
    if (swipe.current) {
      vp.scrollTo({ left: centers.current[clamped] - vpWidth.current / 2, behavior: 'smooth' });
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
          <span className="industries-hint mono" aria-hidden="true">
            Desliza
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </span>
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
