import React from 'react';
import Link from 'next/link';
import type { Job } from '../../types/job';

interface JobTickerProps {
  jobs: Job[];
}

/**
 * The jobs this site aggregates are literally GitHub issues, so the hero is
 * built out of that same material: issue rows, streaming. It doubles as the
 * proof — these are real, current openings, not a mockup.
 *
 * The list is rendered twice and translated by half its height, which makes
 * the loop seamless. `prefers-reduced-motion` stops it and leaves a plain,
 * readable list.
 */
const TickerRow: React.FC<{ job: Job; ariaHidden?: boolean }> = ({
  job,
  ariaHidden = false,
}) => (
  <li aria-hidden={ariaHidden || undefined}>
    <Link
      href={`/vaga/${job.owner}/${job.repo}/${job.issueNumber}`}
      tabIndex={ariaHidden ? -1 : undefined}
      className="flex items-baseline gap-3 rounded-md px-3 py-2.5 no-underline transition-colors hover:bg-accent"
    >
      <span className="shrink-0 font-mono text-xs text-muted-foreground">
        #{job.issueNumber}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm text-foreground">
        {job.title}
      </span>
      <span className="hidden shrink-0 font-mono text-[11px] text-muted-foreground sm:inline">
        {job.owner}
      </span>
    </Link>
  </li>
);

const JobTicker: React.FC<JobTickerProps> = ({ jobs }) => {
  if (jobs.length === 0) return null;

  // Slower with more rows, so the reading pace stays constant.
  const duration = `${jobs.length * 4}s`;

  return (
    <div
      className="group relative h-[340px] overflow-hidden rounded-xl border bg-card/60 backdrop-blur-sm sm:h-[420px]"
      style={
        {
          // Fades the rows out at both ends instead of cutting them.
          maskImage:
            'linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)',
          '--ticker-duration': duration,
        } as React.CSSProperties
      }
    >
      <ul className="animate-ticker list-none p-2 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {jobs.map(job => (
          <TickerRow key={job.id} job={job} />
        ))}
        {/* Second pass exists only to make the loop seamless. */}
        {jobs.map(job => (
          <TickerRow key={`loop-${job.id}`} job={job} ariaHidden />
        ))}
      </ul>
    </div>
  );
};

export default JobTicker;
