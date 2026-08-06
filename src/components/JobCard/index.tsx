import React from 'react';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

const MAX_LABELS = 8;

const JobCard: React.FC<JobCardProps> = ({
  job,
  showRepo = false,
  onLabelSelect,
}) => {
  const href = `/vaga/${job.owner}/${job.repo}/${job.issueNumber}`;
  const relative = formatRelativeDate(job.createdAt);
  const stale = isStale(job.createdAt);
  const hiddenLabels = job.labels.length - MAX_LABELS;

  return (
    <Card className="elevated overflow-hidden transition-colors hover:border-primary/40">
      <div className="flex items-center gap-4 p-5">
        <Link
          href={href}
          // Prefetching keeps the detail page instant on hover/viewport.
          prefetch
          className="flex min-w-0 flex-1 items-center gap-4 no-underline"
        >
          <Avatar className="hidden h-14 w-14 shrink-0 sm:flex">
            <AvatarImage
              src={job.avatarUrl ?? `https://github.com/${job.userLogin}.png`}
              alt=""
            />
            <AvatarFallback>
              {job.userLogin.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold leading-snug">
              {job.title}
            </h2>
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
                      stale
                        ? 'flex items-center gap-1 text-amber-700 dark:text-amber-500'
                        : undefined
                    }
                  >
                    {stale && <Clock size={12} aria-hidden />}
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
        <div className="flex flex-wrap gap-1.5 border-t bg-muted/40 px-5 py-3">
          {job.labels.slice(0, MAX_LABELS).map(label => (
            <LabelChip key={label.id} label={label} onSelect={onLabelSelect} />
          ))}
          {hiddenLabels > 0 && (
            <span className="self-center text-xs text-muted-foreground">
              +{hiddenLabels}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};

export default JobCard;
