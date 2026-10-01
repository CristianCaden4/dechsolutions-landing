'use client';

import { useEffect, useState } from 'react';
import { LogoMark } from './Logo';
import RollButton, { ArrowIcon } from './RollButton';

const LINKS = [
  { label: 'Inicio', href: '#' },
  { label: 'Soluciones', href: '#soluciones' },
  { label: 'PYME Core', href: '#productos' },
  { label: 'LexCore', href: '#productos' },
  { label: 'Cómo trabajamos', href: '#metodologia' },
  { label: 'Diagnóstico', href: '#diagnostico' },
];

// TODO: confirma la ciudad y zona horaria de Dech Solutions antes de publicar.
const CLOCK = { city: 'Bogotá', timeZone: 'America/Bogota' };

function useClock() {
  const [time, setTime] = useState(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('es', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: CLOCK.timeZone });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return time ?? '--:--';
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  );
}

export default function Nav({ navScrolled, navTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const time = useClock();

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

  return (
    <>
      <header className={`nav-fixed theme-${navTheme} ${navScrolled ? 'scrolled' : ''}`}>
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

          <div className="nav-links">
            {LINKS.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>

          <div className="nav-right">
            <span className="nav-clock">
              <ClockIcon />
              <span>
                <span className="mono">{time}</span> en {CLOCK.city}
              </span>
            </span>
            <RollButton href="#contacto" variant={navTheme === 'light' && navScrolled ? 'dark' : 'light'} size="sm" className="nav-cta">
              Contacto
            </RollButton>
            <button
              className="nav-menu-btn"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span>{menuOpen ? 'Cerrar' : 'Menú'}</span>
              {menuOpen ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                  <line x1="4" y1="8" x2="20" y2="8"></line>
                  <line x1="4" y1="16" x2="20" y2="16"></line>
                </svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      <div id="mobile-menu" className={`sheet ${menuOpen ? 'is-open' : ''}`} aria-hidden={!menuOpen} inert={!menuOpen}>
        <div className="sheet-backdrop" onClick={() => setMenuOpen(false)} />
        <div className="sheet-panel" role="dialog" aria-modal="true" aria-label="Menú">
          <div className="sheet-time">
            <ClockIcon />
            <span>
              <span className="mono">{time}</span> en {CLOCK.city}
            </span>
          </div>
          <div className="sheet-links">
            {LINKS.map((link) => (
              <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <a href="#contacto" onClick={() => setMenuOpen(false)}>
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
