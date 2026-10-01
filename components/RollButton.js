export function ArrowIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12"></line>
      <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
  );
}

/**
 * Pill button whose label rolls up on hover (the label is stacked twice inside a 20px-tall mask)
 * and whose arrow, sitting in a circle, turns -45deg.
 * variant: "accent" (cyan), "dark", "light". size: "sm" | "md".
 */
export default function RollButton({ href, children, variant = 'accent', size = 'md', type, onClick, className = '', ...rest }) {
  const cls = `roll-btn roll-btn--${variant} roll-btn--${size} ${className}`;
  const inner = (
    <>
      <span className="roll-btn__mask">
        <span className="roll-btn__track">
          <span>{children}</span>
          <span aria-hidden="true">{children}</span>
        </span>
      </span>
      <span className="roll-btn__icon">
        <ArrowIcon size={size === 'sm' ? 12 : 14} />
      </span>
    </>
  );
  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <button type={type || 'button'} className={cls} onClick={onClick} {...rest}>
      {inner}
    </button>
  );
}
