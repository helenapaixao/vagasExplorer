import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import {  DefaultTheme } from 'styled-components';

import Layout from '../../components/Layout';
import Header from '../../components/Header';
import usePeristedState from '../../utils/usePersistedState';

import light from '../../styles/themes/light';
import dark from '../../styles/themes/dark';

import * as S from './styles';

const Dashboard: React.FC = () => {
  const [theme, setTheme] = usePeristedState<DefaultTheme>('theme', light);

  const toggleTheme = () => {
    setTheme(theme.title === 'light' ? dark : light);
  };

  return (
    <Layout isContentFull>
      <Header isLink="/" toggleTheme={toggleTheme} />

      <S.Repositories>
        <h1>Principais repositórios de vagas</h1>

        <S.Content>
          <S.RepositoryItem
            key="backend-br/vagas"
            to="/repository/backend-br/vagas"
          >
            <img
              src="https://avatars1.githubusercontent.com/u/30732658?v=4"
              alt="backend-br"
            />
            <div>
              <strong>backend-br</strong>
              <p>Espaço para divulgação de vagas para backenders</p>
            </div>
            <FiChevronRight size={20} />
          </S.RepositoryItem>
          <S.RepositoryItem
            key="frontendbr/vagas"
            to="/repository/frontendbr/vagas"
          >
            <img
              src="https://avatars1.githubusercontent.com/u/16963863?v=4"
              alt="frontendbr"
            />
            <div>
              <strong>frontendbr</strong>
              <p>Espaço para divulgação de vagas para front-enders.</p>
            </div>
            <FiChevronRight size={20} />
          </S.RepositoryItem>
          <S.RepositoryItem
            key="vuejs-br/vagas"
            to="/repository/vuejs-br/vagas"
          >
            <img
              src="https://avatars2.githubusercontent.com/u/13300590?v=4.githubusercontent.com/u/16963863?v=4"
              alt="vuejs-br"
            />
            <div>
              <strong>vuejs-br</strong>
              <p>Espaço para divulgação de vagas relacionadas com Vue.js</p>
            </div>
            <FiChevronRight size={20} />
          </S.RepositoryItem>
          <S.RepositoryItem
            key="androiddevbr/vagas"
            to="/repository/androiddevbr/vagas"
          >
            <img
              src="https://avatars1.githubusercontent.com/u/13825651?v=4"
              alt="androiddevbr-br"
            />
            <div>
              <strong>androiddevbr</strong>
              <p>Mural de vagas para desenvolvedor Android.</p>
            </div>
            <FiChevronRight size={20} />
          </S.RepositoryItem>
          <S.RepositoryItem
            key="react-brasil/vagas"
            to="/repository/react-brasil/vagas"
          >
            <img
              src="https://avatars2.githubusercontent.com/u/16929016?s=500&v=4"
              alt="React Brasil"
            />
            <div>
              <strong>React Brasil</strong>
              <p>Espaço para divulgação de vagas relacionadas com React</p>
            </div>
            <FiChevronRight size={20} />
          </S.RepositoryItem>
          <S.RepositoryItem
            key="qa-brasil/vagas"
            to="/repository/qa-brasil/vagas"
          >
            <img
              src="https://avatars0.githubusercontent.com/u/59667653?s=200&v=4"
              alt="@qa-brasil"
            />
            <div>
              <strong>QA Brasil </strong>
              <p>Comunidade Brasileira para Analistas de testes</p>
            </div>
            <FiChevronRight size={20} />
          </S.RepositoryItem>
        </S.Content>
      </S.Repositories>
    </Layout>
  );
};

export default Dashboard;
