import type { NextApiRequest, NextApiResponse } from 'next';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fetchIssues } from '../../../lib/githubApi';
import { prisma } from '../../../lib/prisma';

const PER_PAGE = 100;

type RepoItem = { link: string };

function getReposFromConfig(): { owner: string; repo: string }[] {
  const path = join(process.cwd(), 'public', 'repos.json');
  const raw = readFileSync(path, 'utf-8');
  const list = JSON.parse(raw) as RepoItem[];
  return list.map((item) => {
    const parts = item.link.replace(/^\/repository\//, '').split('/').filter(Boolean);
    const repo = parts.pop() ?? '';
    const owner = parts.pop() ?? '';
    return { owner, repo };
  }).filter((r) => r.owner && r.repo);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth =
      req.headers.authorization?.replace(/^Bearer\s+/i, '') ?? req.query.secret;
    if (auth !== secret) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }

  if (!process.env.DATABASE_URL) {
    return res.status(503).json({
      error: 'DATABASE_URL not set. Configure the database for the sync cron.',
    });
  }

  const repos = getReposFromConfig();
  let totalSynced = 0;
  const errors: string[] = [];

  for (const { owner, repo } of repos) {
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      try {
        const issues = (await fetchIssues(owner, repo, page, PER_PAGE)) as {
          number: number;
          title: string;
          body: string | null;
          html_url: string;
          user: { login: string };
          labels: { id: number; name: string; color: string }[];
          created_at: string;
        }[];

        if (issues.length === 0) {
          hasMore = false;
          break;
        }

        for (const issue of issues) {
          const githubCreatedAt = issue.created_at
            ? new Date(issue.created_at)
            : null;
          const labelsJson = issue.labels?.length
            ? JSON.stringify(
                issue.labels.map((l) => ({ id: l.id, name: l.name, color: l.color })),
              )
            : null;

          await prisma.job.upsert({
            where: {
              owner_repo_issueNumber: {
                owner,
                repo,
                issueNumber: issue.number,
              },
            },
            create: {
              owner,
              repo,
              issueNumber: issue.number,
              title: issue.title,
              body: issue.body ?? null,
              htmlUrl: issue.html_url,
              userLogin: issue.user?.login ?? 'unknown',
              labels: labelsJson,
              githubCreatedAt,
            },
            update: {
              title: issue.title,
              body: issue.body ?? null,
              htmlUrl: issue.html_url,
              userLogin: issue.user?.login ?? 'unknown',
              labels: labelsJson,
              githubCreatedAt,
            },
          });
          totalSynced += 1;
        }

        hasMore = issues.length >= PER_PAGE;
        page += 1;
      } catch (err) {
        errors.push(`${owner}/${repo} page ${page}: ${(err as Error).message}`);
        hasMore = false;
      }
    }
  }

  return res.status(200).json({
    ok: true,
    repos: repos.length,
    jobsSynced: totalSynced,
    errors: errors.length ? errors : undefined,
  });
}
