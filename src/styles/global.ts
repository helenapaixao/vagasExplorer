import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing:border-box;
  }

  body {
    font: 400 14px 'Roboto', sans-serif;
    background-color: #f0f0f5 ;
    -webkit-font-smoothing: antialiased;
  }

  h1 {
    color: #3a3a3a;
    font-size: 20px;
  }


  body, input, button {
    font: 16px Roboto, sans-serif;
  }

  button {
    cursor: pointer;
  }
`;
