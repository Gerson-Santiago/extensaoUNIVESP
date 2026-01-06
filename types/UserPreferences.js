/**
 * User Preferences Type Definitions
 * Defines types for user-configurable preferences in Settings.
 *
 * @see ISSUE-022 - UX Preferences and Behavior
 * @see ADR-000-B - JSDoc Typing Standard
 */

/**
 * Preferências de UX configuráveis pelo usuário.
 *
 * @typedef {Object} UserPreferences
 * @property {boolean} densityCompact - Se true, aplica classe .is-compact no body para densidade visual compacta
 * @property {boolean} autoPinLastWeek - Se true, reabre automaticamente a última semana visitada
 * @property {number|null} [lastWeekNumber] - Número da última semana visitada (salvo automaticamente se autoPinLastWeek ativo)
 */

/**
 * Valores padrão para UserPreferences.
 *
 * @type {UserPreferences}
 */
export const DEFAULT_USER_PREFERENCES = {
  densityCompact: false,
  autoPinLastWeek: false,
  lastWeekNumber: null,
};

export {};
