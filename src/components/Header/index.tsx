import React from 'react';
import { Link } from "react-router-dom";

import * as S from './styles';

interface HeaderProps {
  isBack?: boolean;
}

const Header: React.FC<HeaderProps> = ({ isBack }) => {
  return (
    <S.Container>
      <S.LogoContainer>
        <S.LogoImage />
        <h1>vagasExplorer</h1>
      </S.LogoContainer>
      <S.ActionContainer>
        {isBack && (
          <Link to="/">
            <S.IconBack />
            Voltar
          </Link>
        )}
      </S.ActionContainer>
    </S.Container>
  );
};

export default Header;
