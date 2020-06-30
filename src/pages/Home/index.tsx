import React from "react";
import logo from "../../assets/logo.svg";
import ImageHome from "../../assets/image_home.svg";

import { Image, Title, Header, Footer, FooterFinal } from "./styles";

import { FiLogIn } from "react-icons/fi";

const Home: React.FC = () => {
    return (
        <>
            <Header>
                <img src={logo} alt="logo" />
                <h1>vagasExplorer</h1>
            </Header>
            <Title>Seu buscador de vagas de tecnologia</Title>
            <div>
                <Image src={ImageHome} />
            </div>
            <Footer>
                <div>
                    <a href="/dashboard">
                        <span>
                            <FiLogIn />
                        </span>
                        <div>
                            <strong>Entrar</strong>
                        </div>
                    </a>
                </div>
            </Footer>
            <FooterFinal>
            Feito com ❤️ por Helena Paixão 👋️ <a href="https://www.linkedin.com/in/helenapaixao">Entre em contato!</a>
            </FooterFinal>
        </>
    );
};

export default Home;
