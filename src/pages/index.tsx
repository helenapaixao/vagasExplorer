import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import Header from '../components/Header';
import Animation from '../components/Animation';
import { ToggleTheme } from '../utils/ToggleThemeInterface';
import * as S from '../styles/home';

const Home: React.FC<ToggleTheme> = ({ toggleTheme }) => {
  return (
    <Layout>
      <Header toggleTheme={toggleTheme} />
      <S.Title>
        <h1>Seu buscador de vagas de tecnologia</h1>
        <Link href="/dashboard">
          <S.IconLogin />
          Encontrar vagas
        </Link>
      </S.Title>
      <S.Ilustration>
        <Animation />
      </S.Ilustration>
    </Layout>
  );
};

export default Home;
