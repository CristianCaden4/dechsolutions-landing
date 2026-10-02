'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../scroll/engine';

/*
  Ignition sequence, once per browser session (~1.5s):
  the three chevrons light up one by one, fold into a single line of light,
  and the screen splits open onto the hero.
  The hero waits for `window.__dechRevealed` / the "dech:reveal" event before playing its own entrance.
  A CSS failsafe hides the overlay after a few seconds even if this script never runs.
*/

export function revealHero() {
  if (window.__dechRevealed) return;
  window.__dechRevealed = true;
  window.dispatchEvent(new Event('dech:reveal'));
}

const KEY = 'dech-intro-seen';
// decided once per page load, so a strict-mode double effect does not read its own write
let decision = null;

export default function Intro() {
  const ref = useRef(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (decision === null) {
      let seen = false;
      try {
        seen = sessionStorage.getItem(KEY) === '1';
        sessionStorage.setItem(KEY, '1');
      } catch {
        /* storage blocked: just play it */
      }
      decision = seen || prefersReducedMotion() ? 'skip' : 'play';
    }
    if (decision === 'skip') {
      revealHero();
      setGone(true);
      return undefined;
    }

    const timers = [];
    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    const finish = () => {
      timers.forEach(clearTimeout);
      el.classList.add('is-open');
      revealHero();
      setTimeout(() => setGone(true), 750);
    };

    el.classList.add('is-playing');
    at(620, () => el.classList.add('is-line'));
    at(1000, finish);

    const skip = () => finish();
    window.addEventListener('wheel', skip, { once: true, passive: true });
    window.addEventListener('keydown', skip, { once: true });
    el.addEventListener('pointerdown', skip, { once: true });
    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('wheel', skip);
      window.removeEventListener('keydown', skip);
    };
  }, []);

  if (gone) return null;
  return (
    <div ref={ref} className="intro" aria-hidden="true">
      <div className="intro-half top" />
      <div className="intro-half bottom" />
      <div className="intro-mark">
        <svg viewBox="0 0 34 20" fill="none">
          <path d="M2 2 L9 10 L2 18" stroke="#ffffff" strokeWidth="3.6" strokeLinecap="square" />
          <path d="M13 2 L20 10 L13 18" stroke="#2E9BD6" strokeWidth="3.6" strokeLinecap="square" />
          <path d="M24 2 L31 10 L24 18" stroke="#64CEFB" strokeWidth="3.6" strokeLinecap="square" />
        </svg>
      </div>
      <div className="intro-line" />
    </div>
  );
}
