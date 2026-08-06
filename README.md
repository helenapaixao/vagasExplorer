<h4 align="center">
  🚀 Aplicação desenvolvida para busca de vagas
</h4>

<p align="center">
  <a href="#rocket-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-projeto">Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-como-rodar">Como rodar</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-estrutura">Estrutura</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-como-contribuir">Como contribuir</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#memo-licença">Licença</a>
</p>

<br>

## :rocket: Tecnologias

- [Next.js 15](https://nextjs.org) (Pages Router) + [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com) + componentes no estilo shadcn/ui
- [Prisma](https://www.prisma.io) (cron de sync das vagas)
- [Framer Motion](https://www.framer.com/motion/) e [Lottie](https://lottiefiles.com)

## 💻 Projeto

O vagasExplorer reúne vagas de tecnologia publicadas como _issues_ nos
repositórios das comunidades brasileiras do GitHub (backend-br, frontendbr,
React Brasil, QA Brasil, entre outras).

As chamadas à API do GitHub acontecem **no servidor**, em API Routes do Next,
com cache em memória e suporte a `GITHUB_TOKEN`. O navegador nunca fala com o
GitHub diretamente.

Há dois modos de uso, **ambos sem banco de dados**:

- **`/vagas` — busca global.** Pesquisa em todas as comunidades de uma vez,
  com filtros de regime, contrato, nível e stack, ordenada da mais recente
  para a mais antiga. Usa a search API do GitHub com vários `repo:` na mesma
  query (qualificadores repetidos são um OR), então o normal é **uma única
  requisição** cobrindo todos os repositórios.
- **`/repository/:owner/:repo` — por comunidade.** Lista as issues de um
  repositório específico.

As páginas de vaga (`/vaga/:owner/:repo/:número`) são renderizadas no servidor,
para serem indexáveis e abrirem sem tela de carregamento.

## 🏃 Como rodar

Requer Node `22.x` (veja `.nvmrc`).

```bash
npm install
npm run dev
```

Não precisa de configuração nenhuma para rodar. O `.env` é opcional:

```bash
cp .env.example .env    # GITHUB_TOKEN (recomendado), DATABASE_URL, CRON_SECRET
```

Scripts disponíveis:

| Script              | O que faz                             |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Servidor de desenvolvimento           |
| `npm run build`     | `prisma generate` + build de produção |
| `npm start`         | Servidor de produção                  |
| `npm run lint`      | ESLint                                |
| `npm run typecheck` | `tsc --noEmit`                        |
| `npm run format`    | Prettier (escrita)                    |
| `npm run db:push`   | Aplica o schema do Prisma             |

Sem `GITHUB_TOKEN` a API do GitHub limita a 60 requisições/hora, e a **search
API** (que a busca global usa) a apenas 10/minuto. Com token vão para 5000/hora
e 30/minuto. Recomendado até em desenvolvimento. As respostas ficam em cache em
memória por 5 minutos, o que absorve a maior parte da repetição.

## 📁 Estrutura

```
src/
├─ pages/
│  ├─ api/                    # API Routes (proxy do GitHub, busca global, cron)
│  ├─ index.tsx               # landing
│  ├─ vagas/                  # busca global (banco)
│  ├─ dashboard/              # lista de repositórios
│  ├─ repository/[owner]/     # vagas de um repositório (GitHub)
│  ├─ vaga/[owner]/[repo]/    # detalhe da vaga (SSR)
│  └─ salvas/                 # vagas salvas (localStorage)
├─ components/                # componentes de UI
├─ hooks/                     # useAsyncResource, useSearchState, useSavedJobs…
├─ lib/                       # githubApi, jobs, filters, date, repos, prisma
├─ types/                     # tipos da API do GitHub e do banco
└─ data/repos.json            # repositórios monitorados
```

O estado de busca, filtros e página vive na **URL** (`/vagas?q=react&stack=node&page=2`),
então resultados são compartilháveis e o botão voltar funciona.

Para adicionar um repositório, basta incluir uma entrada em
`src/data/repos.json`. O cron de sync está documentado em [docs/CRON.md](docs/CRON.md).

## 🤔 Como contribuir

- Faça um fork desse repositório;
- Crie uma branch com a sua feature: `git checkout -b minha-feature`;
- Faça commit das suas alterações: `git commit -m 'feat: Minha nova feature'`;
- Faça push para a sua branch: `git push origin minha-feature`.

Depois que o merge da sua pull request for feito, você pode deletar a sua branch.

## :memo: Licença

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Feito com ♥ by Helena Paixão
