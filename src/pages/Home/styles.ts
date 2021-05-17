import styled from 'styled-components';
import { shade } from 'polished';
import { FiLogIn } from 'react-icons/fi';

export const Title = styled.section`
  grid-area: slogan;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (min-width: 992px) and (max-width: 1199.98px) {

  }

  h1 {
    font-size: 48px;
    color: ${(props) => props.theme.colors.text};
    margin-bottom: 50px;

    // Dispositivos small (telefones em modo paisagem, com 576px ou mais)
  @media (max-width: 767.98px) {
    margin-left: 20px;
    font-size:40px;
  }

    // Dispositivos médios (tablets com 768px ou mais)
  @media (min-width: 768px) and (max-width: 991.98px) { 
    margin-left: 20px;
  }

    // Dispositivos large (desktops com 992px ou mais)
    @media (min-width: 992px) and (max-width: 1199.98px) {
    margin-left: 20px;
  }
  }

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    background-color: ${(props) => props.theme.colors.text};
    border-radius: 10px;
    border: 0;
    padding: 16px;
    width: 240px;
    font-weight: 500;
    color: ${(props) => props.theme.colors.primary};
    transition: all 0.2s ease-in-out;
    
    @media (max-width: 550.98px) {
    margin-left: 20px;
    
  }

    &:hover {
      background-color: ${shade(0.2, '#535353')};
      color: #fff;
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
