import Link from 'next/link';
import { FiLogIn } from 'react-icons/fi';
import Layout from '../components/Layout';
import Header from '../components/Header';
import Animation from '../components/Animation';
import { ToggleTheme } from '../utils/ToggleThemeInterface';

export default function Home({ toggleTheme }: ToggleTheme) {
  return (
    <Layout>
      <Header toggleTheme={toggleTheme} />
      <div style={{ gridArea: 'slogan' }} className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl md:text-5xl mb-12">Seu buscador de vagas de tecnologia</h1>
        <Link
          href="/dashboard"
          className="flex items-center justify-center bg-gray-800 text-gray-100 rounded-lg px-6 py-4 w-60 hover:bg-gray-700 transition-colors"
        >
          <FiLogIn className="mr-2" />
          Encontrar vagas
        </Link>
      </div>
      <div style={{ gridArea: 'ilustration' }} className="flex items-center justify-center">
        <Animation />
      </div>
    </Layout>
  );
}
