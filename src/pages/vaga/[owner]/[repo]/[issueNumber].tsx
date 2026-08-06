import React from 'react';
import type { GetServerSideProps } from 'next';

import Layout from '../../../../components/Layout';
import Seo from '../../../../components/Seo';
import IssueDetail from '../../../../components/IssueDetail';
import { ErrorState } from '../../../../components/states';
import { fetchIssue } from '../../../../lib/githubApi';
import type { GitHubIssue } from '../../../../types/github';

interface VagaProps {
  owner: string;
  repo: string;
  issue: GitHubIssue | null;
  error: string | null;
}

/** First ~160 characters of the body, stripped of Markdown noise. */
function buildDescription(issue: GitHubIssue | null, fallback: string): string {
  if (!issue?.body) return fallback;

  const text = issue.body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/[#*_>`[\]()!-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return text.length > 160 ? `${text.slice(0, 157)}...` : text || fallback;
}

const Vaga = ({ owner, repo, issue, error }: VagaProps) => {
  const backHref = `/repository/${owner}/${repo}`;

  return (
    <Layout>
      <Seo
        title={issue?.title ?? 'Vaga'}
        description={buildDescription(
          issue,
          `Vaga publicada em ${owner}/${repo} no GitHub.`,
        )}
      />

      {error && <ErrorState message={error} />}
      {issue && (
        <IssueDetail
          issue={issue}
          owner={owner}
          repo={repo}
          backHref={backHref}
        />
      )}
    </Layout>
  );
};

/**
 * Rendered on the server: a job page is static content that should be
 * indexable and readable without waiting for a client-side fetch.
 */
export const getServerSideProps: GetServerSideProps<VagaProps> = async ({
  params,
  res,
}) => {
  const owner = String(params?.owner ?? '');
  const repo = String(params?.repo ?? '');
  const issueNumber = Number(params?.issueNumber);

  if (!owner || !repo || !Number.isInteger(issueNumber) || issueNumber < 1) {
    return { notFound: true };
  }

  try {
    const issue = await fetchIssue(owner, repo, issueNumber);
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600',
    );
    return { props: { owner, repo, issue, error: null } };
  } catch (err) {
    if ((err as { status?: number }).status === 404) return { notFound: true };
    return {
      props: {
        owner,
        repo,
        issue: null,
        error:
          'Não foi possível carregar a vaga agora. Pode ser o limite da API do GitHub — tente novamente em alguns minutos.',
      },
    };
  }
};

export default Vaga;
