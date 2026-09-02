import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import Layout from '../../components/Layout';
import Seo from '../../components/Seo';
import SearchBar from '../../components/SearchBar';
import FilterBar from '../../components/FilterBar';
import JobCard from '../../components/JobCard';
import Pagination from '../../components/Pagination';
import {
  EmptyState,
  ErrorState,
  JobListSkeleton,
} from '../../components/states';

import { fetchJson } from '../../lib/fetchJson';
import { useAsyncResource } from '../../hooks/useAsyncResource';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { useSearchState } from '../../hooks/useSearchState';
import type { JobsPage } from '../../types/job';

const PER_PAGE = 20;
const SUGGESTIONS = ['node', 'react', 'python', 'remoto', 'júnior'];

const Vagas = () => {
  const { q, page, filters, ready, setQuery, setPage, setFilter, clearAll } =
    useSearchState();

  // The input stays local so typing is instant; the URL catches up after the
  // debounce and is what actually drives the request.
  const [inputValue, setInputValue] = useState(q);
  const debouncedInput = useDebouncedValue(inputValue);

  useEffect(() => {
    if (ready) setInputValue(q);
    // Only when the URL changes from outside (back button, label click).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, ready]);

  useEffect(() => {
    if (ready && debouncedInput !== q) setQuery(debouncedInput);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInput]);

  const filterKey = JSON.stringify(filters);

  const jobs = useAsyncResource<JobsPage>(
    ready
      ? signal =>
          fetchJson(
            '/api/jobs',
            { q: q || undefined, page, per_page: PER_PAGE, ...filters },
            signal,
          )
      : null,
    [ready, q, page, filterKey],
    'Erro ao buscar vagas.',
  );

  const total = jobs.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const handlePageChange = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <Seo
        title="Buscar vagas"
        description="Busque vagas de tecnologia em todas as comunidades brasileiras do GitHub ao mesmo tempo: filtre por stack, nível, regime e contrato."
      />

      <h1 className="text-xl font-semibold">Buscar vagas</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Todas as comunidades ao mesmo tempo, direto do GitHub, ordenadas da mais
        recente para a mais antiga.
      </p>

      <SearchBar
        value={inputValue}
        onChange={setInputValue}
        label="Buscar vagas por tecnologia, empresa ou palavra-chave"
        placeholder="Busque por tecnologia, empresa, palavra-chave..."
      />

      <FilterBar filters={filters} onChange={setFilter} onClear={clearAll} />

      <p aria-live="polite" className="mb-4 text-sm text-muted-foreground">
        {jobs.loading
          ? 'Buscando...'
          : `${total.toLocaleString('pt-BR')} ${total === 1 ? 'vaga encontrada' : 'vagas encontradas'}`}
      </p>

      {jobs.error && <ErrorState message={jobs.error} onRetry={jobs.reload} />}

      {jobs.loading && <JobListSkeleton />}

      {!jobs.loading && !jobs.error && total === 0 && (
        <EmptyState
          title="Nenhuma vaga encontrada"
          hint="Tente outra palavra-chave ou remova algum filtro. Você também pode navegar por repositório."
          suggestions={SUGGESTIONS}
          onSuggestion={value => setInputValue(value)}
        />
      )}

      {!jobs.loading && (
        <div className="flex flex-col gap-4">
          {jobs.data?.jobs.map(job => (
            <JobCard
              key={job.id}
              showRepo
              job={job}
              onLabelSelect={setInputValue}
            />
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        hasNextPage={page < totalPages}
        loading={jobs.loading}
        onChange={handlePageChange}
      />

      <p className="mt-10 text-sm text-muted-foreground">
        Prefere navegar por comunidade?{' '}
        <Link href="/dashboard" className="text-primary underline">
          Ver repositórios
        </Link>
      </p>
    </Layout>
  );
};

export default Vagas;
