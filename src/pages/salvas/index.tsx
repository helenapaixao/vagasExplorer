import React from 'react';
import Link from 'next/link';
import { FiExternalLink, FiTrash2 } from 'react-icons/fi';

import Layout from '../../components/Layout';
import Seo from '../../components/Seo';
import { EmptyState } from '../../components/states';
import { Button } from '../../components/ui/button';
import { useSavedJobs } from '../../hooks/useSavedJobs';
import { formatRelativeDate, toIsoDate } from '../../lib/date';

const Salvas = () => {
  const { saved, remove, clear, mounted } = useSavedJobs();

  return (
    <Layout>
      <Seo
        title="Vagas salvas"
        description="Suas vagas salvas no vagasExplorer."
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Vagas salvas</h1>
        {mounted && saved.length > 0 && (
          <Button variant="outline" size="sm" onClick={clear}>
            Limpar tudo
          </Button>
        )}
      </div>

      {/* Nothing renders until hydration: the list lives in localStorage. */}
      {!mounted && <p className="text-muted-foreground">Carregando...</p>}

      {mounted && saved.length === 0 && (
        <EmptyState
          title="Nenhuma vaga salva ainda"
          hint="Use o ícone de marcador em qualquer vaga para guardá-la aqui. As vagas ficam salvas neste navegador."
        />
      )}

      {mounted && saved.length > 0 && (
        <ul className="flex list-none flex-col gap-4 p-0">
          {saved.map(job => (
            <li
              key={job.key}
              className="flex items-center gap-4 rounded-md border border-border bg-card p-6"
            >
              <div className="min-w-0 flex-1">
                <Link
                  href={`/vaga/${job.owner}/${job.repo}/${job.issueNumber}`}
                  className="text-base font-semibold text-card-foreground no-underline hover:text-primary"
                >
                  {job.title}
                </Link>
                <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
                  <span>{job.userLogin}</span>
                  <span aria-hidden>·</span>
                  <span>
                    {job.owner}/{job.repo}
                  </span>
                  {job.createdAt && (
                    <>
                      <span aria-hidden>·</span>
                      <time dateTime={toIsoDate(job.createdAt)}>
                        {formatRelativeDate(job.createdAt)}
                      </time>
                    </>
                  )}
                </p>
              </div>

              <a
                href={job.htmlUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abrir no GitHub"
                className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <FiExternalLink size={18} aria-hidden />
              </a>
              <button
                type="button"
                onClick={() => remove(job.key)}
                aria-label={`Remover "${job.title}" das salvas`}
                className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-destructive"
              >
                <FiTrash2 size={18} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </Layout>
  );
};

export default Salvas;
