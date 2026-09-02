import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

/**
 * The Lottie player and its ~390 KB animation JSON are loaded on demand, so
 * they stay out of the initial bundle.
 */
const LottiePlayer = dynamic(() => import('./LottiePlayer'), { ssr: false });

const Animation: React.FC = () => {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { threshold: 0.2, rootMargin: '0px 0px -20px 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-[400px] aspect-square">
      {isInView && <LottiePlayer />}
    </div>
  );
};

export default Animation;
