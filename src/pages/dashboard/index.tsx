import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Layout from '../../components/Layout';
import Seo from '../../components/Seo';
import { ErrorState } from '../../components/states';
import { fetchJson } from '../../lib/fetchJson';
import { useAsyncResource } from '../../hooks/useAsyncResource';
import type { RepoItem } from '../../lib/repos';

const SKELETON_ROWS = [0, 1, 2, 3, 4];

const RepoSkeleton = () => (
  <Card className="flex items-center gap-4 p-5">
    <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
    <div className="min-w-0 flex-1 space-y-2">
      <Skeleton className="h-5 w-48" />
      <Skeleton className="h-4 w-full max-w-sm" />
    </div>
    <Skeleton className="h-5 w-5 shrink-0 rounded" />
  </Card>
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
            <Card
              key={repo.link}
              className="elevated transition-colors hover:border-primary/40"
            >
              <Link
                href={repo.link}
                className="flex items-center gap-4 p-5 text-card-foreground no-underline"
              >
                <Avatar className="h-14 w-14 shrink-0">
                  <AvatarImage src={repo.imageUrl} alt="" />
                  <AvatarFallback>
                    {repo.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold">{repo.name}</h2>
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {repo.desc}
                  </p>
                </div>
                <ChevronRight
                  size={20}
                  className="shrink-0 text-muted-foreground"
                  aria-hidden
                />
              </Link>
            </Card>
          ))}
      </div>
    </Layout>
  );
};

export default Dashboard;
