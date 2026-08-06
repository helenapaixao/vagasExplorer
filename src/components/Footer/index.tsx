import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => (
  <footer className="border-t py-6 text-center">
    <span className="text-sm text-muted-foreground">
      Feito com{' '}
      <span
        role="img"
        aria-label="amor"
        // inline-block so the transform applies; the global
        // prefers-reduced-motion rule stops it for anyone who asked.
        className="inline-block animate-heartbeat"
      >
        ❤️
      </span>{' '}
      por Helena Paixão{' '}
      <Link
        href="https://www.linkedin.com/in/helenapaixao"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-primary hover:underline"
      >
        Entre em contato
      </Link>
    </span>
  </footer>
);

export default Footer;
