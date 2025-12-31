/**
 * @file shared/services/NavigationService.js
 * @description Serviço centralizado de navegação hierárquica (Breadcrumb Logic)
 * @architecture Service Layer
 */

import { Tabs } from '../utils/Tabs.js';
import { Logger } from '../utils/Logger.js';

/**
 * Configuração de timeouts e delays do NavigationService
 * @typedef {Object} NavigationConfig
 * @property {number} tabLoadTimeout - Timeout para aguardar carregamento da aba (ms)
 * @property {number} pageHydrationDelay - Delay extra para scripts da página (ms)
 * @property {number} observerTimeout - Timeout para MutationObserver desistir (ms)
 * @property {number} highlightDuration - Duração do efeito de highlight (ms)
 */

/**
 * Estratégia de busca de elementos no DOM
 * @typedef {Object} ScrollStrategy
 * @property {string} fullId - ID completo do elemento (ex: 'contentListItem:12345')
 * @property {string} shortId - ID sem prefixo (ex: '12345')
 * @property {string[]} selectors - Array de seletores CSS para tentar em cascata
 */

export class NavigationService {
  /**
   * Configuração padrão dos timeouts e delays
   * @type {NavigationConfig}
   */
  static config = {
    tabLoadTimeout: 10000,
    pageHydrationDelay: 800,
    observerTimeout: 10000,
    highlightDuration: 1500,
  };

  /**
   * Permite configurar timeouts (útil para testes e customização)
   * @param {Partial<NavigationConfig>} newConfig - Configuração parcial a sobrescrever
   */
  static configure(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Abre uma atividade garantindo o contexto da semana pai.
   * @param {string} weekUrl - URL da semana onde a atividade está listada
   * @param {string} activityId - ID do elemento HTML da atividade para scroll
   * @returns {Promise<void>} Não retorna valor. Erros são logados via Logger.
   * @note Futuramente migrar para SafeResult pattern (ADR-003) em breaking version
   */
  static async openActivity(weekUrl, activityId) {
    const NAMESPACE = 'NavigationService';
    /**#LOG_NAVIGATION*/
    Logger.debug(NAMESPACE, 'Iniciando openActivity', { weekUrl, activityId });

    // 1. Garantir Semana (Hierarquia do Breadcrumb)
    const tab = await Tabs.openOrSwitchTo(weekUrl);

    if (!tab || !tab.id) {
      /**#LOG_NAVIGATION*/
      Logger.error(NAMESPACE, 'Falha ao abrir aba da semana', { weekUrl });
      return;
    }

    // 1.5. Aguardar Carregamento (Se estiver carregando ou se mudou de URL)
    if (tab.status === 'loading') {
      /**#LOG_NAVIGATION*/
      Logger.debug(NAMESPACE, 'Aba ainda carregando, aguardando...', { tabId: tab.id });
      await new Promise((resolve) => {
        const listener = (tabId, info) => {
          if (tabId === tab.id && info.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);
            resolve();
          }
        };
        chrome.tabs.onUpdated.addListener(listener);
        // Timeout de segurança
        setTimeout(() => {
          chrome.tabs.onUpdated.removeListener(listener);
          resolve();
        }, NavigationService.config.tabLoadTimeout);
      });
      // Pequeno delay extra para scripts da página hidratarem
      await new Promise((r) => setTimeout(r, NavigationService.config.pageHydrationDelay));
    }

    // 2. Executar Scroll na Atividade com Robustez
    try {
      /**#LOG_NAVIGATION*/
      Logger.debug(NAMESPACE, 'Injetando script de scroll robusto', { tabId: tab.id, activityId });

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: injectedScrollLogic,
        args: [activityId, Logger.isEnabled()],
      });
    } catch (error) {
      /**#LOG_NAVIGATION*/
      Logger.error(NAMESPACE, 'Erro ao executar script de scroll', error);
    }
  }

  /**
   * Abre um curso na página principal (opcional, wrapper simples)
   * @param {string} courseUrl
   * @param {string|RegExp} [matchPattern] Pattern para identificar aba existente
   * @returns {Promise<chrome.tabs.Tab|undefined>}
   */
  static async openCourse(courseUrl, matchPattern = null) {
    return await Tabs.openOrSwitchTo(courseUrl, matchPattern);
  }
}

/**
 * Lógica injetada no contexto da página para realizar o scroll.
 * Exportada para permitir testes unitários isolados (JSDOM).
 *
 * @param {string} targetId - ID do elemento alvo
 * @param {boolean} isDebugEnabled - Se deve logar no console da página
 */
export const injectedScrollLogic = (targetId, isDebugEnabled) => {
  // --- INJECTED FUNCTION START ---
  const log = (msg, data = null) => {
    if (isDebugEnabled) {
      /**#LOG_INJECTED*/
      // eslint-disable-next-line no-console -- Console usado em função injetada no DOM para debug
      console.log(`[Extension:Scroll] ${msg}`, data || '');
    }
  };

  // 1. Tentar fechar modal/lightbox do AVA se existir
  const closeModal = () => {
    const closeBtn = document.querySelector('a.lbAction[href="#close"]');
    if (closeBtn) {
      try {
        /** @type {HTMLElement} */ (closeBtn).click();
        log('Modal/Lightbox fechado');
      } catch (e) {
        log('Erro ao fechar modal', e);
      }
    }
  };
  closeModal();

  // 2. Estratégia de Identificação
  const normalizeStrategy = (id) => {
    const shortId = id.replace('contentListItem:', '');
    return {
      fullId: id.includes('contentListItem:') ? id : `contentListItem:${id}`,
      shortId: shortId,
      // Variações para querySelector
      selectors: [
        `#${id.includes('contentListItem:') ? id.replace(/:/g, '\\:') : 'contentListItem\\:' + id}`, // ID exato escapado
        `li[id^="contentListItem:${shortId}"]`, // Começa com
        `li[id*="${shortId}"]`, // Contém
        `#${shortId}`, // ID curto direto (fallback raro)
      ],
    };
  };

  const { fullId, shortId, selectors } = normalizeStrategy(targetId);
  log('Estratégia de Busca', { fullId, shortId, selectors });

  // 3. Função de busca imediata
  const findElement = () => {
    // A. ID Direto (mais rápido)
    let el = document.getElementById(fullId) || document.getElementById(shortId);
    if (el) return el;

    // B. Query Selectors (mais flexível)
    for (const sel of selectors) {
      el = document.querySelector(sel);
      if (el) return el;
    }
    return null;
  };

  // 4. Highlight Visual
  const highlightElement = (element) => {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Efeito visual forte
    const originalTransition = element.style.transition;
    const originalBg = element.style.backgroundColor;
    const originalOutline = element.style.outline;

    element.style.transition = 'all 0.5s ease-in-out';
    element.style.backgroundColor = '#fff3cd'; // Amarelo suave fundo
    element.style.outline = '2px solid #ffc107'; // Borda dourada

    // Remover efeito após 1.5s
    setTimeout(() => {
      element.style.backgroundColor = originalBg;
      element.style.outline = originalOutline;
      log('✨ Highlight removido após 1.5s');
      setTimeout(() => {
        element.style.transition = originalTransition;
      }, 500);
    }, 1500);
  };

  // 5. Execução com MutationObserver (Espiar o DOM)
  const element = findElement();
  if (element) {
    log('Elemento encontrado imediatamente!');
    highlightElement(element);
    return; // Sucesso imediato
  }

  log('Elemento não encontrado de imediato. Iniciando MutationObserver...');

  // Se não achou, observa mudanças no DOM (conteúdo carregado via AJAX)
  const observer = new MutationObserver((mutations, obs) => {
    const el = findElement();
    if (el) {
      log('Elemento encontrado via MutationObserver!');
      highlightElement(el);
      obs.disconnect(); // Parar de observar
    }
  });

  // Observar o corpo principal ou fallback para body
  const container = document.getElementById('region-main') || document.body;
  observer.observe(container, { childList: true, subtree: true });

  // Timeout final para desistir e poupar recursos
  // Nota: Este valor vem de NavigationService.config.observerTimeout injetado como argumento
  setTimeout(() => {
    observer.disconnect();
    log('Timeout: Elemento não encontrado após timeout configurado.');
  }, 10000); // Valor padrão, será substituído por injeção

  // --- INJECTED FUNCTION END ---
};
