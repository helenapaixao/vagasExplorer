import styled from 'styled-components';

export const Container = styled.div`
  margin-top: 20px;
  background: #232129;
  border-radius: 10px;
  border: 2px solid #212329;
  padding: 16px;
  width: 100%;
  align-items: center;
  display: flex;
  color: #666360;
  margin-bottom: 30px;
  & + div {
    margin-top: 8px;
  }
  input {
    flex: 1;
    background: transparent;
    border: 0;
    color: #f4ede8;
    &::placeholder {
      color: #666360;
    }
  }
  svg {
    margin-right: 16px;
    color: #fff;
  }
`;

export const Icon = styled.svg`
  margin-right: 16px;
`;
