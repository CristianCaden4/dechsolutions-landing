export default function ProductsSection() {
  return (
    <section id="productos" data-nav-theme="dark" style={{ position: 'relative', background: '#0A0A0A', padding: '100px 0', overflow: 'hidden' }}>
      <div className="dotted-bg" />
      <div className="wrap" style={{ position: 'relative' }}>
        <p className="eyebrow">PRODUCTOS PROPIOS</p>
        <h2 className="section-heading dark" style={{ maxWidth: 820, marginBottom: 56 }}>
          Tecnología propia para operaciones reales.
        </h2>

        <div className="products-grid">
          <div className="product-card">
            <div className="product-card-glow" />
            <div className="product-card-body">
              <p style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>
                ERP MODULAR
              </p>
              <h3 style={{ color: '#fff', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 14px' }}>PYME Core</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 1.6, margin: '0 0 24px' }}>
                Centraliza ventas, compras, inventario, clientes y reportes en una plataforma modular
                que se adapta a la operación de cada empresa.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                <span className="product-tag">Modular</span>
                <span className="product-tag">Escalable</span>
                <span className="product-tag">Multi-industria</span>
              </div>
              <a href="#" className="product-link">Conocer PYME Core →</a>
            </div>
          </div>

          <div className="product-card">
            <div className="product-card-glow" />
            <div className="product-card-body">
              <p style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 12px' }}>
                SAAS LEGAL
              </p>
              <h3 style={{ color: '#fff', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 14px' }}>LexCore</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, lineHeight: 1.6, margin: '0 0 24px' }}>
                El sistema legal que centraliza casos, clientes y facturación — pensado para
                abogados independientes y firmas jurídicas.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                <span className="product-tag">Gestión de casos</span>
                <span className="product-tag">CRM legal</span>
                <span className="product-tag">Facturación</span>
              </div>
              <a href="#" className="product-link">Conocer LexCore →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
