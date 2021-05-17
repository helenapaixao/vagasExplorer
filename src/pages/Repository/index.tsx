import React, { useEffect, useState, useRef } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { FiChevronRight, FiX } from 'react-icons/fi';

import api from '../../services/api';

import Layout from '../../components/Layout';
import Header from '../../components/Header';

import * as S from './styles';
import { ToggleTheme } from '../../utils/ToggleThemeInterface';

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
  body: string;
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
  };
  labels: labelsProps[];
}

interface RepositoryParamsProps {
  repository: string;
}

interface labelsProps {
  color: string;
  id: number;
  name: string;
}

const Repository: React.FC<ToggleTheme> = ({ toggleTheme }) => {
  const [repository, setRepositories] = useState<RepositoryProps | null>(null);
  const [issues, setIssues] = useState<IssueProps[]>([]);
  const [searchValue, setSearchValue] = useState('');


  const { params } = useRouteMatch<RepositoryParamsProps>();

  const [allIssues, setAllIssues] = useState<IssueProps[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get(`repos/${params.repository}`).then((response) => {
      setRepositories(response.data);
    });

    api.get(`repos/${params.repository}/issues`).then((response) => {
      setIssues(response.data);
      setAllIssues(response.data);
      console.log(response.data);
    });
  }, [params.repository]);

  const handleSearch = (val: string) => {
    if (null !== inputRef.current) {
      inputRef.current.focus();
    }

    if (!val) setIssues(allIssues);

    setSearchValue(val);

    // eslint-disable-next-line
    const issuesFiltered = allIssues.filter((issue) => {
      if (issue.title.toLowerCase().indexOf(val.toLowerCase()) !== -1) {
        return true;
      }

      if (issue.body.toLowerCase().indexOf(val.toLowerCase()) !== -1) {
        return true;
      }

      for (let i = 0; i < issue.labels.length; i++) {
        if (
          issue.labels[i].name.toLowerCase().indexOf(val.toLowerCase()) !== -1
        ) {
          return true;
        }
      }

      return false;
    });

    setIssues(issuesFiltered);
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
                <strong>{issues.length}</strong>
                <span>Vagas abertas</span>
              </li>
            </ul>
          </S.RepositoryInfo>
        )}

        <S.Issues>
          <>
            <S.Search>
              <S.Input
                ref={inputRef}
                type="text"
                placeholder="Busque por tecnologia, nível de vaga, local, regime, tipo etc..."
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {searchValue && (
                <S.Icon onClick={() => handleSearch('')}>
                  <FiX size={20} />
                </S.Icon>
              )}
            </S.Search>
            {issues.map((issue, index) => (
              <React.Fragment key={issue.id}>
                <a
                  href={issue.html_url}
                  style={{ animationDelay: `0.${index}ms` }}
                >
                  <img src={issue.user.avatar_url} alt={issue.user.login} />
                  <div>
                    <strong>{issue.title}</strong>
                    <p>{issue.user.login}</p>
                  </div>
                  <FiChevronRight size={20} />
                </a>

                {issue.labels.length > 0 && (
                  <S.Labels style={{ animationDelay: `0.${index}ms` }}>
                    {issue.labels.map((label) => (
                      <S.Label
                        color={label.color}
                        onClick={() => handleSearch(label.name)}
                      >
                        <span>{label.name}</span>
                      </S.Label>
                    ))}
                  </S.Labels>
                )}
              </React.Fragment>
            ))}
          </>
        </S.Issues>
      </S.Container>
    </Layout>
  );
};

export default Repository;
