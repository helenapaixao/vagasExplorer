"use strict";(()=>{var a={};a.id=636,a.ids=[636],a.modules={496:(a,b,c)=>{c.r(b),c.d(b,{default:()=>k});var d=c(8732),e=c(2015),f=c(2770);let g=(0,f.createGlobalStyle)`
  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  body {
    font: 400 14px 'Roboto', sans-serif;
    color: ${({theme:a})=>a.colors.text};
    background: ${({theme:a})=>a.colors.background};
    -webkit-font-smoothing: antialiased;
  }

  body, input, button {
    font: 16px Roboto, sans-serif;
  }

  button {
    cursor: pointer;
  }
`,h={title:"light",colors:{primary:"#f0f0f5",secundary:"#3c3744",background:"#f0f0f5",text:"#3a3a3a"}},i={title:"dark",colors:{primary:"#8257e6",secundary:"#04d361",background:"#3c3744",text:"#ffffff"}},j=f.ThemeProvider,k=({Component:a,pageProps:b})=>{let[c,f]=(0,e.useState)(h);return(0,d.jsx)(j,{theme:c,children:(0,d.jsxs)(d.Fragment,{children:[(0,d.jsx)(a,{...b,toggleTheme:()=>{f("light"===c.title?i:h)}}),(0,d.jsx)(g,{})]})})}},2015:a=>{a.exports=require("react")},2770:a=>{a.exports=require("styled-components")},8732:a=>{a.exports=require("react/jsx-runtime")}};var b=require("../webpack-runtime.js");b.C(a);var c=b(b.s=496);module.exports=c})();