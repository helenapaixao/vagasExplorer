import React, { useCallback, useEffect, useState } from 'react';
import { FiCheck, FiShare2 } from 'react-icons/fi';

interface ShareButtonProps {
  title: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ title }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const share = useCallback(async () => {
    const url = window.location.href;

    // The native share sheet is what people expect on mobile; clipboard is the
    // desktop fallback.
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Dismissed or unavailable: fall through to copying.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      // Clipboard blocked (insecure context / permissions): nothing to do.
    }
  }, [title]);

  return (
    <button
      type="button"
      onClick={share}
      className="flex items-center gap-2 rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      {copied ? (
        <FiCheck size={18} aria-hidden />
      ) : (
        <FiShare2 size={18} aria-hidden />
      )}
      <span className="text-sm">
        {copied ? 'Link copiado' : 'Compartilhar'}
      </span>
    </button>
  );
};

export default ShareButton;
