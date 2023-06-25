import React, { InputHTMLAttributes, useRef } from 'react';

import { IconBaseProps } from 'react-icons';
import { Container } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  containerStyle?: object;
  icon?: React.ComponentType<IconBaseProps>;
}

const SearchInput = ({
  name,
  value = '',
  containerStyle = {},
  icon: Icon,
  ...rest
} : InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Container style={containerStyle} data-testid="input-container">
      {Icon && <Icon name="search" size={20} />}
      <input ref={inputRef} {...rest} />
    </Container>
  );
};

export default SearchInput;
