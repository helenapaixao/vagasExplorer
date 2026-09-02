import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder,
  label,
}) => (
  <div className="relative my-8 flex items-center gap-3 rounded-lg border border-control bg-background px-4 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/25">
    <FiSearch
      size={20}
      className="shrink-0 text-muted-foreground"
      aria-hidden
    />
    <input
      type="search"
      aria-label={label}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="min-w-0 flex-1 border-none bg-transparent py-3.5 text-base outline-none placeholder:text-muted-foreground"
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange('')}
        aria-label="Limpar busca"
        className="flex shrink-0 items-center rounded p-2 text-muted-foreground hover:text-foreground hover:bg-accent"
      >
        <FiX size={20} aria-hidden />
      </button>
    )}
  </div>
);

export default SearchBar;
