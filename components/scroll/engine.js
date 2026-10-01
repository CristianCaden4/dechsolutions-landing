'use client';

import { useEffect, useRef } from 'react';

/**
 * Tiny scroll engine: one requestAnimationFrame loop for the whole page.
 *
 * Each subscriber watches one element and receives a smoothed progress value (0..1):
 *  - mode "pin":   progress through a tall section that contains a sticky child
 *                  (0 when its top hits the viewport top, 1 when its bottom hits the viewport bottom).
 *  - mode "view":  progress of the element crossing the viewport
 *                  (0 when its top enters at the bottom, 1 when its bottom leaves at the top).
 *  - mode "enter": 0 when its top is at the viewport bottom, 1 once its top reaches 25% of the viewport.
 *
 * Callbacks mutate the DOM directly through refs, so scrolling never re-renders React.
 * With prefers-reduced-motion the loop never starts: each callback is called once
 * with its `reducedValue` (the final, readable state).
 */

const subs = new Set();
let raf = 0;
let vh = 0;
let reduced = false;
let started = false;

const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

function measure(el, mode) {
  const r = el.getBoundingClientRect();
  if (mode === 'pin') {
    const span = r.height - vh;
    return span > 0 ? clamp(-r.top / span) : r.top <= 0 ? 1 : 0;
  }
  if (mode === 'enter') return clamp((vh - r.top) / (vh * 0.75));
  return clamp((vh - r.top) / (vh + r.height));
}

function tick() {
  vh = window.innerHeight;
  subs.forEach((s) => {
    const target = measure(s.el, s.mode);
    if (s.cur == null) s.cur = target;
    else {
      s.cur += (target - s.cur) * s.ease;
      if (Math.abs(target - s.cur) < 0.0004) s.cur = target;
    }
    if (s.cur !== s.last) {
      s.last = s.cur;
      s.cb(s.cur);
    }
  });
  raf = requestAnimationFrame(tick);
}

function settleReduced() {
  subs.forEach((s) => s.cb(s.reducedValue));
}

function start() {
  if (started) return;
  started = true;
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  reduced = mq.matches;
  mq.addEventListener('change', (e) => {
    reduced = e.matches;
    cancelAnimationFrame(raf);
    if (reduced) settleReduced();
    else raf = requestAnimationFrame(tick);
  });
  window.addEventListener('resize', () => {
    // force every subscriber to re-emit after layout changes
    subs.forEach((s) => (s.last = null));
    if (reduced) settleReduced();
  });
  if (!reduced) raf = requestAnimationFrame(tick);
}

export function subscribe(sub) {
  const s = { ease: 0.12, mode: 'view', reducedValue: 1, cur: null, last: null, ...sub };
  subs.add(s);
  start();
  if (reduced) s.cb(s.reducedValue);
  return () => subs.delete(s);
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** React binding: calls `cb(progress)` every time the smoothed progress of `ref` changes. */
export function useScrollProgress(ref, cb, { mode = 'view', ease, reducedValue = 1 } = {}) {
  const cbRef = useRef(cb);
  useEffect(() => {
    cbRef.current = cb;
  });
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    return subscribe({
      el,
      mode,
      reducedValue,
      ease: ease ?? (touch ? 0.2 : 0.12),
      cb: (p) => cbRef.current(p),
    });
  }, [ref, mode, ease, reducedValue]);
}

/** Run `cb(time)` on every animation frame while `ref` is on screen. */
export function useVisibleFrame(ref, cb, { rootMargin = '100px' } = {}) {
  const cbRef = useRef(cb);
  useEffect(() => {
    cbRef.current = cb;
  });
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let id = 0;
    let visible = false;
    const loop = (t) => {
      cbRef.current(t);
      id = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible && !prefersReducedMotion()) {
          visible = true;
          id = requestAnimationFrame(loop);
        } else if (!entry.isIntersecting && visible) {
          visible = false;
          cancelAnimationFrame(id);
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(id);
    };
  }, [ref, rootMargin]);
}

export const ease = {
  clamp,
  range: (p, a, b) => clamp((p - a) / (b - a)),
  smooth: (t) => t * t * (3 - 2 * t),
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  lerp: (a, b, t) => a + (b - a) * t,
};
