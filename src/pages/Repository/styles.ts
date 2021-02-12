import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1114px;
  margin: 0 auto;
  padding: 2rem;
`;

export const Content = styled.div`
  margin-top: 4rem;
  display: flex;

  @media (max-width: 800px) {
    flex-direction: column;
    align-items: center;
  }
`;


export const IssuesContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-left: 2rem;

  @media (max-width: 800px) {
    margin-top: 2rem;
  }
`;
