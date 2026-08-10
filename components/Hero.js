export default function Hero() {
  return (
    <section data-nav-theme="dark" className="hero">
      {/*
        TODO (antes de publicar): reemplazar esta URL de video temporal (CloudFront de
        Motionsites, usada solo para la prueba de estilo) por un video propio o con
        licencia clara de uso comercial.
      */}
      <video className="hero-video" autoPlay loop muted playsInline>
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260328_105406_16f4600d-7a92-4292-b96e-b19156c7830a.mp4"
          type="video/mp4"
        />
      </video>
      <div className="hero-scrim" />

      <div className="hero-content">
        <div className="hero-intro">
          <p className="hero-intro-left">
            Entendemos cómo funciona tu empresa y construimos el software, las
            automatizaciones y los sistemas que necesita para operar mejor,
            conectarse y crecer.
          </p>
          <p className="hero-intro-right">Software · Automatización · Sistemas Empresariales</p>
        </div>

        <div className="hero-mid">
          <p className="hero-eyebrow">Tecnología construida alrededor de tu negocio</p>

          <h1 className="hero-heading">
            <span className="hero-heading-line1">Tecnología construida</span>
            <span className="hero-heading-shiny">alrededor de tu negocio.</span>
          </h1>

          <a href="#contacto" className="btn-cta">
            Hablemos de tu negocio
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
