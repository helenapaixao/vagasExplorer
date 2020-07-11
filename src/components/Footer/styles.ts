import styled from 'styled-components';
import { shade } from "polished";

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
    color: #3a3a3a;
    font-weight: bold;
    transition: all 0.2s ease-in-out;

    &:hover {
      color: ${shade(0.2, "#3A3A3A")};
    }
  }
`;
