import { CourseRepository } from '../data/CourseRepository.js';
import { ScraperService } from '../services/ScraperService.js';
import { Tabs } from '../../../shared/utils/Tabs.js';
import { Logger } from '../../../shared/utils/Logger.js';

export class CourseService {
  /**
   * Tenta adicionar um curso a partir da aba ativa.
   * @param {Function} onSuccess - Callback executado em caso de sucesso.
   * @param {Function} onError - Callback executado em caso de erro (opcional).
   */
  async addFromCurrentTab(onSuccess, onError) {
    try {
      const tab = await Tabs.getCurrentTab();

      if (!tab) {
        if (onError) onError('Nenhuma aba ativa encontrada.');
        return;
      }
      let name = tab.title || 'Nova Matéria';

      // Limpeza básica do nome
      if (name.includes('-')) {
        name = name.split('-')[0].trim();
      }

      let weeks = [];
      let detectedName = null;

      // Executa scraper apenas em URLs válidas
      if (tab.url && tab.url.startsWith('http')) {
        const result = await ScraperService.scrapeWeeksFromTab(tab.id);
        weeks = result.weeks || [];
        detectedName = result.title;
      }

      if (detectedName) {
        name = detectedName;
      }

      // Adiciona ao storage
      await CourseRepository.add(name, tab.url, weeks);
      if (onSuccess) onSuccess('Matéria adicionada com sucesso!');
    } catch (error) {
      /**#LOG_SERVICE*/
      Logger.error('CourseService', 'Erro ao adicionar curso da aba atual:', error);
      if (onError) onError('Erro interno ao processar aba.');
    }
  }
}
