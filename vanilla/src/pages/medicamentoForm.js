import {
  atualizarMedicamento,
  criarMedicamento,
  obterMedicamentoPorId
} from '../services/medicamentoService.js';
import {
  adicionarLote,
  listarLotesPorMedicamento,
  removerLote
} from '../services/loteService.js';
import { criarLinhaLoteDOM } from '../components/loteItem.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-medicamento');
  const erroContainer = document.getElementById('erro-container');
  const erroMensagem = document.getElementById('erro-mensagem');
  const sucessoContainer = document.getElementById('sucesso-container');
  const sucessoMensagem = document.getElementById('sucesso-mensagem');
  const btnCancelar = document.getElementById('btn-cancelar');
  const btnSalvar = document.getElementById('btn-salvar');
  const btnScanner = document.getElementById('btn-scanner');

  const inputNome = document.getElementById('nome');
  const inputDosagem = document.getElementById('dosagem');
  const inputFinalidade = document.getElementById('finalidade');
  const inputForma = document.getElementById('forma');
  const inputComprimidos = document.getElementById('comprimidos_por_dose');
  const inputDosesDia = document.getElementById('doses_por_dia');
  const inputEstoqueMinimo = document.getElementById('estoque_minimo_dias');
  const consumoPreview = document.getElementById('consumo-diario-preview');
  const headerData = document.getElementById('header-data-atual');

  // Referências para a seção de Lotes
  const inputLoteValidade = document.getElementById('lote-validade');
  const inputLoteQuantidade = document.getElementById('lote-quantidade');
  const inputLotePreco = document.getElementById('lote-preco');
  const inputLoteLocal = document.getElementById('lote-local');
  const inputLotePromocao = document.getElementById('lote-promocao');
  const btnAdicionarLote = document.getElementById('btn-adicionar-lote');
  const loteErroContainer = document.getElementById('lote-erro-container');
  const loteErroMensagem = document.getElementById('lote-erro-mensagem');
  const listaLotes = document.getElementById('lista-lotes');
  const lotesVazio = document.getElementById('lotes-vazio');
  const badgeTotalLotes = document.getElementById('badge-total-lotes');

  const idMedicamentoParam = new URLSearchParams(window.location.search).get('id');
  const idMedicamentoAtual = idMedicamentoParam || ((typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID()
    : 'med-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9));

  if (headerData) {
    try {
      const hoje = new Date();
      const formatador = new Intl.DateTimeFormat('pt-BR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
      });
      const dataFormatada = formatador.format(hoje);
      headerData.textContent = dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);
    } catch {
      headerData.textContent = 'Hoje';
    }
  }

  // Seleção da forma farmacêutica
  const botoesForma = document.querySelectorAll('.btn-forma-opcao');
  function selecionarForma(formaSelecionada) {
    inputForma.value = formaSelecionada;

    botoesForma.forEach((botao) => {
      botao.setAttribute('aria-checked', 'false');
      botao.className = 'btn-forma-opcao flex items-center gap-space-sm min-h-[56px] px-space-md rounded-DEFAULT bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors text-left';
    });

    const botaoSelecionado = Array.from(botoesForma).find(
      (botao) => botao.getAttribute('data-forma') === formaSelecionada
    );

    if (botaoSelecionado) {
      botaoSelecionado.setAttribute('aria-checked', 'true');
      botaoSelecionado.className = 'btn-forma-opcao flex items-center gap-space-sm min-h-[56px] px-space-md rounded-DEFAULT bg-primary-container text-on-primary-container font-semibold ring-2 ring-primary shadow-sm transition-all text-left';
    }
  }

  botoesForma.forEach((botao) => {
    botao.addEventListener('click', () => {
      const formaSelecionada = botao.getAttribute('data-forma');

      if (formaSelecionada) {
        selecionarForma(formaSelecionada);
      }
    });
  });

  if (idMedicamentoParam) {
    const medicamento = obterMedicamentoPorId(idMedicamentoParam);
    const titulo = document.querySelector('h1');
    const breadcrumbAtual = document.querySelector('[aria-current="page"]');

    document.title = 'Editar Medicamento | MedStorage';

    if (titulo) {
      titulo.textContent = 'Editar Medicamento';
    }

    if (breadcrumbAtual) {
      breadcrumbAtual.textContent = 'Editar medicamento';
    }

    const textoBotaoSalvar = btnSalvar.querySelector('span:last-child');
    if (textoBotaoSalvar) {
      textoBotaoSalvar.textContent = 'Salvar alterações';
    }

    if (medicamento) {
      inputNome.value = medicamento.nome;
      inputDosagem.value = medicamento.dosagem;
      inputFinalidade.value = medicamento.finalidade || '';
      inputComprimidos.value = medicamento.comprimidos_por_dose;
      inputDosesDia.value = medicamento.doses_por_dia;
      inputEstoqueMinimo.value = medicamento.estoque_minimo_dias;
      selecionarForma(medicamento.forma || 'comprimido');
    } else {
      exibirErro('Não foi possível encontrar o medicamento para edição.');
      btnSalvar.disabled = true;
      btnSalvar.classList.add('opacity-70', 'cursor-not-allowed');
    }
  }

  // ============================================================
  // Gerenciamento e Validação da Seção de Lotes (UC04)
  // ============================================================

  function exibirErroLote(mensagem) {
    if (loteErroMensagem && loteErroContainer) {
      loteErroMensagem.textContent = mensagem;
      loteErroContainer.classList.remove('hidden');
    }
  }

  function ocultarErroLote() {
    if (loteErroContainer) {
      loteErroContainer.classList.add('hidden');
    }
  }

  function handleRemoverLote(loteId) {
    removerLote(loteId);
    renderizarListaLotes();
  }

  /**
   * Renderiza a lista de lotes vinculados no DOM usando o componente loteItem.
   * Atende ao requisito acadêmico de manipulação de DOM sem innerHTML em estruturas dinâmicas.
   */
  function renderizarListaLotes() {
    if (!listaLotes || !lotesVazio) return;

    // Uso de Array.filter através de listarLotesPorMedicamento
    const lotes = listarLotesPorMedicamento(idMedicamentoAtual);
    listaLotes.replaceChildren();

    if (badgeTotalLotes) {
      badgeTotalLotes.textContent = lotes.length;
    }

    if (lotes.length === 0) {
      lotesVazio.classList.remove('hidden');
      listaLotes.classList.add('hidden');
      return;
    }

    lotesVazio.classList.add('hidden');
    listaLotes.classList.remove('hidden');

    lotes.forEach((lote) => {
      listaLotes.appendChild(criarLinhaLoteDOM(lote, handleRemoverLote));
    });
  }

  if (btnAdicionarLote) {
    btnAdicionarLote.addEventListener('click', () => {
      ocultarErroLote();

      const validade = inputLoteValidade ? inputLoteValidade.value.trim() : '';
      const quantidadeStr = inputLoteQuantidade ? inputLoteQuantidade.value.trim() : '';
      const precoStr = inputLotePreco ? inputLotePreco.value.trim() : '';
      const localCompra = inputLoteLocal ? inputLoteLocal.value.trim() : '';
      const emPromocao = inputLotePromocao ? Boolean(inputLotePromocao.checked) : false;

      // Validação acadêmica 1: Validade com data válida preenchida
      if (!validade) {
        exibirErroLote('Informe a data de validade do lote.');
        if (inputLoteValidade) inputLoteValidade.focus();
        return;
      }

      const dataValidade = new Date(validade);
      if (isNaN(dataValidade.getTime())) {
        exibirErroLote('A data de validade informada é inválida.');
        if (inputLoteValidade) inputLoteValidade.focus();
        return;
      }

      // Validação acadêmica 2: Number(quantidade) > 0
      const quantidade = Number(quantidadeStr);
      if (!quantidadeStr || isNaN(quantidade) || quantidade <= 0) {
        exibirErroLote('A quantidade de unidades deve ser um número maior que zero.');
        if (inputLoteQuantidade) inputLoteQuantidade.focus();
        return;
      }

      // Validação acadêmica 3: Number(preco_pago) >= 0
      const preco = precoStr !== '' ? Number(precoStr) : 0;
      if (isNaN(preco) || preco < 0) {
        exibirErroLote('O preço pago deve ser um número maior ou igual a zero.');
        if (inputLotePreco) inputLotePreco.focus();
        return;
      }

      // Persistência vinculada via loteService no LocalStorage
      adicionarLote({
        medicamento_id: idMedicamentoAtual,
        validade,
        quantidade,
        preco_pago: preco,
        local_compra: localCompra,
        em_promocao: emPromocao
      });

      // Limpeza dos campos do lote após adicionar com sucesso
      if (inputLoteValidade) inputLoteValidade.value = '';
      if (inputLoteQuantidade) inputLoteQuantidade.value = '';
      if (inputLotePreco) inputLotePreco.value = '';
      if (inputLoteLocal) inputLoteLocal.value = '';
      if (inputLotePromocao) inputLotePromocao.checked = false;

      renderizarListaLotes();
    });
  }

  [inputLoteValidade, inputLoteQuantidade, inputLotePreco].forEach((input) => {
    if (input) {
      input.addEventListener('input', ocultarErroLote);
    }
  });

  // Renderiza lotes vinculados ao carregar a página
  renderizarListaLotes();

  // Atualização dinâmica do consumo diário
  function atualizarPreviewConsumo() {
    const unidades = parseFloat(inputComprimidos.value) || 0;
    const doses = parseInt(inputDosesDia.value, 10) || 0;
    const total = unidades * doses;

    if (consumoPreview) {
      consumoPreview.textContent = total > 0 ? `${total} unidade(s) por dia` : 'Informe doses e unidades';
    }
  }

  inputComprimidos.addEventListener('input', atualizarPreviewConsumo);
  inputDosesDia.addEventListener('input', atualizarPreviewConsumo);
  atualizarPreviewConsumo();

  [inputNome, inputDosagem, inputComprimidos, inputDosesDia, inputEstoqueMinimo].forEach((input) => {
    if (input) {
      input.addEventListener('input', () => {
        input.classList.remove('border-error', 'bg-error-container/20');
        ocultarErro();
      });
    }
  });

  btnCancelar.addEventListener('click', () => {
    window.location.href = 'medicamentos.html';
  });

  if (btnScanner) {
    btnScanner.addEventListener('click', () => {
      alert('A funcionalidade de Scanner por Foto estará disponível na próxima atualização do MedStorage!');
    });
  }

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    ocultarErro();

    const nome = inputNome.value.trim();
    const dosagem = inputDosagem.value.trim();
    const finalidade = inputFinalidade ? inputFinalidade.value.trim() : '';
    const forma = inputForma.value || 'comprimido';
    const comprimidos = Number(inputComprimidos.value);
    const dosesDia = Number(inputDosesDia.value);
    const estoqueMinimo = Number(inputEstoqueMinimo.value);

    // Validações
    if (!nome) {
      marcarCampoComErro(inputNome, 'O nome do medicamento é obrigatório.');
      return;
    }

    if (!dosagem) {
      marcarCampoComErro(inputDosagem, 'A dosagem por unidade é obrigatória (ex: 50 mg).');
      return;
    }

    if (isNaN(comprimidos) || comprimidos <= 0) {
      marcarCampoComErro(inputComprimidos, 'A quantidade por dose deve ser um número maior que zero.');
      return;
    }

    if (isNaN(dosesDia) || dosesDia <= 0) {
      marcarCampoComErro(inputDosesDia, 'O número de doses por dia deve ser no mínimo 1.');
      return;
    }

    if (isNaN(estoqueMinimo) || estoqueMinimo <= 0) {
      marcarCampoComErro(inputEstoqueMinimo, 'A margem de dias para alerta de reposição deve ser maior que zero.');
      return;
    }

    const dadosMedicamento = {
      nome,
      dosagem,
      forma,
      finalidade,
      comprimidos_por_dose: comprimidos,
      doses_por_dia: dosesDia,
      estoque_minimo_dias: estoqueMinimo
    };

    try {
      if (idMedicamentoParam) {
        atualizarMedicamento(idMedicamentoParam, dadosMedicamento);
      } else {
        criarMedicamento({ id: idMedicamentoAtual, ...dadosMedicamento });
      }

      if (sucessoMensagem) {
        sucessoMensagem.textContent = idMedicamentoParam
          ? 'Medicamento atualizado com sucesso! Redirecionando...'
          : 'Medicamento cadastrado com sucesso! Redirecionando...';
      }
      sucessoContainer.classList.remove('hidden');
      btnSalvar.disabled = true;
      btnSalvar.classList.add('opacity-70', 'cursor-not-allowed');

      setTimeout(() => {
        window.location.href = 'medicamentos.html';
      }, 750);
    } catch (erro) {
      const acao = idMedicamentoParam ? 'atualizar' : 'cadastrar';
      console.error(`Erro ao ${acao} medicamento:`, erro);
      exibirErro(`Não foi possível ${acao} os dados do medicamento. Verifique as permissões de armazenamento do navegador.`);
    }
  });

  function marcarCampoComErro(elementoInput, mensagem) {
    exibirErro(mensagem);
    if (elementoInput) {
      elementoInput.classList.add('border-error', 'bg-error-container/20');
      elementoInput.focus();
    }
  }

  function exibirErro(mensagem) {
    if (erroMensagem && erroContainer) {
      erroMensagem.textContent = mensagem;
      erroContainer.classList.remove('hidden');
      erroContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function ocultarErro() {
    if (erroContainer) {
      erroContainer.classList.add('hidden');
    }
  }
});
