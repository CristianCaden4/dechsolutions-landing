'use client';

import { Fragment, useRef, useState } from 'react';
import HeroShader from './HeroShader';
import RollButton, { ArrowIcon } from './RollButton';
import { useScrollProgress, ease } from './scroll/engine';
import Kicker from './fx/Kicker';

const HEADING = ['Cuéntanos', 'cómo', 'funciona', 'tu', 'negocio.'];

export default function CTASection() {
  const [sent, setSent] = useState(false);
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const progressRef = useRef(0);

  // TODO: este formulario todavía no envía datos a ningún sitio. Antes de publicar,
  // conéctalo a un servicio real (por ejemplo un endpoint serverless de Next.js que
  // use Resend/SendGrid, o un servicio como Formspree) para que los mensajes lleguen
  // de verdad a tu correo o CRM.
  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  // the closing light settles as the section arrives, and the heading rises word by word
  useScrollProgress(
    sectionRef,
    (p) => {
      progressRef.current = 0.35 * (1 - ease.range(p, 0, 0.8));
      headRef.current.querySelectorAll('.word > span').forEach((el, i) => {
        const k = ease.outCubic(ease.range(p, 0.08 + i * 0.05, 0.5 + i * 0.05));
        el.style.transform = `translate3d(0, ${(1 - k) * 105}%, 0)`;
      });
    },
    { mode: 'enter' }
  );

  return (
    <section ref={sectionRef} id="contacto" data-nav-theme="dark" data-spy="contacto" className="cta" aria-labelledby="cta-title">
      <div className="cta-bg">
        <HeroShader preset="close" progressRef={progressRef} />
      </div>

      <div className="wrap cta-inner">
        <Kicker>Empecemos</Kicker>
        <h2 ref={headRef} id="cta-title" className="cta-heading">
          {HEADING.map((w) => (
            <Fragment key={w}>
              <span className="word">
                <span>{w}</span>
              </span>{' '}
            </Fragment>
          ))}
        </h2>

        <div className="contact-grid">
          <div className="contact-links" data-stagger>
            <a href="#productos">
              Conocer PYME Core <ArrowIcon />
            </a>
            <a href="#productos">
              Conocer LexCore <ArrowIcon />
            </a>
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer">
              WhatsApp directo <ArrowIcon />
            </a>
          </div>

          <form className="contact-form liquid-glass-strong" onSubmit={handleSubmit} data-stagger>
            {sent ? (
              <div className="contact-sent" role="status">
                <span className="status-dot" />
                <p>Gracias, recibimos tu mensaje. Te contactaremos pronto.</p>
              </div>
            ) : (
              <>
                <div className="contact-form-row">
                  <input className="input" placeholder="Nombre" name="name" aria-label="Nombre" required />
                  <input className="input" placeholder="Empresa" name="company" aria-label="Empresa" />
                </div>
                <input className="input" placeholder="Correo" name="email" type="email" aria-label="Correo" required />
                <select className="input" name="need" defaultValue="" aria-label="Tipo de necesidad">
                  <option value="" disabled>
                    Tipo de necesidad
                  </option>
                  <option>Software a la medida</option>
                  <option>PYME Core</option>
                  <option>LexCore</option>
                  <option>Automatización</option>
                  <option>Otro</option>
                </select>
                <textarea className="input" placeholder="Mensaje" name="message" aria-label="Mensaje" rows={4} />
                <RollButton type="submit" variant="accent" className="contact-submit">
                  Enviar mensaje
                </RollButton>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
