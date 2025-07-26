import Link from 'next/link';
import Layout from '../components/Layout';
import Header from '../components/Header';
import Animation from '../components/Animation';
import { ToggleTheme } from '../utils/ToggleThemeInterface';
import * as S from './Home/styles';

export default function Home({ toggleTheme }: ToggleTheme) {
  return (
    <Layout>
      <Header toggleTheme={toggleTheme} />
      <S.Title>
        <h1>Seu buscador de vagas de tecnologia</h1>
        <Link href="/dashboard">
          <S.IconLogin />
          Encontrar vagas
        </Link>
      </S.Title>
      <S.Ilustration>
        <Animation />
      </S.Ilustration>
    </Layout>
  );
}
