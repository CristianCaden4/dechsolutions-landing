'use client';

import { Fragment, useEffect, useRef } from 'react';
import HeroShader from './HeroShader';
import RollButton from './RollButton';
import { LogoMark } from './Logo';
import { useScrollProgress, useVisibleFrame, ease } from './scroll/engine';

// Floating glass status chips (foreground plane). Illustrative only: no figures.
const CHIPS = [
  { text: 'ventas ⇄ inventario', cls: 'c1', depth: 1.5 },
  { text: 'compras · sincronizado', cls: 'c2', depth: 0.8 },
  { text: 'reportes en tiempo real', cls: 'c3', depth: 1.9 },
  { text: 'clientes · centralizado', cls: 'c4', depth: 1.1 },
];

// The logo's three chevrons, rebuilt as frosted-glass planes that refract the shader behind them.
const CHEVRONS = [
  { cls: 'g1', depth: 0.5 },
  { cls: 'g2', depth: 0.9 },
  { cls: 'g3', depth: 1.35 },
];

const LINE1 = ['Tecnología', 'construida'];
const LINE2 = ['alrededor', 'de', 'tu', 'negocio.'];

export default function Hero() {
  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const chevRefs = useRef([]);
  const chipRefs = useRef([]);
  const progressRef = useRef(0);
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const id = requestAnimationFrame(() => sectionRef.current?.classList.add('is-ready'));
    const onMove = (e) => {
      pointer.current.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(id);
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

  // scroll exit: the frame tightens into a card while the planes separate
  useScrollProgress(
    sectionRef,
    (p) => {
      progressRef.current = p;
      const e = ease.outCubic(p);
      const vw = window.innerWidth;
      const ix = vw < 768 ? 3 : 3.5;
      frameRef.current.style.clipPath = `inset(${e * 6}% ${e * ix}% ${e * 6}% ${e * ix}% round ${e * 36}px)`;
      topRef.current.style.transform = `translate3d(0, ${-e * 50}px, 0)`;
      topRef.current.style.opacity = 1 - ease.range(p, 0.15, 0.6);
      bottomRef.current.style.transform = `translate3d(0, ${-e * 90}px, 0)`;
      bottomRef.current.style.opacity = 1 - ease.range(p, 0.6, 1);
      chevRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = CHEVRONS[i].depth;
        el.style.transform = `translate3d(${(i - 1) * e * 90}px, ${-e * 260 * d}px, 0) rotate(${(i - 1) * e * 4}deg)`;
      });
      chipRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = CHIPS[i].depth;
        el.style.transform = `translate3d(0, ${-e * 380 * d}px, 0)`;
        el.style.opacity = 1 - ease.range(p, 0.1, 0.6);
      });
    },
    { mode: 'pin', reducedValue: 0 }
  );

  let w = 0;
  return (
    <section ref={sectionRef} data-nav-theme="dark" className="hero" aria-labelledby="hero-title">
      <div className="hero-sticky">
        <div ref={frameRef} className="hero-frame">
          <HeroShader progressRef={progressRef} />
          <div className="grain" aria-hidden="true" />

          <div className="hero-chevrons" aria-hidden="true">
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
              <p className="hero-intro-right mono">Software · Automatización · Sistemas Empresariales</p>
            </div>

            <div className="hero-spacer" />

            <div ref={bottomRef} className="hero-bottom">
              <h1 id="hero-title" className="hero-heading">
                <span className="hero-line">
                  {LINE1.map((word) => (
                    <Fragment key={word}>
                      <span className="word">
                        <span style={{ '--i': w++ }}>{word}</span>
                      </span>{' '}
                    </Fragment>
                  ))}
                </span>
                <span className="hero-line hero-line--accent">
                  {LINE2.map((word) => (
                    <Fragment key={word}>
                      <span className="word">
                        <span style={{ '--i': w++ }}>{word}</span>
                      </span>{' '}
                    </Fragment>
                  ))}
                </span>
              </h1>

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
      </div>
    </section>
  );
}
