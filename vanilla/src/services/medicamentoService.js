import { storageService } from './storageService.js';

export const CHAVE_MEDICAMENTOS = 'medstorage_medicamentos';

export function listarMedicamentos() {
  return storageService.obterItem(CHAVE_MEDICAMENTOS, []);
}

export function obterMedicamentoPorId(id) {
  const lista = listarMedicamentos();
  return lista.find((med) => med.id === id) || null;
}

export function criarMedicamento(dados) {
  const medicamentos = listarMedicamentos();

  const id = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : 'med-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);

  const novoMedicamento = {
    id,
    usuario_id: 'user-01',
    nome: dados.nome.trim(),
    dosagem: dados.dosagem.trim(),
    forma: dados.forma || 'comprimido',
    finalidade: dados.finalidade ? dados.finalidade.trim() : '',
    comprimidos_por_dose: Number(dados.comprimidos_por_dose),
    doses_por_dia: Number(dados.doses_por_dia),
    estoque_minimo_dias: Number(dados.estoque_minimo_dias || 15),
    criado_em: new Date().toISOString()
  };

  medicamentos.push(novoMedicamento);
  storageService.salvarItem(CHAVE_MEDICAMENTOS, medicamentos);

  return novoMedicamento;
}
