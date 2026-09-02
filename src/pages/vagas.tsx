import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FiSearch, FiChevronRight } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import api from '../services/api';
import Layout from '../components/Layout';
import Header from '../components/Header';
import type { VagaItem, VagasResponse } from './api/vagas';

const PER_PAGE = 20;

function formatDate(value: string): string {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? ''
    : parsed.toLocaleDateString('pt-BR');
}

const Vagas = () => {
  const router = useRouter();
  const queryParam = typeof router.query.q === 'string' ? router.query.q : '';

  const [term, setTerm] = useState('');
  const [items, setItems] = useState<VagaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // O campo espelha a URL: chegar por link compartilhado mostra o termo usado.
  useEffect(() => {
    if (router.isReady) setTerm(queryParam);
  }, [router.isReady, queryParam]);

  const fetchPage = useCallback(
    (nextPage: number) => {
      setLoading(true);
      setError(null);

      return api
        .get<VagasResponse>('/api/vagas', {
          params: { q: queryParam, page: nextPage, per_page: PER_PAGE },
        })
        .then(({ data }) => {
          setTotal(data.total);
          setPage(data.page);
          setItems(current =>
            nextPage === 1 ? data.items : [...current, ...data.items],
          );
        })
        .catch(() => setError('Erro ao buscar vagas.'))
        .finally(() => setLoading(false));
    },
    [queryParam],
  );

  useEffect(() => {
    if (!router.isReady) return;
    fetchPage(1);
  }, [router.isReady, fetchPage]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next = term.trim();
    router.push(next ? `/vagas?q=${encodeURIComponent(next)}` : '/vagas');
  };

  const hasMore = items.length < total;

  return (
    <Layout>
      <Header isLink="/" />
      <div className="max-w-[1120px] px-0">
        <form
          onSubmit={submit}
          className="flex flex-col sm:flex-row gap-2 mb-6"
        >
          <div className="flex items-center gap-2 flex-1 px-4 h-12 rounded-md border border-border bg-card focus-within:border-primary transition-colors">
            <FiSearch size={18} className="text-muted-foreground shrink-0" />
            <input
              value={term}
              onChange={event => setTerm(event.target.value)}
              placeholder="Busque por tecnologia, cargo ou nível"
              aria-label="Buscar vagas"
              className="flex-1 bg-transparent border-0 outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 shrink-0">
            Buscar
          </Button>
        </form>

        <div className="flex items-baseline justify-between mb-6 gap-4 flex-wrap">
          <h2 className="text-xl font-semibold">
            {queryParam ? `Resultados para "${queryParam}"` : 'Todas as vagas'}
          </h2>
          {!loading && !error && (
            <span className="text-sm text-muted-foreground">
              {total.toLocaleString('pt-BR')} {total === 1 ? 'vaga' : 'vagas'}
            </span>
          )}
        </div>

        {error && <p className="text-destructive mb-4">{error}</p>}

        {!loading && !error && total === 0 && (
          <p className="text-muted-foreground">
            Nenhuma vaga encontrada. Tente outro termo ou{' '}
            <Link href="/comunidades" className="text-primary">
              navegue pelas comunidades
            </Link>
            .
          </p>
        )}

        <div className="flex flex-col gap-4">
          {items.map(vaga => (
            <Link
              key={vaga.id}
              href={vaga.link}
              className="flex items-start gap-4 p-5 bg-card border border-border rounded-md hover:border-primary/50 hover:shadow-md transition-all no-underline text-foreground"
            >
              <Image
                src={vaga.avatarUrl}
                alt={vaga.communityName}
                width={44}
                height={44}
                className="rounded-full shrink-0 object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold line-clamp-2">
                  {vaga.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {vaga.repository}
                  {formatDate(vaga.createdAt) &&
                    ` · ${formatDate(vaga.createdAt)}`}
                </p>
                {vaga.tags.length > 0 && (
                  <ul className="flex flex-wrap gap-2 mt-3 list-none p-0">
                    {vaga.tags.map(tag => (
                      <li
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <FiChevronRight size={20} className="shrink-0 mt-1" />
            </Link>
          ))}

          {loading &&
            [1, 2, 3, 4, 5].map(key => (
              <div
                key={key}
                className="flex items-start gap-4 p-5 bg-card border border-border rounded-md"
              >
                <Skeleton className="h-11 w-11 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3 w-40" />
                  <Skeleton className="h-6 w-56" />
                </div>
              </div>
            ))}
        </div>

        {hasMore && !loading && (
          <div className="flex justify-center my-8">
            <Button variant="outline" onClick={() => fetchPage(page + 1)}>
              Carregar mais
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Vagas;
