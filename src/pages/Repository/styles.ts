import styled, { keyframes } from 'styled-components';

const entranceLeft = keyframes`
  to {
    right: 10px;
    opacity: 1;
  }
`;

export const Container = styled.section`
  grid-area: content;
  margin: 20px 0 40px;
`;

export const RepositoryInfo = styled.header`
  > div {
    display: flex;
    align-items: center;
  }

  img {
    width: 120px;
    height: 120px;
    border-radius: 50%;
  }

  div {
    margin-left: 24px;

    strong {
      font-size: 36px;
      color: ${(props) => props.theme.colors.text};
    }

    p {
      font-size: 18px;
      color: ${(props) => props.theme.colors.text};
      margin-top: 4px;
    }
  }

  ul {
    display: flex;
    list-style: none;
    margin-top: 40px;

    li {
      & + li {
        margin-left: 80px;
      }

      strong {
        display: block;
        font-size: 36px;
        color: ${(props) => props.theme.colors.text};
      }

      span {
        display: flex;
        margin-top: 4px;
        color: ${(props) => props.theme.colors.text};
      }
    }
  }
`;

export const Issues = styled.div`
  margin-top: 40px;

  img {
    border-radius: 50%;
    height: 70px;
  }

  a {
    background: #fff;
    border-radius: 5px;
    width: 100%;
    padding: 24px;
    display: block;
    text-decoration: none;
    display: flex;
    align-items: center;
    transition: transform 0.2s;
    position: relative;

    & + a {
      margin-top: 16px;
    }

    &:hover {
      transform: translateX(10px);
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
      border: 50%;
    }
  }
`;

export const Labels = styled.div`
  margin: -10px 20px 20px;
  padding: 20px 15px 15px 15px;
  border: 1px solid #dcdcdc;
  border-top: none;
  border-radius: 5px;
  background: transparent;
  width: fit-content;
`;

export const Label = styled.label`
  background: #${(props) => props.color};
  font-size: 0.7rem;
  padding: 2px 10px;
  margin: 3px;
  display: inline-block;
  border-radius: 3px;
  color: #000;
  cursor: pointer;
`;

export const Search = styled.div`
  position: relative;
  margin: 3rem auto;
`;

export const Input = styled.input`
  background: #fff;
  border: none;
  padding: 15px;
  border-radius: 5px;
  margin: 0 auto;
  display: block;
  width: 100%;
  text-align: center;
  transition: all 0.2s ease;

  &:focus {
    box-shadow: 0 0 25px -10px #3498db;
  }
`;

export const Icon = styled.label`
  position: absolute;
  right: 20px;
  opacity: 0;
  transform: translateY(-150%);
  cursor: pointer;
  line-height: 1rem;
  color: red;
  animation: ${entranceLeft} 0.4s forwards;
`;
