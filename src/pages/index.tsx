import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { FiGitBranch, FiSearch, FiZap } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import Layout from '../components/Layout';
import Header from '../components/Header';
import Animation from '../components/Animation';
import TotalVagas from '../components/TotalVagas';

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
  const [term, setTerm] = useState('');
  const router = useRouter();

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next = term.trim();
    router.push(next ? `/vagas?q=${encodeURIComponent(next)}` : '/vagas');
  };

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
            <motion.div variants={item}>
              <TotalVagas />
            </motion.div>
            <motion.p className="text-lg text-muted-foreground" variants={item}>
              Busque nas comunidades GitHub (backend-br, frontendbr, React
              Brasil e mais). Filtre por stack, nível e regime — e candidate-se
              direto no GitHub.
            </motion.p>
            <motion.div variants={item} className="w-full">
              <form
                onSubmit={submit}
                className="flex flex-col sm:flex-row gap-2 w-full"
              >
                <div className="flex items-center gap-2 flex-1 px-4 h-12 rounded-md border border-border bg-card focus-within:border-primary transition-colors">
                  <FiSearch
                    size={18}
                    className="text-muted-foreground shrink-0"
                  />
                  <input
                    value={term}
                    onChange={event => setTerm(event.target.value)}
                    placeholder="React, backend júnior, remoto..."
                    aria-label="Buscar vagas"
                    className="flex-1 bg-transparent border-0 outline-none text-sm text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Buscar vagas
                </Button>
              </form>
              <p className="text-sm text-muted-foreground mt-3">
                Ou{' '}
                <Link href="/comunidades" className="text-primary">
                  navegue pelas comunidades
                </Link>
                .
              </p>
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
