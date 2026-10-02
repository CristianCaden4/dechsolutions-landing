import Scramble from './Scramble';

/** Small section label: a mini version of the logo's chevrons, then text that decodes on view. */
export default function Kicker({ children, light = false }) {
  return (
    <p className={`kicker ${light ? 'light' : ''}`}>
      <svg width="17" height="10" viewBox="0 0 34 20" fill="none" aria-hidden="true">
        <path d="M2 2 L9 10 L2 18" stroke="currentColor" strokeWidth="4.6" strokeLinecap="square" />
        <path d="M13 2 L20 10 L13 18" stroke="#2E9BD6" strokeWidth="4.6" strokeLinecap="square" />
        <path d="M24 2 L31 10 L24 18" stroke="#64CEFB" strokeWidth="4.6" strokeLinecap="square" />
      </svg>
      <Scramble text={children} />
    </p>
  );
}
