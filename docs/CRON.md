# Cron: sync de vagas do GitHub

O cron **sync-github-jobs** varre os repositórios listados em `public/repos.json`, busca as issues (vagas) na API do GitHub e grava/atualiza na tabela **Job** do banco.

## Configuração

1. **Banco de dados**
   - Crie um arquivo `.env` na raiz (copie de `.env.example`).
   - **Local (SQLite):** `DATABASE_URL="file:./dev.db"`
   - Crie as tabelas: `yarn db:push`
   - O arquivo `prisma/dev.db` será criado (já está no `.gitignore`).

2. **Produção (Vercel)**
   - Use Postgres (Neon, Supabase, Railway, etc.) e defina `DATABASE_URL` nas variáveis de ambiente do projeto.
   - Altere em `prisma/schema.prisma`: `provider = "postgresql"` e rode `yarn db:push` ou use migrations.

3. **Proteção da rota (recomendado)**
   - Defina `CRON_SECRET` no `.env` (ex.: um valor aleatório longo).
   - Na Vercel, adicione a mesma variável em **Settings → Environment Variables**.
   - O Vercel Cron envia automaticamente `Authorization: Bearer <CRON_SECRET>` ao chamar a rota; a API só processa se o header bater.

## Agendamento

No `vercel.json` o cron está configurado para rodar **a cada 6 horas** (`0 */6 * * *`). Você pode alterar o [schedule](https://vercel.com/docs/cron-jobs#configuring-cron-jobs) (formato cron).

## Como rodar manualmente

- **Local:** depois de `yarn dev`, chame:
  - `GET http://localhost:3000/api/cron/sync-github-jobs?secret=SEU_CRON_SECRET`
  - ou com header: `Authorization: Bearer SEU_CRON_SECRET`
- **Produção:** use o dashboard da Vercel (Cron Jobs) para “Trigger” ou faça um GET na URL do deploy com o `CRON_SECRET`.

## Resposta da API

Exemplo de resposta em caso de sucesso:

```json
{
  "ok": true,
  "repos": 8,
  "jobsSynced": 342,
  "errors": []
}
```

Se houver falha em algum repo/página, os erros vêm em `errors` e o restante é processado.
