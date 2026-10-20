export function criarStatusBadge(status, texto) {
  const badge = document.createElement('span');
  const classesPorStatus = {
    verde: ['bg-emerald-100', 'text-emerald-800'],
    amarelo: ['bg-amber-100', 'text-amber-800'],
    vermelho: ['bg-red-100', 'text-red-800']
  };
  const classes = classesPorStatus[status] || classesPorStatus.verde;

  badge.classList.add(
    'inline-flex',
    'items-center',
    'rounded-full',
    'px-3',
    'py-1',
    'text-xs',
    'font-bold',
    ...classes
  );
  badge.textContent = texto;

  return badge;
}
