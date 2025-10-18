import React, { InputHTMLAttributes, useRef } from 'react';
import { IconBaseProps } from 'react-icons';
import { Container } from './styles';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  containerStyle?: React.CSSProperties;
  icon?: React.ComponentType<IconBaseProps>;
}

const SearchInput: React.FC<InputProps> = ({
  containerStyle = {},
  icon: Icon,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Container style={containerStyle} data-testid="input-container">
      {Icon && <Icon name="search" size={20} />}
      <input ref={inputRef} {...rest} />
    </Container>
  );
};

export default SearchInput;
