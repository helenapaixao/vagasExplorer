import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ThemeProvider } from 'next-themes';
import { Analytics } from '@vercel/analytics/react';
import dynamic from 'next/dynamic';
import '../styles/globals.css';

// Only ever shown after a user action, so it stays out of the shared bundle.
const Toaster = dynamic(
  () => import('@/components/ui/sonner').then(m => m.Toaster),
  { ssr: false },
);

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
    <Component {...pageProps} />
    <Toaster />
    <Analytics />
  </ThemeProvider>
);

export default MyApp;
