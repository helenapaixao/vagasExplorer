import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

import api from '../../services/api';

import Layout from '../../components/Layout';
import Header from '../../components/Header';

import * as S from './styles';

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

  const { params } = useRouteMatch<RepositoryParamsProps>();

  useEffect(() => {
    api.get(`repos/${params.repository}`).then((response) => {
      setRepositories(response.data);
    });

    api.get(`repos/${params.repository}/issues`).then((response) => {
      setIssues(response.data);
    });
  }, [params.repository]);

  return (
    <Layout isContentFull>
      <Header isLink="/dashboard" />
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
