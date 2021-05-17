import styled from 'styled-components';
import { FiChevronLeft } from 'react-icons/fi';

export const Container = styled.header`
  grid-area: header;

  display: flex;
  justify-content: space-between;
  align-items: center;
  
`;

export const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  h1 {
    font-size: 30px;
    
  }
`;

export const LogoImage = styled.div`
  margin-right: 10px;
  @media (max-width: 1199.98px) {
    padding-left: 20px;
  }
`;

export const ActionContainer = styled.div`
  display: flex;

  a {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: #a8a8b3;
    transition: color 0.2s;

    &:hover {
      color: #666;
    }
  }
`;

export const IconBack = styled(FiChevronLeft).attrs({
  size: 16,
})``;
