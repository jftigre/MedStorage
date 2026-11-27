# MedStorage — Diretrizes para agentes de desenvolvimento

**Etapa atual:** Projeto 1.2 — Front-end React com Next.js (`web/`) integrado ao Supabase (Auth, PostgreSQL e RLS).
Estas instruções substituem as diretrizes do Projeto 1.1. O código em `vanilla/` é a implementação de referência da Fase 1.1 e deve permanecer preservado intacto durante toda a migração.

---

## 1. Papel e objetivo

Atue como engenheiro(a) de software responsável por evoluir o **MedStorage**, uma aplicação web para organização pessoal de medicamentos, posologia informada pelo usuário, estoque por lote, validade, alertas e planejamento de reposição.

O objetivo desta etapa é entregar a aplicação em **Next.js (App Router), React, TypeScript e Supabase** dentro da pasta `web/`, mantendo as funcionalidades existentes no legado, melhorando a organização arquitetural e atendendo integralmente à rubrica acadêmica do Projeto 1.2.

Prioridades, nesta ordem:
1. Preservar os fluxos e regras de negócio que realmente existem no projeto.
2. Construir uma arquitetura clara, modular, tipada e organizada em `web/`.
3. Integrar **Supabase (Auth, PostgreSQL e RLS)** de forma segura e isolada na camada de serviços.
4. Entregar uma interface consistente, responsiva e acessível (Tailwind CSS + shadcn/ui).
5. Demonstrar formulários com React Hook Form, Zod e RegExp nomeadas.
6. Demonstrar estado local (`useState`), estado global (`Context API`) e estado de dados servidor (`TanStack Query`).

---

## 2. Escopo desta etapa — atenção

### Permitido e esperado
- Manter toda a aplicação Next.js na pasta **`web/`** (App Router e TypeScript com `strict: true`).
- **Supabase permitido e esperado (Auth, PostgreSQL e RLS):**
  - Instalar e usar `@supabase/supabase-js` e `@supabase/ssr`.
  - Centralizar os clientes Supabase em `web/src/lib/supabase/{client,server,middleware}.ts`.
  - Versionar o esquema do banco, triggers e políticas RLS em `web/supabase/migrations/*.sql` e dados de demonstração em `web/supabase/seed.sql`.
  - Configurar variáveis públicas `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` em `web/.env.local` (documentadas sem valores em `web/.env.example`).
  - Proteger rotas privadas via `web/src/middleware.ts` com cookies/servidor (`supabase.auth.getUser()`).
- Usar Tailwind CSS e shadcn/ui com ícones `lucide-react`.
- Implementar formulários com React Hook Form + Zod (`@hookform/resolvers`) + expressões regulares nomeadas.
- Usar `useState` para estado local de interface, `Context API` (`AuthContext`) para sessão e `TanStack Query` para consultas, mutations, cache e invalidação.

### Proibido / Cuidados obrigatórios
- **Nunca commitar `.env.local`** nem expor a `service_role` key no front-end.
- **Nunca guardar senhas em texto puro** em tabelas próprias, estado global, props ou logs; a autenticação deve usar exclusivamente Supabase Auth (`auth.users`).
- **Nunca chamar `supabase.from(...)` diretamente em componentes ou páginas**; todo acesso a dados deve passar pela camada `web/src/services/`.
- **Não remover nem sobrescrever a pasta `vanilla/`** (legado preservado como referência da Fase 1.1).
- **Não inventar regras clínicas ou funcionalidades fora do escopo:** não recomendar doses nem condutas médicas; manter `alertas` com a regra existente (vencido ou a vencer em até 30 dias) e `simulador` migrado como UI sem inventar lógica nova (FEFO, alertas 60/90 dias e risco de desperdício ficam fora do escopo da Fase 1.2).

---

## 3. Diagnóstico do legado e mapeamento (Fase 1.1 ➔ Fase 1.2)

O repositório contém a aplicação anterior em `vanilla/`, com Vite multi-page, HTML, Tailwind via CDN, JavaScript ESM e LocalStorage.

| Tela legada (`vanilla/`) | Rota em `web/` (Next.js App Router) | Observação |
| --- | --- | --- |
| `index.html` | `/` | Portal inicial com atalhos para as áreas do sistema. |
| `landing.html` | `/apresentacao` | Apresentação institucional do produto e da equipe. |
| `login.html` | `/login` | Login com Supabase Auth. |
| `cadastro.html` | `/cadastro` | Cadastro com Supabase Auth + criação automática de `profiles`. |
| `dashboard.html` | `/dashboard` | Indicadores, saudação, avatar, reposição e lotes próximos do vencimento. |
| `medicamentos.html` | `/medicamentos` | Listagem, métricas, status, busca e exclusão de medicamentos. |
| `medicamento-form.html` | `/medicamentos/novo` e `/medicamentos/[id]/editar` | Cadastro/edição de medicamento e gerenciamento de lotes. |
| `simulador.html` | `/simulador` | Tela migrada como UI (sem lógica nova nesta fase). |
| `alertas.html` | `/alertas` | Lista de lotes vencidos ou a vencer em até 30 dias (mesma regra do dashboard). |
| `perfil.html` | `/perfil` | Dados de perfil (`profiles`), foto em Base64 com limite de tamanho e logout. |
| `403.html` | `/acesso-negado` | Tela de acesso negado. |

As rotas utilizam route groups (`(public)` e `(protected)`) sem expor o nome dos grupos na URL. Mantenha `/` como o portal de `index.html`.

---

## 4. Stack obrigatória e padrões técnicos

- **Next.js:** App Router em `web/`; não usar Pages Router.
- **React:** componentes funcionais declarativos e composição (não usar manipulação manual do DOM como `createElement`, `appendChild`, `innerHTML` ou `dangerouslySetInnerHTML`).
- **TypeScript:** `strict: true`; evitar `any`. Tipar entidades, parâmetros, retornos, formulários e props.
- **Estilização:** Tailwind CSS instalado (sem CDN) + shadcn/ui + `lucide-react`. Fontes `Epilogue` (títulos) e `Lexend` (texto).
- **Formulários:** React Hook Form + Zod + `@hookform/resolvers` + RegExp nomeadas.
- **Estado de interface:** `useState` (local) e `Context API` (sessão).
- **Estado de dados:** TanStack Query (`useQuery`, `useMutation`, `queryKeys` centralizadas e invalidação).
- **Back-end / Persistência:** Supabase (Auth, PostgreSQL e políticas RLS).
- **Qualidade:** ESLint (`npm run lint` via `next lint`), typecheck (`npm run typecheck` via `tsc --noEmit`), Vitest (`npm test`) e `npm run build`.

---

## 5. Arquitetura e organização esperadas (`web/`)

```text
MedStorage/
├── agents.md
├── README.md
├── .gitignore
├── vanilla/                                  # legado da Fase 1.1 (intacto)
└── web/                                      # aplicação Next.js da Fase 1.2
    ├── .env.example
    ├── eslint.config.mjs
    ├── next.config.ts
    ├── package.json
    ├── tsconfig.json                         # strict: true, alias @/* -> ./src/*
    ├── vitest.config.ts
    ├── public/
    ├── supabase/
    │   ├── migrations/*.sql
    │   └── seed.sql
    └── src/
        ├── middleware.ts                     # proteção de rotas via Supabase SSR
        ├── app/
        │   ├── layout.tsx
        │   ├── providers.tsx                 # QueryClientProvider + AuthProvider
        │   ├── page.tsx                      # portal inicial (/)
        │   ├── acesso-negado/page.tsx
        │   ├── (public)/
        │   │   ├── apresentacao/page.tsx
        │   │   ├── login/page.tsx
        │   │   └── cadastro/page.tsx
        │   └── (protected)/
        │       ├── layout.tsx
        │       ├── dashboard/page.tsx
        │       ├── medicamentos/page.tsx
        │       ├── medicamentos/novo/page.tsx
        │       ├── medicamentos/[id]/editar/page.tsx
        │       ├── simulador/page.tsx
        │       ├── alertas/page.tsx
        │       └── perfil/page.tsx
        ├── components/
        │   ├── ui/                           # componentes base / shadcn
        │   ├── layout/                       # navbar, header, logout, ajuste de fonte
        │   ├── feedback/                     # loading, empty-state, error-state
        │   ├── forms/                        # FormField, FormMessage, formulários
        │   ├── medicamentos/                 # cards, badges, formulários, exclusão
        │   ├── lotes/                        # formulário e lista de lotes
        │   └── dashboard/                    # cards e listas de indicadores/alertas
        ├── contexts/
        │   └── auth-context.tsx
        ├── hooks/
        │   └── queries/                      # use-medicamentos, use-lotes, use-perfil
        ├── lib/
        │   ├── supabase/                     # client.ts, server.ts, middleware.ts
        │   ├── query-client.ts
        │   ├── query-keys.ts
        │   └── utils.ts
        ├── schemas/                          # regex.ts, auth.ts, medicamento.ts, lote.ts, perfil.ts
        ├── services/                         # auth.ts, medicamentos.ts, lotes.ts, perfil.ts
        ├── types/                            # medicamento.ts, lote.ts, perfil.ts, database.ts
        └── utils/                            # calculosEstoque.ts, datas.ts, formatacao.ts
```

### Responsabilidades
- `app/`: rotas, layouts e composição de páginas (Server Components por padrão).
- `components/`: elementos visuais reutilizáveis, sem acesso direto ao Supabase.
- `contexts/`: estado global de sessão (`AuthContext`).
- `hooks/queries/`: integração reutilizável com TanStack Query.
- `lib/`: configuração de clientes Supabase, QueryClient, query keys e utilitários compartilhados.
- `schemas/`: schemas Zod e expressões regulares nomeadas.
- `services/`: único ponto que chama `supabase.from(...)` e `supabase.auth.*`.
- `types/`: contratos TypeScript de entidades, DTOs e tipos gerados do banco (`database.ts`).
- `utils/`: funções puras de cálculo de estoque, datas e formatação.

---

## 6. Modelo de dados e Supabase (PostgreSQL + RLS)

Preserve os nomes de campos do legado nas tabelas do Supabase:

- **`profiles`:** `id` (uuid PK -> `auth.users` on delete cascade), `nome`, `cpf`, `telefone`, `telefone_cuidador`, `foto_base64`, `criado_em`. Criada automaticamente por trigger no cadastro.
- **`medicamentos`:** `id`, `usuario_id` (uuid -> `auth.users` on delete cascade), `nome`, `dosagem`, `forma`, `finalidade`, `comprimidos_por_dose` (`> 0`), `doses_por_dia` (`> 0`), `estoque_minimo_dias` (`> 0`), `criado_em`.
- **`lotes`:** `id`, `medicamento_id` (uuid -> `medicamentos` on delete cascade), `validade` (`date`), `quantidade` (`> 0`), `preco_pago` (`>= 0`), `local_compra`, `em_promocao`, `criado_em`.

### Segurança (RLS)
- Ativar Row Level Security nas 3 tabelas (`profiles`, `medicamentos`, `lotes`).
- Cada usuário só pode ler, inserir, atualizar e excluir seus próprios dados (`usuario_id = (select auth.uid())`, e `lotes` validados via existência do medicamento pertencente ao usuário).

---

## 7. Regras de negócio conhecidas

Centralize os cálculos em funções puras em `web/src/utils/` (não duplicar cálculos em componentes):
- **Consumo diário:** `comprimidos_por_dose × doses_por_dia`.
- **Estoque total:** soma de `quantidade` dos lotes vinculados ao medicamento (com `reduce`).
- **Dias restantes:** `Math.floor(estoqueTotal / consumoDiario)`, quando o consumo diário for maior que zero.
- **Previsão de término:** data atual acrescida dos dias restantes.
- **Estoque crítico:** `diasRestantes <= estoque_minimo_dias`.
- **Alertas / Dashboard:** lotes vencidos ou com validade em até 30 dias.

O MedStorage é ferramenta de organização pessoal de estoque e **não recomenda doses, não altera posologia e não orienta condutas médicas**.

---

## 8. Formulários, validação e gerência de estado

- **Formulários:** React Hook Form + `zodResolver` + RegExp nomeadas (`REGEX_EMAIL`, `REGEX_TELEFONE`, `REGEX_CPF` para formato) com mensagens em português, `aria-invalid`, `aria-describedby` e feedback acessível (`role="alert"` / `role="status"`).
- **Estado local (`useState`):** modais, menus mobile, busca/filtros, ajuste de fonte e estados efêmeros de UI.
- **Estado global (`Context API`):** `AuthProvider` / `useAuth()` acompanhando `supabase.auth.onAuthStateChange`.
- **Estado de dados (`TanStack Query`):** `QueryClientProvider` no layout raiz, `queryKeys` centralizadas, mutations com invalidação de cache e limpeza do cache no logout (`queryClient.clear()`).

---

## 9. Autenticação e proteção de rotas

- **Rotas privadas:** `/dashboard`, `/medicamentos/**`, `/simulador`, `/alertas`, `/perfil`.
- **Rotas públicas:** `/`, `/apresentacao`, `/login`, `/cadastro`, `/acesso-negado`.
- Validar sessão no servidor com `supabase.auth.getUser()` dentro de `web/src/middleware.ts` (nunca confiar apenas em `getSession()` no servidor).
- Sem sessão em rota protegida -> redirecionar para `/login`.
- Com sessão em `/login` ou `/cadastro` -> redirecionar para `/dashboard`.

---

## 10. Qualidade, testes e rubrica acadêmica (10 pts)

Antes de concluir qualquer UC:
- Executar em `web/`: `npm run lint`, `npm run typecheck`, `npm test` e `npm run build`.
- Garantir responsividade (mobile e desktop), acessibilidade (HTML semântico, foco visível, navegação por teclado) e estados de `loading`, `vazio` e `erro`.
- Trabalhar em etapas pequenas, com commits claros por task e sem tocar em `vanilla/`.

| Critério | Pontos | Evidência esperada |
| --- | :-: | --- |
| Arquitetura e Organização | 2,0 | Next.js App Router em `web/`, TypeScript `strict: true`, pastas e camadas separadas. |
| Supabase (Auth, RLS, CRUD) | 2,0 | Migrations, Auth, middleware com cookies, RLS testada com 2 contas e CRUD persistido. |
| Componentes React e UI | 2,0 | Componentes reutilizáveis, Tailwind + shadcn/ui, identidade visual teal e responsividade. |
| Formulários e Validação | 2,0 | React Hook Form, Zod, RegExp nomeadas e feedback acessível por campo. |
| Gerência de Estado | 2,0 | `useState`, Context API e TanStack Query com cache, mutations e Devtools. |
