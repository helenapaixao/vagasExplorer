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

const fadeIn = keyframes`
from{
  opacity: 0;
}
to{
  opacity: 1;
}
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
`;

export const IssueBlock = styled.div`
  & + & {
    margin-top: 16px;
  }
`;
export const Labels = styled.div`
  animation: ${fadeIn} 1s forwards;
  opacity: 0;
  margin: -6px 20px 20px;
  padding: 12px 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  z-index: 0;
  @media (max-width: 768px) {
    margin: 8px 0 0;
    padding: 12px 0 0;
    gap: 6px;
  }
`;

export const Label = styled.label<{ color?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 6px 12px 6px 10px;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
  cursor: pointer;
  transition: opacity 0.2s ease, transform 0.15s ease;
  background: ${(props) =>
    props.theme.title === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'};
  color: ${(props) => props.theme.colors.text};
  border-left: 3px solid ${(props) => (props.color ? `#${props.color}` : 'rgba(0,0,0,0.2)')};

  &:hover {
    opacity: 0.9;
    transform: scale(1.02);
  }
`;
export const Search = styled.div`
  position: relative;
  margin: 2rem 0 2.5rem;
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${(props) => props.theme.colors.background};
  border: 1px solid ${(props) => props.theme.colors.border || 'rgba(0,0,0,0.1)'};
  border-radius: 10px;
  padding: 0 16px;
  transition: border-color 0.2s ease;

  @media (max-width: 768px) {
    margin: 1.5rem 0 2rem;
    padding: 0 12px;
  }
`;

export const SearchIcon = styled.span`
  display: flex;
  align-items: center;
  color: ${(props) => props.theme.colors.placeholder || '#a8a8b3'};
  flex-shrink: 0;
`;

export const Input = styled.input`
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  padding: 14px 0;
  font-size: 1rem;
  color: ${(props) => props.theme.colors.text};
  outline: none;

  &::placeholder {
    color: ${(props) => props.theme.colors.placeholder || '#a8a8b3'};
  }
  @media (max-width: 768px) {
    padding: 12px 0;
    font-size: 0.9375rem;
  }
`;

export const Icon = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  margin: 0 -4px 0 0;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: ${(props) => props.theme.colors.placeholder || '#a8a8b3'};
  transition: color 0.2s, background 0.2s;
  animation: ${fadeIn} 0.2s ease forwards;

  &:hover {
    color: ${(props) => props.theme.colors.text};
    background: rgba(0, 0, 0, 0.05);
  }
  @media (prefers-color-scheme: dark) {
    &:hover {
      background: rgba(255, 255, 255, 0.08);
    }
  }
`;
export const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;

  button {
    padding: 8px 16px;
    background-color: #c62e65;
    border: none;
    border-radius: 4px;
    margin: 0 4px;
    cursor: pointer;

    &:hover {
      background-color: #c62e65;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }
`;

export const IssueCard = styled.button`
  z-index: 1;
  animation: ${fadeIn} 1s forwards;
  opacity: 0;
  background: #fff;
  border-radius: 5px;
  width: 100%;
  padding: 24px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: transform 0.2s;
  position: relative;
  text-align: left;

  & + & {
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
  }
`;

export const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

export const ModalContent = styled.div`
  background: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  border-radius: 8px;
  max-width: 640px;
  width: 100%;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

export const ModalHeader = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  flex-shrink: 0;

  strong {
    font-size: 1.25rem;
    display: block;
    margin-bottom: 8px;
  }

  p {
    font-size: 0.875rem;
    color: #a8a8b3;
    margin: 0;
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;

  h1,
  h2,
  h3 {
    margin: 1em 0 0.5em;
    font-size: 1.1rem;
  }

  p {
    margin: 0.5em 0;
    line-height: 1.6;
  }

  ul {
    margin: 0.5em 0;
    padding-left: 1.5em;
  }

  a {
    color: #c62e65;
  }
`;

export const ModalFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
`;

export const IssueDetailPage = styled.article`
  grid-area: content;
  margin: 20px 0 40px;
  max-width: 720px;
`;

export const IssueDetailBack = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 24px;
  color: ${(props) => props.theme.colors.text};
  text-decoration: none;
  font-size: 0.95rem;

  &:hover {
    text-decoration: underline;
  }
`;

export const IssueDetailHeader = styled.header`
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);

  strong {
    font-size: 1.5rem;
    display: block;
    margin-bottom: 8px;
    color: ${(props) => props.theme.colors.text};
  }

  p {
    font-size: 0.9rem;
    color: #a8a8b3;
    margin: 0 0 12px 0;
  }
`;

export const IssueDetailBody = styled.div`
  line-height: 1.6;
  color: ${(props) => props.theme.colors.text};

  h1,
  h2,
  h3 {
    margin: 1.25em 0 0.5em;
    font-size: 1.15rem;
  }

  p {
    margin: 0.75em 0;
  }

  ul {
    margin: 0.5em 0;
    padding-left: 1.5em;
  }

  a {
    color: #c62e65;
  }
`;

export const IssueDetailFooter = styled.footer`
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
`;
