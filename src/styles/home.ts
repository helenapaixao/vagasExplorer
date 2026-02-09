import styled from 'styled-components';
import { FiLogIn, FiGitBranch, FiSearch, FiZap } from 'react-icons/fi';

const ACCENT = '#c62e65';

export const MainContent = styled.div`
  grid-area: main;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 0;
  align-items: start;

  @media (max-width: 767.98px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }
`;

export const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 24px 48px;
  max-width: 560px;

  @media (max-width: 767.98px) {
    align-items: center;
    text-align: center;
    padding: 0 20px 32px;
    max-width: none;
  }
`;

export const Headline = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.2;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 16px;
  letter-spacing: -0.02em;
`;

export const Subheadline = styled.p`
  font-size: 1.125rem;
  line-height: 1.6;
  color: ${(props) => props.theme.colors.text};
  opacity: 0.85;
  margin-bottom: 32px;
`;

export const CtaButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 32px;
  background: ${ACCENT};
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  border-radius: 10px;
  border: 0;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  box-shadow: 0 4px 14px rgba(198, 46, 101, 0.35);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(198, 46, 101, 0.4);
  }

  svg {
    flex-shrink: 0;
  }
`;

export const Ilustration = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;

  @media (max-width: 767.98px) {
    padding: 16px 0 40px;
  }
`;

export const Features = styled.section`
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  padding: 48px 24px 64px;

  @media (max-width: 767.98px) {
    padding: 32px 20px 48px;
  }
`;

export const FeatureCard = styled.div`
  padding: 24px;
  background: ${(props) => props.theme.colors.background};
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  transition:
    border-color 0.2s,
    box-shadow 0.2s;

  &:hover {
    border-color: rgba(198, 46, 101, 0.2);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  }

  svg {
    width: 32px;
    height: 32px;
    margin-bottom: 16px;
    color: ${ACCENT};
  }

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: ${(props) => props.theme.colors.text};
    margin-bottom: 8px;
  }

  p {
    font-size: 0.9375rem;
    line-height: 1.5;
    color: ${(props) => props.theme.colors.text};
    opacity: 0.8;
  }
`;

export const IconLogin = styled(FiLogIn)``;
export const IconBranch = styled(FiGitBranch)``;
export const IconSearch = styled(FiSearch)``;
export const IconZap = styled(FiZap)``;
