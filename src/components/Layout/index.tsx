import React from 'react';

import Footer from '../Footer';

import * as S from './styles';

interface LayoutProps {
  isContentFull?: boolean;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, isContentFull }) => {
  return (
    <S.Container isContentFull={isContentFull} className="page">
      {children}
      <Footer />
    </S.Container>
  );
};

Layout.defaultProps = {
  isContentFull: false,
};

export default Layout;
