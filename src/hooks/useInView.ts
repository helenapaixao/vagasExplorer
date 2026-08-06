import { useEffect, useRef, useState } from 'react';

/**
 * Reveals content on scroll — but only ever *adds* an entrance animation.
 * The element is visible by default, so a visitor without JavaScript (or with
 * a stalled frame loop) still reads the page instead of a blank one.
 */
export function useInView<T extends HTMLElement>(margin = '-80px') {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: `0px 0px ${margin} 0px` },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [margin]);

  return { ref, inView };
}
