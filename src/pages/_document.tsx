import { Html, Head, Main, NextScript } from 'next/document';

// next-themes injects its own pre-paint script, so there's none here.
const Document = () => (
  <Html lang="pt-BR" suppressHydrationWarning>
    <Head>
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
