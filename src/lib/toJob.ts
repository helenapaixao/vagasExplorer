import type { GitHubIssue } from '../types/github';
import type { Job } from '../types/job';

/**
 * `https://api.github.com/repos/backend-br/vagas` ->
 * `{ owner: 'backend-br', repo: 'vagas' }`.
 *
 * Search results span several repos, and `repository_url` is the only field
 * saying which one each item came from.
 */
function parseRepositoryUrl(url: string | undefined) {
  const parts = (url ?? '').split('/');
  const repo = parts.pop() ?? '';
  const owner = parts.pop() ?? '';
  return { owner, repo };
}

export function toJob(issue: GitHubIssue): Job {
  const { owner, repo } = parseRepositoryUrl(issue.repository_url);

  return {
    id: String(issue.id),
    owner,
    repo,
    issueNumber: issue.number,
    title: issue.title,
    htmlUrl: issue.html_url,
    userLogin: issue.user?.login ?? 'unknown',
    avatarUrl: issue.user?.avatar_url,
    labels: issue.labels ?? [],
    createdAt: issue.created_at ?? null,
  };
}
