import styled, { css } from 'styled-components';

interface LayoutProps {
  $isContentFull?: boolean;
}

const fullContent = css`
  grid-template-areas:
    'header header'
    'content content'
    'footer footer';
`;

const homeLayout = css`
  grid-template-areas:
    'header header'
    'main main'
    'footer footer';
  min-height: 100vh;
  height: auto;
`;

export const Container = styled.main<LayoutProps & { $isHome?: boolean }>`
  width: 100%;
  max-width: 1120px;
  min-height: 100vh;
  margin: 0 auto;
  display: grid;

  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 100px auto 52px;

  grid-template-areas:
    'header header'
    'slogan ilustration'
    'footer footer';

  ${({ $isContentFull }) => $isContentFull && fullContent};
  ${({ $isHome }) => $isHome && homeLayout};
`;
