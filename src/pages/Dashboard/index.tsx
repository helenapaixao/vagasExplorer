import React from 'react';
import { FiChevronRight } from 'react-icons/fi';

import Layout from '../../components/Layout';
import Header from '../../components/Header';

import * as S from './styles';
import { ToggleTheme } from '../../utils/ToggleThemeInterface';

const reposData = [
  {
    link: '/repository/backend-br/vagas',
    imageUrl: 'https://avatars1.githubusercontent.com/u/30732658?v=4',
    name: ' backend-br',
    desc: 'Espaço para divulgação de vagas para backenders',
  },
  {
    link: '/repository/frontendbr/vagas',
    imageUrl: 'https://avatars1.githubusercontent.com/u/16963863?v=4',
    name: ' frontendbr',
    desc: 'Espaço para divulgação de vagas para front-enders.',
  },
  {
    link: '/repository/vuejs-br/vagas',
    imageUrl:
      'https://avatars2.githubusercontent.com/u/13300590?v=4.githubusercontent.com/u/16963863?v=4',
    name: ' vuejs-br',
    desc: 'Espaço para divulgação de vagas relacionadas com Vue.js',
  },
  {
    link: '/repository/androiddevbr/vagas',
    imageUrl: 'https://avatars1.githubusercontent.com/u/13825651?v=4',
    name: ' androiddevbr',
    desc: 'Mural de vagas para desenvolvedor Android.',
  },
  {
    link: '/repository/react-brasil/vagas',
    imageUrl: 'https://avatars2.githubusercontent.com/u/16929016?s=500&v=4',
    name: ' React Brasil',
    desc: 'Espaço para divulgação de vagas relacionadas com React',
  },
  {
    link: '/repository/qa-brasil/vagas',
    imageUrl: 'https://avatars0.githubusercontent.com/u/59667653?s=200&v=4',
    name: ' QA Brasil ',
    desc: 'Espaço para divulgação de vagas para Analistas de testes',
  },
  {
    link: '/repository/phpdevbr/vagas',
    imageUrl:
      'https://avatars0.githubusercontent.com/u/21205969?v=3&u=811926aba01e8a43d7a8ffda50b7b66a57ccdd0a',
    name: ' phpdevbr',
    desc: 'Espaço para divulgação de vagas para desenvolvedores PHP.',
  },
  {
    link: '/repository/flutterbr/vagas',
    imageUrl:
      'https://github.com/Flutter-Brazil/brand/raw/master/src/jpg/banner.jpeg',
    name: ' flutterbr',
    desc: ' Espaço para divulgação de vagas relacionadas com Flutter e Dart',
  },
  {
    link: '/repository/uxbrasil/vagas',
    imageUrl:
      'https://user-images.githubusercontent.com/3299130/48214486-2fed0800-e367-11e8-8274-6858c79ab7b4.png',
    name: ' uxbrasil',
    desc: ' Espaço para divulgação de vagas para designers UI e pesquisadores UX.',
  },
];

const Dashboard: React.FC<ToggleTheme> = ({ toggleTheme }) => {
  return (
    <Layout isContentFull>
      <Header isLink="/" toggleTheme={toggleTheme} />

      <S.Repositories>
        <h1>Principais repositórios de vagas</h1>

        <S.Content>
          {reposData.map((repo) => (
            <S.RepositoryItem key={repo.link} to={repo.link}>
              <img src={repo.imageUrl} alt={repo.name} />
              <div>
                <strong>{repo.name}</strong>
                <p>{repo.desc}</p>
              </div>
              <FiChevronRight size={20} />
            </S.RepositoryItem>
          ))}
        </S.Content>
      </S.Repositories>
    </Layout>
  );
};

export default Dashboard;
