import React, { useContext } from 'react';
import Switch from 'react-switch';
import Link from 'next/link';
import { shade } from 'polished';

import { ThemeContext } from 'styled-components';
import * as S from './styles';
import Logo from '../Logo';

interface HeaderProps {
  isLink?: string;
  toggleTheme(): void;
}

const handleBack = () => {
  window.history.back();
};

const Header: React.FC<HeaderProps> = ({ isLink, toggleTheme }) => {
  const { colors, title } = useContext(ThemeContext);

  return (
    <S.Container>
      <S.LogoContainer>
        <button
          onClick={handleBack}
          style={{ all: 'unset', cursor: 'pointer' }}
          aria-label="Voltar para página anterior"
          type="button"
        >
          <S.LogoImage>
            <Logo isDark={title === 'dark'} />
          </S.LogoImage>
        </button>
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
          <Link href={isLink} legacyBehavior passHref>
            <S.ActionLink>
              <S.IconBack />
              Voltar
            </S.ActionLink>
          </Link>
        )}
      </S.ActionContainer>
    </S.Container>
  );
};

Header.defaultProps = {
  isLink: undefined,
};

export default Header;
