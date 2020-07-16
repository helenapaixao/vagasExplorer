import styled, { css } from 'styled-components';

interface LayoutProps {
  isContentFull?: boolean;
}

const fullContent = css`
  grid-template-areas:
    'header header'
    'content content'
    'footer footer';
`;

export const Container = styled.main<LayoutProps>`
  width: 100%;
  max-width: 1120px;
  height: 100vh;
  margin: 0 auto;
  display: grid;

  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: 100px auto 52px;

  grid-template-areas:
    'header header'
    'slogan ilustration'
    'footer footer';

  ${({ isContentFull }) => isContentFull && fullContent};
`;
