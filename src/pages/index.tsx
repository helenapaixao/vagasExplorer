import React from 'react';
import Link from 'next/link';
import { FiLogIn, FiGitBranch, FiSearch, FiZap } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import Layout from '../components/Layout';
import Header from '../components/Header';
import Animation from '../components/Animation';

const Home = () => {
  return (
    <Layout>
      <Header />
      <div className="max-w-[1120px] px-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-12">
          <div className="flex flex-col items-center md:items-start gap-6 text-center md:text-left">
            <h1 className="text-2xl font-bold leading-tight">
              Vagas de tecnologia em um só lugar
            </h1>
            <p className="text-lg text-muted-foreground">
              Busque nas comunidades GitHub (backend-br, frontendbr, React
              Brasil e mais). Filtre por stack, nível e regime — e candidate-se
              direto no GitHub.
            </p>
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
          </div>
          <div className="flex justify-center items-center min-h-[200px]">
            <Animation />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
          <div className="p-6 rounded-lg border border-border bg-card text-card-foreground hover:border-primary hover:shadow-md transition-all">
            <div className="text-primary mb-4">
              <FiGitBranch size={32} />
            </div>
            <h3 className="text-base font-semibold mb-2">Comunidades GitHub</h3>
            <p className="text-sm text-muted-foreground">
              Vagas dos principais repos brasileiros: backend, frontend, React,
              Vue, QA, PHP, Flutter e mais.
            </p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card text-card-foreground hover:border-primary hover:shadow-md transition-all">
            <div className="text-primary mb-4">
              <FiSearch size={32} />
            </div>
            <h3 className="text-base font-semibold mb-2">Busca e filtros</h3>
            <p className="text-sm text-muted-foreground">
              Encontre por tecnologia, nível (júnior a sênior), regime (remoto,
              híbrido, CLT) e labels.
            </p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card text-card-foreground hover:border-primary hover:shadow-md transition-all">
            <div className="text-primary mb-4">
              <FiZap size={32} />
            </div>
            <h3 className="text-base font-semibold mb-2">Direto ao ponto</h3>
            <p className="text-sm text-muted-foreground">
              Leia a vaga completa no app e use o link para se candidatar no
              GitHub ou no site da empresa.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
