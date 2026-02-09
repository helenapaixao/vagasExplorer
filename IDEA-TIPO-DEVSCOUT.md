# Ideia: VagasExplorer no estilo DevScout

Inspiração: [DevScout](https://devscout.app) — plataforma que automatiza a busca por vagas para desenvolvedores e conecta candidatos a recrutadores.

Este documento descreve como evoluir o **VagasExplorer** na direção de um produto semelhante: perfil do candidato, preferências, alertas e (futuramente) matching e candidatura facilitada.

---

## Fontes de dados

- **DevScout (referência)** pega dados do **LinkedIn** (e outras fontes), monitorando milhares de vagas para fazer matching e envio de candidaturas.
- **VagasExplorer hoje** pega dados só do **GitHub**: as vagas são as **issues** dos repositórios de comunidades (ex.: [backend-br/vagas](https://github.com/backend-br/vagas), [frontendbr/vagas](https://github.com/frontendbr/vagas)). A API do GitHub (`/repos/:owner/:repo/issues`) devolve título, corpo, labels, autor e link.
- Para um produto no estilo DevScout usando **LinkedIn**, seria necessário usar a [LinkedIn Job Search API](https://developer.linkedin.com/docs/guide) ou parcerias (o LinkedIn não oferece API pública de vagas para qualquer desenvolvedor; o acesso costuma ser para recrutadores/empresas). O VagasExplorer continua usando GitHub como fonte principal; no futuro, outras fontes (ex.: LinkedIn) podem ser somadas se houver API ou integração permitida.

---

## O que o DevScout faz (referência)

- **Perfil do desenvolvedor**: palavras-chave, modalidade (remoto/presencial), cargos desejados, currículo.
- **Monitoramento contínuo**: acompanha milhares de vagas em tempo real.
- **Matching por IA**: envia candidaturas para vagas com maior compatibilidade.
- **Contato direto**: recrutadores respondem por e-mail.
- **Planos**: gratuito e pagos (limite de envios, vagas exclusivas, etc.).

No nosso caso, podemos começar **sem IA nem envio automático** e focar em: **perfil + alertas + busca unificada**.

---

## Visão para o VagasExplorer (estilo DevScout)

### Fase 1 – Perfil e preferências (MVP “DevScout light”)

| Recurso | Descrição |
|--------|-----------|
| **Cadastro / Login** | E-mail/senha ou OAuth (Google/GitHub). |
| **Perfil do candidato** | Nome, e-mail, bio, LinkedIn, tecnologias (tags), nível (Júnior/Pleno/Sênior), pretensão salarial (opcional), localização, regime (remoto/híbrido/presencial). |
| **Preferências de busca** | Palavras-chave favoritas, stacks que quer ver primeiro, cidades (se presencial). |
| **Vagas salvas** | Botão “Salvar” na tela da vaga; listar em “Minhas vagas salvas”. |

Resultado: o usuário acessa o app, faz login, configura o perfil uma vez e passa a ter “Minhas vagas” e preferências para filtrar.

---

### Fase 2 – Alertas e notificações

| Recurso | Descrição |
|--------|-----------|
| **Alertas por e-mail** | “Me avise quando surgir vaga de React + remoto” (critérios baseados em perfil + palavras-chave). |
| **Frequência** | Diário ou semanal (resumo de novas vagas). |
| **Notificações in-app** | Badge ou lista “Novas vagas que batem com seu perfil” (se tiver backend com jobs). |

Implementação sugerida: job (cron/worker) que varre os repositórios configurados, compara com preferências dos usuários e envia e-mail (Resend, SendGrid, etc.) ou grava notificações no banco.

---

### Fase 3 – Busca unificada e “match” simples

| Recurso | Descrição |
|--------|-----------|
| **Índice único** | Job que consome todos os repos (backend-br, frontendbr, etc.) e grava vagas em uma tabela (ex.: `jobs`). |
| **Busca global** | Uma caixa de busca: “React remoto pleno” retorna vagas de todos os repos, com filtros (stack, nível, regime). |
| **Score de match** | Algoritmo simples: quantas tags do perfil batem com a vaga (título + body + labels). Ordenar por “mais compatível” primeiro. |

Ainda sem “candidatura automática”: o usuário vê as vagas ranqueadas e clica para abrir no app ou no GitHub.

---

### Fase 4 – Candidatura facilitada (opcional)

| Recurso | Descrição |
|--------|-----------|
| **Template de mensagem** | Usuário escreve um texto padrão (apresentação + link do LinkedIn/currículo). |
| **“Copiar e candidatar”** | Na tela da vaga: botão “Copiar mensagem” que cola no clipboard para colar no GitHub ou no formulário da empresa. |
| **Integração com GitHub** | (Avançado) Se a vaga for issue do GitHub, link direto “Abrir issue no GitHub” já existe; no futuro, pré-preencher comentário com o template (ex.: via deep link ou extensão). |

Não é necessário envio automático de e-mail (como o DevScout); o foco é **reduzir atrito** para o candidato se candidatar.

---

## Stack técnica sugerida (resumo)

- **Auth**: NextAuth.js ou Clerk.
- **Banco**: Postgres (Supabase, Neon, Railway) com Prisma ou Drizzle.
- **Tabelas iniciais**: `User`, `Profile`, `SavedJob`, `Alert` (critérios + frequência).
- **Jobs**: Inngest, Bull/BullMQ (Redis) ou Vercel Cron para varrer repos e enviar e-mails.
- **E-mail**: Resend, SendGrid ou AWS SES.
- **Front**: Next.js (já usado) + formulários de perfil, página “Minhas vagas”, página de configuração de alertas.

---

## Diferenças em relação ao DevScout

| Aspecto | DevScout | VagasExplorer (esta ideia) |
|--------|----------|----------------------------|
| Fontes de vagas | LinkedIn e outras (45k+ vagas/mês) | GitHub (repos de comunidades); no futuro possível somar outras fontes |
| Candidatura | Envio automático de e-mails | Candidatura manual com “copiar mensagem” / link para GitHub |
| IA | Matching e envio com IA | Match por palavras-chave + labels (simples) |
| Monetização | Planos pagos por volume de envios | Possível depois: plano pago para mais alertas ou vagas em destaque |

Ou seja: a ideia é um **“DevScout light”** focado em **vagas de comunidades GitHub** + **perfil + alertas + busca unificada**, sem envio automático de candidaturas na primeira versão.

---

## Como fazer isso focado nos repos do GitHub

Tudo gira em torno dos **repositórios de vagas no GitHub**. Você já tem a lista em `public/repos.json` (backend-br/vagas, frontendbr/vagas, react-brasil/vagas, etc.) e as APIs que leem a API do GitHub. O passo a passo abaixo usa só isso como fonte.

### 1. Repos que entram no sistema

- **Fonte única**: a mesma lista que o app já usa. Cada item tem `link` no formato `/repository/owner/repo` (ex.: `/repository/backend-br/vagas`).
- No backend, isso vira uma lista de `owner/repo` para chamar a API do GitHub:  
  `GET https://api.github.com/repos/{owner}/{repo}/issues?per_page=100&page=1,2,...`
- Pode manter `repos.json` como config ou migrar para uma tabela `Repository` no banco (nome, owner, repo, ativo).

### 2. Fluxo geral (tudo a partir do GitHub)

```
[GitHub: repos de vagas]  -->  [Job no seu servidor]  -->  [Seu banco]
       (issues)                      (cron)                  (tabela Job)
                                           |
                                           v
                                    [Alertas por e-mail]
                                    [Busca unificada]
```

- Um **job** (cron/worker) roda de tempos em tempos (ex.: a cada 6h ou 1x por dia).
- Para cada `owner/repo` da lista, o job chama a API do GitHub (reaproveitando a lógica de `src/lib/githubApi.ts` ou as rotas `/api/repo/...`) e grava ou atualiza as issues numa tabela **Job** (ou **Vaga**) no seu banco.
- Com as vagas no banco, você consegue: **alertas** (comparar com preferências do usuário e enviar e-mail) e **busca unificada** (uma busca que percorre só essa tabela).

### 3. Modelo de dados (focado nos repos do GitHub)

- **User** – id, email, nome, criado_em (auth).
- **Profile** – userId, tecnologias (array ou string), nivel (Júnior/Pleno/Sênior), regime (remoto/híbrido/presencial), palavras_chave (opcional).
- **Job** (vaga vinda do GitHub) – id, owner, repo, issue_number, title, body, html_url, labels (JSON ou tabela), user_login, created_at, updated_at. Assim você sabe de qual repo veio e qual issue é.
- **SavedJob** – userId, jobId (ou owner+repo+issue_number); usuário “salvou” a vaga.
- **Alert** – userId, palavras_chave (ou critérios), frequencia (diario/semanal), ultimo_envio.

Nada de LinkedIn aqui: **Job** é preenchida só pelo job que lê as issues dos repos do GitHub.

### 4. Job que popula o banco a partir do GitHub

- Ler a lista de repos (de `repos.json` ou da tabela `Repository`).
- Para cada par (owner, repo):
  - Chamar a API do GitHub (issues, paginando com `page` e `per_page`).
  - Para cada issue: inserir ou atualizar na tabela **Job** (usar `owner + repo + issue.number` como chave única).
- Rodar esse job via **Vercel Cron** (ex.: `api/cron/sync-github-jobs.ts`), **Inngest** ou outro scheduler. Usar **GITHUB_TOKEN** no servidor para não estourar rate limit.

### 5. Alertas (só com vagas do GitHub)

- Outro job (ou o mesmo, depois de sincronizar) percorre a tabela **Alert**.
- Para cada usuário com alerta ativo, buscar **Jobs** recentes (ex.: criados desde o último envio) e filtrar por palavras-chave / labels que batam com o perfil ou com os critérios do alerta.
- Enviar um e-mail (Resend, SendGrid, etc.) com o resumo e links para as vagas (por exemplo `html_url` da issue no GitHub).
- Atualizar `ultimo_envio` no **Alert**.

Todas as vagas desse fluxo vêm da tabela **Job**, que por sua vez veio só dos repos do GitHub.

### 6. Busca unificada

- Uma única rota de API (ex.: `GET /api/jobs?q=react+remoto&nivel=pleno`) que consulta a tabela **Job** (e, se quiser, filtra por labels/regime).
- O front chama essa API em vez de chamar um repo por vez. A lista de vagas continua sendo 100% baseada nos repos do GitHub que você já configurou.

### 7. Resumo do que você já tem vs o que falta

| Já tem (VagasExplorer) | Falta fazer |
|------------------------|------------|
| Lista de repos (`repos.json`) | Banco (Postgres) + Prisma/Drizzle |
| API que lê issues do GitHub (`/api/repo/...`, `githubApi.ts`) | Tabela **Job** + job de sync que chama essa API e grava no banco |
| Páginas de listagem e detalhe por repo/issue | Auth + **Profile** + **SavedJob** + **Alert** |
| — | Job de alertas (lê Job + Alert, envia e-mail) |
| — | Página “Minhas vagas” e “Configurar alertas” |
| — | Rota de busca unificada (`/api/jobs`) que consulta a tabela Job |

Fazendo isso, você fica com um “DevScout light” **totalmente focado nos repos do GitHub**, sem depender de LinkedIn nem de outra fonte.

---

## Próximos passos práticos

1. **Definir modelo de dados**: `User`, `Profile`, `SavedJob`, `Alert`.
2. **Implementar auth** e tela de perfil (edição de tecnologias, nível, regime, etc.).
3. **Persistir “vagas salvas”** (relação User × Issue: repo + issue number).
4. **Criar job** que indexa issues dos repos em uma tabela `Job` e, em seguida, outro job que gera alertas por e-mail a partir de `Alert` e `Job`.
5. **Página “Minhas vagas”** e **página de configuração de alertas** (critérios + frequência).

Se quiser, posso detalhar o esquema do banco (Prisma/Drizzle) ou os fluxos de tela (wireframes em texto) para a Fase 1.
