import './globals.css';

export const metadata = {
  title: 'Dech Solutions — Tecnología construida alrededor de tu negocio',
  description:
    'Software a la medida, automatización y sistemas empresariales. Conoce PYME Core (ERP modular) y LexCore (SaaS legal para abogados y firmas jurídicas).',
};

// viewport-fit=cover lets the layout reach under the notch; the CSS pads with env(safe-area-inset-*)
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0A0A0A',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
