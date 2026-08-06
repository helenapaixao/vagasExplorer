import React from 'react';
import Footer from '../Footer';
import Header from '../Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => (
  <div className="mx-auto flex min-h-screen w-full max-w-[1120px] flex-col px-4">
    {/* Lets keyboard users jump past the nav on every page. */}
    <a
      href="#conteudo"
      className="sr-only rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50"
    >
      Pular para o conteúdo
    </a>
    <Header />
    <main id="conteudo" tabIndex={-1} className="w-full flex-1">
      {children}
    </main>
    <Footer />
  </div>
);

export default Layout;
