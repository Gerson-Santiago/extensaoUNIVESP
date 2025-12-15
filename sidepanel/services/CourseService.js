import { addItem } from '../logic/storage.js';
import { scrapeWeeksFromTab } from '../logic/scraper.js';

export class CourseService {
  /**
   * Tenta adicionar um curso a partir da aba ativa.
   * @param {Function} onSuccess - Callback executado em caso de sucesso.
   * @param {Function} onError - Callback executado em caso de erro (opcional).
   */
  async addFromCurrentTab(onSuccess, onError) {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

      if (!tabs || !tabs[0]) {
        if (onError) onError('Nenhuma aba ativa encontrada.');
        return;
      }

      const tab = tabs[0];
      let name = tab.title || 'Nova Matéria';

      // Limpeza básica do nome
      if (name.includes('-')) {
        name = name.split('-')[0].trim();
      }

      let weeks = [];
      let detectedName = null;

      // Executa scraper apenas em URLs válidas
      if (tab.url && tab.url.startsWith('http')) {
        const result = await scrapeWeeksFromTab(tab.id);
        weeks = result.weeks || [];
        detectedName = result.title;
      }

      if (detectedName) {
        name = detectedName;
      }

      // Adiciona ao storage
      addItem(name, tab.url, weeks, (success, msg) => {
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
