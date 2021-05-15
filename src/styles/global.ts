import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing:border-box;
  }

  body {
    font: 400 14px 'Roboto', sans-serif;
    color: ${(props) => props.theme.colors.text};
    background: ${(props) => props.theme.colors.background};

    -webkit-font-smoothing: antialiased;
  }

  h1 {
    color: ${(props) => props.theme.colors.text};
    font-size: 20px;
  }


  body, input, button {
    font: 16px Roboto, sans-serif;
  }

  button {
    cursor: pointer;
  }

  .page{
    position:absolute;
    top:0;
    left:0;
    right:0;
  }

  .fade-appear,
  .fade-enter {
      opacity: 0;
      z-index: 1;
  }
  .fade-appear-active,
  .fade-enter.fade-enter-active {
      opacity: 1;
      transition: opacity 300ms linear 150ms;
  }
  .fade-exit {
      opacity: 1;
  }
  .fade-exit.fade-exit-active {
      opacity: 0;
      transition: opacity 150ms linear;
  }

`;
