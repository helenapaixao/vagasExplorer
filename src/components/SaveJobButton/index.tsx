import React from 'react';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const action = saved ? 'Remover das vagas salvas' : 'Salvar vaga';

  return (
    <Button
      variant="ghost"
      size={withLabel ? 'sm' : 'icon'}
      aria-pressed={saved}
      aria-label={withLabel ? undefined : action}
      // Native title instead of a tooltip component: the hint isn't worth
      // pulling a popover library into every page's bundle.
      title={action}
      onClick={event => {
        // The card itself is a link; saving shouldn't navigate.
        event.preventDefault();
        event.stopPropagation();
        toggle({ ...job, key });
      }}
      className={saved ? 'text-primary' : 'text-muted-foreground'}
    >
      <Bookmark aria-hidden fill={saved ? 'currentColor' : 'none'} />
      {withLabel && (saved ? 'Salva' : 'Salvar')}
    </Button>
  );
};

export default SaveJobButton;
