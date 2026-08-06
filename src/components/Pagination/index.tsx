import React from 'react';
import { Button } from '../ui/button';

interface PaginationProps {
  page: number;
  hasNextPage: boolean;
  totalPages?: number | null;
  loading?: boolean;
  onChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  hasNextPage,
  totalPages = null,
  loading = false,
  onChange,
}) => {
  if (page === 1 && !hasNextPage) return null;

  return (
    <nav
      aria-label="Paginação de vagas"
      className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-4"
    >
      {/* Stacked on phones so the three targets don't get cramped. */}
      <div className="flex w-full gap-3 sm:w-auto">
        <Button
          variant="outline"
          className="flex-1 sm:flex-none"
          disabled={loading || page === 1}
          onClick={() => onChange(page - 1)}
        >
          Anterior
        </Button>
        <Button
          className="flex-1 sm:flex-none"
          disabled={loading || !hasNextPage}
          onClick={() => onChange(page + 1)}
        >
          Próxima
        </Button>
      </div>
      <span
        aria-live="polite"
        className="order-first text-sm text-muted-foreground sm:order-none"
      >
        Página {page}
        {totalPages ? ` de ${totalPages}` : ''}
      </span>
    </nav>
  );
};

export default Pagination;
