import { criarStatusBadge } from './statusBadge.js';
import { criarElemento } from '../utils/dom.js';

function determinarStatus(med) {
  if (med.estoqueTotal <= 0 || med.diasRestantes <= 0) {
    return { classe: 'vermelho', texto: 'Sem estoque' };
  }

  if (med.diasRestantes <= med.estoque_minimo_dias || med.diasRestantes <= 30) {
    return { classe: 'amarelo', texto: 'Atenção' };
  }

  return { classe: 'verde', texto: 'Estoque normal' };
}

export function criarMedicamentoCard(medEnriquecido, onExcluir) {
  const status = determinarStatus(medEnriquecido);
  const card = criarElemento('article', [
    'border-l-4',
    'border-primary',
    'bg-surface-container-lowest',
    'rounded-DEFAULT',
    'p-space-md',
    'shadow-sm',
    'hover:shadow-md',
    'transition-shadow',
    'flex',
    'flex-col',
    'justify-between',
    'gap-space-md'
  ]);

  const cabecalho = criarElemento('div', ['flex', 'items-start', 'justify-between', 'gap-2']);
  const informacoes = criarElemento('div', ['flex', 'flex-col']);
  const forma = criarElemento('span', ['text-xs', 'uppercase', 'font-bold', 'tracking-wider', 'text-primary'], medEnriquecido.forma || 'Medicamento');
  const nome = criarElemento('h3', ['text-lg', 'font-bold', 'text-on-surface', 'tracking-tight'], medEnriquecido.nome);
  const dosagem = criarElemento('span', ['bg-surface-container', 'px-2.5', 'py-1', 'rounded-full', 'text-xs', 'font-semibold', 'text-on-surface-variant'], medEnriquecido.dosagem);
  const badge = criarStatusBadge(status.classe, status.texto);

  informacoes.appendChild(forma);
  informacoes.appendChild(nome);
  cabecalho.appendChild(informacoes);
  cabecalho.appendChild(dosagem);

  const detalhes = criarElemento('div', ['flex', 'flex-col', 'gap-1', 'text-sm', 'text-on-surface-variant']);
  detalhes.appendChild(criarElemento('p', [], `Estoque disponível: ${medEnriquecido.estoqueTotal} unidades`));
  detalhes.appendChild(criarElemento('p', [], `Consumo diário: ${medEnriquecido.consumoDiario} unidades`));
  detalhes.appendChild(criarElemento('p', [], `Dias restantes: ${medEnriquecido.diasRestantes}`));
  detalhes.appendChild(criarElemento('p', [], `Previsão de término: ${medEnriquecido.dataTermino}`));

  const acoes = criarElemento('div', ['flex', 'flex-col', 'sm:flex-row', 'gap-space-sm']);
  const detalhesButton = criarElemento('button', ['flex-1', 'min-h-[48px]', 'rounded-full', 'bg-primary', 'px-space-md', 'py-space-xs', 'font-bold', 'text-on-primary'], 'Ver detalhes');
  const editarButton = criarElemento('button', ['flex-1', 'min-h-[48px]', 'rounded-full', 'border', 'border-primary', 'px-space-md', 'py-space-xs', 'font-bold', 'text-primary'], 'Editar');
  const excluirButton = criarElemento('button', ['flex-1', 'min-h-[48px]', 'rounded-full', 'border', 'border-error/20', 'px-space-md', 'py-space-xs', 'font-bold', 'text-error', 'hover:bg-error-container/40'], 'Excluir');

  excluirButton.type = 'button';
  excluirButton.addEventListener('click', (evento) => {
    evento.preventDefault();
    const confirmado = window.confirm(`Tem certeza que deseja excluir ${medEnriquecido.nome}? Essa ação não pode ser desfeita.`);

    if (confirmado && typeof onExcluir === 'function') {
      onExcluir(medEnriquecido.id);
    }
  });

  editarButton.addEventListener('click', () => {
    window.location.href = 'medicamento-form.html?id=' + medEnriquecido.id;
  });
  acoes.appendChild(detalhesButton);
  acoes.appendChild(editarButton);
  acoes.appendChild(excluirButton);

  card.appendChild(cabecalho);
  card.appendChild(badge);
  card.appendChild(detalhes);
  card.appendChild(acoes);
  return card;
}
