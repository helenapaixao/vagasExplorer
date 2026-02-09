import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiLogIn, FiGitBranch, FiSearch, FiZap } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import Layout from '../components/Layout';
import Header from '../components/Header';
import Animation from '../components/Animation';
import api from '../services/api';

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

const Home = () => {
  const [totalVagas, setTotalVagas] = useState<number | null>(null);

  useEffect(() => {
    api
      .get<{ total: number }>('/api/vagas-total')
      .then(({ data }) => setTotalVagas(data.total))
      .catch(() => setTotalVagas(null));
  }, []);

  return (
    <Layout>
      <Header />
      <div className="max-w-[1120px] px-0">
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
            <motion.div variants={item}>
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 no-underline"
                >
                  <FiLogIn size={20} />
                  Encontrar vagas
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
          {[
            {
              icon: FiGitBranch,
              title: 'Comunidades GitHub',
              text: 'Vagas dos principais repos brasileiros: backend, frontend, React, Vue, QA, PHP, Flutter e mais.',
            },
            {
              icon: FiSearch,
              title: 'Busca e filtros',
              text: 'Encontre por tecnologia, nível (júnior a sênior), regime (remoto, híbrido, CLT) e labels.',
            },
            {
              icon: FiZap,
              title: 'Direto ao ponto',
              text: 'Leia a vaga completa no app e use o link para se candidatar no GitHub ou no site da empresa.',
            },
          ].map(card => (
            <motion.div
              key={card.title}
              className="p-6 rounded-lg border border-border bg-card text-card-foreground hover:border-primary hover:shadow-md transition-colors cursor-default"
              variants={item}
              whileHover={{
                y: -6,
                boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                transition: { duration: 0.2 },
              }}
            >
              <div className="text-primary mb-4">
                <card.icon size={32} />
              </div>
              <h3 className="text-base font-semibold mb-2">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </Layout>
  );
};

export default Home;
