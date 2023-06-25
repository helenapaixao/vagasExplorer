import React from 'react';

import Footer from '../Footer';

import * as S from './styles';

interface LayoutProps {
  isContentFull?: boolean;
  children: React.ReactNode;
}

const Layout = ({ children, isContentFull } : LayoutProps) => {
  return (
    <S.Container isContentFull={isContentFull} className="page">
      {children}
      <Footer />
    </S.Container>
  );
};

export default Layout;
