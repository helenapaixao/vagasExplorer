import { Html, Head, Main, NextScript } from 'next/document';

/**
 * Runs before first paint so the saved theme is applied without a flash of the
 * wrong colors. Kept inline and tiny on purpose.
 */
const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'dark' || (!stored && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

const Document = () => (
  <Html lang="pt-BR">
    <Head>
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      {/* eslint-disable-next-line react/no-danger */}
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
    </Head>
    <body>
      <Main />
      <NextScript />
    </body>
  </Html>
);

export default Document;
