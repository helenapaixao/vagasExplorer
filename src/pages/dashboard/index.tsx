import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';
import Layout from '../../components/Layout';
import Header from '../../components/Header';
import { Skeleton } from '@/components/ui/skeleton';

export type RepoItem = {
  link: string;
  imageUrl: string;
  name: string;
  desc: string;
};

const Dashboard = () => {
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<RepoItem[]>('/api/repos')
      .then(({ data }) => setRepos(data))
      .catch(() => setError('Erro ao carregar repositórios.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <Header isLink="/" />
      <div className="max-w-[1120px] px-0">
        <h1 className="text-xl font-semibold mb-8">
          Principais repositórios de vagas
        </h1>

        {error && (
          <p className="text-destructive mb-4">{error}</p>
        )}
        {loading && (
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-6 bg-card border border-border rounded-md"
              >
                <Skeleton className="h-[70px] w-[70px] rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-full max-w-sm" />
                  <Skeleton className="h-4 w-full max-w-xs" />
                </div>
                <Skeleton className="h-5 w-5 rounded flex-shrink-0" />
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {!loading &&
            repos.map((repo) => (
              <Link
                key={repo.link}
                href={repo.link}
                className="flex items-center gap-4 p-6 bg-card border border-border rounded-md hover:translate-x-1 hover:shadow-md hover:border-primary/50 transition-all no-underline text-foreground"
              >
                <img
                  src={repo.imageUrl}
                  alt={repo.name}
                  className="w-[70px] h-[70px] rounded-full flex-shrink-0 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold text-foreground">{repo.name}</h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {repo.desc}
                  </p>
                </div>
                <FiChevronRight size={20} className="flex-shrink-0" />
              </Link>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
