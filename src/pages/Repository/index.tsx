import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { FiChevronRight, FiSearch } from 'react-icons/fi';

import { DefaultTheme } from 'styled-components';
import api from '../../services/api';

import Layout from '../../components/Layout';
import Header from '../../components/Header';

import light from '../../styles/themes/light';
import dark from '../../styles/themes/dark';

import usePeristedState from '../../utils/usePersistedState';

import * as S from './styles';
import SearchInput from '../../components/SearchInput';

interface RepositoryProps {
  full_name: string;
  description: string;
  stargazers_count: number;
  open_issues_count: number;
  owner: {
    login: string;
    avatar_url: string;
  };
}

interface IssueProps {
  title: string;
  id: string;
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
}

interface RepositoryParamsProps {
  repository: string;
}

const Repository: React.FC = () => {
  const [repository, setRepositories] = useState<RepositoryProps | null>(null);
  const [issues, setIssues] = useState<IssueProps[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const { params } = useRouteMatch<RepositoryParamsProps>();

  const [theme, setTheme] = usePeristedState<DefaultTheme>('theme', light);

  useEffect(() => {
    api.get(`repos/${params.repository}`).then((response) => {
      setRepositories(response.data);
    });

    api.get(`repos/${params.repository}/issues`).then((response) => {
      setIssues(response.data);
    });
  }, [params.repository]);

  useEffect(() => {
    async function loadRepository(): Promise<void> {
      api
        .get(`/repos/${searchValue.replace(' ', '+')}`)
        .then(({ data: Issues }) => {
          setIssues(Issues);
        });
    }

    loadRepository();
  }, [searchValue]);

  const toggleTheme = () => {
    setTheme(theme.title === 'light' ? dark : light);
  };

  return (
    <Layout isContentFull>
      <Header isLink="/dashboard" toggleTheme={toggleTheme} />
      <S.Container>
        {repository && (
          <S.RepositoryInfo>
            <div>
              <img
                src={repository.owner.avatar_url}
                alt={repository.owner.login}
              />
              <div>
                <strong>{repository.full_name}</strong>
                <p>{repository.description}</p>
              </div>
            </div>
            <ul>
              <li>
                <strong>{repository.open_issues_count}</strong>
                <span>Vagas abertas</span>
              </li>
            </ul>
          </S.RepositoryInfo>
        )}
        <SearchInput
          name="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          icon={FiSearch}
          placeholder="Buscar"
        />

        <S.Issues>
          {issues.map((issue) => (
            <a key={issue.id} href={issue.html_url}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />
              <div>
                <strong>{issue.title}</strong>
                <p>{issue.user.login}</p>
              </div>
              <FiChevronRight size={20} />
            </a>
          ))}
        </S.Issues>
      </S.Container>
    </Layout>
  );
};

export default Repository;
