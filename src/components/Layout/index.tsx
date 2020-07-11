import React from 'react';

import * as S from './styles';

interface LayoutProps {
  isContentFull?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isContentFull }) => {
  return <S.Container isContentFull={isContentFull}>{children}</S.Container>;
};

export default Layout;
