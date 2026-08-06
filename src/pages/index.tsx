import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LogIn, GitBranch, Search, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Layout from '../components/Layout';
import Animation from '../components/Animation';
import Seo from '../components/Seo';
import { fetchJson } from '../lib/fetchJson';

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const FEATURES = [
  {
    icon: GitBranch,
    title: 'Comunidades GitHub',
    text: 'Vagas dos principais repos brasileiros: backend, frontend, React, Vue, QA, PHP, Flutter e mais.',
  },
  {
    icon: Search,
    title: 'Busca e filtros',
    text: 'Encontre por tecnologia, nível (júnior a sênior), regime (remoto, híbrido, CLT) e labels.',
  },
  {
    icon: Zap,
    title: 'Direto ao ponto',
    text: 'Leia a vaga completa no app e use o link para se candidatar no GitHub ou no site da empresa.',
  },
];

const Home = () => {
  const [totalVagas, setTotalVagas] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetchJson<{ total: number }>(
      '/api/vagas-total',
      undefined,
      controller.signal,
    )
      .then(({ total }) => setTotalVagas(total))
      .catch(() => setTotalVagas(null));

    return () => controller.abort();
  }, []);

  return (
    <Layout>
      <Seo
        title="vagasExplorer"
        description="Vagas de tecnologia das comunidades brasileiras no GitHub em um só lugar. Busque por stack, nível e regime e candidate-se direto no GitHub."
      />
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-12">
          <motion.div
            className="flex flex-col items-center md:items-start gap-6 text-center md:text-left"
            variants={container}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-2xl font-bold leading-tight"
              variants={item}
            >
              Vagas de tecnologia em um só lugar
            </motion.h1>
            {totalVagas !== null && (
              <motion.p
                className="text-lg font-semibold text-primary"
                variants={item}
              >
                {totalVagas.toLocaleString('pt-BR')} vagas abertas nos
                repositórios
              </motion.p>
            )}
            <motion.p className="text-lg text-muted-foreground" variants={item}>
              Busque nas comunidades GitHub (backend-br, frontendbr, React
              Brasil e mais). Filtre por stack, nível e regime — e candidate-se
              direto no GitHub.
            </motion.p>
            <motion.div className="flex flex-wrap gap-3" variants={item}>
              <Button asChild size="lg">
                <Link
                  href="/vagas"
                  className="flex items-center gap-2 no-underline"
                >
                  <LogIn size={20} aria-hidden />
                  Encontrar vagas
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/dashboard" className="no-underline">
                  Ver repositórios
                </Link>
              </Button>
            </motion.div>
          </motion.div>
          <motion.div
            className="flex justify-center items-center min-h-[200px]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Animation />
          </motion.div>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={container}
        >
          {FEATURES.map(card => (
            <motion.div
              key={card.title}
              variants={item}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
              <Card className="elevated h-full cursor-default p-6 transition-colors hover:border-primary/40">
                <div className="mb-4 w-fit rounded-lg bg-primary/10 p-2.5 text-primary">
                  <card.icon size={24} aria-hidden />
                </div>
                <h3 className="mb-2 text-base font-semibold">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.text}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Home;
