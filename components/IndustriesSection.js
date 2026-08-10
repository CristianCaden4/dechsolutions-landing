'use client';

import { useEffect, useRef, useState } from 'react';

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
  const carouselRef = useRef(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (el.firstElementChild) {
          const cardW = el.firstElementChild.getBoundingClientRect().width + 20;
          setActive(Math.round(el.scrollLeft / cardW));
        }
        ticking = false;
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const goTo = (i) => {
    const clamped = Math.max(0, Math.min(INDUSTRIES.length - 1, i));
    const el = carouselRef.current;
    if (el && el.children[clamped]) {
      el.children[clamped].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
    }
    setActive(clamped);
  };

  return (
    <section data-nav-theme="light" style={{ background: '#fff', padding: '100px 0' }}>
      <div className="wrap">
        <p className="eyebrow">INDUSTRIAS</p>
        <h2 className="section-heading light" style={{ marginBottom: 56 }}>
          Tecnología para operaciones reales.
        </h2>

        <div className="industries-row">
          <button className="industry-arrow-btn" aria-label="Anterior" onClick={() => goTo(active - 1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div className="industry-carousel" ref={carouselRef}>
            {INDUSTRIES.map((ind) => (
              <div key={ind.name} className="industry-card">
                <div className="industry-card-icon">{ind.icon}</div>
                <h3>{ind.name}</h3>
                <div className="industry-pills">
                  {ind.pills.map((p) => (
                    <span key={p} className="industry-pill">{p}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button className="industry-arrow-btn" aria-label="Siguiente" onClick={() => goTo(active + 1)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          {INDUSTRIES.map((ind, i) => (
            <button
              key={ind.name}
              aria-label={`Ir a ${ind.name}`}
              onClick={() => goTo(i)}
              className="industry-dot"
              style={{ width: active === i ? 22 : 8, opacity: active === i ? 1 : 0.35 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
