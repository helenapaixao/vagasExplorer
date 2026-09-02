import React, { useEffect, useState, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FiChevronRight, FiX, FiArrowLeft, FiSearch } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import {
  RepositoryParamsProps,
  IssueProps,
  RepositoryProps,
} from '../../utils/repositoryInterfaces';

import api from '../../services/api';

import Layout from '../../components/Layout';
import Header from '../../components/Header';

import * as S from '../../styles/repository';
import Button from '../../components/Button';

const PER_PAGE = 10;

/**
 * Só um 404 significa que o recurso não existe. Tratar 500, 502 ou queda de
 * rede como "não encontrado" manda o usuário desistir de uma vaga que está lá.
 */
function describeFetchError(
  error: unknown,
  missingMessage: string,
  failureMessage: string,
): string {
  const status = (error as { response?: { status?: number } })?.response
    ?.status;
  return status === 404 ? missingMessage : failureMessage;
}

const Repository = () => {
  const [repository, setRepository] = useState<RepositoryProps | null>(null);
  const [allIssues, setAllIssues] = useState<IssueProps[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [issueDetail, setIssueDetail] = useState<IssueProps | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const router = useRouter();
  const { repository: repoParam } =
    router.query as Partial<RepositoryParamsProps>;
  const isRouteReady = router.isReady;
  const segments = (() => {
    if (Array.isArray(repoParam)) return repoParam;
    if (repoParam) return [repoParam];
    return [];
  })();
  const repoPath =
    segments.length >= 2 ? segments.slice(0, 2).join('/') : segments.join('/');
  const issueNumber = segments.length === 3 ? segments[2] : null;
  const isDetailView = isRouteReady && segments.length === 3;
  const isInsideApp = isRouteReady && !!repoPath && segments.length === 2;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!repoPath || segments.length !== 2) return;
    setPage(1);
    setAllIssues([]);
    setSearchValue('');
    setError(null);
  }, [repoPath, segments.length]);

  useEffect(() => {
    const fetchRepositoryData = async () => {
      if (!repoPath) return;
      try {
        const { data } = await api.get(`/api/repo/${repoPath}`);
        setRepository(data as RepositoryProps);
      } catch (fetchError) {
        setError(
          describeFetchError(
            fetchError,
            'Repositório não encontrado.',
            'Erro ao carregar o repositório. Tente novamente.',
          ),
        );
      }
    };

    fetchRepositoryData();
  }, [repoPath]);

  useEffect(() => {
    if (!isDetailView) {
      setIssueDetail(null);
      setDetailError(null);
      return;
    }
    if (!repoPath || !issueNumber) return;
    const num = parseInt(issueNumber, 10);
    if (Number.isNaN(num)) return;
    setDetailLoading(true);
    setDetailError(null);
    api
      .get(`/api/repo/${repoPath}/issue/${issueNumber}`)
      .then(({ data }) => setIssueDetail(data as IssueProps))
      .catch(fetchError =>
        setDetailError(
          describeFetchError(
            fetchError,
            'Vaga não encontrada.',
            'Erro ao carregar a vaga. Tente novamente.',
          ),
        ),
      )
      .finally(() => setDetailLoading(false));
  }, [isDetailView, repoPath, issueNumber]);

  useEffect(() => {
    const fetchIssuesData = async () => {
      if (!repoPath || segments.length !== 2) return;
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/api/repo/issues/${repoPath}`, {
          params: { page, per_page: PER_PAGE },
        });
        setAllIssues(prev =>
          page === 1
            ? (data as IssueProps[])
            : [...prev, ...(data as IssueProps[])],
        );
      } catch {
        setError('Erro ao carregar vagas. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    const needsFetch = page === 1 || allIssues.length < page * PER_PAGE;
    if (needsFetch) fetchIssuesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetch only when page/repoPath change
  }, [repoPath, page, segments.length]);

  const filteredBySearch = useMemo(() => {
    if (!searchValue.trim()) return null;
    const term = searchValue.toLowerCase();
    return allIssues.filter(
      issue =>
        issue.title.toLowerCase().includes(term) ||
        (issue.body && issue.body.toLowerCase().includes(term)) ||
        issue.labels.some(label => label.name.toLowerCase().includes(term)),
    );
  }, [allIssues, searchValue]);

  const displayedIssues: IssueProps[] = useMemo(() => {
    if (filteredBySearch) return filteredBySearch;
    const start = (page - 1) * PER_PAGE;
    return allIssues.slice(start, start + PER_PAGE);
  }, [allIssues, page, filteredBySearch]);

  const totalPages = repository
    ? Math.max(1, Math.ceil(repository.open_issues_count / PER_PAGE))
    : 1;
  const hasNextPage = !filteredBySearch && page < totalPages;

  const handleSearch = (val: string) => {
    inputRef.current?.focus();
    setSearchValue(val);
    if (!val) setPage(1);
  };

  const handleNextPage = () => setPage(prev => prev + 1);
  const handlePreviousPage = () => setPage(prev => Math.max(1, prev - 1));

  const goToIssue = (issue: IssueProps) => {
    const num = issue.number ?? issue.html_url.split('/').pop();
    if (num) router.push(`/repository/${repoPath}/${num}`);
  };

  return (
    <Layout>
      <Header isLink="/dashboard" />

      <S.Container>
        {!isRouteReady && <p style={{ marginBottom: 24 }}>Carregando...</p>}
        {isRouteReady && segments.length < 2 && (
          <p style={{ marginBottom: 24 }}>
            Repositório não informado.{' '}
            <Link href="/dashboard">Ver repositórios de vagas</Link>
          </p>
        )}

        {isDetailView && (
          <S.IssueDetailPage>
            <Link href={`/repository/${repoPath}`} passHref legacyBehavior>
              <S.IssueDetailBack>
                <FiArrowLeft size={20} />
                Voltar para a lista de vagas
              </S.IssueDetailBack>
            </Link>
            {detailLoading && (
              <p style={{ marginBottom: 24 }}>Carregando vaga...</p>
            )}
            {detailError && (
              <p style={{ color: 'var(--red)', marginBottom: 24 }}>
                {detailError}
              </p>
            )}
            {issueDetail && !detailLoading && (
              <>
                <S.IssueDetailHeader>
                  <strong>{issueDetail.title}</strong>
                  <p>{issueDetail.user.login}</p>
                  {issueDetail.labels.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 6,
                        marginTop: 8,
                      }}
                    >
                      {issueDetail.labels.map(label => (
                        <S.Label key={label.id} color={label.color}>
                          <span>{label.name}</span>
                        </S.Label>
                      ))}
                    </div>
                  )}
                </S.IssueDetailHeader>
                <S.IssueDetailBody>
                  {issueDetail.body ? (
                    <ReactMarkdown>{issueDetail.body}</ReactMarkdown>
                  ) : (
                    <p>Conteúdo não disponível.</p>
                  )}
                </S.IssueDetailBody>
                <S.IssueDetailFooter>
                  <a
                    href={issueDetail.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#c62e65',
                      fontWeight: 600,
                      fontSize: '1rem',
                    }}
                  >
                    Ver no GitHub e candidatar →
                  </a>
                </S.IssueDetailFooter>
              </>
            )}
          </S.IssueDetailPage>
        )}

        {!isDetailView && repository && (
          <S.RepositoryInfo>
            <div>
              <Image
                src={repository.owner.avatar_url}
                alt={repository.owner.login}
                width={120}
                height={120}
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

        {isInsideApp && (
          <S.Issues>
            <S.Search>
              <S.SearchIcon aria-hidden>
                <FiSearch size={20} />
              </S.SearchIcon>
              <S.Input
                ref={inputRef}
                type="search"
                aria-label="Buscar vagas por tecnologia, nível, local, regime ou tipo"
                placeholder="Busque por tecnologia, nível de vaga, local, regime, tipo etc..."
                value={searchValue}
                onChange={e => handleSearch(e.target.value)}
              />
              {searchValue && (
                <S.Icon
                  type="button"
                  onClick={() => handleSearch('')}
                  aria-label="Limpar busca"
                >
                  <FiX size={20} />
                </S.Icon>
              )}
            </S.Search>

            {error && (
              <p style={{ color: 'var(--red)', marginBottom: 16 }}>{error}</p>
            )}
            {loading && displayedIssues.length === 0 && (
              <p style={{ marginBottom: 16 }}>Carregando vagas...</p>
            )}

            {displayedIssues.map((issue, index) => (
              <S.IssueBlock key={issue.id}>
                <S.IssueCard
                  type="button"
                  style={{ animationDelay: `0.${index}ms` }}
                  onClick={() => goToIssue(issue)}
                >
                  <Image
                    src={issue.user.avatar_url}
                    alt={issue.user.login}
                    width={70}
                    height={70}
                  />
                  <div>
                    <strong>{issue.title}</strong>
                    <p>{issue.user.login}</p>
                  </div>
                  <FiChevronRight size={40} />
                </S.IssueCard>

                {issue.labels.length > 0 && (
                  <S.Labels style={{ animationDelay: `0.${index}ms` }}>
                    {issue.labels.map(label => (
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
              </S.IssueBlock>
            ))}

            {!filteredBySearch && (
              <S.Pagination>
                <Button
                  color="#0000"
                  disabled={page === 1}
                  onClick={handlePreviousPage}
                >
                  Anterior
                </Button>
                <Button
                  disabled={!hasNextPage || loading}
                  onClick={handleNextPage}
                >
                  Próxima
                </Button>
              </S.Pagination>
            )}
          </S.Issues>
        )}
      </S.Container>
    </Layout>
  );
};

export default Repository;
