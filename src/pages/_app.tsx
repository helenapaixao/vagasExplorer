import React, { useState } from 'react';
import type { AppProps } from 'next/app';
import { ThemeProvider as SCThemeProvider } from 'styled-components';

import RawGlobalStyle from '../styles/global';
import light from '../styles/themes/light';
import dark from '../styles/themes/dark';

const ThemeProvider = SCThemeProvider as unknown as React.FC<{
  theme: any;
  children: React.ReactNode;
}>;

const GlobalStyle = RawGlobalStyle as unknown as React.FC;

const MyApp: React.FC<AppProps> = ({ Component, pageProps }) => {
  const [theme, setTheme] = useState(light);

  const toggleTheme = () => {
    setTheme(theme.title === 'light' ? dark : light);
  };

  return (
    <ThemeProvider theme={theme}>
      <>
        <Component {...pageProps} toggleTheme={toggleTheme} />
        <GlobalStyle />
      </>
    </ThemeProvider>
  );
};

export default MyApp;
