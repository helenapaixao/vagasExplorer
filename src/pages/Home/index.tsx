import React from "react";
import logo from "../../assets/logo.svg";
import ImageHome from "../../assets/image_home.svg";

import { Image, Title, Header } from "./styles";

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
            <div>
                <a href="/dashboard">
                    <span>
                        <FiLogIn />
                    </span>
                    <strong>Entrar</strong>
                </a>
            </div>
        </>
    );
};

export default Home;
