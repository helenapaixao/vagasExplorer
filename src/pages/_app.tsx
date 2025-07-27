import React, { useState } from 'react';
import type { AppProps } from 'next/app';
import * as styled from 'styled-components';

const StyledProvider = styled.ThemeProvider;
import GlobalStyle from '../styles/global';
import light from '../styles/themes/light';
import dark from '../styles/themes/dark';

function MyApp({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState(light);

  const toggleTheme = () => {
    setTheme(theme.title === 'light' ? dark : light);
  };

  return (
    <StyledProvider theme={theme}>
      <>
        <Component {...pageProps} toggleTheme={toggleTheme} />
        <GlobalStyle />
      </>
    </StyledProvider>
  );
}

export default MyApp;
