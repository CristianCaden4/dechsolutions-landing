'use client';

import { useState } from 'react';

const LINKS = [
  { label: 'Inicio', href: '#' },
  { label: 'Soluciones', href: '#soluciones' },
  { label: 'PYME Core', href: '#productos' },
  { label: 'LexCore', href: '#productos' },
  { label: 'Cómo trabajamos', href: '#metodologia' },
  { label: 'Diagnóstico', href: '#diagnostico' },
];

export default function Nav({ navScrolled, navTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={`nav-fixed theme-${navTheme} ${navScrolled ? 'scrolled' : ''}`}
    >
      <nav className="nav-inner">
        <a href="#" aria-label="Dech Solutions" className="nav-brand">
          <svg width="34" height="20" viewBox="0 0 34 20" fill="none">
            <path
              className="nav-logo-stroke0"
              d="M2 2 L9 10 L2 18"
              stroke="#ffffff"
              strokeWidth="4.2"
              strokeLinecap="square"
              style={{ transition: 'stroke 0.25s ease' }}
            />
            <path d="M13 2 L20 10 L13 18" stroke="#2E9BD6" strokeWidth="4.2" strokeLinecap="square" />
            <path d="M24 2 L31 10 L24 18" stroke="#64CEFB" strokeWidth="4.2" strokeLinecap="square" />
          </svg>
          <span className="nav-brand-text">
            <span className="nav-brand-strong">Dech</span>
            <span className="nav-brand-muted"> Solutions</span>
          </span>
        </a>

        <div className="nav-pill">
          {LINKS.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
          <a href="#contacto">
            Contacto
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>

        <button
          className="nav-burger"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </nav>

      {menuOpen && (
        <div className="nav-mobile-menu">
          {LINKS.map((link) => (
            <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          <a href="#contacto" onClick={() => setMenuOpen(false)}>
            Contacto
          </a>
        </div>
      )}
    </div>
  );
}
