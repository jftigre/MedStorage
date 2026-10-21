import { criarMedicamentoCard } from '../components/medicamentoCard.js';
import { initStorage } from '../services/storageService.js';
import { excluirMedicamento, listarMedicamentos } from '../services/medicamentoService.js';
import { initLotesStorage, listarTodosLotes } from '../services/loteService.js';
import { enriquecerMedicamentosComMetricas } from '../utils/calculosEstoque.js';

function prepararLotes(medicamentos) {
  initLotesStorage();
  const lotesNoStorage = listarTodosLotes();
  const lotesDosMedicamentos = medicamentos.flatMap((medicamento) =>
    (medicamento.lotes || []).map((lote) => ({
      ...lote,
      medicamento_id: medicamento.id
    }))
  );

  const mapaLotes = new Map();
  lotesDosMedicamentos.forEach((lote) => mapaLotes.set(lote.id, lote));
  lotesNoStorage.forEach((lote) => mapaLotes.set(lote.id, lote));
  return Array.from(mapaLotes.values());
}

function renderizarMedicamentos() {
  const grid = document.getElementById('grid-medicamentos');
  const estadoVazio = document.getElementById('estado-vazio');
  const badgeTotal = document.getElementById('badge-total-medicamentos');

  if (!grid || !estadoVazio || !badgeTotal) {
    return;
  }

  initStorage();
  const medicamentos = listarMedicamentos();
  const lotes = prepararLotes(medicamentos);
  const medicamentosEnriquecidos = enriquecerMedicamentosComMetricas(medicamentos, lotes);

  badgeTotal.textContent = medicamentosEnriquecidos.length;
  grid.replaceChildren();

  if (medicamentosEnriquecidos.length === 0) {
    grid.classList.add('hidden');
    estadoVazio.classList.remove('hidden');
    estadoVazio.classList.add('flex');
    return;
  }

  grid.classList.remove('hidden');
  estadoVazio.classList.add('hidden');
  estadoVazio.classList.remove('flex');

  medicamentosEnriquecidos.forEach((medicamento) => {
    grid.appendChild(criarMedicamentoCard(medicamento, (id) => {
      try {
        excluirMedicamento(id);
      } catch (erro) {
        console.error('Erro ao excluir medicamento:', erro);
        window.alert('Não foi possível concluir a exclusão do medicamento. Verifique o armazenamento e tente novamente.');
      }

      renderizarMedicamentos();
    }));
  });
}

document.addEventListener('DOMContentLoaded', renderizarMedicamentos);
