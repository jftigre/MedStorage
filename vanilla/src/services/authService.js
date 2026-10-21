import { storageService } from './storageService.js';

export const CHAVE_USUARIO = 'medstorage_usuario';
export const CHAVE_USUARIOS = 'medstorage_usersDB';

/**
 * Cadastra um novo usuário no banco de dados local (LocalStorage).
 * Atende ao princípio de separação de responsabilidades (ESM).
 *
 * @param {Object} dados Dados do novo usuário (nome, cpf, email, telefone, senha)
 * @returns {Object} Usuário cadastrado
 */
export function cadastrarUsuario(dados) {
  const usuarios = storageService.obterItem(CHAVE_USUARIOS, []);
  if (!Array.isArray(usuarios)) {
    throw new Error('Os dados de cadastro armazenados não estão em um formato válido.');
  }

  const emailNormalizado = dados.email.trim().toLowerCase();
  const jaExiste = usuarios.some(
    (item) => typeof item.email === 'string' && item.email.toLowerCase() === emailNormalizado
  );

  if (jaExiste) {
    const erro = new Error('E-mail já registrado.');
    erro.code = 'EMAIL_DUPLICADO';
    throw erro;
  }

  const novoUsuario = {
    id: (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : 'user-' + Date.now(),
    nome: dados.nome.trim(),
    cpf: dados.cpf ? dados.cpf.trim() : '',
    email: dados.email.trim(),
    telefone: dados.telefone ? dados.telefone.trim() : '',
    telefoneCuidador: dados.telefoneCuidador ? dados.telefoneCuidador.trim() : '',
    senha: dados.senha,
    criadoEm: new Date().toISOString()
  };

  usuarios.push(novoUsuario);
  storageService.salvarItem(CHAVE_USUARIOS, usuarios);
  return novoUsuario;
}

export function realizarLoginLocal(email, senha) {
  const usuarios = storageService.obterItem(CHAVE_USUARIOS, []);
  const emailNormalizado = email.trim().toLowerCase();
  const usuario = usuarios.find(
    (user) => user.email.toLowerCase() === emailNormalizado && user.senha === senha
  );

  if (!usuario) {
    return false;
  }

  const sessao = {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    logadoEm: new Date().toISOString()
  };

  storageService.salvarItem(CHAVE_USUARIO, sessao);
  return true;
}

export function verificarSessao() {
  return storageService.obterItem(CHAVE_USUARIO, null);
}

export function obterDadosPerfil() {
  const sessao = verificarSessao();
  if (!sessao) {
    return null;
  }

  const usuarios = storageService.obterItem(CHAVE_USUARIOS, []);
  if (!Array.isArray(usuarios)) {
    throw new Error('Os dados de cadastro armazenados não estão em um formato válido.');
  }

  const usuario = usuarios.find((item) => item.id === sessao.id || item.email === sessao.email);
  return {
    nome: usuario?.nome ?? sessao.nome,
    email: usuario?.email ?? sessao.email,
    cpf: usuario?.cpf ?? '',
    telefone: usuario?.telefone ?? '',
    telefoneCuidador: usuario?.telefoneCuidador ?? '',
    fotoBase64: usuario?.fotoBase64 ?? ''
  };
}

export function atualizarPerfil(dadosAtualizados, senhaAtual) {
  const sessao = verificarSessao();
  if (!sessao) {
    throw new Error('Nenhuma sessão ativa foi encontrada.');
  }

  const usuarios = storageService.obterItem(CHAVE_USUARIOS, []);
  if (!Array.isArray(usuarios) || usuarios.length === 0) {
    throw new Error('Não foi possível localizar os dados da conta.');
  }

  const indicePorId = sessao.id !== undefined && sessao.id !== null
    ? usuarios.findIndex((item) => item.id === sessao.id)
    : -1;
  const indiceUsuario = indicePorId >= 0
    ? indicePorId
    : usuarios.findIndex((item) => item.email === sessao.email);

  if (indiceUsuario < 0) {
    throw new Error('Não foi possível localizar a conta da sessão atual.');
  }

  const usuario = usuarios[indiceUsuario];
  if (usuario.senha !== senhaAtual) {
    throw new Error('Senha atual incorreta.');
  }

  const emailNormalizado = dadosAtualizados.email.trim().toLowerCase();
  const emailJaExiste = usuarios.some(
    (item, indice) =>
      indice !== indiceUsuario &&
      typeof item.email === 'string' &&
      item.email.toLowerCase() === emailNormalizado
  );
  if (emailJaExiste) {
    throw new Error('Este e-mail já está sendo usado por outra conta.');
  }

  if (dadosAtualizados.novaSenha && dadosAtualizados.novaSenha.length < 6) {
    throw new Error('A nova senha deve ter no mínimo 6 caracteres.');
  }

  usuarios[indiceUsuario] = {
    ...usuario,
    nome: dadosAtualizados.nome,
    email: dadosAtualizados.email,
    telefone: dadosAtualizados.telefone,
    telefoneCuidador: dadosAtualizados.telefoneCuidador,
    fotoBase64: dadosAtualizados.fotoBase64 ?? usuario.fotoBase64 ?? ''
  };

  if (dadosAtualizados.novaSenha) {
    usuarios[indiceUsuario].senha = dadosAtualizados.novaSenha;
  }

  storageService.salvarItem(CHAVE_USUARIOS, usuarios);

  const sessaoAtualizada = {
    ...sessao,
    nome: usuarios[indiceUsuario].nome,
    email: usuarios[indiceUsuario].email,
    telefone: usuarios[indiceUsuario].telefone,
    telefoneCuidador: usuarios[indiceUsuario].telefoneCuidador,
    fotoBase64: usuarios[indiceUsuario].fotoBase64
  };
  storageService.salvarItem(CHAVE_USUARIO, sessaoAtualizada);
  return true;
}

export function realizarLogout() {
  storageService.removerItem(CHAVE_USUARIO);
}
