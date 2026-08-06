import type { GitHubLabel } from './github';

/** A job as served by the DB-backed global search (`/api/jobs`). */
export interface Job {
  id: string;
  owner: string;
  repo: string;
  issueNumber: number;
  title: string;
  htmlUrl: string;
  userLogin: string;
  avatarUrl?: string;
  labels: GitHubLabel[];
  createdAt: string | null;
}

export interface JobsPage {
  jobs: Job[];
  total: number;
  page: number;
  perPage: number;
}

/** Shape stored in localStorage by the "save job" feature. */
export interface SavedJob {
  key: string;
  owner: string;
  repo: string;
  issueNumber: number;
  title: string;
  userLogin: string;
  htmlUrl: string;
  createdAt: string | null;
  savedAt: string;
}
