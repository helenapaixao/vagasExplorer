import styled from 'styled-components';
import { shade } from 'polished';
import { FiLogIn } from 'react-icons/fi';

export const Title = styled.section`
  grid-area: slogan;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h1 {
    font-size: 48px;
    color: ${(props) => props.theme.colors.text};
    margin-bottom: 50px;
  }

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    background-color: #3a3a3a;
    border-radius: 10px;
    border: 0;
    padding: 16px;
    width: 240px;
    font-weight: 500;
    color: ${(props) => props.theme.colors.text};
    transition: all 0.2s ease-in-out;

    &:hover {
      background-color: ${shade(0.2, '#3A3A3A')};
    }

    svg {
      margin-right: 10px;
    }
  }
`;

export const Ilustration = styled.section`
  grid-area: ilustration;

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Footer = styled.footer`
  grid-area: footer;

  display: flex;
  align-items: center;
  justify-content: center;

  a {
    text-decoration: none;
    margin-left: 10px;
    color: #3a3a3a;
    font-weight: bold;
    transition: all 0.2s ease-in-out;

    &:hover {
      color: ${shade(0.2, '#3A3A3A')};
    }
  }
`;

export const IconLogin = styled(FiLogIn)``;
