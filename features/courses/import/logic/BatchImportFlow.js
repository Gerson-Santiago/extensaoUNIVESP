import { NavigationService } from '../../../../shared/services/NavigationService.js';
import { Logger } from '../../../../shared/utils/Logger.js';

export class BatchImportFlow {
  /**
   * @param {Object} dependencies
   * @param {Object} dependencies.batchImportModal - Modal for scraping/selecting courses
   * @param {Object} dependencies.loginWaitModal - Modal for waiting login
   */
  constructor({ batchImportModal, loginWaitModal }) {
    this.batchImportModal = batchImportModal;
    this.loginWaitModal = loginWaitModal;
  }

  async start() {
    try {
      // A. Smart Switch / Discovery via NavigationService
      // Usa 'ava.univesp.br' como pattern para encontrar QUALQUER aba do AVA e reutilizar
      const targetTab = await NavigationService.openCourse(
        'https://ava.univesp.br/ultra/course',
        'ava.univesp.br'
      );

      if (!targetTab) {
        throw new Error('Falha ao obter aba do AVA');
      }

      // B. Check State
      // Se o status for 'loading', consideramos newlyCreated/navegando -> Wait Modal
      // Se for 'complete' e a URL já estiver correta -> Import Modal

      const isReadyValue =
        targetTab.status === 'complete' &&
        targetTab.url &&
        (targetTab.url.includes('/ultra/course') || targetTab.url.includes('bb_router'));

      if (isReadyValue) {
        // Ready to scrape
        this.batchImportModal.open(targetTab.id);
      } else {
        // Loading, Login required or Redirecting -> Wait
        this.loginWaitModal.open();
      }
    } catch (err) {
      /**#LOG_SCRAPER*/
      Logger.error('BatchImportFlow', 'BatchImportFlow Error:', err);
      // We could use a generic error modal or alert
      // alert('Erro no fluxo de importação: ' + err.message);
    }
  }
}
