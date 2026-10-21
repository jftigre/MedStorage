import { atualizarPerfil, obterDadosPerfil } from "../services/authService.js";

const formulario = document.querySelector("#perfil-form");
const campoFoto = document.querySelector("#foto-perfil");
const imagemPerfil = document.querySelector("#imagem-perfil");
const mensagemFeedback = document.querySelector("#mensagem-feedback");
let fotoBase64;
let leituraFotoPendente = false;

const campos = {
  nome: document.querySelector("#perfil-nome"),
  email: document.querySelector("#perfil-email"),
  cpf: document.querySelector("#perfil-cpf"),
  telefone: document.querySelector("#perfil-telefone"),
  telefoneCuidador: document.querySelector("#perfil-telefone-cuidador"),
  senhaAtual: document.querySelector("#senha-atual"),
  novaSenha: document.querySelector("#nova-senha")
};

function exibirFeedback(mensagem, tipo) {
  mensagemFeedback.textContent = mensagem;
  mensagemFeedback.className = tipo === "sucesso"
    ? "rounded-md bg-green-50 px-4 py-3 text-sm font-medium text-green-800"
    : "rounded-md bg-red-50 px-4 py-3 text-sm font-medium text-red-800";
}

function limparFeedback() {
  mensagemFeedback.textContent = "";
  mensagemFeedback.className = "hidden";
}

const perfil = obterDadosPerfil();

if (!perfil) {
  window.location.replace("login.html");
} else {
  campos.nome.value = perfil.nome;
  campos.email.value = perfil.email;
  campos.cpf.value = perfil.cpf || "Não informado";
  campos.telefone.value = perfil.telefone;
  campos.telefoneCuidador.value = perfil.telefoneCuidador;
  fotoBase64 = perfil.fotoBase64;

  if (fotoBase64) {
    imagemPerfil.src = fotoBase64;
  }

  campoFoto.addEventListener("change", () => {
    limparFeedback();
    const arquivo = campoFoto.files?.[0];

    if (!arquivo) {
      return;
    }

    if (!arquivo.type.startsWith("image/")) {
      campoFoto.value = "";
      exibirFeedback("Selecione um arquivo de imagem válido.", "erro");
      return;
    }

    if (arquivo.size >= 1024 * 1024) {
      campoFoto.value = "";
      exibirFeedback("A imagem deve ter menos de 1 MB.", "erro");
      return;
    }

    const leitor = new FileReader();
    leitor.addEventListener("load", () => {
      leituraFotoPendente = false;
      if (typeof leitor.result !== "string") {
        exibirFeedback("Não foi possível carregar a imagem selecionada.", "erro");
        return;
      }

      fotoBase64 = leitor.result;
      imagemPerfil.src = fotoBase64;
    });
    leitor.addEventListener("error", () => {
      leituraFotoPendente = false;
      exibirFeedback("Não foi possível ler a imagem selecionada.", "erro");
    });
    leituraFotoPendente = true;
    leitor.readAsDataURL(arquivo);
  });

  formulario.addEventListener("submit", (event) => {
    event.preventDefault();
    limparFeedback();

    if (leituraFotoPendente) {
      exibirFeedback("Aguarde o carregamento da foto antes de salvar.", "erro");
      return;
    }

    const dadosAtualizados = {
      nome: campos.nome.value.trim(),
      email: campos.email.value.trim(),
      telefone: campos.telefone.value.trim(),
      telefoneCuidador: campos.telefoneCuidador.value.trim(),
      novaSenha: campos.novaSenha.value,
      fotoBase64
    };
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dadosAtualizados.email);

    if (!dadosAtualizados.nome) {
      exibirFeedback("Informe seu nome.", "erro");
      campos.nome.focus();
      return;
    }

    if (!emailValido) {
      exibirFeedback("Digite um e-mail válido.", "erro");
      campos.email.focus();
      return;
    }

    if (!campos.senhaAtual.value) {
      exibirFeedback("Informe sua senha atual para confirmar as alterações.", "erro");
      campos.senhaAtual.focus();
      return;
    }

    if (dadosAtualizados.novaSenha && dadosAtualizados.novaSenha.length < 6) {
      exibirFeedback("A nova senha deve ter no mínimo 6 caracteres.", "erro");
      campos.novaSenha.focus();
      return;
    }

    try {
      atualizarPerfil(dadosAtualizados, campos.senhaAtual.value);
      campos.senhaAtual.value = "";
      campos.novaSenha.value = "";
      exibirFeedback("Perfil atualizado com sucesso.", "sucesso");
    } catch (erro) {
      exibirFeedback(
        erro instanceof Error ? erro.message : "Não foi possível atualizar seu perfil.",
        "erro"
      );
    }
  });
}
