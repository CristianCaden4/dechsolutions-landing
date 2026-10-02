'use client';

import { useRef } from 'react';
import { LogoMark } from './Logo';
import { useScrollProgress, ease } from './scroll/engine';

const WORD = [...'Dech'].map((c) => [c, 'strong']).concat([...'Solutions'].map((c) => [c, 'muted']));

/** The brand signature: oversized letters that rise into place as the page ends. */
// progress is measured on the whole footer, so the letters finish rising before the page runs out
function Wordmark({ footerRef }) {
  const ref = useRef(null);
  useScrollProgress(
    footerRef,
    (p) => {
      const chars = ref.current.querySelectorAll('.wm-char');
      chars.forEach((el, i) => {
        const k = ease.outCubic(ease.range(p, 0.02 + i * 0.02, 0.36 + i * 0.02));
        el.style.transform = `translate3d(0, ${(1 - k) * 100}%, 0) rotate(${(1 - k) * 12}deg)`;
      });
    },
    { mode: 'enter' }
  );
  return (
    <div ref={ref} className="footer-wordmark" aria-hidden="true">
      {WORD.map(([c, tone], i) => (
        <span key={i} className={`wm-mask ${tone} ${i === 4 ? 'gap' : ''}`}>
          <span className="wm-char">{c}</span>
        </span>
      ))}
    </div>
  );
}

export default function Footer() {
  const footerRef = useRef(null);
  return (
    <footer ref={footerRef} data-nav-theme="dark" className="footer">
      <div className="wrap">
        <div className="footer-grid" data-stagger>
          <div>
            <div className="footer-brand">
              <LogoMark />
              <span className="footer-brand__text">
                <span className="nav-brand-strong">Dech</span>
                <span className="nav-brand-muted"> Solutions</span>
              </span>
            </div>
            <p className="footer-tagline">Tecnología construida alrededor de tu negocio.</p>
          </div>

          <div>
            <p className="footer-col-title">Soluciones</p>
            <div className="footer-links">
              <a href="#soluciones">Software a la medida</a>
              <a href="#soluciones">Automatización</a>
              <a href="#soluciones">Integraciones</a>
              <a href="#soluciones">IA aplicada</a>
            </div>
          </div>

          <div>
            <p className="footer-col-title">Producto</p>
            <div className="footer-links">
              <a href="#productos">PYME Core</a>
              <a href="#productos">LexCore</a>
            </div>
          </div>

          <div>
            <p className="footer-col-title">Empresa</p>
            <div className="footer-links">
              <a href="#metodologia">Cómo trabajamos</a>
              <a href="#diagnostico">Diagnóstico</a>
              <a href="#contacto">Contacto</a>
            </div>
          </div>
        </div>
        <p className="footer-copy">© 2026 DECH SOLUTIONS. Todos los derechos reservados.</p>
        <Wordmark footerRef={footerRef} />
      </div>
    </footer>
  );
}
