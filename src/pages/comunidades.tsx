import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiChevronRight, FiSearch } from 'react-icons/fi';
import { Skeleton } from '@/components/ui/skeleton';
import api from '../services/api';
import Layout from '../components/Layout';
import Header from '../components/Header';
import type { RepoItem } from './api/repos';

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

const Comunidades = () => {
  const [repos, setRepos] = useState<RepoItem[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<RepoItem[]>('/api/repos')
      .then(({ data }) => setRepos(data))
      .catch(() => setError('Erro ao carregar comunidades.'))
      .finally(() => setLoading(false));
  }, []);

  // Filtro local: a lista inteira já veio, ir ao servidor a cada tecla só
  // adicionaria latência.
  const visible = useMemo(() => {
    const term = normalize(filter.trim());
    if (!term) return repos;

    return repos.filter(repo =>
      normalize(`${repo.name} ${repo.desc}`).includes(term),
    );
  }, [repos, filter]);

  return (
    <Layout>
      <Header isLink="/" />
      <div className="max-w-[1120px] px-0">
        <h1 className="text-xl font-semibold mb-2">Comunidades</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Repositórios do GitHub que publicam vagas. Comunidades brasileiras
          aparecem primeiro.
        </p>

        <div className="flex items-center gap-2 px-4 h-12 rounded-md border border-border bg-card focus-within:border-primary transition-colors mb-6">
          <FiSearch size={18} className="text-muted-foreground shrink-0" />
          <input
            value={filter}
            onChange={event => setFilter(event.target.value)}
            placeholder="Filtrar por nome, país ou região"
            aria-label="Filtrar comunidades"
            className="flex-1 bg-transparent border-0 outline-none text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {error && <p className="text-destructive mb-4">{error}</p>}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map(key => (
              <div
                key={key}
                className="flex items-center gap-4 p-5 bg-card border border-border rounded-md"
              >
                <Skeleton className="h-[56px] w-[56px] rounded-full shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-full max-w-[220px]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && visible.length === 0 && (
          <p className="text-muted-foreground">
            Nenhuma comunidade encontrada para esse filtro.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!loading &&
            visible.map(repo => (
              <Link
                key={repo.link}
                href={repo.link}
                className="flex items-center gap-4 p-5 bg-card border border-border rounded-md hover:border-primary/50 hover:shadow-md transition-all no-underline text-foreground"
              >
                <Image
                  src={repo.imageUrl}
                  alt={repo.name}
                  width={56}
                  height={56}
                  className="rounded-full shrink-0 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold truncate">
                    {repo.name}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {repo.desc}
                  </p>
                </div>
                <FiChevronRight size={20} className="shrink-0" />
              </Link>
            ))}
        </div>
      </div>
    </Layout>
  );
};

export default Comunidades;
