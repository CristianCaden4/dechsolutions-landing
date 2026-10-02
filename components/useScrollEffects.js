'use client';

import { useEffect, useState } from 'react';

/**
 * Page-wide scroll behaviours, all driven by IntersectionObserver or a passive scroll listener
 * that only reads window.scrollY (no layout reads, no per-frame work while the page is still):
 *  1. Reveal-on-scroll: [data-reveal] gets .is-revealed once; [data-stagger] does the same and
 *     numbers its children (--si) so CSS can cascade them.
 *  2. Nav theme: which [data-nav-theme] section sits under the nav (a thin band at y=40px).
 *  3. Nav state: scrolled past the hero, and hidden while scrolling down / shown when scrolling up.
 *  4. Scroll-spy: which [data-spy] block is crossing the middle of the screen.
 */
export function useScrollEffects() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [navTheme, setNavTheme] = useState('dark');
  const [navHidden, setNavHidden] = useState(false);
  const [activeSpy, setActiveSpy] = useState('inicio');

  useEffect(() => {
    // 1. reveal
    document.querySelectorAll('[data-stagger]').forEach((el) => {
      [...el.children].forEach((child, i) => child.style.setProperty('--si', i));
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    );
    document.querySelectorAll('[data-reveal], [data-stagger]').forEach((el) => io.observe(el));

    // 1b. decorative CSS loops (pulsing dots, rings, bars) keep ticking even off screen and each tick
    //     restyles the element; sections out of view get .is-offscreen, which pauses them
    const offIo = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('is-offscreen', !e.isIntersecting)),
      { rootMargin: '100px 0px' }
    );
    document.querySelectorAll('section, footer').forEach((el) => offIo.observe(el));

    // 2. nav theme
    let theme = 'dark';
    const themeIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.target.dataset.navTheme !== theme) setNavTheme((theme = e.target.dataset.navTheme));
        });
      },
      { rootMargin: '-40px 0px -95% 0px' }
    );
    document.querySelectorAll('[data-nav-theme]').forEach((el) => themeIo.observe(el));

    // 4. scroll-spy: of the blocks crossing the middle band, the last one in document order wins
    const spyEls = [...document.querySelectorAll('[data-spy]')];
    const crossing = new Set();
    const spyIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? crossing.add(e.target) : crossing.delete(e.target)));
        const current = spyEls.filter((el) => crossing.has(el)).pop();
        setActiveSpy(current ? current.dataset.spy : null);
      },
      { rootMargin: '-45% 0px -54% 0px' }
    );
    spyEls.forEach((el) => spyIo.observe(el));

    // 3. scrolled + smart hide
    let lastY = window.scrollY;
    let travel = 0;
    // React is only told when a value actually flips, not on every scroll event
    let scrolled = null;
    let hidden = false;
    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const nextScrolled = y > vh * 0.8;
      if (nextScrolled !== scrolled) setNavScrolled((scrolled = nextScrolled));
      const dy = y - lastY;
      lastY = y;
      // accumulate travel in one direction so tiny jitters don't toggle the nav
      travel = Math.sign(dy) === Math.sign(travel) ? travel + dy : dy;
      let nextHidden = hidden;
      if (y < vh * 0.9) nextHidden = false;
      else if (travel > 24) nextHidden = true;
      else if (travel < -12) nextHidden = false;
      if (nextHidden !== hidden) setNavHidden((hidden = nextHidden));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      offIo.disconnect();
      themeIo.disconnect();
      spyIo.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return { navScrolled, navTheme, navHidden, activeSpy };
}
