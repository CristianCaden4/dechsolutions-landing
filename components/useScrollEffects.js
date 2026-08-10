'use client';

import { useEffect, useState } from 'react';

/**
 * Handles two independent scroll-driven behaviors:
 *  1. Reveal-on-scroll for any element with [data-reveal] (adds .is-revealed once, then stops observing).
 *  2. Nav theme detection: which [data-nav-theme] section currently sits behind the fixed nav,
 *     plus whether we've scrolled far enough to show the frosted-glass background.
 *
 * IntersectionObserver is the only mechanism used here — this runs in a real browser (Vercel/production),
 * not the design-tool preview sandbox, so no polling fallback is needed.
 */
export function useScrollEffects() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [navTheme, setNavTheme] = useState('dark');

  useEffect(() => {
    // Reveal-on-scroll
    const revealEls = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach((el) => io.observe(el));

    // Nav theme + scrolled state
    const themedEls = Array.from(document.querySelectorAll('[data-nav-theme]'));
    const probeY = 40;

    const onScroll = () => {
      const vh = window.innerHeight;
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      setNavScrolled(scrollY > vh * 0.8);

      for (const el of themedEls) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= probeY && rect.bottom > probeY) {
          setNavTheme(el.dataset.navTheme);
          break;
        }
      }
    };

    let ticking = false;
    const scrollHandler = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  return { navScrolled, navTheme };
}
