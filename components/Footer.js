export default function Footer() {
  return (
    <footer data-nav-theme="dark" style={{ background: '#0A0A0A', padding: '80px 0 32px' }}>
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 18 }}>
              <svg width="34" height="20" viewBox="0 0 34 20" fill="none">
                <path d="M2 2 L9 10 L2 18" stroke="#ffffff" strokeWidth="4.2" strokeLinecap="square"></path>
                <path d="M13 2 L20 10 L13 18" stroke="#2E9BD6" strokeWidth="4.2" strokeLinecap="square"></path>
                <path d="M24 2 L31 10 L24 18" stroke="#64CEFB" strokeWidth="4.2" strokeLinecap="square"></path>
              </svg>
              <span style={{ fontSize: 20, letterSpacing: '-0.02em', lineHeight: 1, whiteSpace: 'nowrap' }}>
                <span style={{ color: '#fff', fontWeight: 700 }}>Dech</span>
                <span style={{ color: 'rgba(255,255,255,0.62)', fontWeight: 400 }}> Solutions</span>
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, lineHeight: 1.5, margin: 0, maxWidth: 220 }}>
              Tecnología construida alrededor de tu negocio.
            </p>
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
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12.5, margin: '24px 0 0' }}>
          © 2026 DECH SOLUTIONS. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
