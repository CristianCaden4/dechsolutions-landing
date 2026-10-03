'use client';

import { useEffect, useRef } from 'react';
import RollButton from './RollButton';
import { useScrollProgress, ease } from './scroll/engine';
import SplitHeading from './fx/SplitHeading';
import Kicker from './fx/Kicker';

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

export function PymeMock() {
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

export function LexMock() {
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
  // the window leans toward the pointer
  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--tx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    e.currentTarget.style.setProperty('--ty', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  const onLeave = (e) => {
    e.currentTarget.style.setProperty('--tx', '0');
    e.currentTarget.style.setProperty('--ty', '0');
  };
  return (
    <article className="product-card" data-spy={index === 0 ? 'pyme' : 'lexcore'} style={{ '--idx': index }}>
      <div className="product-card__copy" data-stagger>
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
      <div className="product-card__visual" aria-hidden="true" onPointerMove={onMove} onPointerLeave={onLeave}>
        <Mock />
      </div>
    </article>
  );
}

export default function ProductsSection() {
  const stackRef = useRef(null);

  // cards are sticky siblings: each one rises in, then recedes while the next one slides over it
  const geo = useRef({ cards: [], stick: [], last: [] });

  // the sticky offsets only change with the layout, so read them once (and on resize)
  useEffect(() => {
    const read = () => {
      const cards = [...stackRef.current.querySelectorAll('.product-card')];
      geo.current.cards = cards;
      geo.current.stick = cards.map((c) => parseFloat(getComputedStyle(c).top) || 0);
      geo.current.last = cards.map(() => ({}));
    };
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, []);

  // write a custom property only when its value really changed (each write restyles the card)
  const setVar = (i, card, name, v) => {
    const s = v.toFixed(3);
    if (geo.current.last[i][name] === s) return;
    geo.current.last[i][name] = s;
    card.style.setProperty(name, s);
  };

  useScrollProgress(
    stackRef,
    (p, tops) => {
      if (!tops) return;
      const vh = window.innerHeight;
      const { cards, stick } = geo.current;
      cards.forEach((card, i) => {
        setVar(i, card, '--enter', ease.outCubic(ease.clamp((vh - tops[i]) / (vh * 0.55))));
        if (i < cards.length - 1) {
          setVar(i, card, '--away', ease.clamp((vh - tops[i + 1]) / (vh - stick[i + 1])));
        }
      });
    },
    // read phase only: card positions
    { mode: 'view', ease: 0.5, measure: () => geo.current.cards.map((c) => c.getBoundingClientRect().top) }
  );

  return (
    <section id="productos" data-nav-theme="dark" className="products" aria-labelledby="products-title">
      <div className="dotted-bg" />
      <span className="section-rule" data-reveal aria-hidden="true" />
      <div className="wrap products-wrap">
        <div className="products-head">
          <Kicker>Productos propios</Kicker>
          <SplitHeading id="products-title" className="section-heading dark" text="Tecnología propia para operaciones reales." />
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
