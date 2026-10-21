import { obterDadosPerfil } from "../services/authService.js";

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
