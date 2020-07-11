import React from "react";
import { Link } from "react-router-dom";

import Layout from "../../components/Layout";
import Header from "../../components/Header";
import Animation from "../../components/Animation";
import Footer from "../../components/Footer";

import * as S from "./styles";

const Home: React.FC = () => {
  return (
    <Layout>
      <Header />
      <S.Title>
        <h1>Seu buscador de vagas de tecnologia</h1>
        <Link to="/dashboard">
          <S.IconLogin />
          Encontrar vagas
        </Link>
      </S.Title>
      <S.Ilustration>
        <Animation />
      </S.Ilustration>
      <Footer />
    </Layout>
  );
};

export default Home;
