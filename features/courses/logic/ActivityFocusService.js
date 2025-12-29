/**
 * @file features/courses/logic/ActivityFocusService.js
 * @description Use Case desacoplado para navegação e foco em atividades no AVA
 * @architecture Domain/Use Case Layer - Desacoplado
 */

import { NavigationService } from '../../../shared/services/NavigationService.js';
import { Logger } from '../../../shared/utils/Logger.js';

export class ActivityFocusService {
  /**
   * Navega para uma atividade e garante o foco visual (scroll + highlight)
   * @param {string} weekUrl - URL da semana pai
   * @param {string} activityId - ID da atividade
   * @returns {Promise<void>}
   */
  static async focusActivity(weekUrl, activityId) {
    const NAMESPACE = 'ActivityFocusService';

    return await Logger.measure(NAMESPACE, 'focusActivity', async () => {
      Logger.debug(NAMESPACE, 'Iniciando fluxo de foco', { weekUrl, activityId });

      if (!weekUrl || !activityId) {
        Logger.warn(NAMESPACE, 'Parâmetros inválidos para foco', { weekUrl, activityId });
        return;
      }

      // Encapsula a chamada ao NavigationService que já foi melhorado com o Logger
      await NavigationService.openActivity(weekUrl, activityId);

      Logger.debug(NAMESPACE, 'Fluxo de foco enviado para execução');
    });
  }
}
