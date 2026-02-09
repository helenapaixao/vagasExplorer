import React from 'react';
import Link from 'next/link';
import { FiChevronLeft } from 'react-icons/fi';
import Logo from '../Logo';

interface HeaderProps {
  isLink?: string;
}

const Header: React.FC<HeaderProps> = ({ isLink }) => {
  return (
    <header className="flex items-center justify-between py-4 mb-6 gap-4 flex-wrap">
      <div className="flex items-center gap-3">
        <Link
          href={isLink ?? '#'}
          onClick={(e: React.MouseEvent) => {
            if (!isLink) {
              e.preventDefault();
              window.history.back();
            }
          }}
          className="flex items-center"
          aria-label="Voltar"
        >
          <div className="w-10 h-10 flex items-center justify-center">
            <Logo isDark={false} />
          </div>
        </Link>
        <h1 className="text-lg font-bold">vagasExplorer</h1>
      </div>

      <div className="flex items-center gap-3">
        {isLink && (
          <Link
            href={isLink}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <FiChevronLeft size={16} />
            Voltar
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
