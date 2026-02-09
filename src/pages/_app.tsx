import React from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import light from '../styles/themes/light';

import '../styles/globals.css';

const StyledThemeProvider = SCThemeProvider as React.FC<{
  theme: typeof light;
  children: React.ReactNode;
}>;

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <StyledThemeProvider theme={light}>
      <Component {...pageProps} />
    </StyledThemeProvider>
  );
};

export default MyApp;
