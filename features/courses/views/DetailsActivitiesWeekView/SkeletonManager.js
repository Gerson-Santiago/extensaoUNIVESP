/**
 * @file SkeletonManager.js
 * @description Gerencia renderização de skeleton screens
 * @architecture View Layer - Loading State
 */

import { SkeletonLoader } from '../../../../shared/ui/SkeletonLoader.js';

/**
 * Gerencia skeleton screens para melhorar UX de carregamento
 */
export class SkeletonManager {
  /**
   * Renderiza skeleton de atividades no container
   * @param {HTMLElement} container - Container onde renderizar
   * @param {number} [count=5] - Quantidade de items de skeleton
   */
  static renderSkeleton(container, count = 5) {
    if (!container) return;

    // Mostra skeleton imediatamente
    container.innerHTML = SkeletonLoader.renderActivitiesSkeleton(count);
  }

  /**
   * Limpa skeleton do container
   * @param {HTMLElement} container - Container a limpar
   */
  static clearSkeleton(container) {
    if (!container) return;
    container.innerHTML = '';
  }
}
