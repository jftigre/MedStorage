import { criarElemento } from '../utils/dom.js';
import { realizarLogout as logoutAuth } from '../services/authService.js';

const linksDaNavbar = [
  { pagina: 'dashboard', texto: 'Dashboard', href: 'dashboard.html' },
  { pagina: 'medicamentos', texto: 'Medicamentos', href: 'medicamentos.html' },
  { pagina: 'cadastro', texto: 'Cadastrar medicamento', href: 'medicamento-form.html' },
  { pagina: 'simulador', texto: 'Simulador', href: 'simulador.html' },
  { pagina: 'alertas', texto: 'Alertas', href: 'alertas.html' }
];

export function realizarLogout() {
  logoutAuth();
  window.location.href = 'login.html';
}

export function renderizarNavbar(paginaAtiva) {
  const nav = criarElemento('nav', [
    'bg-teal-800',
    'text-white',
    'shadow-md'
  ]);
  nav.setAttribute('aria-label', 'Navegação principal');

  const container = criarElemento('div', [
    'mx-auto',
    'flex',
    'max-w-7xl',
    'flex-wrap',
    'items-center',
    'justify-between',
    'gap-4',
    'px-4',
    'py-4',
    'sm:px-6',
    'lg:px-8'
  ]);

  const marca = document.createElement('a');
  marca.classList.add(
    'font-display',
    'text-xl',
    'font-bold',
    'transition',
    'hover:text-teal-100',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-white'
  );
  marca.href = 'index.html';
  marca.textContent = 'MedStorage';

  const menu = criarElemento('div', [
    'flex',
    'w-full',
    'flex-col',
    'gap-2',
    'text-sm',
    'font-semibold',
    'sm:w-auto',
    'sm:flex-row',
    'sm:flex-wrap',
    'sm:items-center',
    'sm:gap-4'
  ]);

  linksDaNavbar.forEach(({ pagina, texto, href }) => {
    const link = document.createElement('a');
    link.classList.add(
      'rounded-md',
      'px-3',
      'py-2',
      'transition',
      'hover:bg-teal-700',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-white'
    );
    link.href = href;
    link.textContent = texto;

    if (pagina === paginaAtiva) {
      link.classList.add('bg-teal-900', 'font-bold');
      link.setAttribute('aria-current', 'page');
    }

    menu.appendChild(link);
  });

  const botaoSair = criarElemento('button', [
    'rounded-md',
    'border',
    'border-teal-100',
    'px-3',
    'py-2',
    'text-left',
    'transition',
    'hover:bg-teal-700',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-white',
    'sm:text-center'
  ], 'Sair');
  botaoSair.type = 'button';
  botaoSair.addEventListener('click', realizarLogout);
  menu.appendChild(botaoSair);

  container.appendChild(marca);
  container.appendChild(menu);
  nav.appendChild(container);

  return nav;
}
