import styled from 'styled-components';
import { shade } from 'polished';

export const Footer = styled.footer`
  grid-area: footer;

  display: flex;
  align-items: center;
  justify-content: center;

  span {
    margin: 0 5px;
  }

  a {
    text-decoration: none;
    color: #c62e65;
    font-weight: bold;
    transition: all 0.2s ease-in-out;

    &:hover {
      color: ${shade(0.2, '#c62e65')};
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
  }
`;
