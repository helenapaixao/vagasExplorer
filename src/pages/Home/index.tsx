import React from "react";

import Animation from "../../components/Animation";
import Header from "../../components/Header";

import * as S from "./styles";

const Home: React.FC = () => {
  return (
    <S.Container>
      <Header />
      <S.Title>
        <h1>Seu buscador de vagas de tecnologia</h1>
      </S.Title>
      <S.Ilustration>
        <Animation />
      </S.Ilustration>
      <S.Footer>
        Feito com ❤️ por Helena Paixão 👋️{" "}
        <a href="https://www.linkedin.com/in/helenapaixao">
          Entre em contato!
        </a>
      </S.Footer>
    </S.Container>
  );
};

export default Home;
