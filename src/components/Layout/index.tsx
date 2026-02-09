import React from 'react';
import Footer from '../Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col max-w-[1120px] mx-auto w-full px-4">
      <section className="flex-1 w-full">{children}</section>
      <Footer />
    </div>
  );
};

export default Layout;
