import React from 'react';
import { FiChevronRight } from 'react-icons/fi';
import {reposData} from './reposData'

import Layout from '../../components/Layout';
import Header from '../../components/Header';

import * as S from './styles';
import { ToggleTheme } from '../../utils/ToggleThemeInterface';


const Dashboard = ({ toggleTheme }: ToggleTheme) => {
  return (
    <Layout isContentFull>
      <Header isLink="/" toggleTheme={toggleTheme} />

      <S.Repositories>
        <h1>Principais repositórios de vagas</h1>

        <S.Content>
          {reposData.map((repo) => (
            <S.RepositoryItem key={repo.link} to={repo.link}>
              <img src={repo.imageUrl} alt={repo.name} />
              <div>
                <strong>{repo.name}</strong>
                <p>{repo.desc}</p>
              </div>
              <FiChevronRight size={20} />
            </S.RepositoryItem>
          ))}
        </S.Content>
      </S.Repositories>
    </Layout>
  );
};

export default Dashboard;
