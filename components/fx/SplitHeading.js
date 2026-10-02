'use client';

import { Fragment, useEffect, useRef } from 'react';

/**
 * Heading whose words rise out of a mask, one after another, the first time it enters the viewport.
 * `highlight` wraps one word in its own class (e.g. the mono "código").
 */
export default function SplitHeading({ as: Tag = 'h2', text, className = '', id, highlight }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('is-in');
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const words = text.split(' ');
  return (
    <Tag ref={ref} id={id} className={`split-heading ${className}`} aria-label={text}>
      {words.map((w, i) => {
        const bare = w.replace(/[.,!?¿¡]/g, '');
        const isHi = highlight && bare === highlight.word;
        return (
          <Fragment key={i}>
            <span className="word" aria-hidden="true">
              <span style={{ '--i': i }}>
                {isHi ? (
                  <>
                    <span className={highlight.className}>{bare}</span>
                    {w.slice(bare.length)}
                  </>
                ) : (
                  w
                )}
              </span>
            </span>{' '}
          </Fragment>
        );
      })}
    </Tag>
  );
}
