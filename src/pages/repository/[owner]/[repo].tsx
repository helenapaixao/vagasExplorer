import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Layout from '../../../components/Layout';
import Seo from '../../../components/Seo';
import SearchBar from '../../../components/SearchBar';
import FilterBar from '../../../components/FilterBar';
import JobCard from '../../../components/JobCard';
import RepositoryInfo from '../../../components/RepositoryInfo';
import Pagination from '../../../components/Pagination';
import {
  EmptyState,
  ErrorState,
  JobListSkeleton,
} from '../../../components/states';

import { fetchJson } from '../../../lib/fetchJson';
import { useAsyncResource } from '../../../hooks/useAsyncResource';
import { useDebouncedValue } from '../../../hooks/useDebouncedValue';
import { useSearchState } from '../../../hooks/useSearchState';
import type { GitHubRepo, IssuesPage } from '../../../types/github';

const PER_PAGE = 10;

const Repository = () => {
  const router = useRouter();
  const owner = String(router.query.owner ?? '');
  const repo = String(router.query.repo ?? '');
  const repoPath = owner && repo ? `${owner}/${repo}` : '';

  const { q, page, filters, ready, setQuery, setPage, setFilter, clearAll } =
    useSearchState();

  const [inputValue, setInputValue] = useState(q);
  const debouncedInput = useDebouncedValue(inputValue);

  useEffect(() => {
    if (ready) setInputValue(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, ready]);

  useEffect(() => {
    if (ready && debouncedInput !== q) setQuery(debouncedInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInput]);

  const filterKey = JSON.stringify(filters);

  const repository = useAsyncResource<GitHubRepo>(
    ready && repoPath
      ? signal => fetchJson(`/api/repo/${repoPath}`, undefined, signal)
      : null,
    [ready, repoPath],
    'Repositório não encontrado.',
  );

  const issues = useAsyncResource<IssuesPage>(
    ready && repoPath
      ? signal =>
          fetchJson(
            `/api/repo/issues/${repoPath}`,
            { page, per_page: PER_PAGE, q: q || undefined, ...filters },
            signal,
          )
      : null,
    [ready, repoPath, page, q, filterKey],
    'Erro ao carregar vagas.',
  );

  const totalCount = issues.data?.totalCount ?? null;
  const totalPages =
    totalCount !== null ? Math.max(1, Math.ceil(totalCount / PER_PAGE)) : null;
  const hasNextPage =
    totalPages !== null
      ? page < totalPages
      : (issues.data?.issues.length ?? 0) === PER_PAGE;

  const handlePageChange = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const title = repository.data?.full_name ?? repoPath ?? 'Vagas';
  const found = issues.data?.issues.length ?? 0;

  return (
    <Layout>
      <Seo
        title={title}
        description={`Vagas de tecnologia publicadas em ${title} no GitHub.`}
      />

      {repository.data && <RepositoryInfo repository={repository.data} />}
      {repository.error && (
        <ErrorState message={repository.error} onRetry={repository.reload} />
      )}

      <SearchBar
        value={inputValue}
        onChange={setInputValue}
        label="Buscar vagas por tecnologia, nível, local, regime ou tipo"
        placeholder="Busque por tecnologia, nível, local, regime, tipo..."
      />

      <FilterBar filters={filters} onChange={setFilter} onClear={clearAll} />

      <p aria-live="polite" className="mb-4 text-sm text-muted-foreground">
        {issues.loading
          ? 'Buscando...'
          : `${(totalCount ?? found).toLocaleString('pt-BR')} ${
              (totalCount ?? found) === 1
                ? 'vaga encontrada'
                : 'vagas encontradas'
            }${totalCount === null ? ' nesta página' : ''}`}
      </p>

      {issues.error && (
        <ErrorState message={issues.error} onRetry={issues.reload} />
      )}

      {issues.loading && <JobListSkeleton />}

      {!issues.loading && !issues.error && found === 0 && (
        <EmptyState
          title="Nenhuma vaga encontrada"
          hint="Tente outra palavra-chave, remova um filtro ou busque em todas as comunidades de uma vez."
          suggestions={['node', 'react', 'remoto', 'júnior']}
          onSuggestion={setInputValue}
        />
      )}

      {!issues.loading && (
        <div className="flex flex-col gap-4">
          {issues.data?.issues.map(issue => (
            <JobCard
              key={issue.id}
              onLabelSelect={setInputValue}
              job={{
                owner,
                repo,
                issueNumber: issue.number,
                title: issue.title,
                userLogin: issue.user.login,
                avatarUrl: issue.user.avatar_url,
                htmlUrl: issue.html_url,
                labels: issue.labels,
                createdAt: issue.created_at ?? null,
              }}
            />
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        loading={issues.loading}
        onChange={handlePageChange}
      />
    </Layout>
  );
};

export default Repository;
