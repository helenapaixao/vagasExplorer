import React from 'react';

import * as S from './styles';

const Footer: React.FC = () => {
  return (
    <S.Footer>
      Feito com <span aria-hidden="true" role="img"> ❤️ </span> por Helena Paixão <span aria-hidden="true" role="img"> 👋️ </span>
      <a href="https://www.linkedin.com/in/helenapaixao">
        Entre em contato!
      </a>
    </S.Footer>
  );
};

export default Footer;
