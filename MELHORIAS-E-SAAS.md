# Melhorias do VagasExplorer e Caminho para um SaaS

Este documento reúne melhorias imediatas para o sistema atual e um plano para evoluir o projeto para um produto SaaS (Software as a Service).

---

## O que o sistema faz hoje

- **Home**: página inicial com CTA para “Encontrar vagas”.
- **Dashboard**: lista de repositórios de vagas (frontend-br, backend-br, react-brasil, etc.) definidos em código.
- **Página do repositório**: busca dados do repo e das issues (vagas) na API do GitHub, com busca por título/corpo/labels e paginação.

**Já corrigido neste PR:** bug em que a busca considerava só a última página carregada; paginação e estado ao trocar de repositório foram ajustados (veja `src/pages/repository/[...repository].tsx`).

---

## Melhorias no sistema atual (sem virar SaaS)

### 1. **Backend leve (Next.js API Routes ou servidor separado)**

- **Problema:** todas as chamadas à API do GitHub saem do browser → limite de requisições (60/h sem auth) e exposição de uso.
- **Solução:** criar rotas de API no Next (ex.: `/api/repos/[owner]/[repo]/issues`) que façam as chamadas ao GitHub no servidor. Opcional: cache em memória ou Redis (ex.: 5–15 min) para reduzir chamadas e melhorar tempo de resposta.

### 2. **Repositórios configuráveis**

- **Problema:** lista de repos em `reposData.ts` é fixa; qualquer novo repo exige deploy.
- **Solução:** carregar lista de um JSON no repositório, de um CMS (ex.: Decap CMS) ou de uma tabela no futuro backend. Ex.: `public/repos.json` ou variável de ambiente com JSON.

### 3. **Tratamento de erros e loading**

- **Já melhorado:** mensagens de erro e estado de loading na página do repositório.
- **Próximos passos:** toasts ou componente global de erro, retry em falhas de rede e skeleton na lista de vagas.

### 4. **UX e acessibilidade**

- Debounce na busca (ex.: 300 ms) para não filtrar a cada tecla.
- Indicar “Nenhuma vaga encontrada” quando a busca não retornar resultados.
- Suporte a teclado (Enter para abrir vaga, Escape para limpar busca).
- Meta tags e títulos por página para SEO.

### 5. **Performance**

- Cache de respostas da API (SWR ou React Query) com revalidação.
- Pré-carregar dados do dashboard (repo + primeira página de issues) com `getServerSideProps` ou `getStaticProps` onde fizer sentido.

### 6. **Rate limit do GitHub**

- Usar token de usuário (env) nas chamadas server-side para aumentar o limite (5000/h).
- Respeitar header `X-RateLimit-Remaining` e exibir mensagem amigável quando estiver perto do limite.

---

## Visão de produto SaaS

Transformar o VagasExplorer em um **SaaS de agregação e curadoria de vagas** para devs, com foco em experiência do candidato e, opcionalmente, em recrutadores.

### Funcionalidades por fase

#### Fase 1 – Fundação (MVP SaaS)

| Recurso                 | Descrição                                                                |
| ----------------------- | ------------------------------------------------------------------------ |
| **Cadastro / Login**    | Auth com e-mail/senha ou OAuth (Google/GitHub).                          |
| **Backend próprio**     | API (Node/Next ou outro) + banco (Postgres ou similar).                  |
| **Agregação de vagas**  | Job que consome GitHub Issues (e depois outras fontes) e grava no banco. |
| **Busca unificada**     | Busca em todas as vagas indexadas (por stack, nível, local, regime).     |
| **Perfil do candidato** | Campos: nome, bio, tecnologias, nível, pretensão, localização.           |
| **Vagas salvas**        | “Favoritar” vagas e listar em “Minhas vagas”.                            |

#### Fase 2 – Engajamento

| Recurso                       | Descrição                                              |
| ----------------------------- | ------------------------------------------------------ |
| **Alertas por e-mail**        | “Me avise quando surgir vaga de React + remoto”.       |
| **Notificações in-app**       | Novas vagas que batem com o perfil.                    |
| **Histórico de candidaturas** | Marcar “me candidatei” e acompanhar status (opcional). |

#### Fase 3 – Monetização e escala

| Recurso                  | Descrição                                                             |
| ------------------------ | --------------------------------------------------------------------- |
| **Planos pagos**         | Free (X alertas), Pro (alertas ilimitados, destaque de perfil).       |
| **Portal para empresas** | Publicar vagas direto no SaaS (além das do GitHub).                   |
| **Analytics**            | Para empresas: visualizações e candidaturas por vaga.                 |
| **Mais fontes**          | LinkedIn Jobs, Programathor, etc., via integrações ou scraping ético. |

### Stack sugerida para o SaaS

- **Frontend:** Next.js (já usado) + React Query/SWR + estado global leve (Context/Zustand) se precisar.
- **Backend:** Next.js API Routes + Prisma (ou Drizzle) + Postgres; ou serviço separado (Node/Fastify, etc.).
- **Auth:** NextAuth.js ou Clerk.
- **Filas/Jobs:** Bull/BullMQ (Redis) ou Inngest para sincronizar vagas do GitHub e enviar e-mails.
- **Hospedagem:** Vercel (front + serverless) + Postgres (Neon, Supabase, Railway).
- **Pagamentos:** Stripe para planos e assinaturas.

### Arquitetura de alto nível (quando virar SaaS)

```
[Usuário] → [Next.js / App] → [API Backend] → [Postgres]
                                    ↓
                            [Redis / Fila]
                                    ↓
                            [Job: GitHub API]
                                    ↓
                            [E-mail / Notificações]
```

---

## Próximos passos práticos

e1. **Curto prazo (melhorar o atual)** — ✅ Implementado

- Chamadas ao GitHub passam pelas API Routes (`/api/repo/[owner]/[repo]` e `/api/repo/issues/[owner]/[repo]`).
- Cache em memória (10 min repo, 5 min issues) e uso de `GITHUB_TOKEN` no servidor (veja `.env.example`).
- Lista de repositórios em `public/repos.json`; dashboard consome `/api/repos`.

2. **Médio prazo (preparar SaaS)**
   - Definir modelo de dados (User, Job, SavedJob, Alert).
   - Implementar auth e “vagas salvas”.
   - Criar job que popula o banco a partir dos repos atuais.

3. **Longo prazo (SaaS completo)**
   - Alertas por e-mail, planos pagos, portal para empresas.

Se quiser, posso detalhar um desses pontos (por exemplo: desenho da API e do banco para a Fase 1, ou exemplo de API Route com cache para o GitHub).
