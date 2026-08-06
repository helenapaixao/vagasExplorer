import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiClock } from 'react-icons/fi';
import LabelChip from '../LabelChip';
import SaveJobButton from '../SaveJobButton';
import { formatRelativeDate, isStale, toIsoDate } from '../../lib/date';
import type { GitHubLabel } from '../../types/github';

export interface JobCardData {
  owner: string;
  repo: string;
  issueNumber: number;
  title: string;
  userLogin: string;
  htmlUrl: string;
  avatarUrl?: string;
  labels: GitHubLabel[];
  createdAt: string | null;
}

interface JobCardProps {
  job: JobCardData;
  /** Shows `owner/repo`, useful when results span several repos. */
  showRepo?: boolean;
  onLabelSelect?: (name: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  showRepo = false,
  onLabelSelect,
}) => {
  const href = `/vaga/${job.owner}/${job.repo}/${job.issueNumber}`;
  const relative = formatRelativeDate(job.createdAt);
  const stale = isStale(job.createdAt);

  return (
    <article className="rounded-md border border-border bg-card transition-all hover:border-primary/50 hover:shadow-md">
      <div className="flex items-center gap-4 p-6">
        <Link
          href={href}
          // Prefetching keeps the detail page instant on hover/viewport.
          prefetch
          className="flex min-w-0 flex-1 items-center gap-4 no-underline text-card-foreground"
        >
          <Image
            src={job.avatarUrl ?? `https://github.com/${job.userLogin}.png`}
            alt=""
            width={70}
            height={70}
            className="hidden shrink-0 rounded-full object-cover sm:block"
          />
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold sm:text-lg">{job.title}</h2>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <span>{job.userLogin}</span>
              {showRepo && (
                <>
                  <span aria-hidden>·</span>
                  <span>
                    {job.owner}/{job.repo}
                  </span>
                </>
              )}
              {relative && (
                <>
                  <span aria-hidden>·</span>
                  <time
                    dateTime={toIsoDate(job.createdAt)}
                    className={
                      stale ? 'flex items-center gap-1 text-amber-600' : ''
                    }
                  >
                    {stale && <FiClock size={12} aria-hidden />}
                    {relative}
                  </time>
                </>
              )}
            </p>
          </div>
        </Link>

        <SaveJobButton
          job={{
            owner: job.owner,
            repo: job.repo,
            issueNumber: job.issueNumber,
            title: job.title,
            userLogin: job.userLogin,
            htmlUrl: job.htmlUrl,
            createdAt: job.createdAt,
          }}
        />
      </div>

      {job.labels.length > 0 && (
        <div className="flex flex-wrap gap-2 px-6 pb-4">
          {job.labels.slice(0, 8).map(label => (
            <LabelChip key={label.id} label={label} onSelect={onLabelSelect} />
          ))}
        </div>
      )}
    </article>
  );
};

export default JobCard;
