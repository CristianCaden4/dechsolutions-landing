'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import HeroShader from './HeroShader';
import RollButton from './RollButton';
import { LogoMark } from './Logo';
import { scrambleInto } from './fx/Scramble';
import { useScrollProgress, prefersReducedMotion, ease } from './scroll/engine';

// Floating glass status chips (foreground plane). Illustrative only: no figures.
// `dir` is the direction each one is flung when the camera dives through the logo.
const CHIPS = [
  { text: 'ventas ⇄ inventario', cls: 'c1', depth: 1.5, dir: [-1, -0.2] },
  { text: 'compras sincronizadas', cls: 'c2', depth: 0.8, dir: [-0.6, 0.5] },
  { text: 'reportes en tiempo real', cls: 'c3', depth: 1.9, dir: [1, -0.7] },
  { text: 'clientes centralizados', cls: 'c4', depth: 1.1, dir: [0.1, -1] },
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
  const chipRefs = useRef([]);
  const chipDepthRefs = useRef([]);
  const progressRef = useRef(0);
  // shared with the shader: it draws the glass logo and hands back the smoothed pointer each frame
  const sceneRef = useRef({ p: 0, mx: 0, my: 0, revealAt: 0, lastMx: 9, lastMy: 9, onFrame: null });
  const [started, setStarted] = useState(false);

  // entrance waits for the intro to open the curtain
  useEffect(() => {
    const go = () => {
      sectionRef.current?.classList.add('is-ready');
      sceneRef.current.revealAt = performance.now();
      setStarted(true);
    };
    if (window.__dechRevealed) requestAnimationFrame(go);
    else window.addEventListener('dech:reveal', go, { once: true });

    // pointer parallax for the chips, driven from the shader's own frame (one loop for the whole hero);
    // writes only when the pointer actually moved
    sceneRef.current.onFrame = (scene) => {
      if (Math.abs(scene.mx - scene.lastMx) < 0.001 && Math.abs(scene.my - scene.lastMy) < 0.001) return;
      scene.lastMx = scene.mx;
      scene.lastMy = scene.my;
      chipDepthRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = CHIPS[i].depth * 1.6;
        el.style.transform = `translate3d(${(-scene.mx * d * 16).toFixed(2)}px, ${(-scene.my * d * 11).toFixed(2)}px, 0)`;
      });
    };
    return () => window.removeEventListener('dech:reveal', go);
  }, []);

  // scroll exit: the camera dives through the glass logo while the headline splits apart
  useScrollProgress(
    sectionRef,
    (p) => {
      progressRef.current = p;
      const e = ease.outCubic(p);
      const vw = window.innerWidth;
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
    <section ref={sectionRef} data-nav-theme="dark" data-spy="inicio" className="hero" aria-labelledby="hero-title">
      <div className="hero-sticky">
        <div className="hero-frame">
          {/* the glass logo is drawn inside the shader, in the same pass as the background */}
          <HeroShader progressRef={progressRef} sceneRef={sceneRef} />

          <div className="hero-chips" aria-hidden="true">
            {CHIPS.map((c, i) => (
              <div key={c.cls} ref={(el) => (chipRefs.current[i] = el)} className={`hero-chip-plane ${c.cls}`}>
                <div ref={(el) => (chipDepthRefs.current[i] = el)} className="depth">
                  <span className="hero-chip">
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
                {/* on phones the intro moves under the headline, shorter, so the headline reads first */}
                <p className="hero-lede">
                  Construimos el software, las automatizaciones y los sistemas que tu empresa necesita para operar mejor
                  y crecer.
                </p>
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
