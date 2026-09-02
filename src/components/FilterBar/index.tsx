import React from 'react';
import { FiX } from 'react-icons/fi';
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
 * One selection per group. Multi-select would have to be ORed inside a group,
 * which the GitHub search API can't express reliably — and "Remoto +
 * Presencial" is a contradiction anyway.
 */
const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  onClear,
}) => {
  const active = countActive(filters);

  return (
    <div className="mb-6 flex flex-col gap-3">
      {FILTER_GROUPS.map(group => (
        <fieldset key={group.id} className="flex flex-wrap items-center gap-2">
          <legend className="sr-only">{group.label}</legend>
          <span className="w-20 shrink-0 text-xs font-semibold uppercase tracking-wide text-foreground">
            {group.label}
          </span>
          {group.options.map(option => {
            const selected = filters[group.id] === option.value;
            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={selected}
                onClick={() =>
                  onChange(group.id, selected ? null : option.value)
                }
                className={
                  selected
                    ? 'rounded-full border border-primary bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground'
                    : // O contorno é o que identifica o chip, então usa o token
                      // de controle (3.5:1) em vez da borda discreta de card.
                      'rounded-full border border-control bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary'
                }
              >
                {option.label}
              </button>
            );
          })}
        </fieldset>
      ))}

      {active > 0 && (
        <button
          type="button"
          onClick={onClear}
          className="flex w-fit items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          <FiX size={14} aria-hidden />
          Limpar {active} {active === 1 ? 'filtro' : 'filtros'}
        </button>
      )}
    </div>
  );
};

export default FilterBar;
