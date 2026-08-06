import React from 'react';
import type { GitHubLabel } from '../../types/github';

interface LabelChipProps {
  label: GitHubLabel;
  /** When set, the chip becomes a button that searches for the label name. */
  onSelect?: (name: string) => void;
}

const LabelChip: React.FC<LabelChipProps> = ({ label, onSelect }) => {
  const className =
    'inline-flex items-center rounded-full bg-secondary text-secondary-foreground px-3 py-1.5 text-xs font-medium border-l-[3px]';
  const style = { borderLeftColor: `#${label.color}` };

  if (!onSelect) {
    return (
      <span className={className} style={style}>
        {label.name}
      </span>
    );
  }

  return (
    <button
      type="button"
      className={`${className} transition-opacity hover:opacity-80`}
      style={style}
      onClick={() => onSelect(label.name)}
    >
      {label.name}
    </button>
  );
};

export default LabelChip;
