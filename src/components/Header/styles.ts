import styled from 'styled-components';
import { FiLogIn } from "react-icons/fi";
import { shade } from "polished";

export const Container = styled.header`
  grid-area: header;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  h1 {
    font-size: 30px;
  }
`;

export const LogoImage = styled.img.attrs({
  src: require('../../assets/logo.svg'),
  alt: 'Vagas Explorer'
})`
  height: 60px;
  margin-right: 10px;
`;

export const ActionContainer = styled.div`
  display: flex;

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
    color: #a8a8b3;
    transition: all 0.2s ease-in-out;

    &:hover {
      background-color: ${shade(0.2, "#3A3A3A")};
    }

    svg {
      margin-right: 10px;
    }
  }
`;

export const IconLogin = styled(FiLogIn)``;
