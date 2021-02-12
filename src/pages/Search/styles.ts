
import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;
  width: 100%;
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 20rem;
  margin-top:20px;
  & img {
    height: 4.5rem;
  }
`;

export const Form = styled.form`
  margin-top: 4rem;
  width: 70rem;
  display: flex;
  flex: 1;
  input {
    flex: 1;
    height: 5rem;
    width: 60rem;
    padding: 0 2rem;
    border: 0;
    border-bottom-left-radius: 50px;
    border-top-left-radius: 50px;
    background: #e5e5e5;
    border-right: 0;
    color: #524b4b;
    font-size: 2rem;
    &::placeholder {
      color: #524b4b;
      font-size: 2rem;
      padding: 0 2rem;
    }
    @media (max-width: 576px) {
      width: 10rem;
      padding: 2rem;
    }
  }
  button {
    padding: 0 4rem;
    margin-left: -8rem;
    margin-top:-0.01rem;
    margin-bottom:20px;
    padding: 1rem;
    font-size: 2rem;
  }
  @media (max-width: 576px) {
    width: 40rem;
  }
`;

export const Error = styled.span`
  color: #ffb20f;
  margin-top: 1px;
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
