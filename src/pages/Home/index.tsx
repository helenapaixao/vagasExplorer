import React from 'react';
import { Link } from 'react-router-dom';
import { DefaultTheme } from 'styled-components';
import usePeristedState from '../../utils/usePersistedState';

import Layout from '../../components/Layout';
import Header from '../../components/Header';
import Animation from '../../components/Animation';

import light from '../../styles/themes/light';
import dark from '../../styles/themes/dark';

import * as S from './styles';

const Home: React.FC = () => {
  const [theme, setTheme] = usePeristedState<DefaultTheme>('theme', light);

  const toggleTheme = () => {
    setTheme(theme.title === 'light' ? dark : light);
  };
  return (
    <Layout>
      <Header toggleTheme={toggleTheme} />
      <S.Title>
        <h1>Seu buscador de vagas de tecnologia</h1>
        <Link to="/dashboard">
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
