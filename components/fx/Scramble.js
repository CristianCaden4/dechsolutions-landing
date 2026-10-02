'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../scroll/engine';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/[]{}=+*#';

/** Resolve `text` left to right out of random glyphs, inside `el`. Returns a cancel function. */
export function scrambleInto(el, text, { duration = 700 } = {}) {
  if (!el) return () => {};
  if (prefersReducedMotion()) {
    el.textContent = text;
    return () => {};
  }
  const start = performance.now();
  let id = 0;
  const frame = (now) => {
    const k = Math.min(1, (now - start) / duration);
    const fixed = Math.floor(k * text.length);
    let out = text.slice(0, fixed);
    for (let i = fixed; i < text.length; i++) {
      out += text[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
    }
    el.textContent = out;
    if (k < 1) id = requestAnimationFrame(frame);
  };
  id = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(id);
}

/** Text that decodes itself the first time it scrolls into view. */
export default function Scramble({ text, className = '', duration }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    let cancel = () => {};
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          cancel = scrambleInto(el, text, { duration });
          io.disconnect();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancel();
    };
  }, [text, duration]);
  return (
    <span className={className} aria-label={text}>
      <span ref={ref} aria-hidden="true">
        {text}
      </span>
    </span>
  );
}
