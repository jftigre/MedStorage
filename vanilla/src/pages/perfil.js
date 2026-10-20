import { obterDadosPerfil } from "../services/authService.js";

const perfil = obterDadosPerfil();

if (!perfil) {
  window.location.replace("login.html");
} else {
  document.querySelector("#perfil-nome").textContent = perfil.nome;
  document.querySelector("#perfil-email").textContent = perfil.email;
  document.querySelector("#perfil-cpf").textContent = perfil.cpf || "Não informado";
  document.querySelector("#perfil-telefone").textContent = perfil.telefone || "Não informado";
}
