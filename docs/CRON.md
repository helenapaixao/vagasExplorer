# Cron: sync de vagas do GitHub

O cron **sync-github-jobs** varre os repositórios listados em `src/data/repos.json`, busca as issues (vagas) na API do GitHub e grava/atualiza na tabela **Job** do banco.

> **Nenhuma tela do app lê essa tabela hoje.** A busca global (`/vagas`) fala
> direto com a search API do GitHub, sem banco. O cron continua funcionando e
> mantém um histórico das vagas, mas é opcional: se você não configurar
> `DATABASE_URL`, a rota responde 503 e o app funciona normalmente.
>
> Mantenha se quiser um arquivo histórico das vagas (a API do GitHub só devolve
> as issues abertas) ou se pretende voltar a servir a busca a partir do banco
> para escapar do rate limit da search API. Caso contrário, dá para remover o
> cron, o `prisma/`, a entrada em `vercel.json` e este documento.

## Configuração

1. **Banco de dados**
   - Crie um arquivo `.env` na raiz (copie de `.env.example`).
   - **Local (SQLite):** `DATABASE_URL="file:./dev.db"`
   - Crie as tabelas: `npm run db:push`
   - O arquivo `prisma/dev.db` será criado (já está no `.gitignore`).

2. **Produção (Vercel)**
   - Use Postgres (Neon, Supabase, Railway, etc.) e defina `DATABASE_URL` nas variáveis de ambiente do projeto.
   - Altere em `prisma/schema.prisma`: `provider = "postgresql"` e rode `npm run db:push` ou use migrations.

3. **Proteção da rota (recomendado)**
   - Defina `CRON_SECRET` no `.env` (ex.: um valor aleatório longo).
   - Na Vercel, adicione a mesma variável em **Settings → Environment Variables**.
   - O Vercel Cron envia automaticamente `Authorization: Bearer <CRON_SECRET>` ao chamar a rota; a API só processa se o header bater.

## Agendamento

No `vercel.json` o cron está configurado para rodar **uma vez por dia** às 6h (`0 6 * * *`). No plano **Hobby** da Vercel, crons só podem executar uma vez por dia; no plano Pro é possível usar intervalos menores (ex.: a cada 6 horas). Você pode alterar o [schedule](https://vercel.com/docs/cron-jobs#configuring-cron-jobs) (formato cron), desde que no Hobby seja no máximo 1x/dia.

## Como rodar manualmente

- **Local:** depois de `npm run dev`, chame:
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
