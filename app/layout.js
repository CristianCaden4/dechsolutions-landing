import './globals.css';

export const metadata = {
  title: 'Dech Solutions — Tecnología construida alrededor de tu negocio',
  description:
    'Software a la medida, automatización y sistemas empresariales. Conoce PYME Core (ERP modular) y LexCore (SaaS legal para abogados y firmas jurídicas).',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
