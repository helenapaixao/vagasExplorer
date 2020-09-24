import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Repositories = styled.section`
  grid-area: content;
  margin: 20px 0 40px;

  h1 {
    font-size: 48px;
    color: ${(props) => props.theme.colors.text};
    text-align: center;
    margin: 30px 0;
  }

  a {
    max-width: 700px;
    background-color: #fff;
    border-radius: 5px;
    width: 100%;
    padding: 24px;
    display: block;
    text-decoration: none;
    display: flex;
    align-items: center;
    transition: transform 0.2s;

    & + a {
      margin-top: 16px;
    }

    &:hover {
      transform: translateX(10px);
    }

    img {
      width: 64px;
      height: 64px;
      border-radius: 50%;
    }

    div {
      margin: 0 16px;
      flex: 1;

      strong {
        font-size: 20px;
        color: #3d3d4d;
      }

      p {
        font-size: 18px;
        color: #a8a8b3;
        margin-top: 4px;
      }
    }

    svg {
      margin-left: auto;
      color: #cbcbd6;
    }
  }
`;

export const RepositoryItem = styled(Link)``;
