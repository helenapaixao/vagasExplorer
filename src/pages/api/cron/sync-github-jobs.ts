import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchIssues } from '../../../lib/githubApi';
import { prisma } from '../../../lib/prisma';
import { getRepoRefs, type RepoRef } from '../../../lib/repos';
import { allowMethods, singleParam } from '../../../lib/apiHelpers';
import type { GitHubIssue } from '../../../types/github';

const PER_PAGE = 100;
const MAX_PAGES = 50;

function isAuthorized(req: NextApiRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;

  const header = req.headers.authorization?.replace(/^Bearer\s+/i, '');
  return header === secret || singleParam(req.query.secret) === secret;
}

function toJobData(owner: string, repo: string, issue: GitHubIssue) {
  const labels = issue.labels ?? [];

  return {
    owner,
    repo,
    issueNumber: issue.number,
    title: issue.title,
    body: issue.body ?? null,
    htmlUrl: issue.html_url,
    userLogin: issue.user?.login ?? 'unknown',
    labels: labels.length
      ? JSON.stringify(
          labels.map(l => ({ id: l.id, name: l.name, color: l.color })),
        )
      : null,
    githubCreatedAt: issue.created_at ? new Date(issue.created_at) : null,
  };
}

async function syncRepo(ref: RepoRef): Promise<number> {
  const { owner, repo } = ref;
  let synced = 0;

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    // Sequential to respect the GitHub API rate limit.
    // eslint-disable-next-line no-await-in-loop
    const { issues } = await fetchIssues(owner, repo, {
      page,
      perPage: PER_PAGE,
    });
    if (issues.length === 0) return synced;

    for (let i = 0; i < issues.length; i += 1) {
      const data = toJobData(owner, repo, issues[i]);

      // Sequential upserts to avoid a DB connection spike.
      // eslint-disable-next-line no-await-in-loop
      await prisma.job.upsert({
        where: {
          owner_repo_issueNumber: {
            owner,
            repo,
            issueNumber: data.issueNumber,
          },
        },
        create: data,
        update: data,
      });
      synced += 1;
    }

    // A short page means GitHub has no more results, even after PRs were
    // filtered out of it.
    if (issues.length < PER_PAGE) return synced;
  }

  return synced;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!allowMethods(req, res, ['GET', 'POST'])) return;

  if (!isAuthorized(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (!process.env.DATABASE_URL) {
    res.status(503).json({
      error: 'DATABASE_URL not set. Configure the database for the sync cron.',
    });
    return;
  }

  const refs = getRepoRefs();
  const errors: string[] = [];
  let jobsSynced = 0;

  for (let i = 0; i < refs.length; i += 1) {
    try {
      // Sequential to respect the GitHub API rate limit.
      // eslint-disable-next-line no-await-in-loop
      jobsSynced += await syncRepo(refs[i]);
    } catch (err) {
      errors.push(
        `${refs[i].owner}/${refs[i].repo}: ${(err as Error).message}`,
      );
    }
  }

  res.status(200).json({
    ok: true,
    repos: refs.length,
    jobsSynced,
    errors: errors.length ? errors : undefined,
  });
}
