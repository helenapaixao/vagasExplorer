import React, { useCallback } from 'react';
import { Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface ShareButtonProps {
  title: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ title }) => {
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
      toast.success('Link copiado');
    } catch {
      toast.error('Não foi possível copiar o link');
    }
  }, [title]);

  return (
    <Button variant="ghost" size="sm" onClick={share}>
      <Share2 aria-hidden />
      Compartilhar
    </Button>
  );
};

export default ShareButton;
