import { storageService } from './storageService.js';
import { seedData } from './seedData.js';

export const CHAVE_LOTES = 'medstorage_lotes';

/**
 * Inicializa a chave de lotes no LocalStorage com os dados iniciais do seedData, caso ainda não exista.
 * Atende ao requisito acadêmico de persistência no LocalStorage.
 */
export function initLotesStorage() {
  if (localStorage.getItem(CHAVE_LOTES) === null) {
    const lotesIniciais = seedData.flatMap((med) =>
      (med.lotes || []).map((lote) => ({
        id: lote.id || crypto.randomUUID(),
        medicamento_id: med.id,
        validade: lote.validade,
        quantidade: Number(lote.quantidade),
        preco_pago: Number(lote.preco_pago || 0),
        local_compra: lote.local_compra || 'Farmácia',
        em_promocao: Boolean(lote.em_promocao)
      }))
    );
    storageService.salvarItem(CHAVE_LOTES, lotesIniciais);
    return lotesIniciais;
  }
  return listarTodosLotes();
}

/**
 * Retorna todos os lotes armazenados no LocalStorage.
 */
export function listarTodosLotes() {
  return storageService.obterItem(CHAVE_LOTES, []);
}

/**
 * Retorna os lotes de um medicamento específico utilizando Programação Funcional (filter).
 * Requisito acadêmico: Array.filter() para busca e transformação de dados.
 */
export function listarLotesPorMedicamento(medicamentoId) {
  initLotesStorage();
  const todosLotes = listarTodosLotes();
  // Uso de Array.filter para filtrar apenas os lotes vinculados ao medicamento_id
  return todosLotes.filter((lote) => lote.medicamento_id === medicamentoId);
}

/**
 * Adiciona e persiste um novo lote vinculado a um medicamento no LocalStorage.
 * Salva { id, medicamento_id, validade, quantidade, preco_pago, local_compra, em_promocao }.
 */
export function adicionarLote(dadosLote) {
  initLotesStorage();
  const lotes = listarTodosLotes();

  const id = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : 'lote-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);

  const novoLote = {
    id,
    medicamento_id: dadosLote.medicamento_id,
    validade: dadosLote.validade,
    quantidade: Number(dadosLote.quantidade),
    preco_pago: Number(dadosLote.preco_pago || 0),
    local_compra: dadosLote.local_compra ? dadosLote.local_compra.trim() : '',
    em_promocao: Boolean(dadosLote.em_promocao),
    criado_em: new Date().toISOString()
  };

  lotes.push(novoLote);
  storageService.salvarItem(CHAVE_LOTES, lotes);

  return novoLote;
}

/**
 * Remove um lote do LocalStorage pelo ID utilizando Programação Funcional (filter).
 * Requisito acadêmico: Array.filter() para exclusão imutável de itens.
 */
export function removerLote(loteId) {
  initLotesStorage();
  const lotes = listarTodosLotes();
  // Uso de Array.filter para remover o lote mantendo os demais
  const lotesAtualizados = lotes.filter((lote) => lote.id !== loteId);
  storageService.salvarItem(CHAVE_LOTES, lotesAtualizados);
  return lotesAtualizados;
}
