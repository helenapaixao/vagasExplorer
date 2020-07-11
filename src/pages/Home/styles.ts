import styled from "styled-components";
import { shade } from "polished";

export const Container = styled.main`
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
`;

export const Title = styled.section`
  grid-area: slogan;

  display: flex;
  align-items: center;

  h1 {
    font-size: 48px;
    color: #3a3a3a;
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
      color: ${shade(0.2, "#3A3A3A")};
    }
  }
`;
