/** The three Dech chevrons. `first` lets the first stroke follow the surrounding theme. */
export function LogoMark({ width = 34, height = 20, first = '#ffffff', className, strokeWidth = 4.2 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 34 20" fill="none" className={className} aria-hidden="true">
      <path className="logo-stroke0" d="M2 2 L9 10 L2 18" stroke={first} strokeWidth={strokeWidth} strokeLinecap="square" />
      <path d="M13 2 L20 10 L13 18" stroke="#2E9BD6" strokeWidth={strokeWidth} strokeLinecap="square" />
      <path d="M24 2 L31 10 L24 18" stroke="#64CEFB" strokeWidth={strokeWidth} strokeLinecap="square" />
    </svg>
  );
}
