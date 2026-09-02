import React from 'react';
import { FiAlertCircle, FiInbox, FiRefreshCw } from 'react-icons/fi';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';

const SKELETON_ROWS = [0, 1, 2, 3, 4];

export const JobListSkeleton: React.FC = () => (
  <div className="flex flex-col gap-4" aria-hidden>
    {SKELETON_ROWS.map(row => (
      <div
        key={row}
        className="flex items-center gap-4 rounded-md border border-border bg-card p-6"
      >
        <Skeleton className="h-[70px] w-[70px] shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4 max-w-md" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-full max-w-xs" />
        </div>
        <Skeleton className="h-5 w-5 shrink-0 rounded" />
      </div>
    ))}
  </div>
);

interface EmptyStateProps {
  title: string;
  hint?: string;
  suggestions?: string[];
  onSuggestion?: (value: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  hint,
  suggestions = [],
  onSuggestion,
}) => (
  <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-border px-6 py-12 text-center">
    <FiInbox size={32} className="text-muted-foreground" aria-hidden />
    <p className="font-medium">{title}</p>
    {hint && <p className="max-w-md text-sm text-muted-foreground">{hint}</p>}
    {suggestions.length > 0 && onSuggestion && (
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {suggestions.map(suggestion => (
          <button
            key={suggestion}
            type="button"
            onClick={() => onSuggestion(suggestion)}
            className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            {suggestion}
          </button>
        ))}
      </div>
    )}
  </div>
);

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => (
  <div
    role="alert"
    className="flex flex-col items-start gap-3 rounded-md border border-destructive/40 bg-destructive/5 p-6"
  >
    <p className="flex items-center gap-2 text-destructive">
      <FiAlertCircle size={18} aria-hidden />
      {message}
    </p>
    {/* Rate-limit errors clear on their own, so a retry is often all it takes. */}
    {onRetry && (
      <Button variant="outline" size="sm" onClick={onRetry}>
        <FiRefreshCw size={14} aria-hidden />
        Tentar novamente
      </Button>
    )}
  </div>
);
