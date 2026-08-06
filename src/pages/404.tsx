import React from 'react';
import Link from 'next/link';
import { Compass } from 'lucide-react';
import Layout from '../components/Layout';
import Seo from '../components/Seo';
import { Button } from '../components/ui/button';

const NotFound = () => (
  <Layout>
    <Seo
      title="Página não encontrada"
      description="A página que você procurou não existe no vagasExplorer."
    />

    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <Compass size={40} className="text-muted-foreground" aria-hidden />
      <h1 className="text-2xl font-bold">Página não encontrada</h1>
      <p className="max-w-md text-muted-foreground">
        O link pode estar quebrado, ou a vaga que você procurava foi removida do
        repositório.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/vagas" className="no-underline">
            Buscar vagas
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/" className="no-underline">
            Voltar ao início
          </Link>
        </Button>
      </div>
    </div>
  </Layout>
);

export default NotFound;
