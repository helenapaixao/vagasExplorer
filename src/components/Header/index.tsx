import React, { useContext } from 'react';
import Switch from 'react-switch';
import { Link } from 'react-router-dom';
import { shade } from 'polished';

import { ThemeContext } from 'styled-components';
import * as S from './styles';

interface HeaderProps {
  isLink?: string;
  toggleTheme(): void;
}

const Header: React.FC<HeaderProps> = ({ isLink, toggleTheme }) => {
  const { colors, title } = useContext(ThemeContext);
  return (
    <S.Container>
      <S.LogoContainer>
        <S.LogoImage />
        <h1>vagasExplorer</h1>
      </S.LogoContainer>
      <Switch
        onChange={toggleTheme}
        checked={title === 'dark'}
        checkedIcon={false}
        uncheckedIcon={false}
        height={10}
        width={40}
        handleDiameter={20}
        offColor={shade(0.15, colors.primary)}
        onColor={colors.secundary}
      />
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
