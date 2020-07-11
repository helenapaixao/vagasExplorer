import React from 'react';
import { Link,  } from "react-router-dom";

import * as S from './styles';

const Header: React.FC = () => {
  return (
    <S.Container>
      <S.LogoContainer>
        <S.LogoImage />
        <h1>vagasExplorer</h1>
      </S.LogoContainer>
      <S.ActionContainer>
        <Link to="/dashboard">
          <S.IconLogin />
          Ver vagas
        </Link>
      </S.ActionContainer>
    </S.Container>
  );
};

export default Header;
