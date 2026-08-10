'use client';

import { useState } from 'react';

export default function CTASection() {
  const [sent, setSent] = useState(false);

  // TODO: este formulario todavía no envía datos a ningún sitio. Antes de publicar,
  // conéctalo a un servicio real (por ejemplo un endpoint serverless de Next.js que
  // use Resend/SendGrid, o un servicio como Formspree) para que los mensajes lleguen
  // de verdad a tu correo o CRM.
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contacto" data-nav-theme="light" style={{ background: '#fff', padding: '100px 0' }}>
      <div className="wrap">
        <p className="eyebrow">EMPECEMOS</p>
        <h2 className="section-heading light" style={{ maxWidth: 700, marginBottom: 56 }}>
          Cuéntanos cómo funciona tu negocio.
        </h2>

        <div className="contact-grid">
          <div className="contact-links">
            <a href="#productos">Conocer PYME Core →</a>
            <a href="#productos">Conocer LexCore →</a>
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">WhatsApp directo →</a>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            {sent ? (
              <div style={{ border: '1px solid var(--line)', borderRadius: 12, padding: '24px 20px' }}>
                <p style={{ margin: 0, color: 'var(--ink)', fontSize: 15 }}>
                  Gracias — recibimos tu mensaje. Te contactaremos pronto.
                </p>
              </div>
            ) : (
              <>
                <div className="contact-form-row">
                  <input className="input" placeholder="Nombre" name="name" required />
                  <input className="input" placeholder="Empresa" name="company" />
                </div>
                <input className="input" placeholder="Correo" name="email" type="email" required />
                <select className="input" name="need" defaultValue="">
                  <option value="" disabled>Tipo de necesidad</option>
                  <option>Software a la medida</option>
                  <option>PYME Core</option>
                  <option>LexCore</option>
                  <option>Automatización</option>
                  <option>Otro</option>
                </select>
                <textarea className="input" placeholder="Mensaje" name="message" rows={4} />
                <button type="submit" className="btn-cta" style={{ alignSelf: 'flex-start' }}>
                  Enviar mensaje
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
