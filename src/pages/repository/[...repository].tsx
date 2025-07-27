import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { FiChevronRight, FiX } from 'react-icons/fi';
import {
  RepositoryParamsProps,
  IssueProps,
  RepositoryProps,
} from '../../utils/repositoryInterfaces';

import api from '../../services/api';

import Layout from '../../components/Layout';
import Header from '../../components/Header';

import * as S from '../../styles/repository';
import { ToggleTheme } from '../../utils/ToggleThemeInterface';
import Button from '../../components/Button';

function Repository({ toggleTheme }: ToggleTheme) {
  const [repository, setRepository] = useState<RepositoryProps | null>(null);
  const [issues, setIssues] = useState<IssueProps[]>([]);
  const [allIssues, setAllIssues] = useState<IssueProps[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);

  const router = useRouter();
  const { repository: repoParam } = router.query as Partial<RepositoryParamsProps>;
  const repoPath = Array.isArray(repoParam) ? repoParam.join('/') : repoParam;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchRepositoryData = async () => {
      if (!repoPath) return;
      try {
        const { data } = await api.get(`repos/${repoPath}`);
        setRepository(data);
      } catch {
        // erro silenciado
      }
    };

    const fetchIssuesData = async () => {
      try {
        const { data } = await api.get(`repos/${repoPath}/issues`, {
          params: { page, per_page: 10 },
        });
        setIssues((prev) => [...prev, ...data]);
        setAllIssues(data);
      } catch {
        // erro silenciado
      }
    };

    fetchRepositoryData();
    fetchIssuesData();
  }, [repoPath, page]);

  const handleSearch = (val: string) => {
    inputRef.current?.focus();
    setSearchValue(val);

    if (!val) {
      setIssues(allIssues);
      return;
    }

    const filtered = allIssues.filter((issue) =>
      issue.title.toLowerCase().includes(val.toLowerCase()) ||
      issue.body.toLowerCase().includes(val.toLowerCase()) ||
      issue.labels.some((label) => label.name.toLowerCase().includes(val.toLowerCase()))
    );

    setIssues(filtered);
  };

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePreviousPage = () => setPage((prev) => prev - 1);

  return (
    <Layout isContentFull>
      <Header isLink="/dashboard" toggleTheme={toggleTheme} />

      <S.Container>
        {repository && (
          <S.RepositoryInfo>
            <div>
              <img src={repository.owner.avatar_url} alt={repository.owner.login} />
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
              <a href={issue.html_url} style={{ animationDelay: `0.${index}ms` }}>
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
                      key={label.id}
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
            <Button
              color="#0000"
              disabled={page === 1}
              onClick={handlePreviousPage}
            >
              Anterior
            </Button>
            <Button onClick={handleNextPage}>Próxima</Button>
          </S.Pagination>
        </S.Issues>
      </S.Container>
    </Layout>
  );
}

export default Repository;
