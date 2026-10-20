export function calcularConsumoDiario(med) {
  return med.comprimidos_por_dose * med.doses_por_dia;
}

export function calcularEstoqueTotal(lotes) {
  // Uso obrigatório de reduce para somar o estoque de todos os lotes.
  return lotes.reduce((total, lote) => total + lote.quantidade, 0);
}

function formatarData(data) {
  return data.toISOString().slice(0, 10);
}

export function enriquecerMedicamentosComMetricas(medicamentos, todosLotes) {
  const hoje = new Date();

  return medicamentos.map((medicamento) => {
    const lotesDoMedicamento = todosLotes.filter(
      (lote) => lote.medicamento_id === medicamento.id
    );
    const consumoDiario = calcularConsumoDiario(medicamento);
    const estoqueTotal = calcularEstoqueTotal(lotesDoMedicamento);
    const diasRestantes = consumoDiario > 0
      ? Math.floor(estoqueTotal / consumoDiario)
      : 0;
    const dataTermino = new Date(hoje);

    dataTermino.setDate(dataTermino.getDate() + diasRestantes);

    return {
      ...medicamento,
      consumoDiario,
      estoqueTotal,
      diasRestantes,
      dataTermino: formatarData(dataTermino)
    };
  });
}
