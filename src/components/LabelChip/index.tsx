import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { GitHubLabel } from '../../types/github';

interface LabelChipProps {
  label: GitHubLabel;
  /** When set, the chip becomes a button that searches for the label name. */
  onSelect?: (name: string) => void;
}

const LabelChip: React.FC<LabelChipProps> = ({ label, onSelect }) => {
  // GitHub's label color is arbitrary and often unreadable as a background in
  // one of the themes, so it's used only as an accent stripe.
  const style = { borderLeftColor: `#${label.color}` };
  const className = 'border-l-[3px] font-normal';

  if (!onSelect) {
    return (
      <Badge variant="secondary" className={className} style={style}>
        {label.name}
      </Badge>
    );
  }

  return (
    <button type="button" onClick={() => onSelect(label.name)}>
      <Badge
        variant="secondary"
        className={cn(className, 'transition-colors hover:bg-accent')}
        style={style}
      >
        {label.name}
      </Badge>
    </button>
  );
};

export default LabelChip;
