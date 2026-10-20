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

export function realizarLogout() {
  localStorage.removeItem(CHAVE_USUARIO);
}
