import { AddManualModal } from '../components/Modals/AddManualModal.js';
import { BatchImportModal } from '../components/Modals/BatchImportModal.js';
import { addItem, clearItems } from '../logic/storage.js';
import { scrapeWeeksFromTab } from '../logic/scraper.js';
import { StatusManager } from '../utils/statusManager.js';
import { ConfigForm } from '../components/Forms/ConfigForm.js';
import { ActionMenu } from '../components/Shared/ActionMenu.js';

export class SettingsView {
  constructor(callbacks = {}) {
    this.onNavigate = callbacks.onNavigate;
    this.feedback = new StatusManager('settingsFeedback');
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

    // Header Flex
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';

    const h2 = document.createElement('h2');
    h2.textContent = 'Configurações';
    h2.style.margin = '0';

    // Menu de Ações Globais
    const actionMenu = new ActionMenu({
      title: 'Ações Globais',
      icon: '⚙️', // Icone de engrenagem ou reticencias
      actions: [
        {
          label: 'Remover Todas as Matérias',
          icon: '🗑️',
          type: 'danger',
          onClick: () => this.handleClearAll()
        },
        {
          label: 'Enviar Feedback',
          icon: '📢',
          onClick: () => this.onNavigate && this.onNavigate('feedback')
        }
      ]
    });

    header.appendChild(h2);
    header.appendChild(actionMenu.render());
    div.appendChild(header);

    div.insertAdjacentHTML('beforeend', `
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
            </div>

            <hr class="divider">

            <h3>Ajuda</h3>
            <p class="config-desc">Para reportar bugs ou sugestões, use o menu de ações acima (⚙️).</p>

            <div id="settingsFeedback" class="status-msg"></div>
            <div class="footer-info"></div>
        `);
    return div;
  }

  afterRender() {
    // Attach ConfigForm listeners
    this.configForm.attachListeners();

    // Attach Action Buttons listeners
    const btnManual = document.getElementById('btnManualAdd');
    const btnCurrent = document.getElementById('btnAddCurrent');
    const btnBatch = document.getElementById('btnBatchImport');

    if (btnManual) btnManual.onclick = () => this.addManualModal.open();
    if (btnBatch) btnBatch.onclick = () => this.batchImportModal.open();
    if (btnCurrent) btnCurrent.onclick = () => this.handleAddCurrent();
  }

  handleClearAll() {
    if (confirm('Tem certeza que deseja remover TODAS as matérias salvas? Essa ação não pode ser desfeita.')) {
      clearItems(() => this.feedback.show('Todas as matérias foram removidas.', 'success'));
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
