import React from 'react';
import type { GetServerSideProps } from 'next';

import Layout from '../components/Layout';
import Seo from '../components/Seo';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import Communities from '../components/landing/Communities';

import { searchAllRepos } from '../lib/githubApi';
import { getRepoRefs } from '../lib/repos';
import { toJob } from '../lib/toJob';
import type { Job } from '../types/job';

interface HomeProps {
  total: number | null;
  jobs: Job[];
}

const Home = ({ total, jobs }: HomeProps) => (
  <Layout>
    <Seo
      title="vagasExplorer"
      description="Vagas de tecnologia das comunidades brasileiras no GitHub, em um só campo de busca. Filtre por stack, nível e regime e candidate-se direto no GitHub."
    />
    <Hero total={total} jobs={jobs} />
    <Features />
    <Communities />
  </Layout>
);

const TICKER_SIZE = 14;

/**
 * The hero is built from live openings, so they're fetched on the server: no
 * loading state, and the page is meaningful to crawlers. The cache header
 * means one GitHub call serves five minutes of visitors, and a failure just
 * renders the hero without the stream.
 */
export const getServerSideProps: GetServerSideProps<HomeProps> = async ({
  res,
}) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=300, stale-while-revalidate=1800',
  );

  try {
    const result = await searchAllRepos(getRepoRefs(), {
      page: 1,
      perPage: TICKER_SIZE,
    });

    return {
      props: { total: result.totalCount, jobs: result.issues.map(toJob) },
    };
  } catch {
    return { props: { total: null, jobs: [] } };
  }
};

export default Home;
