import React from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import ReactMarkdown from 'react-markdown';
import LabelChip from '../LabelChip';
import SaveJobButton from '../SaveJobButton';
import ShareButton from '../ShareButton';
import { formatRelativeDate, isStale, toIsoDate } from '../../lib/date';
import type { GitHubIssue } from '../../types/github';

interface IssueDetailProps {
  issue: GitHubIssue;
  owner: string;
  repo: string;
  backHref: string;
}

/**
 * Issue bodies are user-authored Markdown. react-markdown escapes raw HTML by
 * default (no `rehype-raw` here), so the content can't inject markup.
 */
const markdownClasses = [
  'leading-relaxed',
  '[&_h1]:text-lg [&_h1]:font-semibold [&_h1]:mt-6 [&_h1]:mb-2',
  '[&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-2',
  '[&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2',
  '[&_p]:my-3',
  '[&_ul]:my-2 [&_ul]:pl-6 [&_ul]:list-disc',
  '[&_ol]:my-2 [&_ol]:pl-6 [&_ol]:list-decimal',
  '[&_a]:text-primary [&_a]:underline [&_a]:break-words',
  '[&_code]:bg-muted [&_code]:rounded [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-sm',
  '[&_pre]:bg-muted [&_pre]:rounded [&_pre]:p-4 [&_pre]:overflow-x-auto',
  '[&_blockquote]:border-l-4 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-muted-foreground',
  '[&_img]:max-w-full [&_img]:h-auto',
  '[&_table]:block [&_table]:overflow-x-auto',
].join(' ');

const IssueDetail: React.FC<IssueDetailProps> = ({
  issue,
  owner,
  repo,
  backHref,
}) => {
  const relative = formatRelativeDate(issue.created_at);
  const stale = isStale(issue.created_at);

  return (
    <article className="max-w-[720px]">
      <Link
        href={backHref}
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground no-underline hover:text-foreground hover:underline"
      >
        <ArrowLeft size={18} aria-hidden />
        Voltar para a lista de vagas
      </Link>

      <header className="mb-6 border-b pb-5">
        <h1 className="mb-2 text-2xl font-bold">{issue.title}</h1>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
          <span>{issue.user.login}</span>
          <span aria-hidden>·</span>
          <span>
            {owner}/{repo}
          </span>
          {relative && (
            <>
              <span aria-hidden>·</span>
              <time dateTime={toIsoDate(issue.created_at)}>{relative}</time>
            </>
          )}
        </p>

        {stale && (
          <Alert className="mt-3 border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-400">
            <AlertTriangle className="h-4 w-4" aria-hidden />
            <AlertDescription>
              Vaga publicada há mais de 3 meses — pode já estar preenchida.
            </AlertDescription>
          </Alert>
        )}

        {issue.labels.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {issue.labels.map(label => (
              <LabelChip key={label.id} label={label} />
            ))}
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <SaveJobButton
            withLabel
            job={{
              owner,
              repo,
              issueNumber: issue.number,
              title: issue.title,
              userLogin: issue.user.login,
              htmlUrl: issue.html_url,
              createdAt: issue.created_at ?? null,
            }}
          />
          <ShareButton title={issue.title} />
        </div>
      </header>

      <div className={markdownClasses}>
        {issue.body ? (
          <ReactMarkdown>{issue.body}</ReactMarkdown>
        ) : (
          <p>Conteúdo não disponível.</p>
        )}
      </div>

      <Separator className="mt-8" />
      <footer className="mt-5">
        <Button asChild size="lg">
          <a
            href={issue.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
          >
            Ver no GitHub e candidatar
            <ExternalLink aria-hidden />
          </a>
        </Button>
      </footer>
    </article>
  );
};

export default IssueDetail;
