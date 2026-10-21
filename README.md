# 💊 MedStorage - Estoque, Validade e Compras de Medicamentos

> Sistema Web para controle pessoal de estoque de medicamentos: saiba o que você
> tem em casa, por quantos dias dura e se vale a pena comprar em promoção antes
> que o remédio vença.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Disciplina](https://img.shields.io/badge/IFPB-Programação_para_Web_2-2E7D32)
![Etapa](https://img.shields.io/badge/etapa-Projeto_1.1_(Front--end_Vanilla)-teal)

🔗 **Veja o sistema no ar:** [jftigre.github.io/MedStorage](https://jftigre.github.io/MedStorage/)

---

## 📌 Sumário
- [Ideia, Objetivo Principal & Público-Alvo](#ideia-objetivo-principal--público-alvo)
- [Tutorial de Instalação e Execução](#-tutorial-de-instalação-e-execução)
- [Tutorial de Navegação e Teste das Funcionalidades](#-tutorial-de-navegação-e-teste-das-funcionalidades)
- [Estrutura Real de Pastas do Repositório](#-estrutura-real-de-pastas-do-repositório)
- [Demonstração dos Critérios de Avaliação (100 Pontos)](#-demonstração-dos-critérios-de-avaliação-100-pontos)
- [Páginas da Aplicação](#-páginas-da-aplicação)
- [Funcionalidades Concluídas (Features)](#-funcionalidades-concluídas-features)
- [Equipe e Fluxo de Trabalho](#equipe)

---

## Ideia, Objetivo Principal & Público-Alvo

- **Ideia & Objetivo:** Centralizar em um único painel o controle de estoque, validade e reposição dos medicamentos de uso contínuo, ajudando o usuário a comprar na hora certa e na quantidade certa.
- **Público-Alvo:**
  - **Pessoas em uso contínuo de medicamentos:** quem toma vários medicamentos todos os dias;
  - **Familiares e cuidadores:** quem ajuda a organizar a rotina de remédios de idosos ou dependentes.
- **Problema:** O controle costuma ser feito de cabeça, em caderno ou em planilha. Quem aproveita promoções e compra grandes quantidades perde o controle de quanto tem, para quantos dias dura e se o remédio vai vencer antes de acabar. O resultado é remédio vencido, dinheiro desperdiçado e risco de interrupção do tratamento.
- **Solução & Valor:** Interface Web simples e acessível (letras grandes, alto contraste, badges semânticos) que calcula automaticamente quantos dias de estoque restam, alerta sobre validades e reposição e permite gerenciar lotes com validades independentes.

> ⚠️ **Aviso:** o MedStorage é uma ferramenta de organização de estoque. Ele **não** oferece orientação médica nem prescreve doses. A posologia é informada pelo próprio usuário, conforme a prescrição médica.

### Pilares do sistema

| Pilar | O que faz |
| ----- | --------- |
| 📦 **Estoque** | Cadastro de medicamentos com posologia, controle por lote (validade, quantidade, preço pago, local de compra e promoção), registro e métricas automáticas. |
| ⏳ **Validade** | Acompanhamento de datas de vencimento por lote e identificação visual de caixas vencendo ou com estoque zerado. |
| 🛒 **Reposição** | Cálculo automatizado de consumo diário, dias restantes e data estimada de término do estoque a partir da posologia informada. |

---

## 🚀 Tutorial de Instalação e Execução

O projeto **1.1 (Front-end Vanilla)** utiliza **Vite** como servidor de desenvolvimento e bundler ESM multi-page.

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior instalada.
- Gerenciador de pacotes `npm`.

### Passo a passo para rodar localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/jftigre/MedStorage.git
   cd MedStorage
   ```

2. **Acesse a pasta do projeto Vanilla:**
   ```bash
   cd vanilla
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   O terminal exibirá o endereço local, tipicamente:
   ```text
   ➜  Local:   http://localhost:5173/
   ```

5. **Acesse no navegador:**
   Abra `http://localhost:5173/` ou `http://localhost:5173/index.html`.

### Comandos disponíveis

| Comando | Finalidade |
| ------- | ---------- |
| `npm run dev` | Inicia o servidor de desenvolvimento com Hot Module Replacement (HMR). |
| `npm run build` | Compila o bundle otimizado de produção na pasta `dist/`. |
| `npm run preview` | Executa localmente o bundle compilado em `dist/` para validação final. |

---

## 🧪 Tutorial de Navegação e Teste das Funcionalidades

Para avaliar todas as capacidades implementadas no front-end Vanilla:

1. **Página Inicial (`index.html`):**
   - Apresenta a visão geral dos pilares e cartões com atalhos diretos para todas as áreas da aplicação.
2. **Listagem Dinâmica de Medicamentos (`medicamentos.html`):**
   - Renderiza os cards de medicamentos no DOM a partir dos dados do `LocalStorage` (incluindo carga inicial automática via `seedData`).
   - Observe as métricas calculadas em tempo real: **Estoque disponível**, **Consumo diário**, **Dias restantes** e **Previsão de término**.
   - Cada card possui badge semântico de status gerado dinamicamente (`Estoque normal`, `Atenção` ou `Sem estoque`).
3. **Cadastro e Edição de Medicamento (`medicamento-form.html`):**
   - **Cálculo reativo de consumo:** Digite unidades por dose e doses por dia para ver o preview do consumo diário atualizar em tempo real.
   - **Validações:** Tente submeter campos vazios ou números negativos para conferir as mensagens de erro em destaque.
   - **Edição:** Na listagem de medicamentos, clique em "Editar" em qualquer remédio para carregar o formulário pré-preenchido e salvar alterações sem duplicar registros.
4. **Cadastro e Gerenciamento de Lotes (UC04):**
   - Na seção **"3. Lotes do Medicamento"**, informe validade, quantidade, preço pago, local da compra e marque se foi adquirido em promoção.
   - Clique em **"Adicionar Lote"**: o lote é inserido imediatamente no DOM na lista `<ul id="lista-lotes">` com formatação brasileira de data e moeda, badge "Promoção" e persistência na chave `medstorage_lotes`.
   - Clique em **"Excluir"** em qualquer lote para removê-lo em tempo real.
5. **Autenticação e Cadastro Local (`cadastro.html` e `login.html`):**
   - Crie uma nova conta em `cadastro.html` com validações de e-mail e senha. Os dados são persistidos na chave `medstorage_usersDB`.
   - Faça login em `login.html` e observe a sessão ativa gravada em `medstorage_usuario`.
6. **Perfil do Usuário (`perfil.html`):**
   - Exibe os dados da sessão atual, permite alterar informações e carregar foto de perfil com conversão para Base64 via `FileReader`.
   - O botão **Logout** encerra a sessão com segurança limpando os dados ativos.

---

## 📁 Estrutura Real de Pastas do Repositório

O projeto adota uma arquitetura modular baseada em responsabilidades claras em `vanilla/src/`:

```text
MedStorage/
├── README.md                           # Documentação central do projeto
├── agents.md                           # Diretrizes e regras técnicas do agente
└── vanilla/                            # PROJETO 1.1 — FRONT-END VANILLA
    ├── package.json                    # Scripts e dependências do Vite
    ├── vite.config.js                  # Configuração multi-page do Vite
    │
    ├── index.html                      # Índice central com atalhos de navegação
    ├── landing.html                    # Página institucional de apresentação
    ├── login.html                      # Página de login
    ├── cadastro.html                   # Página de cadastro de novos usuários
    ├── dashboard.html                  # Painel geral com indicadores
    ├── medicamentos.html               # Listagem dinâmica de medicamentos
    ├── medicamento-form.html           # Cadastro e edição de remédio e lotes
    ├── simulador.html                  # Simulador de compras e economia
    ├── alertas.html                    # Painel de alertas de reposição e validade
    ├── perfil.html                     # Gerenciamento de perfil e foto do usuário
    │
    └── src/
        ├── assets/
        │   └── main.css                # Estilos base e utilitários
        │
        ├── components/                 # Componentes dinâmicos gerados via DOM API
        │   ├── loteItem.js             # Linha de lote com formatação, badge e exclusão
        │   ├── medicamentoCard.js      # Card de medicamento com métricas e badges
        │   ├── navbar.js               # Barra de navegação reutilizável
        │   └── statusBadge.js          # Badge semântico (verde, amarelo, vermelho)
        │
        ├── pages/                      # Scripts de controle específicos de cada tela
        │   ├── cadastro.js             # Validação e submissão de cadastro
        │   ├── login.js                # Validação de credenciais e sessão
        │   ├── logout.js               # Handler global para links com [data-logout]
        │   ├── medicamentoForm.js      # Controle do formulário de remédios e lotes
        │   ├── medicamentos.js         # Montagem da listagem e integração com storage
        │   └── perfil.js               # Edição de perfil e conversão de foto em Base64
        │
        ├── services/                   # Camada de acesso a dados (LocalStorage)
        │   ├── authService.js          # Sessão, cadastro e consulta de usuários
        │   ├── loteService.js          # CRUD e persistência de lotes (medstorage_lotes)
        │   ├── medicamentoService.js   # CRUD de medicamentos (medstorage_medicamentos)
        │   ├── seedData.js             # Carga inicial com dados fictícios de demonstração
        │   └── storageService.js       # Wrapper seguro com try/catch para LocalStorage
        │
        └── utils/                      # Funções puras e utilitários compartilhados
            ├── calculosEstoque.js      # Motor matemático (consumo diário, dias restantes)
            └── dom.js                  # Helper nativo para createElement e appendChild
```

---

## 🎯 Demonstração dos Critérios de Avaliação (100 Pontos)

Esta tabela mapeia diretamente como cada critério da disciplina foi implementado no código-fonte:

| Critério Acadêmico | Pontos | Onde e como está demonstrado no código |
| ------------------ | :----: | -------------------------------------- |
| **Programação Funcional** | **15 pts** | • `Array.reduce()`: soma das quantidades de todos os lotes em [calculosEstoque.js:L7](file:///c:/Users/Tigre/Documents/Developer/MedStorage/vanilla/src/utils/calculosEstoque.js#L7)<br>• `Array.map()`: transformação e enriquecimento de métricas em [calculosEstoque.js:L17](file:///c:/Users/Tigre/Documents/Developer/MedStorage/vanilla/src/utils/calculosEstoque.js#L17) e atualização imutável em [medicamentoService.js:L50](file:///c:/Users/Tigre/Documents/Developer/MedStorage/vanilla/src/services/medicamentoService.js#L50)<br>• `Array.filter()`: busca de lotes vinculados ao medicamento em [loteService.js:L42](file:///c:/Users/Tigre/Documents/Developer/MedStorage/vanilla/src/services/loteService.js#L42), exclusão imutável de lote em [loteService.js:L81](file:///c:/Users/Tigre/Documents/Developer/MedStorage/vanilla/src/services/loteService.js#L81) e associação de lotes em [calculosEstoque.js:L18](file:///c:/Users/Tigre/Documents/Developer/MedStorage/vanilla/src/utils/calculosEstoque.js#L18)<br>• `Array.flatMap()`: unificação de lotes em [medicamentos.js:L10](file:///c:/Users/Tigre/Documents/Developer/MedStorage/vanilla/src/pages/medicamentos.js#L10) e [loteService.js:L13](file:///c:/Users/Tigre/Documents/Developer/MedStorage/vanilla/src/services/loteService.js#L13) |
| **Uso de ESM (ECMAScript Modules)** | **10 pts** | • Arquitetura 100% modular com `import`/`export` nativos em todos os arquivos.<br>• Separação estrita de camadas: UI em `pages/`, componentes dinâmicos em `components/`, acesso a dados em `services/` e cálculos/DOM em `utils/`.<br>• Zero poluição de escopo global. |
| **Estruturação de Dados e Persistência** | **20 pts** | • Camada centralizada de acesso em [storageService.js](file:///c:/Users/Tigre/Documents/Developer/MedStorage/vanilla/src/services/storageService.js) com tratamento seguro de exceções via `try/catch`.<br>• Persistência estruturada em chaves dedicadas: `medstorage_medicamentos`, `medstorage_lotes`, `medstorage_usersDB` e `medstorage_usuario`.<br>• Inicialização inteligente de dados padrão (`seedData.js`) no primeiro acesso. |
| **Manipulação do DOM e Componentes Dinâmicos** | **20 pts** | • Criação declarativa de componentes dinâmicos exclusivamente através da API do DOM (`document.createElement`, `appendChild`, `replaceChildren`) sem frameworks nem `innerHTML`: [medicamentoCard.js](file:///c:/Users/Tigre/Documents/Developer/MedStorage/vanilla/src/components/medicamentoCard.js), [loteItem.js](file:///c:/Users/Tigre/Documents/Developer/MedStorage/vanilla/src/components/loteItem.js) e [statusBadge.js](file:///c:/Users/Tigre/Documents/Developer/MedStorage/vanilla/src/components/statusBadge.js).<br>• CRUD completo: Criação e Edição de Medicamentos + Criação e Exclusão de Lotes vinculados. |
| **Tratamento de Eventos** | **20 pts** | • `submit`: interceptação de formulários com `event.preventDefault()`, validação e feedback contextual em [medicamentoForm.js](file:///c:/Users/Tigre/Documents/Developer/MedStorage/vanilla/src/pages/medicamentoForm.js), [cadastro.js](file:///c:/Users/Tigre/Documents/Developer/MedStorage/vanilla/src/pages/cadastro.js) e [login.js](file:///c:/Users/Tigre/Documents/Developer/MedStorage/vanilla/src/pages/login.js).<br>• `input`: atualização reativa do preview de consumo diário em tempo real e remoção dinâmica de alertas de erro.<br>• `click`: seleção interativa de formas farmacêuticas, exclusão de lotes vinculados e logout em [logout.js](file:///c:/Users/Tigre/Documents/Developer/MedStorage/vanilla/src/pages/logout.js).<br>• `change`: upload e leitura assíncrona de imagem de perfil com `FileReader` em [perfil.js](file:///c:/Users/Tigre/Documents/Developer/MedStorage/vanilla/src/pages/perfil.js). |
| **Uso do Vite (Template Vanilla)** | **15 pts** | • Configuração multi-page estruturada em [vite.config.js](file:///c:/Users/Tigre/Documents/Developer/MedStorage/vanilla/vite.config.js) gerenciando as 10 páginas da aplicação.<br>• Código limpo sem arquivos residuais do template inicial (`main.js`, `counter.js`, `style.css` removidos).<br>• Servidor com Hot Module Replacement (HMR) e compilação de produção com `npm run build`. |

---

## 🌐 Páginas da Aplicação

| Página | Arquivo | Finalidade |
| ------ | ------- | ---------- |
| 🏠 **Home / Início** | `index.html` | Portal de acesso rápido e apresentação dos pilares |
| 📄 **Apresentação** | `landing.html` | Apresentação institucional da proposta de valor |
| 🔑 **Login** | `login.html` | Autenticação local de usuários |
| 📝 **Cadastro** | `cadastro.html` | Registro de novos usuários com validação completa |
| 📊 **Dashboard** | `dashboard.html` | Visão geral dos estoques e alertas |
| 💊 **Medicamentos** | `medicamentos.html` | Listagem dinâmica gerada no DOM com métricas calculadas |
| ➕ **Formulário** | `medicamento-form.html` | Cadastro e edição de medicamentos com posologia e lotes |
| 🛒 **Simulador** | `simulador.html` | Análise de economia e compras em promoção |
| 🔔 **Alertas** | `alertas.html` | Monitoramento de prazos de validade e reposição |
| 👤 **Perfil** | `perfil.html` | Gestão de dados pessoais e foto de perfil |

---

## ✨ Funcionalidades Concluídas (Features)

### Etapa inicial (interface e design system)
- [x] Telas responsivas em HTML5 e Tailwind CSS para desktop e dispositivos móveis
- [x] Portal `index.html` com navegação centralizada para todas as áreas
- [x] Identidade visual consistente com paleta médica em tons de teal
- [x] Acessibilidade com botões amplos, alto contraste e suporte a leitor de tela
- [x] Badges semânticos de status padronizados (Verde, Âmbar e Vermelho)

### Projeto 1.1 (Front-end Vanilla)
- [x] CRUD de medicamentos com posologia e persistência no `LocalStorage`
- [x] Cadastro de lotes vinculados por `medicamento_id` com validade, quantidade, preço e marcação de promoção (UC04)
- [x] Exclusão dinâmica de lotes vinculados em tempo real no DOM
- [x] Cálculo automático de consumo diário, dias restantes e previsão de término (`map` e `reduce`)
- [x] Renderização de componentes via DOM nativo (`document.createElement` e `appendChild`)
- [x] Autenticação local, sessão ativa, edição de perfil e logout
- [x] Validação em tempo real de formulários com feedback de erro acessível
- [x] Organização arquitetural modular com ESM e Vite multi-page

---

## Equipe

- **Felipe Santos de Oliveira Flôr** — [202614320032] | [GitHub](https://github.com/FelipeBlossom) | [LinkedIn](https://www.linkedin.com/in/felipe-flor-oliveira/)
- **João Felipe Fiari Tigre** — [202614320025] | [GitHub](https://github.com/jftigre) | [LinkedIn](https://www.linkedin.com/in/joaofelipefiaritigre/)
- **Lucas Francelino de Pontes** — [202614320011] | [GitHub](https://github.com/Lucasfrancelinopontes) | [LinkedIn](https://www.linkedin.com/in/lucas-francelino-pontes)
- **Pedro Gomes de Andrade Neto** — [202614320033] | [GitHub](https://github.com/pedro-g-neto) | [LinkedIn](https://www.linkedin.com/in/pedrogneto)
- **Theo Nogueira Virginio** — [202614320013] | [GitHub](https://github.com/jftigre/MedStorage) | [LinkedIn](https://www.linkedin.com/)

---

## Fluxo de Trabalho e Metodologia

- **Quadro Kanban:** Acompanhamento das tarefas no [GitHub Projects](https://github.com/users/jftigre/projects/2).
- **Rastreabilidade:** Commits e Pull Requests associados a issues com critérios de aceitação específicos.
- **Git Flow:** Ramificações por funcionalidade a partir da branch `develop`.
