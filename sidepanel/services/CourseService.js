import { CourseRepository } from '../../features/courses/data/CourseRepository.js';
import { ScraperService } from '../../features/courses/services/ScraperService.js';
import { Tabs } from '../../shared/utils/Tabs.js';

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
      CourseRepository.add(name, tab.url, weeks, (success, msg) => {
        if (success) {
          if (onSuccess) onSuccess();
        } else {
          if (onError) onError(msg);
        }
      });
    } catch (error) {
      console.error('Erro ao adicionar curso da aba atual:', error);
      if (onError) onError('Erro interno ao processar aba.');
    }
  }
}
