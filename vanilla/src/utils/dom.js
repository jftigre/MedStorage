/**
 * Utilitário para criação declarativa de elementos do DOM.
 * Atende ao critério acadêmico de manipulação do DOM e componentes dinâmicos
 * utilizando estritamente a API nativa (document.createElement e appendChild).
 *
 * @param {string} tag Nome da tag HTML a ser criada (ex: 'div', 'button', 'li')
 * @param {string[]} classes Lista de classes CSS (ex: Tailwind) a serem aplicadas
 * @param {string|null} texto Conteúdo textual opcional do elemento
 * @returns {HTMLElement}
 */
export function criarElemento(tag, classes = [], texto = null) {
  const elemento = document.createElement(tag);

  if (Array.isArray(classes) && classes.length > 0) {
    elemento.classList.add(...classes);
  }

  if (texto !== null && texto !== undefined) {
    elemento.textContent = texto;
  }

  return elemento;
}
