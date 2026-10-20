export const storageService = {
  obterItem(chave, valorPadrao = null) {
    try {
      const item = localStorage.getItem(chave);
      return item ? JSON.parse(item) : valorPadrao;
    } catch (erro) {
      console.error(`[storageService] Erro ao obter "${chave}":`, erro);
      return valorPadrao;
    }
  },

  salvarItem(chave, valor) {
    try {
      localStorage.setItem(chave, JSON.stringify(valor));
      return true;
    } catch (erro) {
      console.error(`[storageService] Erro ao salvar "${chave}":`, erro);
      return false;
    }
  },

  removerItem(chave) {
    try {
      localStorage.removeItem(chave);
    } catch (erro) {
      console.error(`[storageService] Erro ao remover "${chave}":`, erro);
    }
  },

  limpar() {
    try {
      localStorage.clear();
    } catch (erro) {
      console.error('[storageService] Erro ao limpar LocalStorage:', erro);
    }
  }
};
