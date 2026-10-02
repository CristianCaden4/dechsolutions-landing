'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import HeroShader from './HeroShader';
import RollButton from './RollButton';
import { LogoMark } from './Logo';
import { scrambleInto } from './fx/Scramble';
import { useScrollProgress, useVisibleFrame, prefersReducedMotion, ease } from './scroll/engine';

// Floating glass status chips (foreground plane). Illustrative only: no figures.
// `dir` is the direction each one is flung when the camera dives through the logo.
const CHIPS = [
  { text: 'ventas ⇄ inventario', cls: 'c1', depth: 1.5, dir: [-1, -0.2] },
  { text: 'compras sincronizadas', cls: 'c2', depth: 0.8, dir: [-0.6, 0.5] },
  { text: 'reportes en tiempo real', cls: 'c3', depth: 1.9, dir: [1, -0.7] },
  { text: 'clientes centralizados', cls: 'c4', depth: 1.1, dir: [0.1, -1] },
];

// The logo's three chevrons, rebuilt as frosted-glass planes that refract the shader behind them.
const CHEVRONS = [
  { cls: 'g1', depth: 0.5 },
  { cls: 'g2', depth: 0.9 },
  { cls: 'g3', depth: 1.35 },
];

const SERVICES = ['Software', 'Automatización', 'Sistemas Empresariales'];
const LINE1 = ['Tecnología', 'construida'];
const LINE2 = ['alrededor', 'de', 'tu', 'negocio.'];
const TITLE = `${LINE1.join(' ')} ${LINE2.join(' ')}`;

/** The three service lines, one lit at a time; the lit one decodes itself. */
function ServiceTicker({ started }) {
  const [active, setActive] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    if (!started || prefersReducedMotion()) return undefined;
    const id = setInterval(() => setActive((a) => (a + 1) % SERVICES.length), 2600);
    return () => clearInterval(id);
  }, [started]);

  useEffect(() => {
    if (!started) return undefined;
    const el = refs.current[active];
    const cancel = scrambleInto(el, SERVICES[active], { duration: 600 });
    return () => {
      cancel();
      el.textContent = SERVICES[active];
    };
  }, [active, started]);

  return (
    <ul className="hero-services" aria-label="Servicios">
      {SERVICES.map((s, i) => (
        <li key={s} className={i === active ? 'is-on' : ''}>
          <span className="hero-services__bar" aria-hidden="true" />
          <span ref={(el) => (refs.current[i] = el)}>{s}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Hero() {
  const sectionRef = useRef(null);
  const veilRef = useRef(null);
  const topRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const ctasRef = useRef(null);
  const chevWrapRef = useRef(null);
  const chevRefs = useRef([]);
  const chipRefs = useRef([]);
  const progressRef = useRef(0);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });
  const [started, setStarted] = useState(false);

  // entrance waits for the intro to open the curtain
  useEffect(() => {
    const go = () => {
      sectionRef.current?.classList.add('is-ready');
      setStarted(true);
    };
    if (window.__dechRevealed) requestAnimationFrame(go);
    else window.addEventListener('dech:reveal', go, { once: true });
    const onMove = (e) => {
      pointer.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('dech:reveal', go);
      window.removeEventListener('pointermove', onMove);
    };
  }, []);

  // pointer parallax: closer planes move more
  useVisibleFrame(sectionRef, () => {
    const p = pointer.current;
    p.x += (p.tx - p.x) * 0.06;
    p.y += (p.ty - p.y) * 0.06;
    const el = sectionRef.current;
    el.style.setProperty('--mx', p.x.toFixed(4));
    el.style.setProperty('--my', p.y.toFixed(4));
  });

  // scroll exit: the camera dives through the glass logo while the headline splits apart
  useScrollProgress(
    sectionRef,
    (p) => {
      progressRef.current = p;
      const e = ease.outCubic(p);
      const dive = p * p * p;
      const vw = window.innerWidth;
      chevWrapRef.current.style.transform = `scale(${1 + dive * 11})`;
      chevWrapRef.current.style.opacity = 1 - ease.range(p, 0.8, 1);
      chevRefs.current.forEach((el, i) => {
        if (!el) return;
        el.style.transform = `translate3d(${(i - 1) * e * 70}px, 0, 0) rotate(${(i - 1) * e * 5}deg)`;
      });
      chipRefs.current.forEach((el, i) => {
        if (!el) return;
        const { dir, depth } = CHIPS[i];
        const d = e * 520 * depth;
        el.style.transform = `translate3d(${dir[0] * d}px, ${dir[1] * d}px, 0) scale(${1 + e * 0.5})`;
        el.style.opacity = 1 - ease.range(p, 0.05, 0.45);
      });
      const split = ease.range(p, 0.08, 0.85);
      const shift = ease.outCubic(split) * vw * 0.24;
      line1Ref.current.style.transform = `translate3d(${-shift}px, 0, 0)`;
      line2Ref.current.style.transform = `translate3d(${shift}px, 0, 0)`;
      const fade = 1 - ease.range(p, 0.35, 0.85);
      line1Ref.current.style.opacity = fade;
      line2Ref.current.style.opacity = fade;
      ctasRef.current.style.transform = `translate3d(0, ${e * 40}px, 0)`;
      ctasRef.current.style.opacity = 1 - ease.range(p, 0, 0.35);
      topRef.current.style.transform = `translate3d(0, ${-e * 40}px, 0)`;
      topRef.current.style.opacity = 1 - ease.range(p, 0, 0.4);
      veilRef.current.style.opacity = ease.range(p, 0.72, 1) * 0.88;
    },
    { mode: 'pin', reducedValue: 0 }
  );

  let n = 0;
  const renderLine = (words) =>
    words.map((word) => (
      <Fragment key={word}>
        <span className="word">
          {[...word].map((ch, k) => (
            <span key={k} className="char" style={{ '--i': n++ }}>
              {ch}
            </span>
          ))}
        </span>{' '}
      </Fragment>
    ));

  return (
    <section ref={sectionRef} data-nav-theme="dark" className="hero" aria-labelledby="hero-title">
      <div className="hero-sticky">
        <div className="hero-frame">
          <HeroShader progressRef={progressRef} />
          <div className="grain" aria-hidden="true" />

          <div ref={chevWrapRef} className="hero-chevrons" aria-hidden="true">
            {CHEVRONS.map((c, i) => (
              <div key={c.cls} ref={(el) => (chevRefs.current[i] = el)} className={`hero-chev-plane ${c.cls}`}>
                <div className="depth" style={{ '--d': c.depth }}>
                  <div className="glass-chev">
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none">
                      <polygon points="0,0 38,0 100,50 38,100 0,100 62,50" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hero-chips" aria-hidden="true">
            {CHIPS.map((c, i) => (
              <div key={c.cls} ref={(el) => (chipRefs.current[i] = el)} className={`hero-chip-plane ${c.cls}`}>
                <div className="depth" style={{ '--d': c.depth * 1.6 }}>
                  <span className="hero-chip liquid-glass">
                    <span className="status-dot" />
                    {c.text}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="hero-scrim" aria-hidden="true" />

          <div className="hero-inner">
            <div ref={topRef} className="hero-top">
              <p className="hero-intro-left">
                Entendemos cómo funciona tu empresa y construimos el software, las automatizaciones y los sistemas
                que necesita para operar mejor, conectarse y crecer.
              </p>
              <ServiceTicker started={started} />
            </div>

            <div className="hero-spacer" />

            <div className="hero-bottom">
              <h1 id="hero-title" className="hero-heading" aria-label={TITLE}>
                <span ref={line1Ref} className="hero-line" aria-hidden="true">
                  {renderLine(LINE1)}
                </span>
                <span ref={line2Ref} className="hero-line hero-line--accent" aria-hidden="true">
                  {renderLine(LINE2)}
                </span>
              </h1>

              <div ref={ctasRef} className="hero-ctas-wrap">
                <div className="hero-ctas">
                  <RollButton href="#contacto" variant="accent">
                    Hablemos de tu negocio
                  </RollButton>
                  <a href="#productos" className="hero-badge">
                    <LogoMark width={24} height={14} first="#0a0a0a" />
                    <span>PYME Core + LexCore</span>
                    <span className="hero-badge-tag">Productos propios</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div ref={veilRef} className="hero-veil" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
