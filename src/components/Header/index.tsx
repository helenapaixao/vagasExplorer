import React from 'react';
import { Link } from "react-router-dom";

import * as S from './styles';

interface HeaderProps {
  isLink?: string;
}

const Header: React.FC<HeaderProps> = ({ isLink }) => {
  return (
    <S.Container>
      <S.LogoContainer>
        <S.LogoImage />
        <h1>vagasExplorer</h1>
      </S.LogoContainer>
      <S.ActionContainer>
        {isLink && (
          <Link to={isLink}>
            <S.IconBack />
            Voltar
          </Link>
        )}
      </S.ActionContainer>
    </S.Container>
  );
};

export default Header;
