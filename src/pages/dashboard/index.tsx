import React from 'react';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';
import { reposData } from '../../utils/reposData';

import Layout from '../../components/Layout';
import Header from '../../components/Header';

import * as S from '../../styles/dashboard';
import { ToggleTheme } from '../../utils/ToggleThemeInterface';

const Dashboard: React.FC<ToggleTheme> = ({ toggleTheme }) => {
  return (
    <Layout isContentFull>
      <Header isLink="/" toggleTheme={toggleTheme} />

      <S.Repositories>
        <h1>Principais repositórios de vagas</h1>

        <S.Content>
          {reposData.map((repo) => (
            <Link key={repo.link} href={repo.link} passHref legacyBehavior>
              <S.RepositoryItem>
                <img src={repo.imageUrl} alt={repo.name} />
                <div>
                  <strong>{repo.name}</strong>
                  <p>{repo.desc}</p>
                </div>
                <FiChevronRight size={20} />
              </S.RepositoryItem>
            </Link>
          ))}
        </S.Content>
      </S.Repositories>
    </Layout>
  );
};

export default Dashboard;
