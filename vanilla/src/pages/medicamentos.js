import { criarMedicamentoCard } from '../components/medicamentoCard.js';
import { initStorage } from '../services/storageService.js';
import { listarMedicamentos } from '../services/medicamentoService.js';
import { enriquecerMedicamentosComMetricas } from '../utils/calculosEstoque.js';

function prepararLotes(medicamentos) {
  return medicamentos.flatMap((medicamento) =>
    (medicamento.lotes || []).map((lote) => ({
      ...lote,
      medicamento_id: medicamento.id
    }))
  );
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
    grid.appendChild(criarMedicamentoCard(medicamento));
  });
}

document.addEventListener('DOMContentLoaded', renderizarMedicamentos);
