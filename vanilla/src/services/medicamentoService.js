import { storageService, CHAVE_MEDICAMENTOS } from './storageService.js';

export function listarMedicamentos() {
  return storageService.obterItem(CHAVE_MEDICAMENTOS, []);
}

export function obterMedicamentoPorId(id) {
  const lista = listarMedicamentos();
  return lista.find((med) => med.id === id) || null;
}

export function criarMedicamento(dados) {
  const medicamentos = listarMedicamentos();

  const id = dados.id || ((typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : 'med-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9));

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

export function atualizarMedicamento(id, dadosAtualizados) {
  const medicamentos = listarMedicamentos();
  const medicamentoExistente = medicamentos.find((medicamento) => medicamento.id === id);

  if (!medicamentoExistente) {
    throw new Error(`Medicamento com ID "${id}" não encontrado.`);
  }

  const medicamentosAtualizados = medicamentos.map((medicamento) =>
    medicamento.id === id
      ? { ...medicamento, ...dadosAtualizados, id: medicamento.id }
      : medicamento
  );

  if (!storageService.salvarItem(CHAVE_MEDICAMENTOS, medicamentosAtualizados)) {
    throw new Error(`Não foi possível salvar as alterações do medicamento "${id}".`);
  }

  return medicamentosAtualizados.find((medicamento) => medicamento.id === id);
}
