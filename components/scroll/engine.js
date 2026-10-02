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
 * Performance contract:
 *  - every frame first READS (all rects, plus each subscriber's optional `measure()`), then WRITES
 *    (callbacks), so layout is computed at most once per frame instead of once per subscriber;
 *  - rects are only re-read when the page scrolled or resized;
 *  - the loop sleeps as soon as nothing is moving and wakes on scroll/resize.
 * Callbacks mutate the DOM directly through refs, so scrolling never re-renders React.
 * With prefers-reduced-motion the loop never starts: each callback is called once with its
 * `reducedValue` (the final, readable state).
 */

const subs = new Set();
let raf = 0;
let vh = 0;
let reduced = false;
let started = false;
let running = false;
let dirty = true;
let lastY = -1;
let idle = 0;

const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

function progressOf(r, mode) {
  if (mode === 'pin') {
    const span = r.height - vh;
    return span > 0 ? clamp(-r.top / span) : r.top <= 0 ? 1 : 0;
  }
  if (mode === 'enter') return clamp((vh - r.top) / (vh * 0.75));
  return clamp((vh - r.top) / (vh + r.height));
}

function tick() {
  const y = window.scrollY;
  const moved = dirty || y !== lastY;
  lastY = y;

  // read phase
  if (moved) {
    vh = window.innerHeight;
    subs.forEach((s) => {
      s.target = progressOf(s.el.getBoundingClientRect(), s.mode);
      if (s.measure) s.data = s.measure();
    });
    dirty = false;
  }

  // write phase
  let animating = false;
  subs.forEach((s) => {
    if (s.cur == null) s.cur = s.target;
    else if (s.cur !== s.target) {
      s.cur += (s.target - s.cur) * s.ease;
      if (Math.abs(s.target - s.cur) < 0.0004) s.cur = s.target;
    }
    if (s.cur !== s.target) animating = true;
    if (s.cur !== s.last || (moved && s.measure)) {
      s.last = s.cur;
      s.cb(s.cur, s.data);
    }
  });

  idle = moved || animating ? 0 : idle + 1;
  if (idle > 3) {
    running = false;
    return;
  }
  raf = requestAnimationFrame(tick);
}

function wake() {
  if (running || reduced) return;
  running = true;
  idle = 0;
  raf = requestAnimationFrame(tick);
}

function settleReduced() {
  subs.forEach((s) => s.cb(s.reducedValue, s.measure ? s.measure() : undefined));
}

function invalidate() {
  dirty = true;
  subs.forEach((s) => (s.last = null));
  if (reduced) settleReduced();
  else wake();
}

function start() {
  if (started) return;
  started = true;
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  reduced = mq.matches;
  mq.addEventListener('change', (e) => {
    reduced = e.matches;
    cancelAnimationFrame(raf);
    running = false;
    if (reduced) settleReduced();
    else invalidate();
  });
  window.addEventListener('scroll', wake, { passive: true });
  window.addEventListener('resize', invalidate);
  // layout can change without a scroll (fonts loading, sections sizing themselves)
  new ResizeObserver(invalidate).observe(document.body);
  wake();
}

export function subscribe(sub) {
  const s = { ease: 0.12, mode: 'view', reducedValue: 1, cur: null, last: null, target: 0, ...sub };
  subs.add(s);
  start();
  if (reduced) s.cb(s.reducedValue, s.measure ? s.measure() : undefined);
  else invalidate();
  return () => subs.delete(s);
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * React binding: calls `cb(progress, data)` every time the smoothed progress of `ref` changes.
 * `measure` (optional) runs in the read phase, after a scroll, and its result is passed as `data`:
 * put any layout reads there, never in `cb`.
 */
export function useScrollProgress(ref, cb, { mode = 'view', ease, reducedValue = 1, measure } = {}) {
  const cbRef = useRef(cb);
  const measureRef = useRef(measure);
  useEffect(() => {
    cbRef.current = cb;
    measureRef.current = measure;
  });
  const hasMeasure = !!measure;
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const touch = window.matchMedia('(pointer: coarse)').matches;
    return subscribe({
      el,
      mode,
      reducedValue,
      ease: ease ?? (touch ? 0.2 : 0.12),
      measure: hasMeasure ? () => measureRef.current() : undefined,
      cb: (p, data) => cbRef.current(p, data),
    });
  }, [ref, mode, ease, reducedValue, hasMeasure]);
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

/** Add `is-in` to `ref` the first time it enters the viewport (CSS does the animation). */
export function useInView(ref, { threshold = 0.25, rootMargin = '0px' } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('is-in');
          io.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, rootMargin]);
}

export const ease = {
  clamp,
  range: (p, a, b) => clamp((p - a) / (b - a)),
  smooth: (t) => t * t * (3 - 2 * t),
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  lerp: (a, b, t) => a + (b - a) * t,
};
