import { RaManager } from '../../../features/session/logic/SessionManager.js';
import { DomainManager } from '../../../features/settings/logic/domainManager.js';
import { DOMSafe } from '../../../shared/utils/DOMSafe.js';

export class ConfigForm {
  /**
   * @param {Object} statusManager - Instância do Toaster
   */
  constructor(statusManager) {
    this.feedback = statusManager;
  }

  render() {
    // Helper para reduzir verbosidade
    const h = DOMSafe.createElement;

    const inputGroup = h('div', { className: 'input-group-row' }, [
      h('input', { type: 'text', id: 'raInput', className: 'input-field', placeholder: 'RA' }),
      h('div', { className: 'domain-wrapper' }, [
        h('input', {
          type: 'text',
          id: 'domainInput',
          className: 'input-field',
          placeholder: '@dominio.com',
        }),
        h(
          'button',
          { id: 'resetDomainBtn', className: 'btn-reset', title: 'Restaurar Padrão' },
          '↺'
        ),
      ]),
    ]);

    const saveRow = h('div', { style: { marginBottom: '20px' } }, [
      h('button', { id: 'saveConfigBtn', className: 'btn-save' }, 'Salvar Credenciais'),
      h('div', {
        id: 'configFeedback',
        className: 'status-msg',
        style: 'margin-top: 10px; display: none;',
      }),
    ]);

    const behaviorRow = h('div', { style: { marginBottom: '20px' } }, [
      h(
        'label',
        { style: 'display: flex; align-items: center; font-size: 13px; cursor: pointer;' },
        [
          h('input', { type: 'checkbox', id: 'popupToggle', style: { marginRight: '8px' } }),
          h('span', {}, 'Ativar Popup (Desativado por padrão)'),
        ]
      ),
    ]);

    return h('div', { className: 'settings-content' }, [
      h('h3', {}, 'Configurar Acesso'),
      h('p', { className: 'config-desc' }, 'Configuração para preenchimento automático (Login).'),
      inputGroup,
      saveRow,
      h('hr', { className: 'divider' }),
      h('h3', {}, 'Comportamento ao Clicar'),
      h(
        'p',
        { className: 'config-desc' },
        'Escolha o que acontece ao clicar no ícone da extensão.'
      ),
      behaviorRow,
    ]);
  }

  attachListeners() {
    this.setupLoadData();
    this.setupSaveActions();
    this.setupBehaviorActions();
    this.setupResetDomain();
  }

  setupLoadData() {
    const raInput = /** @type {HTMLInputElement} */ (document.getElementById('raInput'));
    const domainInput = /** @type {HTMLInputElement} */ (document.getElementById('domainInput'));
    const popupToggle = /** @type {HTMLInputElement} */ (document.getElementById('popupToggle'));

    chrome.storage.sync.get(['userEmail', 'customDomain', 'clickBehavior'], (result) => {
      const userEmail = /** @type {string} */ (result.userEmail || '');
      const customDomain = /** @type {string} */ (result.customDomain || '');

      const domain = DomainManager.getCurrentDomain(userEmail, customDomain);
      if (domainInput) domainInput.value = domain;

      if (userEmail && raInput) {
        raInput.value = RaManager.getRaFromEmail(userEmail);
      }

      // Load Behavior
      const savedBehavior = result.clickBehavior || 'sidepanel';
      if (popupToggle) {
        popupToggle.checked = savedBehavior === 'popup';
      }
    });
  }

  setupSaveActions() {
    const saveConfigBtn = document.getElementById('saveConfigBtn');
    const raInput = /** @type {HTMLInputElement} */ (document.getElementById('raInput'));
    const domainInput = /** @type {HTMLInputElement} */ (document.getElementById('domainInput'));

    if (saveConfigBtn) {
      saveConfigBtn.addEventListener('click', () => {
        const ra = raInput.value;
        const domain = domainInput.value;

        const { isValid, fullEmail, cleanDomain, error } = RaManager.prepareCredentials(ra, domain);

        if (!isValid) {
          alert(error);
          return;
        }

        chrome.storage.sync.set(
          {
            userEmail: fullEmail,
            customDomain: cleanDomain,
          },
          () => {
            this.feedback.show('Configuração salva com sucesso!', 'success');
          }
        );
      });
    }
  }

  setupBehaviorActions() {
    const popupToggle = /** @type {HTMLInputElement} */ (document.getElementById('popupToggle'));
    if (popupToggle) {
      popupToggle.addEventListener('change', (e) => {
        const target = /** @type {HTMLInputElement} */ (e.target);
        const behavior = target.checked ? 'popup' : 'sidepanel';
        chrome.storage.sync.set({ clickBehavior: behavior });
      });
    }
  }

  setupResetDomain() {
    const resetDomainBtn = document.getElementById('resetDomainBtn');
    const domainInput = /** @type {HTMLInputElement} */ (document.getElementById('domainInput'));
    if (resetDomainBtn) {
      resetDomainBtn.addEventListener('click', () => {
        domainInput.value = DomainManager.getDefaultDomain();
      });
    }
  }
}
