/**
 * @file ActionMenu.js (Model)
 * @description Definições de tipos para ActionMenu component
 * @architecture Domain Layer (shared/models/)
 */

/**
 * Ação individual do menu
 * @typedef {Object} ActionMenuAction
 * @property {string} label - Texto da ação
 * @property {string} icon - Ícone da ação (emoji ou símbolo)
 * @property {Function} [onClick] - Callback ao clicar (opcional)
 * @property {'action'|'danger'} [type] - Tipo visual da ação (opcional)
 */

/**
 * Opções de configuração do ActionMenu
 * @typedef {Object} ActionMenuOptions
 * @property {ActionMenuAction[]} [actions] - Lista de ações disponíveis
 * @property {string} [icon] - Ícone do botão principal (padrão: '+')
 * @property {string} [title] - Tooltip do botão (padrão: 'Ações')
 */

export const ActionMenuModel = {};
