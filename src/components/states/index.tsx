import React from 'react';
import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const SKELETON_ROWS = [0, 1, 2, 3, 4];

export const JobListSkeleton: React.FC = () => (
  <div className="flex flex-col gap-4" aria-hidden>
    {SKELETON_ROWS.map(row => (
      <Card key={row} className="flex items-center gap-4 p-5">
        <Skeleton className="hidden h-14 w-14 shrink-0 rounded-full sm:block" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4 max-w-md" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-9 w-9 shrink-0 rounded-md" />
      </Card>
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
  <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed px-6 py-14 text-center">
    <div className="rounded-full bg-muted p-3">
      <Inbox size={24} className="text-muted-foreground" aria-hidden />
    </div>
    <p className="font-medium">{title}</p>
    {hint && <p className="max-w-md text-sm text-muted-foreground">{hint}</p>}
    {suggestions.length > 0 && onSuggestion && (
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {suggestions.map(suggestion => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={() => onSuggestion(suggestion)}
          >
            {suggestion}
          </Button>
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
  <Alert variant="destructive" className="mb-4">
    <AlertCircle className="h-4 w-4" aria-hidden />
    <AlertTitle>Algo deu errado</AlertTitle>
    <AlertDescription className="flex flex-col items-start gap-3">
      {message}
      {/* Rate-limit errors clear on their own, so a retry is often all it takes. */}
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw aria-hidden />
          Tentar novamente
        </Button>
      )}
    </AlertDescription>
  </Alert>
);
