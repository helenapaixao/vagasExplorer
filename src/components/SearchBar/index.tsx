import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
  <div className="relative my-6">
    <Search
      size={18}
      aria-hidden
      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
    />
    <Input
      type="search"
      aria-label={label}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="h-11 pl-10 pr-11 text-base [&::-webkit-search-cancel-button]:appearance-none"
    />
    {value && (
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => onChange('')}
        aria-label="Limpar busca"
        className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
      >
        <X aria-hidden />
      </Button>
    )}
  </div>
);

export default SearchBar;
