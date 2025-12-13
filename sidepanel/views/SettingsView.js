import { AddManualModal } from '../components/Modals/AddManualModal.js';
import { BatchImportModal } from '../components/Modals/BatchImportModal.js';
import { addItem, clearItems } from '../logic/storage.js';
import { scrapeWeeksFromTab } from '../logic/scraper.js';
import { FeedbackManager } from '../utils/feedback.js';
import { ConfigForm } from '../components/Forms/ConfigForm.js';

export class SettingsView {
  constructor(callbacks = {}) {
    this.onNavigate = callbacks.onNavigate;
    this.feedback = new FeedbackManager('settingsFeedback');
    this.configForm = new ConfigForm(this.feedback);

    this.addManualModal = new AddManualModal(() =>
      this.feedback.show('Matéria adicionada com sucesso!', 'success')
    );
    this.batchImportModal = new BatchImportModal(() => {
      this.feedback.show('Importação concluída!', 'success');
      if (this.onNavigate) setTimeout(() => this.onNavigate('courses'), 1500);
    });
  }

  render() {
    const div = document.createElement('div');
    div.className = 'view-settings';
    div.innerHTML = `
            <h2>Configurações</h2>
            
            ${this.configForm.render()}
            
            <hr class="divider">

            <h3>Gerenciar Matérias</h3>
            <p class="config-desc">Opções para adicionar ou remover cursos.</p>

            <div class="action-list">
                <button id="btnManualAdd" class="action-card small-action">
                    <span class="icon">✏️</span><span class="label">Adicionar Manualmente</span>
                </button>
                <button id="btnAddCurrent" class="action-card small-action">
                    <span class="icon">➕</span><span class="label">Adicionar Página Atual</span>
                </button>
                <button id="btnBatchImport" class="action-card small-action">
                    <span class="icon">📦</span><span class="label">Importar em Lote (AVA)</span>
                </button>
                <hr class="divider">
                <button id="btnClearAll" class="action-card small-action" style="border-color: #ffcccc; color: #d9534f;">
                    <span class="icon">🗑️</span><span class="label">Remover Todas as Matérias</span>
                </button>
            </div>

            <hr class="divider">

            <h3>Ajuda e Feedback</h3>
            <p class="config-desc">Encontrou um problema ou tem uma sugestão?</p>
            <div class="action-list">
                <button id="btnFeedback" class="action-card small-action">
                    <span class="icon">📢</span><span class="label">Enviar Feedback</span>
                </button>
            </div>

            <div id="settingsFeedback" class="status-msg"></div>
            <div class="footer-info"></div>
        `;
    return div;
  }

  afterRender() {
    // Attach ConfigForm listeners
    this.configForm.attachListeners();

    // Attach Action Buttons listeners
    const btnManual = document.getElementById('btnManualAdd');
    const btnCurrent = document.getElementById('btnAddCurrent');
    const btnBatch = document.getElementById('btnBatchImport');
    const btnFeedback = document.getElementById('btnFeedback');
    const btnClear = document.getElementById('btnClearAll');

    if (btnManual) btnManual.onclick = () => this.addManualModal.open();
    if (btnBatch) btnBatch.onclick = () => this.batchImportModal.open();
    if (btnFeedback) btnFeedback.onclick = () => {
      if (this.onNavigate) this.onNavigate('feedback');
    };
    if (btnCurrent) btnCurrent.onclick = () => this.handleAddCurrent();

    if (btnClear) {
      btnClear.onclick = () => {
        if (confirm('Tem certeza que deseja remover TODAS as matérias salvas? Essa ação não pode ser desfeita.')) {
          clearItems(() => this.feedback.show('Todas as matérias foram removidas.', 'success'));
        }
      };
    }
  }

  handleAddCurrent() {
    const feedbackEl = document.getElementById('settingsFeedback');
    if (feedbackEl) {
      feedbackEl.textContent = 'Analisando página...';
      feedbackEl.style.display = 'block';
    }

    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (!tabs?.length) return;
      const tab = tabs[0];

      let name = (tab.title || 'Nova Matéria').split('-')[0].trim();
      let weeks = [];

      if (tab.url.startsWith('http')) {
        const result = await scrapeWeeksFromTab(tab.id);
        weeks = result.weeks || [];
        if (result.title) name = result.title;
      }

      addItem(name, tab.url, weeks, (success, msg) => {
        const type = success ? 'success' : 'error';
        const text = success ? 'Página atual adicionada com sucesso!' : `Erro: ${msg}`;
        this.feedback.show(text, type);
      });
    });
  }
}
