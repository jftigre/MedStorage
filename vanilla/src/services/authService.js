const CHAVE_USUARIO = 'medstorage_usuario';
const CHAVE_USUARIOS = 'medstorage_usersDB';

export function realizarLoginLocal(email, senha) {
  const usuariosArmazenados = localStorage.getItem(CHAVE_USUARIOS);
  const usuarios = usuariosArmazenados ? JSON.parse(usuariosArmazenados) : [];
  const usuario = usuarios.find((user) => user.email === email && user.senha === senha);

  if (!usuario) {
    return false;
  }

  const sessao = {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    logadoEm: new Date().toISOString()
  };

  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(sessao));
  return true;
}

export function verificarSessao() {
  const usuario = localStorage.getItem(CHAVE_USUARIO);
  return usuario ? JSON.parse(usuario) : null;
}

export function obterDadosPerfil() {
  const sessao = verificarSessao();
  if (!sessao) {
    return null;
  }

  const usuariosArmazenados = localStorage.getItem(CHAVE_USUARIOS);
  if (!usuariosArmazenados) {
    return {
      nome: sessao.nome,
      email: sessao.email,
      cpf: "",
      telefone: "",
      telefoneCuidador: "",
      fotoBase64: ""
    };
  }

  const usuarios = JSON.parse(usuariosArmazenados);
  if (!Array.isArray(usuarios)) {
    throw new Error("Os dados de cadastro armazenados não estão em um formato válido.");
  }

  const usuario = usuarios.find((item) => item.id === sessao.id || item.email === sessao.email);
  return {
    nome: usuario?.nome ?? sessao.nome,
    email: usuario?.email ?? sessao.email,
    cpf: usuario?.cpf ?? "",
    telefone: usuario?.telefone ?? "",
    telefoneCuidador: usuario?.telefoneCuidador ?? "",
    fotoBase64: usuario?.fotoBase64 ?? ""
  };
}

export function atualizarPerfil(dadosAtualizados, senhaAtual) {
  const sessao = verificarSessao();
  if (!sessao) {
    throw new Error("Nenhuma sessão ativa foi encontrada.");
  }

  const usuariosArmazenados = localStorage.getItem(CHAVE_USUARIOS);
  if (!usuariosArmazenados) {
    throw new Error("Não foi possível localizar os dados da conta.");
  }

  const usuarios = JSON.parse(usuariosArmazenados);
  if (!Array.isArray(usuarios)) {
    throw new Error("Os dados de cadastro armazenados não estão em um formato válido.");
  }

  const indicePorId = sessao.id !== undefined && sessao.id !== null
    ? usuarios.findIndex((item) => item.id === sessao.id)
    : -1;
  const indiceUsuario = indicePorId >= 0
    ? indicePorId
    : usuarios.findIndex((item) => item.email === sessao.email);

  if (indiceUsuario < 0) {
    throw new Error("Não foi possível localizar a conta da sessão atual.");
  }

  const usuario = usuarios[indiceUsuario];
  if (usuario.senha !== senhaAtual) {
    throw new Error("Senha atual incorreta.");
  }

  const emailNormalizado = dadosAtualizados.email.trim().toLocaleLowerCase();
  const emailJaExiste = usuarios.some((item, indice) =>
    indice !== indiceUsuario
      && typeof item.email === "string"
      && item.email.toLocaleLowerCase() === emailNormalizado
  );
  if (emailJaExiste) {
    throw new Error("Este e-mail já está sendo usado por outra conta.");
  }

  if (dadosAtualizados.novaSenha && dadosAtualizados.novaSenha.length < 6) {
    throw new Error("A nova senha deve ter no mínimo 6 caracteres.");
  }

  usuarios[indiceUsuario] = {
    ...usuario,
    nome: dadosAtualizados.nome,
    email: dadosAtualizados.email,
    telefone: dadosAtualizados.telefone,
    telefoneCuidador: dadosAtualizados.telefoneCuidador,
    fotoBase64: dadosAtualizados.fotoBase64 ?? usuario.fotoBase64 ?? ""
  };

  if (dadosAtualizados.novaSenha) {
    usuarios[indiceUsuario].senha = dadosAtualizados.novaSenha;
  }

  localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));

  const sessaoAtualizada = {
    ...sessao,
    nome: usuarios[indiceUsuario].nome,
    email: usuarios[indiceUsuario].email,
    telefone: usuarios[indiceUsuario].telefone,
    telefoneCuidador: usuarios[indiceUsuario].telefoneCuidador,
    fotoBase64: usuarios[indiceUsuario].fotoBase64
  };
  localStorage.setItem(CHAVE_USUARIO, JSON.stringify(sessaoAtualizada));
  return true;
}

export function realizarLogout() {
  localStorage.removeItem(CHAVE_USUARIO);
}
