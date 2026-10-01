import { LogoMark } from './Logo';

export default function Footer() {
  return (
    <footer data-nav-theme="dark" className="footer">
      <div className="wrap">
        <div className="footer-grid">
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
      </div>
    </footer>
  );
}
