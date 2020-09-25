import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, DefaultTheme } from 'styled-components';
import usePeristedState from './utils/usePersistedState';
import Routes from './routes';
import GlobalStyle from './styles/global';
import light from './styles/themes/light';

const App: React.FC = () => {
  const [theme] = usePeristedState<DefaultTheme>('theme', light);
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes />
        <GlobalStyle />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
