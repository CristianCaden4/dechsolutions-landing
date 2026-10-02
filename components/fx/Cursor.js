'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../scroll/engine';

const INTERACTIVE = 'a, button, select, [role="button"]';
const TEXT_INPUT = 'input, textarea';
const MAGNET = '.roll-btn, .hero-badge, .industry-arrow-btn';

/**
 * Desktop-only cursor ring that trails the pointer, swells over anything clickable,
 * and pulls magnetic elements (the main buttons) a few pixels toward the pointer.
 * The native cursor stays visible; this is an accent, not a replacement.
 */
export default function Cursor() {
  const ringRef = useRef(null);

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches || prefersReducedMotion()) return undefined;
    const ring = ringRef.current;
    const pos = { x: -100, y: -100, tx: -100, ty: -100 };
    let magnet = null;
    let raf = 0;
    let running = false;

    const release = () => {
      if (magnet) magnet.style.translate = '';
      magnet = null;
    };

    const onMove = (e) => {
      pos.tx = e.clientX;
      pos.ty = e.clientY;
      if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
      const t = e.target instanceof Element ? e.target : null;
      ring.classList.toggle('is-hover', !!t?.closest(INTERACTIVE));
      ring.classList.toggle('is-hidden', !!t?.closest(TEXT_INPUT));
      ring.classList.add('is-on');

      const m = t?.closest(MAGNET);
      if (m !== magnet) release();
      if (m) {
        magnet = m;
        const r = m.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        m.style.translate = `${dx * 0.22}px ${dy * 0.32}px`;
      }
    };
    const onLeave = () => {
      ring.classList.remove('is-on');
      release();
    };
    const onDown = () => ring.classList.add('is-down');
    const onUp = () => ring.classList.remove('is-down');

    // the ring eases toward the pointer and the loop sleeps once it has arrived
    function loop() {
      pos.x += (pos.tx - pos.x) * 0.2;
      pos.y += (pos.ty - pos.y) * 0.2;
      ring.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0)`;
      if (Math.abs(pos.tx - pos.x) < 0.1 && Math.abs(pos.ty - pos.y) < 0.1) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    return () => {
      cancelAnimationFrame(raf);
      release();
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  return (
    <div ref={ringRef} className="cursor" aria-hidden="true">
      <span />
    </div>
  );
}
