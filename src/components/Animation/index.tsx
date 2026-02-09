import React, { useState, useRef, useEffect } from 'react';
import LottieLib from 'react-lottie';
import type { LottieProps } from 'react-lottie';
import { Container } from './styles';
import animationData from '../../assets/25920-questions.json';

const Lottie = LottieLib as unknown as React.ComponentType<LottieProps>;

const Animation: React.FC = () => {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsInView(true);
      },
      { threshold: 0.2, rootMargin: '0px 0px -20px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Container ref={containerRef}>
      {isInView && (
        <Lottie
          key="lottie-inview"
          options={{
            loop: true,
            autoplay: true,
            animationData,
          }}
          direction={1}
        />
      )}
    </Container>
  );
};

export default Animation;
