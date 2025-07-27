import React, { useState } from 'react';
import LottieLib from 'react-lottie';
import type { LottieProps } from 'react-lottie';
import { Container } from './styles';
import animationData from '../../assets/25920-questions.json';

const Lottie = LottieLib as unknown as React.ComponentType<LottieProps>;

const Animation: React.FC = () => {
  const [autoplay] = useState(false);
  const [loop] = useState(true);
  const [direction] = useState(1);

  return (
    <Container>
      <Lottie
        options={{
          loop,
          autoplay,
          animationData,
        }}
        direction={direction}
      />
    </Container>
  );
};

export default Animation;
