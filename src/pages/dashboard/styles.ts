import styled from 'styled-components';

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
    max-width: auto;
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

export const RepositoryItem = styled.a``;

export const Content = styled.div`
  flex: 1;

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-areas: 'content content';
  gap: 20px;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      'content'
      'content';
  }
`;
