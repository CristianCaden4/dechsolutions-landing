'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { LogoMark } from './Logo';
import RollButton, { ArrowIcon } from './RollButton';
import { useScrollEffects } from './useScrollEffects';

const LINKS = [
  { label: 'Inicio', href: '#', spy: 'inicio' },
  { label: 'Soluciones', href: '#soluciones', spy: 'soluciones' },
  { label: 'PYME Core', href: '#productos', spy: 'pyme' },
  { label: 'LexCore', href: '#productos', spy: 'lexcore' },
  { label: 'Cómo trabajamos', href: '#metodologia', spy: 'metodologia' },
  { label: 'Diagnóstico', href: '#diagnostico', spy: 'diagnostico' },
];

// TODO: confirma la ciudad y zona horaria de Dech Solutions antes de publicar.
const CLOCK = { city: 'Bogotá', timeZone: 'America/Bogota' };

/** Live clock; its own component so only this re-renders every few seconds, not the whole nav. */
function Clock() {
  const [time, setTime] = useState(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('es', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: CLOCK.timeZone });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 5000);
    return () => clearInterval(id);
  }, []);
  const [hh, mm] = (time ?? '--:--').split(':');
  return (
    <>
      <ClockIcon />
      <span>
        <span className="mono">
          {hh}
          <span className="clock-colon">:</span>
          {mm}
        </span>{' '}
        en {CLOCK.city}
      </span>
    </>
  );
}

function ClockIcon() {
  return (
    <svg className="clock-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}

/** Nav link whose label rolls up on hover (same gesture as the buttons). */
function RollLink({ href, label, onPointerEnter, active, linkRef }) {
  return (
    <a ref={linkRef} href={href} className={`nav-link ${active ? 'is-active' : ''}`} onPointerEnter={onPointerEnter} aria-current={active ? 'true' : undefined}>
      <span className="nav-link__mask">
        <span className="nav-link__track">
          <span>{label}</span>
          <span aria-hidden="true">{label}</span>
        </span>
      </span>
    </a>
  );
}

export default function Nav() {
  // the scroll state is owned here, so its updates re-render the nav only, never the page
  const { navScrolled, navTheme, navHidden, activeSpy } = useScrollEffects();
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  // kept in React state: the header's className is rendered by React, so a class added by hand would be wiped
  const [ready, setReady] = useState(false);
  const linkRefs = useRef([]);
  const indicatorRef = useRef(null);
  const progressRef = useRef(null);

  // entrance after the intro opens the curtain
  useEffect(() => {
    const go = () => setReady(true);
    if (window.__dechRevealed) requestAnimationFrame(go);
    else window.addEventListener('dech:reveal', go, { once: true });
    return () => window.removeEventListener('dech:reveal', go);
  }, []);

  // reading progress: one transform write per scroll frame, scrollY only (no layout reads)
  useEffect(() => {
    let max = 1;
    let queued = false;
    const measure = () => {
      max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };
    const paint = () => {
      queued = false;
      progressRef.current.style.transform = `scaleX(${(window.scrollY / max).toFixed(4)})`;
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    };
    measure();
    paint();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // sliding indicator: sits under the hovered link, otherwise under the section you're reading.
  // Only measures on hover/section change, never per frame.
  const target = hovered ?? LINKS.findIndex((l) => l.spy === activeSpy);
  const placeIndicator = useCallback(() => {
    const ind = indicatorRef.current;
    const link = linkRefs.current[target];
    if (!ind) return;
    if (!link || target < 0) {
      ind.style.opacity = '0';
      return;
    }
    ind.style.opacity = '1';
    ind.style.width = `${link.offsetWidth}px`;
    ind.style.transform = `translateX(${link.offsetLeft}px)`;
  }, [target]);
  useLayoutEffect(placeIndicator, [placeIndicator]);
  useEffect(() => {
    window.addEventListener('resize', placeIndicator);
    document.fonts?.ready.then(placeIndicator);
    return () => window.removeEventListener('resize', placeIndicator);
  }, [placeIndicator]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
    };
  }, [menuOpen]);

  const light = navTheme === 'light' && navScrolled;
  const hidden = navHidden && !menuOpen;

  return (
    <>
      <header className={`nav-fixed theme-${navTheme} ${navScrolled ? 'scrolled' : ''} ${hidden ? 'is-hidden' : ''} ${ready ? 'is-ready' : ''}`}>
        <nav className="nav-pill" aria-label="Principal">
          <a href="#" aria-label="Dech Solutions, inicio" className="nav-brand">
            <span className="nav-logo-dot">
              <LogoMark width={22} height={13} />
            </span>
            <span className="nav-brand-text">
              <span className="nav-brand-strong">Dech</span>
              <span className="nav-brand-muted"> Solutions</span>
            </span>
          </a>

          <div className="nav-links" onPointerLeave={() => setHovered(null)}>
            <span ref={indicatorRef} className="nav-indicator" aria-hidden="true" />
            {LINKS.map((link, i) => (
              <RollLink
                key={link.label}
                href={link.href}
                label={link.label}
                active={link.spy === activeSpy}
                linkRef={(el) => (linkRefs.current[i] = el)}
                onPointerEnter={() => setHovered(i)}
              />
            ))}
          </div>

          <div className="nav-right">
            <span className="nav-clock">
              <Clock />
            </span>
            <RollButton
              href="#contacto"
              variant={light ? 'dark' : 'light'}
              size="sm"
              className={`nav-cta ${activeSpy === 'contacto' ? 'is-active' : ''}`}
            >
              Contacto
            </RollButton>
            <button
              className="nav-menu-btn"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="nav-menu-btn__mask">
                <span className={`nav-menu-btn__track ${menuOpen ? 'is-open' : ''}`}>
                  <span>Menú</span>
                  <span>Cerrar</span>
                </span>
              </span>
              <span className={`burger ${menuOpen ? 'is-open' : ''}`} aria-hidden="true">
                <i />
                <i />
              </span>
            </button>
          </div>

          <span className="nav-progress" aria-hidden="true">
            <span ref={progressRef} />
          </span>
        </nav>
      </header>

      <div id="mobile-menu" className={`sheet ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen} inert={!menuOpen}>
        <div className="sheet-backdrop" onClick={() => setMenuOpen(false)} />
        <div className="sheet-panel" role="dialog" aria-modal="true" aria-label="Menú">
          <div className="sheet-time">
            <Clock />
          </div>
          <div className="sheet-links">
            {LINKS.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={link.spy === activeSpy ? 'is-active' : ''}
                style={{ '--si': i }}
              >
                {link.label}
              </a>
            ))}
            <a href="#contacto" onClick={() => setMenuOpen(false)} style={{ '--si': LINKS.length }}>
              Contacto
            </a>
          </div>
          <a href="#contacto" className="sheet-cta" onClick={() => setMenuOpen(false)}>
            Hablemos de tu negocio
            <span className="roll-btn__icon">
              <ArrowIcon />
            </span>
          </a>
        </div>
      </div>
    </>
  );
}
