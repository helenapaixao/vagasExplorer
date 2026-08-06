import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import dynamic from 'next/dynamic';
// eslint-disable-next-line camelcase -- next/font exports the family names verbatim
import { Bricolage_Grotesque, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/react';
import '../styles/globals.css';

// Only ever shown after a user action, so it stays out of the shared bundle.
const Toaster = dynamic(
  () => import('@/components/ui/sonner').then(m => m.Toaster),
  { ssr: false },
);

// Two roles, two faces. The display face carries headlines; the mono is the
// vernacular of the subject — issue numbers, repo handles, labels. Body text
// stays on the system stack. next/font self-hosts both at build time, so no
// request leaves the page at runtime.
const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const MyApp = ({ Component, pageProps }: AppProps) => (
  <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
  >
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <div className={`${display.variable} ${mono.variable}`}>
      <Component {...pageProps} />
    </div>
    <Toaster />
    <Analytics />
  </ThemeProvider>
);

export default MyApp;
