import React, { useContext } from 'react';
import Switch from 'react-switch';
import { Link } from 'react-router-dom';
import { shade } from 'polished';

import { ThemeContext } from 'styled-components';
import * as S from './styles';
import { Logo } from '../Logo';

interface HeaderProps {
  isLink?: string;
  toggleTheme(): void;
}
//clicar na logo e voltar uma pagina anterior
const handleBack = () => {
  window.history.back();
}


const Header = ({ isLink, toggleTheme } :HeaderProps) => {
  const { colors, title } = useContext(ThemeContext);
  return (
    <S.Container>
      <S.LogoContainer>
        <span onClick={handleBack}>
        <S.LogoImage >
          <Logo  isDark={
            title === 'dark'
          } />
        </S.LogoImage>
        </span>
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
