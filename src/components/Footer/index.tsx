import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="py-4 text-center border-t border-border">
      <span className="text-sm">
        Feito com ❤️ por Helena Paixão 👋{' '}
        <Link
          href="https://www.linkedin.com/in/helenapaixao"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-bold hover:underline"
        >
          Entre em contato!
        </Link>
      </span>
    </footer>
  );
};

export default Footer;
