import React, { useEffect, useState, useRef } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { FiChevronRight, FiX } from 'react-icons/fi';
import {
  RepositoryParamsProps,
  IssueProps,
  RepositoryProps,
} from './intefaces';

import api from '../../services/api';

import Layout from '../../components/Layout';
import Header from '../../components/Header';

import * as S from './styles';
import { ToggleTheme } from '../../utils/ToggleThemeInterface';
import Button from '../../components/Button';

const Repository = ({ toggleTheme }: ToggleTheme) => {
  const [repository, setRepositories] = useState<RepositoryProps | null>(null);
  const [issues, setIssues] = useState<IssueProps[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);

  const { params } = useRouteMatch<RepositoryParamsProps>();

  const [allIssues, setAllIssues] = useState<IssueProps[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const fetchRepositoryData = async () => {
      try {
        const repositoryResponse = await api.get(`repos/${params.repository}`);
        setRepositories(repositoryResponse.data);
      } catch (error) {
        console.error('Erro ao buscar dados do repositório:', error);
      }
    };

    const fetchIssuesData = async () => {
      try {
        const issuesResponse = await api.get(
          `repos/${params.repository}/issues`,
          {
            params: {
              page,
              per_page: 10, // Defina a quantidade de issues por página
            },
          },
        );
        setIssues(issuesResponse.data);
        setAllIssues(issuesResponse.data);
      } catch (error) {
        console.error('Erro ao buscar dados das issues:', error);
      } finally {
      }
    };

    fetchRepositoryData();
    fetchIssuesData();
  }, [params.repository, page]);

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

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    setPage(page - 1);
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
                  <FiChevronRight size={40} />
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
            <S.Pagination>
              <Button color='#0000' disabled={page === 1} onClick={handlePreviousPage}>
                Anterior
              </Button>
              <Button onClick={handleNextPage}>Proxima</Button>
            </S.Pagination>
          </>
        </S.Issues>
      </S.Container>
    </Layout>
  );
};

export default Repository;
