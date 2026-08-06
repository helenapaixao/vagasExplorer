import React from 'react';
import Lottie from 'lottie-react';
import animationData from '../../assets/25920-questions.json';

const LottiePlayer: React.FC = () => (
  <Lottie animationData={animationData} loop autoplay />
);

export default LottiePlayer;
