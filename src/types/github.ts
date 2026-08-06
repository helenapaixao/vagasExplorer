export interface GitHubUser {
  login: string;
  avatar_url: string;
}

export interface GitHubLabel {
  id: number;
  name: string;
  color: string;
}

export interface GitHubRepo {
  full_name: string;
  description: string | null;
  stargazers_count: number;
  open_issues_count: number;
  owner: GitHubUser;
}

export interface GitHubIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  html_url: string;
  created_at: string;
  user: GitHubUser;
  labels: GitHubLabel[];
  /** Present only on pull requests. Used to filter PRs out of the job list. */
  pull_request?: unknown;
  /**
   * `https://api.github.com/repos/{owner}/{repo}`. Only the search API returns
   * it, and it's the only way to tell which repo a result came from when the
   * query spans several.
   */
  repository_url?: string;
}

export interface IssuesPage {
  issues: GitHubIssue[];
  /** Total matching issues when known (search API); null when unknown. */
  totalCount: number | null;
}
