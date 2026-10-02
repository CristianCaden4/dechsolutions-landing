'use client';

import { Fragment, useEffect, useRef } from 'react';
import { LogoMark } from './Logo';
import { useVisibleFrame } from './scroll/engine';

const ROW_A = ['Software a la medida', 'Automatización', 'Integraciones', 'IA aplicada'];
const ROW_B = ['PYME Core', 'LexCore', 'Sistemas empresariales', 'Transformación tecnológica'];

function Row({ items, trackRef, variant }) {
  // the content is rendered twice so the loop can wrap seamlessly at half its width
  const seq = [...items, ...items];
  return (
    <div className={`tape tape--${variant}`}>
      <div ref={trackRef} className="tape-track">
        {[0, 1].map((copy) => (
          <div key={copy} className="tape-seq" aria-hidden={copy === 1}>
            {seq.map((t, i) => (
              <Fragment key={i}>
                <span className="tape-item">{t}</span>
                {variant === 'a' ? (
                  <LogoMark width={46} height={27} first="#03121b" second="#03121b" third="#ffffff" className="tape-mark" />
                ) : (
                  <LogoMark width={46} height={27} className="tape-mark" />
                )}
              </Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Two tapes crossing over the seam between the light and dark sections.
 * They drift on their own, are pushed by the scroll position, and lean with scroll velocity.
 */
export default function MarqueeBand() {
  const sectionRef = useRef(null);
  const aRef = useRef(null);
  const bRef = useRef(null);
  const st = useRef({ lastY: null, v: 0, t0: null, half: [0, 0] });

  // loop widths only change with the layout: measure them here, never in the frame loop
  useEffect(() => {
    const measure = () => {
      st.current.half = [aRef.current.scrollWidth / 2, bRef.current.scrollWidth / 2];
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(aRef.current);
    ro.observe(bRef.current);
    return () => ro.disconnect();
  }, []);

  useVisibleFrame(sectionRef, (now) => {
    const s = st.current;
    const y = window.scrollY;
    if (s.lastY === null) s.lastY = y;
    if (s.t0 === null) s.t0 = now;
    const dy = y - s.lastY;
    s.lastY = y;
    s.v += (dy - s.v) * 0.12;
    const t = (now - s.t0) / 1000;
    const skew = Math.max(-14, Math.min(14, -s.v * 0.35));
    const move = (track, dir, half) => {
      if (!half) return;
      let x = (t * 46 + y * 0.55) % half;
      if (dir < 0) x = half - x;
      track.style.transform = `translate3d(${-x}px, 0, 0) skewX(${skew.toFixed(2)}deg)`;
    };
    move(aRef.current, 1, s.half[0]);
    move(bRef.current, -1, s.half[1]);
  });

  return (
    <section ref={sectionRef} className="marquee" data-nav-theme="dark" aria-label="Lo que hacemos">
      <Row items={ROW_B} trackRef={bRef} variant="b" />
      <Row items={ROW_A} trackRef={aRef} variant="a" />
    </section>
  );
}
