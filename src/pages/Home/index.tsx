import React from "react";
import logo from "../../assets/logo.svg";
import Animation from "../../components/Animation";

import {
    Title,
    Header,
    Footer,
    FooterFinal,
    AnimationContainer,
} from "./styles";

import { FiLogIn } from "react-icons/fi";

const Home: React.FC = () => {
    return (
        <>
            <Header>
                <img src={logo} alt="logo" />
                <h1>vagasExplorer</h1>
            </Header>
            <AnimationContainer>
                <Title>Seu buscador de vagas de tecnologia</Title>

                <div>
                    <Animation />
                </div>
            </AnimationContainer>
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
                Feito com ❤️ por Helena Paixão 👋️{" "}
                <a href="https://www.linkedin.com/in/helenapaixao">
                    Entre em contato!
                </a>
            </FooterFinal>
        </>
    );
};

export default Home;
