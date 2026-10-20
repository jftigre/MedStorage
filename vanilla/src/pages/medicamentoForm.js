import {
  atualizarMedicamento,
  criarMedicamento,
  obterMedicamentoPorId
} from '../services/medicamentoService.js';

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
  const idMedicamento = new URLSearchParams(window.location.search).get('id');

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

  if (idMedicamento) {
    const medicamento = obterMedicamentoPorId(idMedicamento);
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
      if (idMedicamento) {
        atualizarMedicamento(idMedicamento, dadosMedicamento);
      } else {
        criarMedicamento(dadosMedicamento);
      }

      if (sucessoMensagem) {
        sucessoMensagem.textContent = idMedicamento
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
      const acao = idMedicamento ? 'atualizar' : 'cadastrar';
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
