import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiChevronRight } from 'react-icons/fi';
import { Skeleton } from '@/components/ui/skeleton';
import Layout from '../../components/Layout';
import Seo from '../../components/Seo';
import { ErrorState } from '../../components/states';
import { fetchJson } from '../../lib/fetchJson';
import { useAsyncResource } from '../../hooks/useAsyncResource';
import type { RepoItem } from '../../lib/repos';

const SKELETON_ROWS = [0, 1, 2, 3, 4];

const RepoSkeleton = () => (
  <div className="flex items-center gap-4 rounded-md border border-border bg-card p-6">
    <Skeleton className="h-[70px] w-[70px] shrink-0 rounded-full" />
    <div className="min-w-0 flex-1 space-y-2">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-4 w-full max-w-sm" />
      <Skeleton className="h-4 w-full max-w-xs" />
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

  return (
    <Layout>
      <Seo
        title="Repositórios de vagas"
        description="Principais repositórios de vagas de tecnologia das comunidades brasileiras no GitHub."
      />

      <h1 className="text-xl font-semibold">Repositórios de vagas</h1>
      <p className="mb-8 mt-1 text-sm text-muted-foreground">
        Navegue por comunidade, ou{' '}
        <Link href="/vagas" className="text-primary underline">
          busque em todas de uma vez
        </Link>
        .
      </p>

      {error && <ErrorState message={error} onRetry={reload} />}

      <div className="flex flex-col gap-4">
        {loading &&
          SKELETON_ROWS.map(i => <RepoSkeleton key={`skeleton-${i}`} />)}

        {!loading &&
          data?.map(repo => (
            <Link
              key={repo.link}
              href={repo.link}
              className="flex items-center gap-4 rounded-md border border-border bg-card p-6 text-foreground no-underline transition-all hover:translate-x-1 hover:border-primary/50 hover:shadow-md"
            >
              <Image
                src={repo.imageUrl}
                alt=""
                width={70}
                height={70}
                className="shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold">{repo.name}</h2>
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
