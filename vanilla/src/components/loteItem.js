/**
 * Formata data no formato ISO (AAAA-MM-DD) para o padrão brasileiro (DD/MM/AAAA).
 * Realizado via manipulação direta de strings para evitar desvios de fuso horário.
 */
function formatarDataBR(dataStr) {
  if (!dataStr) return 'Não informada';
  const partes = String(dataStr).split('-');
  if (partes.length === 3) {
    const [ano, mes, dia] = partes;
    return `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}/${ano}`;
  }
  return dataStr;
}

/**
 * Formata valor numérico para moeda brasileira (R$).
 */
function formatarMoedaBR(valor) {
  const numero = Number(valor) || 0;
  return `R$ ${numero.toFixed(2).replace('.', ',')}`;
}

/**
 * Cria dinamicamente um elemento DOM com classes e texto opcional.
 * Atende ao requisito acadêmico de manipulação de DOM via API nativa (createElement/appendChild).
 */
function criarElemento(tag, classes = [], texto = null) {
  const elemento = document.createElement(tag);
  if (classes.length > 0) {
    elemento.classList.add(...classes);
  }
  if (texto !== null && texto !== undefined) {
    elemento.textContent = texto;
  }
  return elemento;
}

/**
 * Cria a linha de lote no DOM (elemento <li>) para ser adicionada à lista de lotes.
 * Requisito acadêmico: Construção de componentes dinâmicos sem frameworks.
 *
 * @param {Object} lote Dados do lote (id, validade, quantidade, preco_pago, local_compra, em_promocao)
 * @param {Function} onRemover Callback acionado ao clicar em excluir o lote
 * @returns {HTMLLIElement}
 */
export function criarLinhaLoteDOM(lote, onRemover) {
  const li = criarElemento('li', [
    'flex',
    'items-center',
    'justify-between',
    'p-space-sm',
    'bg-surface-container-lowest',
    'rounded-DEFAULT',
    'border',
    'border-surface-container',
    'shadow-xs',
    'hover:border-primary/40',
    'transition-all',
    'gap-space-sm',
    'flex-wrap',
    'sm:flex-nowrap'
  ]);
  li.setAttribute('data-lote-id', lote.id);

  // Coluna esquerda: dados principais do lote (Validade, Quantidade, Preço, Local)
  const infoContainer = criarElemento('div', ['flex', 'items-center', 'gap-space-sm', 'flex-wrap']);

  // Ícone representativo
  const iconeContainer = criarElemento('div', [
    'w-9',
    'h-9',
    'rounded-full',
    'bg-teal-50',
    'text-primary',
    'flex',
    'items-center',
    'justify-center',
    'shrink-0'
  ]);
  const icone = criarElemento('span', ['material-symbols-outlined', 'text-xl'], 'inventory');
  iconeContainer.appendChild(icone);
  infoContainer.appendChild(iconeContainer);

  const detalhes = criarElemento('div', ['flex', 'flex-col', 'gap-0.5']);

  // Linha 1: Validade e Quantidade
  const linhaValidade = criarElemento('div', ['flex', 'items-center', 'gap-2', 'flex-wrap']);
  const textoValidade = criarElemento('span', ['font-semibold', 'text-on-surface', 'text-sm'], `Validade: ${formatarDataBR(lote.validade)}`);
  const separador = criarElemento('span', ['text-outline-variant', 'text-xs'], '•');
  const textoQtd = criarElemento('span', ['font-bold', 'text-primary', 'text-sm'], `${lote.quantidade} unidade(s)`);

  linhaValidade.appendChild(textoValidade);
  linhaValidade.appendChild(separador);
  linhaValidade.appendChild(textoQtd);

  // Badge de Promoção (se aplicável)
  if (lote.em_promocao) {
    const badgePromo = criarElemento('span', [
      'inline-flex',
      'items-center',
      'gap-1',
      'rounded-full',
      'px-2',
      'py-0.5',
      'text-xs',
      'font-bold',
      'bg-amber-100',
      'text-amber-800'
    ]);
    const iconeTag = criarElemento('span', ['material-symbols-outlined', 'text-xs'], 'sell');
    badgePromo.appendChild(iconeTag);
    badgePromo.appendChild(document.createTextNode('Promoção'));
    linhaValidade.appendChild(badgePromo);
  }

  detalhes.appendChild(linhaValidade);

  // Linha 2: Preço e Local de compra (se informado)
  const linhaSecundaria = criarElemento('div', ['flex', 'items-center', 'gap-2', 'text-xs', 'text-on-surface-variant', 'flex-wrap']);
  const textoPreco = criarElemento('span', [], `Preço: ${formatarMoedaBR(lote.preco_pago)}`);
  linhaSecundaria.appendChild(textoPreco);

  if (lote.local_compra) {
    const separador2 = criarElemento('span', ['text-outline-variant'], '•');
    const textoLocal = criarElemento('span', [], `Local: ${lote.local_compra}`);
    linhaSecundaria.appendChild(separador2);
    linhaSecundaria.appendChild(textoLocal);
  }

  detalhes.appendChild(linhaSecundaria);
  infoContainer.appendChild(detalhes);

  // Coluna direita: Ações (Botão Excluir)
  const acoesContainer = criarElemento('div', ['flex', 'items-center', 'gap-1', 'shrink-0']);
  const btnExcluir = criarElemento('button', [
    'inline-flex',
    'items-center',
    'gap-1',
    'px-2.5',
    'py-1.5',
    'rounded-full',
    'text-xs',
    'font-semibold',
    'text-error',
    'hover:bg-error-container/40',
    'border',
    'border-error/20',
    'transition-colors',
    'cursor-pointer'
  ], null);
  btnExcluir.type = 'button';
  btnExcluir.setAttribute('aria-label', `Excluir lote com validade ${formatarDataBR(lote.validade)}`);

  const iconeLixeira = criarElemento('span', ['material-symbols-outlined', 'text-base'], 'delete');
  const labelExcluir = criarElemento('span', [], 'Excluir');
  btnExcluir.appendChild(iconeLixeira);
  btnExcluir.appendChild(labelExcluir);

  btnExcluir.addEventListener('click', (evento) => {
    evento.preventDefault();
    if (typeof onRemover === 'function') {
      onRemover(lote.id);
    }
  });

  acoesContainer.appendChild(btnExcluir);

  li.appendChild(infoContainer);
  li.appendChild(acoesContainer);

  return li;
}
