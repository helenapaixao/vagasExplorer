import styled from "styled-components";
import { shade } from "polished";

export const Title = styled.h1`
    font-size: 48px;
    color: #3a3a3a;
    margin-top: 40px;
`;

export const Image = styled.img`
    height: 350px;

    margin-top: 100px;
    margin-left: 400px;
`;

export const Header = styled.header`
    margin: 48px 0 0;
    margin-top: 20px;
`;

export const Link = styled.link``;

export const Footer = styled.footer`
    background: #3a3a3a;
    border-radius: 10px;
    border: 0;
    padding: 16px;
    color: #f0f0f5;
    width: 240px;
    font-weight: 500;
    margin-top: 16px;
    transition: background-color 0.2s;
    &:hover {
        background: ${shade(0.2, "#3A3A3A")};
    }

    a {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: #a8a8b3;
        transition: color 0.2s;
    }

    svg {
        margin-left: 0px;
    }

    strong {
        margin-left:30px;
    }


`;

export const FooterFinal = styled.footer`

margin-top: 50px;

display:flex;

` ;
