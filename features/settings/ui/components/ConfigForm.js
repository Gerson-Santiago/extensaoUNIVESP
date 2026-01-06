// @ts-check
import { RaManager } from '../../../../features/session/logic/SessionManager.js';
import { DomainManager } from '../../logic/EmailDomainValidator.js';
import { DOMSafe } from '../../../../shared/utils/DOMSafe.js';

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

    return h('div', { className: 'settings-content' }, [
      h('h3', {}, 'Configurar Acesso'),
      h('p', { className: 'config-desc' }, 'Configuração para preenchimento automático (Login).'),
      inputGroup,
      saveRow,
    ]);
  }

  attachListeners() {
    this.setupLoadData();
    this.setupSaveActions();
    this.setupResetDomain();
  }

  setupLoadData() {
    const raInput = /** @type {HTMLInputElement} */ (document.getElementById('raInput'));
    const domainInput = /** @type {HTMLInputElement} */ (document.getElementById('domainInput'));

    chrome.storage.sync.get(['userEmail', 'customDomain'], (result) => {
      const userEmail = /** @type {string} */ (result.userEmail || '');
      const customDomain = /** @type {string} */ (result.customDomain || '');

      const domain = DomainManager.getCurrentDomain(userEmail, customDomain);
      if (domainInput) domainInput.value = domain;

      if (userEmail && raInput) {
        raInput.value = RaManager.getRaFromEmail(userEmail);
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
