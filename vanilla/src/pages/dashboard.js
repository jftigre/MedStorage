import { obterDadosPerfil } from "../services/authService.js";
import { listarMedicamentos } from "../services/medicamentoService.js";
import { initLotesStorage, listarTodosLotes } from "../services/loteService.js";
import { enriquecerMedicamentosComMetricas } from "../utils/calculosEstoque.js";
import { initStorage } from "../services/storageService.js";

function obterElementoObrigatorio(id) {
  const elemento = document.getElementById(id);

  if (!elemento) {
    throw new Error(`Não foi possível localizar o elemento #${id} da dashboard.`);
  }

  return elemento;
}

function renderizarAvatar(conteiner, perfil, nomeUsuario) {
  if (typeof perfil.fotoBase64 === "string" && perfil.fotoBase64) {
    const imagem = document.createElement("img");
    imagem.src = perfil.fotoBase64;
    imagem.alt = `Foto do perfil de ${nomeUsuario}`;
    imagem.className = "h-full w-full rounded-full object-cover";
    conteiner.replaceChildren(imagem);
    return;
  }

  const iniciais = document.createElement("div");
  iniciais.className = "flex h-full w-full items-center justify-center rounded-full bg-teal-100 text-lg font-semibold text-teal-800";
  iniciais.textContent = nomeUsuario.charAt(0).toLocaleUpperCase("pt-BR");
  iniciais.setAttribute("role", "img");
  iniciais.setAttribute("aria-label", `Avatar de ${nomeUsuario}`);
  conteiner.replaceChildren(iniciais);
}

function renderizarListaReposicao(listaCritica) {
  const lista = obterElementoObrigatorio("lista-reposicao");
  lista.replaceChildren();

  if (listaCritica.length === 0) {
    const itemVazio = document.createElement("li");
    itemVazio.classList.add("rounded-md", "border", "border-teal-100", "bg-teal-50", "p-3", "text-sm", "text-teal-800");
    itemVazio.textContent = "Estoque seguro: nenhum medicamento precisa de reposição.";
    lista.appendChild(itemVazio);
    return;
  }

  // Uso de map e da API nativa do DOM para criar cards sem innerHTML.
  const itens = listaCritica.map((medicamento) => {
    const item = document.createElement("li");
    item.classList.add("rounded-md", "border", "border-amber-200", "bg-amber-50", "p-3");

    const nome = document.createElement("span");
    nome.classList.add("block", "font-semibold", "text-ink");
    nome.textContent = medicamento.nome;

    const diasRestantes = document.createElement("span");
    diasRestantes.classList.add("mt-1", "block", "text-sm", "text-slate-700");
    diasRestantes.textContent = `Restam ${medicamento.diasRestantes} dias`;

    item.appendChild(nome);
    item.appendChild(diasRestantes);
    return item;
  });

  itens.forEach((item) => lista.appendChild(item));
}

function formatarDataValidade(data) {
  const [ano, mes, dia] = String(data).split("-");
  return ano && mes && dia ? `${dia}/${mes}/${ano}` : "Data não informada";
}

function renderizarListaVencimentos(lotesVencendo, medicamentos) {
  const lista = obterElementoObrigatorio("lista-vencimentos");
  lista.replaceChildren();

  if (lotesVencendo.length === 0) {
    const itemVazio = document.createElement("li");
    itemVazio.classList.add("rounded-md", "border", "border-teal-100", "bg-teal-50", "p-3", "text-sm", "text-teal-800");
    itemVazio.textContent = "Nenhum lote vencendo nos próximos 30 dias.";
    lista.appendChild(itemVazio);
    return;
  }

  const itens = lotesVencendo.map((lote) => {
    const item = document.createElement("li");
    item.classList.add("rounded-md", "border", "border-rose-200", "bg-rose-50", "p-3");

    const medicamento = medicamentos.find((itemMedicamento) => itemMedicamento.id === lote.medicamento_id);
    const nome = document.createElement("span");
    nome.classList.add("block", "font-semibold", "text-ink");
    nome.textContent = medicamento ? medicamento.nome : "Medicamento";

    const validade = document.createElement("span");
    validade.classList.add("mt-1", "block", "text-sm", "text-slate-700");
    validade.textContent = `Validade: ${formatarDataValidade(lote.validade)} · Quantidade: ${lote.quantidade}`;

    item.appendChild(nome);
    item.appendChild(validade);
    return item;
  });

  itens.forEach((item) => lista.appendChild(item));
}

function carregarIndicadoresEAlertas() {
  initStorage();
  initLotesStorage();

  const medicamentos = listarMedicamentos();
  const lotes = listarTodosLotes();
  const dadosEnriquecidos = enriquecerMedicamentosComMetricas(medicamentos, lotes);

  // Uso de filter para identificar medicamentos abaixo do estoque mínimo.
  const listaCritica = dadosEnriquecidos.filter(
    (medicamento) => medicamento.diasRestantes <= medicamento.estoque_minimo_dias
  );
  const dataLimite = new Date();
  dataLimite.setDate(dataLimite.getDate() + 30);
  // Uso de filter para localizar lotes vencidos ou que vencem em até 30 dias.
  const lotesVencendo = lotes.filter((lote) => {
    const validade = new Date(`${lote.validade}T00:00:00`);
    return Number.isFinite(validade.getTime()) && validade <= dataLimite;
  });

  obterElementoObrigatorio("total-medicamentos").textContent = dadosEnriquecidos.length;
  obterElementoObrigatorio("estoque-critico").textContent = listaCritica.length;
  obterElementoObrigatorio("lotes-vencendo").textContent = lotesVencendo.length;

  renderizarListaReposicao(listaCritica);
  renderizarListaVencimentos(lotesVencendo, medicamentos);
}

const perfil = obterDadosPerfil();

if (!perfil) {
  window.location.replace("login.html");
} else {
  const nomeCompleto = typeof perfil.nome === "string" ? perfil.nome.trim() : "";

  if (!nomeCompleto) {
    throw new Error("O perfil da sessão não possui um nome válido.");
  }

  const nomeUsuario = nomeCompleto.split(/\s+/)[0];
  const horaAtual = new Date().getHours();
  const saudacao = horaAtual < 12
    ? "Bom dia"
    : horaAtual < 18
      ? "Boa tarde"
      : "Boa noite";

  obterElementoObrigatorio("saudacao-usuario").textContent = `${saudacao}, ${nomeUsuario}!`;
  renderizarAvatar(obterElementoObrigatorio("navbar-avatar"), perfil, nomeUsuario);
  renderizarAvatar(obterElementoObrigatorio("header-avatar"), perfil, nomeUsuario);
}

if (perfil) {
  carregarIndicadoresEAlertas();
}


function AjusteFonte() {
  const botaoDiminuir = document.getElementById("diminuir-fonte");
  const botaoAumentar = document.getElementById("aumentar-fonte");

  if (!botaoDiminuir || !botaoAumentar) {
    return;
  }

  // Tamanho mínimo e máximo definidos para limitar a mudança
  const tamanhoInicial = 16;
  const tamanhoMinimo = 12;
  const tamanhoMaximo = 24;
  const incremento = 2;

  let tamanhoFonte = tamanhoInicial;

  function aplicarTamanhoFonte() {
    document.documentElement.style.fontSize = `${tamanhoFonte}px`;
  }

  botaoDiminuir.addEventListener("click", () => {
    tamanhoFonte = Math.max(
      tamanhoMinimo,
      tamanhoFonte - incremento
    );

    aplicarTamanhoFonte();
  });

  botaoAumentar.addEventListener("click", () => {
    tamanhoFonte = Math.min(
      tamanhoMaximo,
      tamanhoFonte + incremento
    );

    aplicarTamanhoFonte();
  });

  aplicarTamanhoFonte();
}

AjusteFonte();

function AjusteTema() {
  const botaoTema = document.getElementById("botao-tema");

  if (!botaoTema) {
    return;
  }

  const htmlElement = document.documentElement;
  const CHAVE_TEMA = "medstorage_tema";

  function aplicarTema(ehEscuro) {
    const icone = botaoTema.querySelector(".material-symbols-outlined");

    if (ehEscuro) {
      htmlElement.classList.add("dark");
      if (icone) icone.textContent = "light_mode";
      botaoTema.setAttribute("title", "Mudar para o tema claro");
    } else {
      htmlElement.classList.remove("dark");
      if (icone) icone.textContent = "contrast";
      botaoTema.setAttribute("title", "Mudar para o tema escuro");
    }
  }

  // Obter tema salvo para já iniciar com escuro se tiver alterado
  const temaSalvo = localStorage.getItem(CHAVE_TEMA);
  const prefereEscuroSistema = window.matchMedia("(prefers-color-scheme: dark)").matches;
  
  const estaEscuro = temaSalvo ? temaSalvo === "dark" : prefereEscuroSistema;
  aplicarTema(estaEscuro);

  botaoTema.addEventListener("click", () => {
    const escuroAtual = htmlElement.classList.contains("dark");
    const novoEstadoEscuro = !escuroAtual;

    aplicarTema(novoEstadoEscuro);
    localStorage.setItem(CHAVE_STORAGE_TEMA, novoEstadoEscuro ? "dark" : "light");
  });
}

AjusteTema();