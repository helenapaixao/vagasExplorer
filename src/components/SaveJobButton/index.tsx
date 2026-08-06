import React from 'react';
import { FiBookmark } from 'react-icons/fi';
import { jobKey, useSavedJobs } from '../../hooks/useSavedJobs';
import type { SavedJob } from '../../types/job';

type JobRef = Omit<SavedJob, 'savedAt' | 'key'>;

interface SaveJobButtonProps {
  job: JobRef;
  withLabel?: boolean;
}

const SaveJobButton: React.FC<SaveJobButtonProps> = ({
  job,
  withLabel = false,
}) => {
  const { isSaved, toggle, mounted } = useSavedJobs();
  const key = jobKey(job.owner, job.repo, job.issueNumber);
  const saved = mounted && isSaved(key);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? 'Remover das vagas salvas' : 'Salvar vaga'}
      onClick={event => {
        // The card itself is a link; saving shouldn't navigate.
        event.preventDefault();
        event.stopPropagation();
        toggle({ ...job, key });
      }}
      className={
        saved
          ? 'flex shrink-0 items-center gap-2 rounded-md p-2 text-primary transition-colors hover:bg-accent'
          : 'flex shrink-0 items-center gap-2 rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground'
      }
    >
      <FiBookmark
        size={18}
        aria-hidden
        fill={saved ? 'currentColor' : 'none'}
      />
      {withLabel && (
        <span className="text-sm">{saved ? 'Salva' : 'Salvar'}</span>
      )}
    </button>
  );
};

export default SaveJobButton;
