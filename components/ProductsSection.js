'use client';

import { useEffect, useRef } from 'react';
import RollButton from './RollButton';
import { useScrollProgress, ease } from './scroll/engine';

const PYME_MODULES = ['Ventas', 'Compras', 'Inventario', 'Clientes', 'Reportes'];
const LEX_TABS = ['Casos', 'Clientes', 'Facturación'];
const LEX_ROWS = [
  { kind: 'Caso', status: 'Activo' },
  { kind: 'Cliente', status: 'En revisión' },
  { kind: 'Factura', status: 'Facturado' },
  { kind: 'Caso', status: 'Activo' },
];

function WindowChrome({ title }) {
  return (
    <div className="mock-chrome">
      <span />
      <span />
      <span />
      <p className="mono">{title}</p>
    </div>
  );
}

function PymeMock() {
  const ref = useRef(null);
  // cycle the active module so the window feels alive
  useEffect(() => {
    const el = ref.current;
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % PYME_MODULES.length;
      el.style.setProperty('--active', i);
      el.dataset.active = i;
    }, 1800);
    return () => clearInterval(id);
  }, []);
  return (
    <div ref={ref} className="mock mock-pyme" data-active="0">
      <WindowChrome title="pyme-core / panel" />
      <div className="mock-body">
        <aside className="mock-side">
          {PYME_MODULES.map((m, i) => (
            <span key={m} className="mock-side__item" data-i={i}>
              <i />
              {m}
            </span>
          ))}
        </aside>
        <div className="mock-main">
          <div className="mock-row-head">
            <span className="mock-skel w40" />
            <span className="mock-pill">Sincronizado</span>
          </div>
          <div className="mock-chart">
            {[0.42, 0.6, 0.5, 0.78, 0.66, 0.9, 0.72, 0.84].map((h, i) => (
              <span key={i} style={{ '--h': h, '--i': i }} />
            ))}
          </div>
          <div className="mock-list">
            {[0, 1, 2].map((k) => (
              <div key={k} className="mock-list__row">
                <span className="mock-dot" />
                <span className="mock-skel w55" />
                <span className="mock-skel w20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LexMock() {
  return (
    <div className="mock mock-lex">
      <WindowChrome title="lexcore / casos" />
      <div className="mock-body mock-body--col">
        <div className="mock-tabs">
          {LEX_TABS.map((t, i) => (
            <span key={t} className={i === 0 ? 'is-on' : ''}>
              {t}
            </span>
          ))}
        </div>
        <div className="mock-cases">
          {LEX_ROWS.map((r, i) => (
            <div key={i} className="mock-case" style={{ '--i': i }}>
              <span className="mock-case__kind mono">{r.kind}</span>
              <span className="mock-skel w50" />
              <span className={`mock-status s${i % 3}`}>{r.status}</span>
            </div>
          ))}
        </div>
        <div className="mock-timeline">
          {[0, 1, 2, 3, 4].map((k) => (
            <span key={k} style={{ '--k': k }} />
          ))}
        </div>
      </div>
    </div>
  );
}

const PRODUCTS = [
  {
    kicker: 'ERP MODULAR',
    name: 'PYME Core',
    desc: 'Centraliza ventas, compras, inventario, clientes y reportes en una plataforma modular que se adapta a la operación de cada empresa.',
    tags: ['Modular', 'Escalable', 'Multi-industria'],
    link: 'Conocer PYME Core',
    Mock: PymeMock,
  },
  {
    kicker: 'SAAS LEGAL',
    name: 'LexCore',
    desc: 'El sistema legal que centraliza casos, clientes y facturación, pensado para abogados independientes y firmas jurídicas.',
    tags: ['Gestión de casos', 'CRM legal', 'Facturación'],
    link: 'Conocer LexCore',
    Mock: LexMock,
  },
];

function ProductCard({ prod, index }) {
  const { Mock } = prod;
  return (
    <article className="product-card" style={{ '--idx': index }}>
      <div className="product-card__copy">
        <p className="product-kicker">{prod.kicker}</p>
        <h3>{prod.name}</h3>
        <p className="product-desc">{prod.desc}</p>
        <div className="product-tags">
          {prod.tags.map((t) => (
            <span key={t} className="product-tag">
              {t}
            </span>
          ))}
        </div>
        <RollButton href="#" variant="light">
          {prod.link}
        </RollButton>
      </div>
      <div className="product-card__visual" aria-hidden="true">
        <Mock />
      </div>
    </article>
  );
}

export default function ProductsSection() {
  const stackRef = useRef(null);

  // cards are sticky siblings: each one rises in, then recedes while the next one slides over it
  useScrollProgress(
    stackRef,
    () => {
      const vh = window.innerHeight;
      const cards = stackRef.current.querySelectorAll('.product-card');
      cards.forEach((card, i) => {
        const top = card.getBoundingClientRect().top;
        card.style.setProperty('--enter', ease.outCubic(ease.clamp((vh - top) / (vh * 0.55))).toFixed(4));
        const next = cards[i + 1];
        if (next) {
          const stick = parseFloat(getComputedStyle(next).top) || 0;
          const away = ease.clamp((vh - next.getBoundingClientRect().top) / (vh - stick));
          card.style.setProperty('--away', away.toFixed(4));
        }
      });
    },
    { mode: 'view', ease: 0.5 }
  );

  return (
    <section id="productos" data-nav-theme="dark" className="products" aria-labelledby="products-title">
      <div className="dotted-bg" />
      <div className="wrap products-wrap">
        <div className="products-head">
          <p className="tag-mono">
            <span className="tag-mono__slash">//</span> Productos propios
          </p>
          <h2 id="products-title" className="section-heading dark">
            Tecnología propia para operaciones reales.
          </h2>
        </div>

        <div ref={stackRef} className="products-stack">
          {PRODUCTS.map((prod, i) => (
            <ProductCard key={prod.name} prod={prod} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
