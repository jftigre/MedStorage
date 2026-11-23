MedStorage — Diretrizes para agentes de desenvolvimento
Etapa atual: Projeto 1.2 — migração do Front-end Vanilla para React com Next.js.
Estas instruções substituem as diretrizes do Projeto 1.1. O código em vanilla/ é a implementação de referência e deve permanecer preservado durante a migração.

1. Papel e objetivo
Atue como engenheiro(a) de software responsável por evoluir o MedStorage, uma aplicação web para organização pessoal de medicamentos, posologia informada pelo usuário, estoque por lote, validade, alertas e planejamento de reposição.

O objetivo desta etapa é migrar a aplicação atual para Next.js com App Router, React e TypeScript, mantendo as funcionalidades que já existem, melhorando a organização e atendendo aos critérios acadêmicos do Projeto 1.2.

Prioridades, nesta ordem:
1. Preservar os fluxos e regras de negócio que realmente existem no projeto.
2. Construir uma arquitetura clara, modular, tipada e fácil de demonstrar na avaliação.
3. Entregar uma interface consistente, responsiva e acessível.
4. Demonstrar formulários com React Hook Form, Zod e RegExp.
5. Demonstrar estado local/global e estado de dados com React e TanStack Query.
6. Deixar a camada de persistência substituível no futuro, sem antecipar a integração remota.
2. Escopo desta etapa — atenção
Permitido e esperado
- Migrar as telas e os componentes existentes para React.
- Usar Next.js App Router e TypeScript em modo estrito.
- Usar Tailwind CSS e, quando trouxer benefício real, shadcn/ui.
- Implementar formulários com React Hook Form, Zod e expressões regulares.
- Usar useState para estado local de interface.
- Usar Context API para estado global de autenticação/sessão simulada, ou Zustand caso haja justificativa clara. Não crie dois gerenciadores globais para o mesmo estado.
- Usar TanStack Query para consultas, mutations, cache, loading/error states e invalidação dos dados acessados pela camada de serviços local.
- Manter persistência temporária no navegador por meio de um adaptador de LocalStorage.
- Criar interfaces/contratos para que os serviços possam ser substituídos por uma implementação remota futuramente.
Proibido nesta etapa
Não integrar Supabase ainda. Não instalar nem importar @supabase/supabase-js, @supabase/ssr ou bibliotecas equivalentes. Não criar cliente Supabase, variáveis NEXT_PUBLIC_SUPABASE_*, migrations SQL, tabelas, políticas RLS, buckets ou fluxos de autenticação Supabase.

Não simular que o LocalStorage é um back-end seguro. A autenticação atual é apenas uma demonstração local de interface e fluxo. A proteção de páginas nessa fase é client-side e não deve ser descrita como segurança de produção.

Não remover a pasta vanilla/, nem sobrescrever os arquivos HTML/JS legados, antes de a versão React compilar e os fluxos migrados terem sido verificados.
3. Diagnóstico do legado e fonte de verdade
O repositório recebido contém a aplicação anterior em vanilla/, com Vite multi-page, HTML, Tailwind via CDN, JavaScript ESM e LocalStorage.
Telas que devem ser preservadas
Tela legada	Rota proposta no Next.js	Observação
index.html	/	Portal inicial com atalhos para as áreas do sistema.
landing.html	/apresentacao	Apresentação institucional do produto e da equipe.
login.html	/login	Login local de demonstração.
cadastro.html	/cadastro	Cadastro local de demonstração.
dashboard.html	/dashboard	Indicadores, saudação, avatar, reposição e lotes próximos do vencimento.
medicamentos.html	/medicamentos	Listagem, métricas, status e exclusão de medicamentos.
medicamento-form.html	/medicamentos/novo e /medicamentos/[id]/editar	Cadastro/edição e gerenciamento de lotes.
simulador.html	/simulador	Tela existente; a lógica funcional precisa ser auditada e concluída, não presumida.
alertas.html	/alertas	Tela existente; a lógica funcional precisa ser auditada e ligada aos dados reais.
perfil.html	/perfil	Dados de perfil, foto, atualização e logout.
403.html	/acesso-negado	Tela de acesso negado.


As rotas podem ser organizadas com route groups do App Router, sem que o nome dos grupos apareça na URL. Mantenha / como o portal de index.html; não o substitua silenciosamente pela landing page.
Funcionalidades com lógica identificada no código legado
- Cadastro, login e logout locais.
- Consulta e atualização de perfil, incluindo foto em Base64 com limite de tamanho no formulário legado.
- CRUD de medicamentos.
- Criação e exclusão de lotes vinculados a medicamentos.
- Associação de lotes por medicamento_id.
- Cálculo de consumo diário, estoque total, dias restantes e previsão de término.
- Dashboard com total de medicamentos, itens em estoque crítico e lotes vencidos ou com validade em até 30 dias.
- Preview reativo de consumo diário no formulário de medicamento.
- Validações básicas e mensagens de feedback nos formulários.
- Controles visuais de acessibilidade presentes no legado, como ajuste de fonte/tema em algumas telas.
Limitações e divergências que não podem ser escondidas
- alertas.html e simulador.html não possuem módulos de página próprios para executar a lógica principal; no estado recebido, carregam essencialmente a interface estática e o handler global de logout. Não os descreva como funcionalidades completas antes de implementá-los e testá-los.
- A documentação antiga de agents.md menciona FEFO, alertas em 30/60/90 dias e cálculo de risco de desperdício. Essas regras são requisitos documentados no legado, mas não foram encontradas implementadas no motor calculosEstoque.js recebido. Antes de afirmar que já existem, compare a tela, o código e os requisitos; implemente apenas com regra explicitada e teste correspondente. O dashboard atual, por sua vez, usa limite de 30 dias para a lista de lotes vencidos/a vencer.
- O LocalStorage antigo guarda credenciais locais; isso não é autenticação segura. Não copie senhas em texto puro para a nova estrutura nem apresente o mecanismo como pronto para produção. Se o fluxo de demonstração exigir credenciais persistidas localmente, isole esse comportamento em um adaptador explicitamente demo-only, documente a limitação e não reutilize esse mecanismo quando o Supabase for integrado.
- O legado possui lotes tanto aninhados nos dados iniciais de medicamentos quanto em uma chave separada. A migração deve deduplicar por id e preservar medicamento_id, validade e quantidade.
Em caso de conflito entre o comportamento observado no código, uma descrição antiga e uma nova solicitação, não invente uma resolução silenciosa. Registre a divergência e adote o requisito mais recente explicitamente solicitado pelo responsável pelo projeto.
4. Stack obrigatória e padrões técnicos
- Next.js: App Router; não usar Pages Router.
- React: componentes funcionais e composição.
- TypeScript: strict: true; evitar any. Tipar entidades, parâmetros, retornos, formulários e props.
- Estilização: Tailwind CSS. shadcn/ui pode ser usado para componentes acessíveis e reutilizáveis, sem transformar tudo em abstrações desnecessárias.
- Formulários: React Hook Form + Zod + @hookform/resolvers.
- Estado de interface: useState e, quando necessário, Context API.
- Estado de dados: TanStack Query (useQuery, useMutation, query keys e invalidação).
- Persistência da fase atual: adaptador client-side de LocalStorage, acessado somente no navegador.
- Ícones: preferir Lucide/shadcn quando aplicável. Evitar misturar bibliotecas sem necessidade.
Use versões estáveis e mutuamente compatíveis no momento da implementação. Não force versões antigas só para seguir exemplos de tutoriais. Registre as dependências realmente utilizadas no package.json.
5. Arquitetura e organização esperadas
A nova aplicação Next.js deve ser criada na raiz do repositório, e não dentro de vanilla/. Uma estrutura de referência:
MedStorage/
├── agents.md
├── README.md
├── PROMPT_MIGRACAO_VANILLA_PARA_REACT.md
├── package.json
├── next.config.*
├── tsconfig.json
├── public/
│   └── ...                         # favicon e assets públicos migrados
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── providers.tsx
│   │   ├── page.tsx                # portal inicial
│   │   ├── (public)/
│   │   │   ├── apresentacao/page.tsx
│   │   │   ├── login/page.tsx
│   │   │   └── cadastro/page.tsx
│   │   ├── (protected)/
│   │   │   ├── layout.tsx          # layout protegido client-side nesta fase
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── medicamentos/page.tsx
│   │   │   ├── medicamentos/novo/page.tsx
│   │   │   ├── medicamentos/[id]/editar/page.tsx
│   │   │   ├── simulador/page.tsx
│   │   │   ├── alertas/page.tsx
│   │   │   └── perfil/page.tsx
│   │   └── acesso-negado/page.tsx
│   ├── components/
│   │   ├── ui/                      # componentes base/shadcn
│   │   ├── layout/                  # header, sidebar, navegação
│   │   ├── feedback/                # alertas, estados vazios, loading
│   │   ├── medicamentos/            # cards, formulários, badges
│   │   ├── lotes/                   # formulário e itens de lote
│   │   └── dashboard/               # cards e listas de indicadores
│   ├── contexts/
│   │   └── auth-context.tsx
│   ├── hooks/
│   │   ├── queries/
│   │   └── ...
│   ├── lib/
│   │   ├── query-client.ts
│   │   └── utils.ts
│   ├── schemas/                     # schemas Zod e RegExp compartilhadas
│   ├── services/
│   │   ├── auth/
│   │   ├── medicamentos/
│   │   ├── lotes/
│   │   └── persistence/             # contrato + adaptador LocalStorage
│   ├── types/
│   └── utils/                       # cálculos puros, datas e formatação
├── vanilla/                         # legado preservado como referência
└── ...
A estrutura final pode variar quando houver motivo técnico, mas deve manter responsabilidades separadas. Não concentre páginas, schemas, acesso a dados e regras de negócio em um único arquivo.
Responsabilidades
- app/: rotas, layouts e composição de páginas. Server Components por padrão.
- components/: elementos visuais reutilizáveis, sem acesso direto ao LocalStorage.
- contexts/: estado realmente global, especialmente sessão simulada e perfil resumido.
- hooks/: integração reutilizável de componentes com Context e TanStack Query.
- schemas/: validações Zod e expressões regulares nomeadas.
- services/: casos de uso e acesso a dados; componentes não manipulam chaves de armazenamento diretamente.
- types/: contratos TypeScript de entidades e DTOs.
- utils/: funções puras, especialmente cálculos de estoque, datas e formatação.
6. Modelo de dados e compatibilidade com o legado
Preserve os conceitos e nomes de campos existentes, salvo necessidade justificada e documentada.
Medicamento
interface Medicamento {
  id: string;
  usuario_id: string;
  nome: string;
  dosagem: string;
  forma: string;
  finalidade?: string;
  comprimidos_por_dose: number;
  doses_por_dia: number;
  estoque_minimo_dias: number;
  criado_em: string;
}
Lote
interface Lote {
  id: string;
  medicamento_id: string;
  validade: string; // ISO YYYY-MM-DD
  quantidade: number;
  preco_pago: number;
  local_compra: string;
  em_promocao: boolean;
  criado_em?: string;
}
Usuário e sessão
Preserve os campos funcionais de perfil: id, nome, cpf, email, telefone, telefoneCuidador e fotoBase64, quando presentes. Separe o objeto público de perfil dos dados privados usados somente pelo adaptador de autenticação de demonstração. Não exponha senha em props, logs ou estado global.
Chaves legadas de LocalStorage
- medstorage_medicamentos
- medstorage_lotes
- medstorage_usersDB
- medstorage_usuario
Crie um único ponto de acesso ao armazenamento. Não espalhe localStorage.getItem() e localStorage.setItem() pelos componentes.

A camada de compatibilidade deve:
1. Ser executada somente no cliente, depois da hidratação.
2. Tratar JSON inválido, chave ausente e falha de quota/armazenamento.
3. Preservar identificadores e vínculos dos registros existentes.
4. Normalizar lotes aninhados e lotes da chave independente, deduplicando por ID.
5. Inicializar os dados de demonstração uma única vez, sem sobrescrever dados reais já presentes no navegador.
6. Não apagar as chaves antigas até confirmar a migração e oferecer comportamento seguro em caso de falha.
7. Regras de negócio conhecidas
Centralize as regras em funções puras e reutilizáveis. Não replique os cálculos em componentes.
- Consumo diário: comprimidos_por_dose × doses_por_dia.
- Estoque total: soma de quantidade dos lotes vinculados ao medicamento.
- Dias restantes: Math.floor(estoqueTotal / consumoDiario), quando o consumo diário for maior que zero.
- Previsão de término: data atual acrescida dos dias restantes.
- Estoque crítico: medicamento cujo diasRestantes <= estoque_minimo_dias.
- Dashboard legado: considera lotes cuja validade já passou ou vence em até 30 dias.
As regras FEFO e risco de desperdício descritas na documentação antiga devem ser tratadas como regras documentadas a validar/implementar, e não como comportamento que já existe no código. Para cada regra adicional implementada, escreva testes de casos normais, limites e dados inválidos.

O MedStorage é ferramenta de organização de estoque. Não deve recomendar doses, alterar posologia, orientar tratamentos ou sugerir condutas médicas. A posologia é informada pelo usuário conforme orientação profissional externa.
8. Formulários e validação — critério acadêmico
Use React Hook Form integrado a Zod por zodResolver. Os formulários principais incluem:
- Cadastro de usuário.
- Login local de demonstração.
- Edição de perfil.
- Cadastro e edição de medicamento.
- Adição de lote.
Crie schemas reutilizáveis e mensagens em português. Use RegExp nomeadas para validações de formato, por exemplo e-mail, telefone e apresentação do CPF. Uma RegExp de CPF verifica apenas formato; se a aplicação validar os dígitos verificadores, implemente essa regra separadamente e teste-a.

Regras mínimas existentes a preservar:
- Nome e dosagem do medicamento obrigatórios.
- comprimidos_por_dose > 0.
- doses_por_dia > 0.
- estoque_minimo_dias > 0.
- Lote com validade válida, quantidade maior que zero e preço maior ou igual a zero.
- E-mail em formato válido.
- Senha com no mínimo seis caracteres, no fluxo local legado.
- Confirmação de senha igual à senha no cadastro.
Exiba erros junto aos campos, associe mensagens com aria-describedby, marque campos inválidos e apresente feedback de sucesso/erro. Não dependa exclusivamente de alert() ou validação HTML nativa.
9. Gerência de estado
Demonstre claramente a finalidade de cada ferramenta:
- useState: estado efêmero de interface, como modal aberto, campo de busca, filtro selecionado, aba ativa e preview de consumo.
- Context API: sessão e dados mínimos do usuário autenticado localmente. O provider deve ter tipo explícito e estado de hidratação para impedir redirecionamentos prematuros.
- TanStack Query: dados de medicamentos e lotes, consultas, mutations, cache e sincronização com os serviços locais. Centralize query keys; invalide as queries correspondentes após cada mutation.
Não mantenha cópias desnecessárias dos mesmos dados em useState, Context e TanStack Query. O estado remoto/local persistido deve ter uma fonte principal.

Configure QueryClientProvider em um provider client-side importado pelo layout raiz. Defina estados de carregamento, erro e vazio nas telas.
10. Autenticação demonstrativa e proteção de rotas
Nesta etapa, implemente apenas o fluxo local necessário para navegar e demonstrar a interface. Isole o mecanismo atrás de um contrato de serviço/adaptador que possa ser substituído depois.
- Rotas privadas: dashboard, medicamentos, formulário, simulador, alertas e perfil.
- Rotas públicas: portal, apresentação, login e cadastro.
- Sem sessão local: encaminhar para /login após verificar a hidratação do provider.
- Com sessão: login/cadastro não devem manter o usuário preso à tela pública; encaminhar conforme a navegação do produto.
- Logout: limpar a sessão local e invalidar/limpar dados de usuário do cache.
Como a sessão nesta fase reside no navegador, o guard deve ser client-side. Não crie um middleware.ts que tente ler LocalStorage no servidor. Documente que isso não é proteção de segurança real. A futura autenticação Supabase deverá substituir o adaptador local e introduzir validação de sessão baseada em cookies/servidor.
11. Interface, identidade visual e acessibilidade
Mantenha a identidade visual do MedStorage existente:
- Paleta principal teal/verde-petróleo, fundos claros e badges semânticos.
- Fontes Epilogue para títulos e Lexend para textos, com fallback adequado.
- Cartões com hierarquia clara, espaços generosos, bordas suaves e estados bem definidos.
- Tipografia legível, botões com área de toque adequada e contraste suficiente.
- Layout desktop e mobile; navegação adaptada para telas pequenas.
- Estados de loading, erro, vazio e sucesso.
Reutilize os elementos visuais do legado como referência, mas converta-os para componentes React declarativos. Não transportar a lógica antiga de manipulação manual do DOM (createElement, appendChild, replaceChildren) para React. Não usar document.querySelector para controlar a interface, innerHTML ou dangerouslySetInnerHTML.

Use HTML semântico, foco visível, navegação por teclado, labels associadas, texto alternativo e atributos ARIA apenas quando necessários. Não remova funcionalidades de acessibilidade que já existem sem substituição equivalente.
12. Qualidade, testes e critérios de conclusão
Antes de considerar uma parte concluída:
- Rode npm run build e corrija erros.
- Rode lint e typecheck, caso os scripts estejam configurados.
- Teste cálculos de consumo/estoque e schemas de validação.
- Teste CRUD de medicamentos e lotes, incluindo edição, exclusão e vínculos.
- Teste persistência após atualizar a página e comportamento com armazenamento vazio/dados inválidos.
- Teste login, cadastro, logout e redirecionamento das rotas privadas no modo de demonstração.
- Verifique as telas em larguras mobile e desktop.
- Verifique os estados de loading, vazio, erro e sucesso.
Mantenha funções de cálculo puras. Para funções críticas, use testes unitários (por exemplo, Vitest) e, para formulários/componentes, React Testing Library quando fizer sentido.
Critérios acadêmicos que a implementação deve tornar demonstráveis
Critério	Evidência esperada
Arquitetura (20 pts)	App Router, TypeScript estrito, pastas e responsabilidades separadas.
Supabase (20 pts)	Fora do escopo desta migração. Documentar como pendência da etapa seguinte; não declarar este critério concluído.
Componentes/UI (20 pts)	Componentes React reutilizáveis, Tailwind/shadcn e responsividade.
Formulários (20 pts)	React Hook Form, Zod, RegExp e feedback de validação.
Estado (20 pts)	useState, Context API e TanStack Query com cache e mutations.


13. Documentação e forma de trabalho
- Atualize o README.md para descrever a versão Next.js somente depois que ela estiver funcional. Mantenha uma seção clara sobre o legado vanilla/ e sobre a ausência de Supabase nesta fase.
- Documente instalação, execução, estrutura de pastas, rotas, persistência local, dados de demonstração e limitações de segurança.
- Não invente resultados, testes executados ou funcionalidades concluídas.
- Trabalhe em etapas pequenas e verificáveis. Prefira mudanças coesas e não misture migração visual com alterações de regra de negócio sem necessidade.
- Não altere nomes de campos ou contratos de dados sem registrar a razão e como a compatibilidade será mantida.
- Não faça commit, push, publicação ou deploy sem solicitação explícita.
14. Regra final
Preserve o que funciona, identifique o que é apenas visual, tipifique as regras, separe as responsabilidades e não integre Supabase nesta etapa.