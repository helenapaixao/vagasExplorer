import React from 'react';
import Head from 'next/head';

interface SeoProps {
  title: string;
  description: string;
}

const SITE_NAME = 'vagasExplorer';

const Seo: React.FC<SeoProps> = ({ title, description }) => {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
    </Head>
  );
};

export default Seo;
