import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';

import Layout from '../../components/Layout';
import Header from '../../components/Header';

import * as S from '../../styles/dashboard';
import { ToggleTheme } from '../../utils/ToggleThemeInterface';

export type RepoItem = {
  link: string;
  imageUrl: string;
  name: string;
  desc: string;
};

const Dashboard: React.FC<ToggleTheme> = ({ toggleTheme }) => {
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<RepoItem[]>('/api/repos')
      .then(({ data }) => setRepos(data))
      .catch(() => setError('Erro ao carregar repositórios.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout isContentFull>
      <Header isLink="/" toggleTheme={toggleTheme} />

      <S.Repositories>
        <h1>Principais repositórios de vagas</h1>

        {error && (
          <p style={{ color: 'var(--red)', marginBottom: 16 }}>{error}</p>
        )}
        {loading && <p style={{ marginBottom: 16 }}>Carregando...</p>}

        <S.Content>
          {repos.map((repo) => (
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
