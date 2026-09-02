import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiChevronRight, FiSearch } from 'react-icons/fi';
import { Skeleton } from '@/components/ui/skeleton';
import Layout from '../../components/Layout';
import Seo from '../../components/Seo';
import { ErrorState } from '../../components/states';
import { fetchJson } from '../../lib/fetchJson';
import { useAsyncResource } from '../../hooks/useAsyncResource';
import { normalize } from '../../lib/filters';
import type { RepoItem } from '../../lib/repos';

const SKELETON_ROWS = [0, 1, 2, 3, 4, 5];

const RepoSkeleton = () => (
  <div className="flex items-center gap-4 rounded-md border border-border bg-card p-5">
    <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
    <div className="min-w-0 flex-1 space-y-2">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-4 w-full max-w-[220px]" />
    </div>
    <Skeleton className="h-5 w-5 shrink-0 rounded" />
  </div>
);

const Dashboard = () => {
  const { data, loading, error, reload } = useAsyncResource<RepoItem[]>(
    signal => fetchJson('/api/repos', undefined, signal),
    [],
    'Erro ao carregar repositórios.',
  );

  const [filter, setFilter] = useState('');

  // Filtro local: a lista inteira já veio, ir ao servidor a cada tecla só
  // adicionaria latência.
  const visible = useMemo(() => {
    const term = normalize(filter);
    if (!term) return data ?? [];

    return (data ?? []).filter(repo =>
      normalize(`${repo.name} ${repo.desc}`).includes(term),
    );
  }, [data, filter]);

  return (
    <Layout>
      <Seo
        title="Repositórios de vagas"
        description="Principais repositórios de vagas de tecnologia das comunidades brasileiras no GitHub."
      />

      <h1 className="text-xl font-semibold">Repositórios de vagas</h1>
      <p className="mb-6 mt-1 text-sm text-muted-foreground">
        Comunidades brasileiras aparecem primeiro. Ou{' '}
        <Link href="/vagas" className="text-primary underline">
          busque em todas de uma vez
        </Link>
        .
      </p>

      <div className="mb-6 flex h-12 items-center gap-2 rounded-md border border-border bg-card px-4 transition-colors focus-within:border-primary">
        <FiSearch
          size={18}
          className="shrink-0 text-muted-foreground"
          aria-hidden
        />
        <input
          value={filter}
          onChange={event => setFilter(event.target.value)}
          placeholder="Filtrar por nome, país ou região"
          aria-label="Filtrar comunidades"
          className="flex-1 border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      {error && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && visible.length === 0 && (
        <p className="text-muted-foreground">
          Nenhuma comunidade encontrada para esse filtro.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {loading &&
          SKELETON_ROWS.map(i => <RepoSkeleton key={`skeleton-${i}`} />)}

        {!loading &&
          visible.map(repo => (
            <Link
              key={repo.link}
              href={repo.link}
              className="flex items-center gap-4 rounded-md border border-border bg-card p-5 text-foreground no-underline transition-all hover:border-primary/50 hover:shadow-md"
            >
              <Image
                src={repo.imageUrl}
                alt=""
                width={56}
                height={56}
                className="shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <h2 className="truncate text-base font-semibold">
                  {repo.name}
                </h2>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {repo.desc}
                </p>
              </div>
              <FiChevronRight size={20} className="shrink-0" aria-hidden />
            </Link>
          ))}
      </div>
    </Layout>
  );
};

export default Dashboard;
