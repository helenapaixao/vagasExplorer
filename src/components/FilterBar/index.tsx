import React from 'react';
import { X } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Button } from '@/components/ui/button';
import {
  FILTER_GROUPS,
  countActive,
  type ActiveFilters,
} from '../../lib/filters';

interface FilterBarProps {
  filters: ActiveFilters;
  onChange: (groupId: string, value: string | null) => void;
  onClear: () => void;
}

/**
 * One selection per group, so `ToggleGroup` runs in single mode: it gives
 * roving focus and the pressed state for free. Multi-select would have to be
 * ORed inside a group, which the GitHub search API can't express reliably —
 * and "Remoto + Presencial" is a contradiction anyway.
 */
const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  onClear,
}) => {
  const active = countActive(filters);

  return (
    <div className="mb-6 flex flex-col gap-2 rounded-lg border bg-card p-4">
      {FILTER_GROUPS.map(group => (
        <div
          key={group.id}
          className="flex flex-wrap items-center gap-x-3 gap-y-2"
        >
          <span
            id={`filtro-${group.id}`}
            className="w-16 shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground"
          >
            {group.label}
          </span>
          <ToggleGroup
            type="single"
            size="sm"
            aria-labelledby={`filtro-${group.id}`}
            value={filters[group.id] ?? ''}
            onValueChange={value => onChange(group.id, value || null)}
            className="flex-wrap justify-start gap-1.5"
          >
            {group.options.map(option => (
              <ToggleGroupItem
                key={option.value}
                value={option.value}
                aria-label={option.label}
                className="h-7 rounded-full border px-3 text-xs data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
              >
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      ))}

      {active > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="mt-1 w-fit text-muted-foreground"
        >
          <X aria-hidden />
          Limpar {active} {active === 1 ? 'filtro' : 'filtros'}
        </Button>
      )}
    </div>
  );
};

export default FilterBar;
