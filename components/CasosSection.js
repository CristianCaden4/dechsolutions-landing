'use client';

import { useEffect, useRef, useState } from 'react';
import { useScrollProgress, ease, prefersReducedMotion } from './scroll/engine';
import SplitHeading from './fx/SplitHeading';
import { PymeMock, LexMock } from './ProductsSection';

/* ---------- Microsoft stack logos (logistics case: only the tools, no screenshots) ---------- */

function LogoPowerApps() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id="lg-pa" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E48CF5" />
          <stop offset="1" stopColor="#742774" />
        </linearGradient>
      </defs>
      <path d="M24 3 45 24 24 45 3 24z" fill="url(#lg-pa)" />
      <path d="M24 3 45 24 34.5 34.5 13.5 13.5z" fill="#B44BC7" opacity="0.75" />
      <path d="M13.5 13.5 34.5 34.5 24 45 3 24z" fill="#5C1F6E" opacity="0.55" />
    </svg>
  );
}

function LogoPowerAutomate() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M4 8h18l18 16-18 16H4l18-16z" fill="#0F6CBD" />
      <path d="M22 8h12l10 16-10 16H22l18-16z" fill="#4FA3F7" />
      <path d="M4 8h18l9 8H13z" fill="#2B88D8" opacity="0.8" />
    </svg>
  );
}

function LogoSharePoint() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="28" cy="16" r="12" fill="#036C70" />
      <circle cx="33" cy="28" r="10" fill="#1A9BA1" />
      <circle cx="27" cy="37" r="8" fill="#37C6D0" />
      <rect x="3" y="13" width="22" height="22" rx="3" fill="#03787C" />
      <path d="M18.6 19.3c-.9-.7-2.2-1.1-3.6-1.1-2.5 0-4.2 1.3-4.2 3.2 0 1.6 1.1 2.5 3.3 3.2 1.5.5 2 .8 2 1.5s-.7 1.2-1.8 1.2c-1.3 0-2.5-.5-3.4-1.3v2.8c.9.6 2.2.9 3.5.9 2.8 0 4.4-1.3 4.4-3.3 0-1.7-1-2.6-3.3-3.3-1.4-.4-2-.8-2-1.4 0-.6.6-1.1 1.6-1.1 1.1 0 2.2.4 3 1z" fill="#fff" />
    </svg>
  );
}

function LogoExcel() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <rect x="14" y="5" width="30" height="38" rx="3" fill="#107C41" />
      <rect x="14" y="5" width="30" height="13" rx="3" fill="#33C481" />
      <rect x="14" y="17" width="30" height="13" fill="#21A366" />
      <rect x="3" y="13" width="22" height="22" rx="3" fill="#185C37" />
      <path d="M8.6 18.5h3.3l2.1 3.7 2.2-3.7h3.2l-3.6 5.5 3.7 5.5h-3.3l-2.2-3.8-2.2 3.8H8.5l3.7-5.5z" fill="#fff" />
    </svg>
  );
}

function LogoMicrosoft() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <rect x="4" y="4" width="19" height="19" fill="#F25022" />
      <rect x="25" y="4" width="19" height="19" fill="#7FBA00" />
      <rect x="4" y="25" width="19" height="19" fill="#00A4EF" />
      <rect x="25" y="25" width="19" height="19" fill="#FFB900" />
    </svg>
  );
}

const STACK = [
  { name: 'Power Apps', Logo: LogoPowerApps, x: 19, y: 25 },
  { name: 'SharePoint Lists', Logo: LogoSharePoint, x: 81, y: 25 },
  { name: 'Power Automate', Logo: LogoPowerAutomate, x: 19, y: 77 },
  { name: 'Excel VBA', Logo: LogoExcel, x: 81, y: 77 },
];

/* ---------- The projects, in the order of the client portfolio ---------- */

const PROJECTS = [
  {
    id: 'miraflores',
    word: 'Miraflores',
    short: 'Miraflores',
    client: 'Marca de café colombiano',
    name: 'Miraflores Café de Origen',
    desc: 'Una experiencia web 3D interactiva para presentar sus cafés de forma inmersiva: empaques recreados en digital, modelos tridimensionales y escenas que avanzan con el scroll.',
    tech: ['Blender', 'Modelado 3D', 'GLB', 'Web 3D', 'Git y GitHub', 'Interacción por scroll'],
    chips: ['Modelos 3D', 'Scroll interactivo', 'Blender'],
    kind: 'web',
    url: 'https://miraflores-nine.vercel.app',
    host: 'miraflores-nine.vercel.app',
    frames: ['/casos/miraflores-1.webp', '/casos/miraflores-2.webp', '/casos/miraflores-3.webp'],
    phone: '/casos/miraflores-m.webp',
    crop: 0,
    hue: '#4F6F45',
  },
  {
    id: 'montier',
    word: 'Montier',
    short: 'Montier',
    client: 'Creaciones Latina S.A.S. + Vermont S.A.S.',
    name: 'Montier',
    desc: 'La transformación digital detrás de la unión de dos empresas y el nacimiento de MONTIER: identidad digital, estrategia comercial, e-commerce, redes sociales y todo su ecosistema web.',
    tech: ['Desarrollo web', 'E-commerce', 'Git y GitHub', 'Meta Business Suite', 'Analítica digital', 'Marketing digital'],
    chips: ['E-commerce', 'Identidad digital', 'Meta Business Suite'],
    kind: 'web',
    url: 'https://montier-ashen.vercel.app',
    host: 'montier-ashen.vercel.app',
    frames: ['/casos/montier-1.webp', '/casos/montier-2.webp', '/casos/montier-3.webp'],
    phone: '/casos/montier-m.webp',
    crop: 80,
    hue: '#A8743F',
  },
  {
    id: 'camila',
    word: 'Camila',
    short: 'Camila y Adriel',
    client: 'Creaciones Adriel',
    name: 'Almacenes Camila y Adriel',
    desc: 'La digitalización de sus almacenes con páginas web que fortalecen su presencia digital, exhiben sus productos y acercan los canales de contacto con cada cliente.',
    tech: ['Desarrollo web', 'Diseño UX/UI', 'Integración con WhatsApp', 'Meta Business Suite', 'SEO', 'Analítica web'],
    chips: ['WhatsApp integrado', 'UX/UI', 'SEO'],
    kind: 'web',
    url: 'https://camila-coral.vercel.app',
    host: 'camila-coral.vercel.app',
    frames: ['/casos/camila-1.webp', '/casos/camila-2.webp', '/casos/camila-3.webp'],
    phone: '/casos/camila-m.webp',
    crop: 65,
    hue: '#E2231A',
  },
  {
    id: 'logistica',
    word: 'Logística',
    short: 'Logística',
    client: 'Empresa de logística internacional',
    name: 'Consultoría y automatización de procesos',
    desc: 'Consultoría para centralizar la información, ordenar la gestión de clientes y automatizar procesos internos: menos tareas manuales y un seguimiento operativo y comercial mucho más claro.',
    tech: ['Microsoft Power Apps', 'SharePoint Lists', 'VBA Excel', 'Power Automate', 'Microsoft 365'],
    chips: ['Información centralizada', 'Menos tareas manuales', 'Seguimiento comercial'],
    kind: 'stack',
    host: 'microsoft 365 / operaciones',
    note: 'Proyecto interno, sin sitio público',
    toast: { title: 'Flujo automatizado', meta: 'power automate' },
    hue: '#0F6CBD',
  },
  {
    id: 'pyme',
    word: 'PYME Core',
    short: 'PYME Core',
    client: 'Comercio',
    name: 'PYME Core',
    desc: 'Ventas, inventario y clientes en una sola plataforma.',
    reasons: [
      ['Reto', 'Ventas registradas en múltiples hojas sin cruce de información.'],
      ['Solución', 'PYME Core integrando ventas, inventario y clientes.'],
      ['Resultado', 'Reportes consolidados y decisiones más rápidas.'],
    ],
    tech: ['Modular', 'Escalable', 'Multi-industria'],
    chips: ['Antes: hojas sueltas', 'Después: plataforma unificada', 'Reportes a medida'],
    kind: 'app',
    Mock: PymeMock,
    host: 'pyme-core / panel',
    link: { href: '#productos', label: 'Ver PYME Core' },
    toast: { title: 'Inventario sincronizado', meta: 'ventas + bodega' },
    hue: '#2E9BD6',
  },
  {
    id: 'lexcore',
    word: 'LexCore',
    short: 'LexCore',
    client: 'Servicios legales',
    name: 'LexCore',
    desc: 'Gestión de casos y facturación para una firma legal.',
    reasons: [
      ['Reto', 'Casos y clientes dispersos en documentos sueltos.'],
      ['Solución', 'LexCore como CRM legal y facturación unificada.'],
      ['Resultado', 'Trazabilidad completa de cada caso y cliente.'],
    ],
    tech: ['Gestión de casos', 'CRM legal', 'Facturación'],
    chips: ['Antes: documentos sueltos', 'Después: CRM legal', 'Trazabilidad total'],
    kind: 'app',
    Mock: LexMock,
    host: 'lexcore / casos',
    link: { href: '#productos', label: 'Ver LexCore' },
    toast: { title: 'Caso actualizado', meta: 'cliente notificado' },
    hue: '#6D5BD0',
  },
];

// how much of the strip's own height the inner page travels (frames are 1440x900 captures,
// later frames lose their sticky header band, which is drawn once on top instead)
const spanOf = (p) => {
  const n = p.frames.length;
  const h = 900 + (n - 1) * (900 - p.crop);
  return ((h - 900) / h).toFixed(4);
};

/* ---------- Screens: what the floating window shows for each project ---------- */

function WebScreen({ p }) {
  return (
    <div className="cw-page" style={{ '--span': spanOf(p) }}>
      <div className="cw-strip">
        {p.frames.map((src, k) => (
          <div key={src} className="cw-frame" style={k && p.crop ? { aspectRatio: `1440 / ${900 - p.crop}` } : undefined}>
            <img
              src={src}
              alt=""
              width="1440"
              height="900"
              loading="lazy"
              decoding="async"
              style={k && p.crop ? { marginTop: `${(-p.crop / 1440) * 100}%` } : undefined}
            />
          </div>
        ))}
      </div>
      {p.crop > 0 && (
        <div className="cw-stickynav" style={{ aspectRatio: `1440 / ${p.crop}` }}>
          <img src={p.frames[1]} alt="" width="1440" height="900" loading="lazy" decoding="async" />
        </div>
      )}
      <span className="cw-scrollbar" />
    </div>
  );
}

function StackScreen() {
  return (
    <div className="cw-stack">
      <svg className="cw-stack__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {STACK.map((t, k) => (
          <g key={t.name} style={{ '--k': k }}>
            <line x1="50" y1="51" x2={t.x} y2={t.y} />
            <line className="pulse" x1="50" y1="51" x2={t.x} y2={t.y} pathLength="100" />
          </g>
        ))}
      </svg>
      <div className="cw-hub">
        <div className="cw-tile cw-tile--hub">
          <span className="cw-hub__ring" />
          <span className="cw-hub__ring r2" />
          <LogoMicrosoft />
        </div>
        <p>Microsoft 365</p>
      </div>
      {STACK.map(({ name, Logo, x, y }, k) => (
        <div key={name} className="cw-tool" style={{ left: `${x}%`, top: `${y}%`, '--k': k }}>
          <div className="cw-tile">
            <Logo />
          </div>
          <p>{name}</p>
        </div>
      ))}
    </div>
  );
}

function AppScreen({ p }) {
  const { Mock } = p;
  return (
    <div className="cw-app">
      <Mock />
    </div>
  );
}

/* ---------- The scene: aura, giant name, floating window, phone/toast and chips ---------- */

function Scene({ list, active, typing = false, offset = 0 }) {
  const winRef = useRef(null);
  const urlRef = useRef(null);
  const current = list[active] ?? list[0];

  // the address bar types the new address, the load bar runs and the window takes a small hit
  useEffect(() => {
    const el = urlRef.current;
    const text = current.host;
    if (!typing || active < 0 || prefersReducedMotion()) {
      el.textContent = text;
      return undefined;
    }
    const win = winRef.current;
    win.classList.remove('is-switch');
    void win.offsetWidth;
    win.classList.add('is-switch');
    let i = 0;
    el.textContent = '';
    const id = setInterval(() => {
      i += 1;
      el.textContent = text.slice(0, i);
      if (i >= text.length) clearInterval(id);
    }, 24);
    return () => clearInterval(id);
  }, [active, typing, current.host]);

  const state = (i) => (i === active ? 'is-active' : i < active ? (i === active - 1 ? 'is-past' : 'is-past is-far') : '');

  return (
    <div className="ws-scene" style={{ '--hue': current.hue }}>
      <div className="ws-auras" aria-hidden="true">
        {list.map((p, i) => (
          <span key={p.id} className={i === active ? 'is-on' : ''} style={{ '--c': p.hue }} />
        ))}
      </div>
      <div className="ws-words" aria-hidden="true">
        {list.map((p, i) => (
          <span key={p.id} className={`ws-word ${i === active ? 'is-on' : ''}`} data-lp={i + offset}>
            {p.word}
          </span>
        ))}
      </div>

      <div ref={winRef} className="cw-window" aria-hidden="true">
        <div className="cw-chrome">
          <span className="cw-dots">
            <i />
            <i />
            <i />
          </span>
          <div className="cw-url">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            <span ref={urlRef} className="cw-url__text">
              {current.host}
            </span>
          </div>
          <span className="cw-chrome__pad" />
          <span className="cw-load" />
        </div>
        <div className="cw-viewport">
          {list.map((p, i) => (
            <div key={p.id} className={`cw-screen cw-screen--${p.kind} ${state(i)}`} data-lp={i + offset}>
              {p.kind === 'web' && <WebScreen p={p} />}
              {p.kind === 'stack' && <StackScreen />}
              {p.kind === 'app' && <AppScreen p={p} />}
              <span className="cw-scan" />
            </div>
          ))}
        </div>
      </div>

      {/* front planes: the phone (websites) or a live notification (systems) */}
      <div className="ws-front" aria-hidden="true">
        {list.map((p, i) =>
          p.kind === 'web' ? (
            <div key={p.id} className={`ws-phone ${i === active ? 'is-on' : ''}`} data-lp={i + offset}>
              <div className="ws-phone__screen">
                <img src={p.phone} alt="" width="390" height="844" loading="lazy" decoding="async" />
              </div>
              <span className="ws-phone__island" />
            </div>
          ) : (
            <div key={p.id} className={`ws-toast ${i === active ? 'is-on' : ''}`} data-lp={i + offset} style={{ '--c': p.hue }}>
              <span className="ws-toast__icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span>
                <b>{p.toast.title}</b>
                <small className="mono">{p.toast.meta}</small>
              </span>
            </div>
          )
        )}
        {list.map((p, i) => (
          <div key={p.id} className={`ws-chips ${i === active ? 'is-on' : ''}`} data-lp={i + offset} style={{ '--c': p.hue }}>
            {p.chips.map((c, k) => (
              <span key={c} className="ws-chip" style={{ '--k': k }}>
                <i />
                {c}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* On phones and tablets every project carries its own window, which wipes in as it arrives */
function InlineScene({ p, index }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setInView(true), io.disconnect()), { threshold: 0.3 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="work-inline">
      <Scene list={[p]} active={inView ? 0 : -1} typing={inView} offset={index} />
    </div>
  );
}

function ProjectCopy({ p }) {
  return (
    <div className="work-copy">
      <p className="work-client">{p.client}</p>
      <h3 className="work-name">{p.name}</h3>
      <p className="work-desc">{p.desc}</p>
      {p.reasons && (
        <dl className="work-reasons">
          {p.reasons.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      )}
      <ul className="work-tech" aria-label="Tecnologías">
        {p.tech.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
      {p.url && (
        <a className="work-link" href={p.url} target="_blank" rel="noopener noreferrer">
          <span>Visitar sitio</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="8 7 17 7 17 16" />
          </svg>
        </a>
      )}
      {p.link && (
        <a className="work-link" href={p.link.href}>
          <span>{p.link.label}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      )}
      {p.note && <p className="work-note mono">{p.note}</p>}
    </div>
  );
}

// inner pages "land" on each captured section instead of drifting through them
function stepped(lp, n) {
  if (n < 2) return 0;
  const t = lp * (n - 1);
  const k = Math.min(n - 2, Math.floor(t));
  const e = ease.smooth(ease.clamp((t - k - 0.18) / 0.64));
  return (k + e) / (n - 1);
}

export default function CasosSection() {
  const sectionRef = useRef(null);
  const listRef = useRef(null);
  const [active, setActive] = useState(0);
  const geo = useRef({ items: [], targets: [], last: [], active: 0 });

  useEffect(() => {
    geo.current.items = [...listRef.current.querySelectorAll('.work-item')];
    // every element that follows its project's local progress, grouped by project
    geo.current.targets = PROJECTS.map((_, i) => [...sectionRef.current.querySelectorAll(`[data-lp="${i}"]`)]);
    geo.current.last = PROJECTS.map(() => '');
  }, []);

  // the white sheet widens to full bleed as the section arrives
  useScrollProgress(
    sectionRef,
    (p) => sectionRef.current.style.setProperty('--rise', ease.outCubic(p).toFixed(3)),
    { mode: 'enter' }
  );

  // local progress of each project: drives the page scrolling inside its window and the parallax planes
  const measureItems = () =>
    geo.current.items.map((el) => {
      const r = el.getBoundingClientRect();
      return [r.top, r.height];
    });
  const track = (rects) => {
    if (!rects) return;
    const vh = window.innerHeight;
    // the project crossing the middle of the screen is the one on stage
    let on = rects.findIndex(([top, h]) => top <= vh * 0.5 && top + h > vh * 0.5);
    if (on < 0) on = rects[0][0] > vh * 0.5 ? 0 : rects.length - 1;
    if (on !== geo.current.active) setActive((geo.current.active = on));
    rects.forEach(([top, h], i) => {
      const lp = ease.clamp((vh * 0.5 - top) / h);
      const p = PROJECTS[i];
      const pos = p.kind === 'web' ? stepped(lp, p.frames.length) : lp;
      const key = `${lp.toFixed(3)}|${pos.toFixed(3)}`;
      if (geo.current.last[i] === key) return;
      geo.current.last[i] = key;
      geo.current.targets[i].forEach((el) => {
        el.style.setProperty('--lp', lp.toFixed(3));
        el.style.setProperty('--pos', pos.toFixed(3));
      });
    });
  };
  useScrollProgress(listRef, (_, rects) => track(rects), { mode: 'view', measure: measureItems });

  // with reduced motion the scroll engine stays asleep, but the stage must still follow the reader
  useEffect(() => {
    if (!prefersReducedMotion()) return undefined;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => track(measureItems()));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // the whole scene leans toward the pointer
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

  const goTo = (i) => geo.current.items[i]?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });

  return (
    <section ref={sectionRef} id="casos" data-nav-theme="light" className="work" aria-labelledby="work-title">
      <div className="work-sheet" aria-hidden="true" />
      <div className="wrap work-wrap">
        <header className="work-head">
          <div>
            <div className="badge-row">
              <span className="badge-num">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </span>
              <span className="badge-pill">Casos de éxito</span>
            </div>
            <SplitHeading id="work-title" className="section-heading light work-heading" text="Clientes reales. Proyectos en producción." />
          </div>
          <p className="work-sub" data-reveal>
            Marcas, comercios y equipos que ya operan con tecnología hecha por Dech. Esto es lo que construimos para cada uno.
          </p>
        </header>

        <div className="work-grid">
          <div ref={listRef} className="work-list">
            {PROJECTS.map((p, i) => (
              <article key={p.id} className={`work-item ${i === active ? 'is-active' : ''}`} data-i={i} style={{ '--c': p.hue }}>
                <InlineScene p={p} index={i} />
                <ProjectCopy p={p} />
              </article>
            ))}
          </div>

          <div className="work-stage">
            <div className="work-stage__sticky" onPointerMove={onMove} onPointerLeave={onLeave}>
              <nav className="ws-index" aria-label="Proyectos">
                {PROJECTS.map((p, i) => (
                  <button key={p.id} type="button" className={i === active ? 'is-on' : ''} aria-current={i === active ? 'true' : undefined} onClick={() => goTo(i)} style={{ '--c': p.hue }}>
                    {p.short}
                  </button>
                ))}
              </nav>
              <Scene list={PROJECTS} active={active} typing />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
