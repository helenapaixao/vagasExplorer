import styled, { keyframes } from "styled-components";
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
        margin-left: 30px;
    }
`;

export const FooterFinal = styled.footer`
    margin-top: 50px;

    display: flex;
`;

const appearFromLeft = keyframes`
from {
        opacity:0;
        transform: tanslateX(-50px);
}
to {
    opacity:1;
        transform: tanslateX(0);
}
}
`;

export const AnimationContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    animation: ${appearFromLeft} 1s;
    form {
        margin: 80px 0;
        width: 340px;
        text-align: center;
        h1 {
            margin-bottom: 24px;
        }
        a {
            color: #f4ede8;
            display: block;
            margin-top: 24px;
            text-decoration: none;
            transition: color 0.2s;
            &:hover {
                color: ${shade(0.2, "#F4EDE8")};
            }
        }
    }
    > a {
        color: #3A3A3A;
        display: block;
        margin-top: 24px;
        text-decoration: none;
        transition: color 0.2s;
        display: flex;
        align-items: center;
        &:hover {
            color: ${shade(0.2, "#3A3A3A")};
        }
        svg {
            margin-left: 16px;
        }
    }
`;
