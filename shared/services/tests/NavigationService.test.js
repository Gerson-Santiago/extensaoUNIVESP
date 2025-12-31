/**
 * @file shared/services/tests/NavigationService.test.js
 * @description Testes unitários para NavigationService e lógica injetada (AAA Pattern)
 */

import { NavigationService, injectedScrollLogic } from '../NavigationService.js';
import { Tabs } from '../../utils/Tabs.js';
import { Logger } from '../../utils/Logger.js';

// Mocks
jest.mock('../../utils/Tabs.js');
jest.mock('../../utils/Logger.js');

/**
 * Cria mocks da Chrome API para testes.
 * Centraliza @ts-ignore em um único local conforme ADR-009.
 * @returns {any} Mock parcial do Chrome API
 */
function setupChromeApiMocks() {
  // @ts-ignore - Mock parcial da API do Chrome para ambiente de testes
  return {
    scripting: {
      executeScript: jest.fn().mockResolvedValue([{ result: true }]),
    },
    tabs: {
      onUpdated: {
        addListener: jest.fn(),
        removeListener: jest.fn(),
      },
    },
  };
}

describe('NavigationService', () => {
  const mockTab = { id: 123, status: 'complete' };

  beforeEach(() => {
    jest.clearAllMocks();

    // Configurar timeouts rápidos para testes
    NavigationService.configure({
      tabLoadTimeout: 100,
      pageHydrationDelay: 10,
    });

    Logger.isEnabled = jest.fn().mockReturnValue(false);

    // Mock Chrome API usando helper
    // @ts-ignore - Substituindo global.chrome por mock para testes
    global.chrome = /** @type {any} */ (setupChromeApiMocks());
  });

  describe('openActivity', () => {
    it('deve abrir a aba e injetar o script de scroll com sucesso', async () => {
      // Arrange
      /** @type {jest.Mock} */ (Tabs.openOrSwitchTo).mockResolvedValue(mockTab);
      const weekUrl = 'https://ava.univesp.br/week/1';
      const activityId = '12345';

      // Act
      await NavigationService.openActivity(weekUrl, activityId);

      // Assert
      expect(Tabs.openOrSwitchTo).toHaveBeenCalledWith(weekUrl);
      // CRÍTICO: Validamos a função exata (não expect.any) porque:
      // 1. Previne regressão se alguém trocar a implementação
      // 2. Garante que injectedScrollLogic exportada é a mesma injetada
      // 3. Permite refactoring seguro com confiança nos testes
      expect(chrome.scripting.executeScript).toHaveBeenCalledWith({
        target: { tabId: mockTab.id },
        func: injectedScrollLogic, // Referência exata, não matcher genérico
        args: [activityId, false], // Logger.isEnabled() returns false
      });
    });

    it('deve logar erro se falhar ao abrir aba', async () => {
      // Arrange
      /** @type {jest.Mock} */ (Tabs.openOrSwitchTo).mockResolvedValue(null);

      // Act
      await NavigationService.openActivity('url', 'id');

      // Assert
      expect(Logger.error).toHaveBeenCalledWith(
        'NavigationService',
        'Falha ao abrir aba da semana',
        expect.any(Object)
      );
      expect(chrome.scripting.executeScript).not.toHaveBeenCalled();
    });

    it('deve tratar erro na execução do script', async () => {
      // Arrange
      /** @type {jest.Mock} */ (Tabs.openOrSwitchTo).mockResolvedValue(mockTab);
      const error = new Error('Script error');
      // @ts-ignore - Mock configuration
      chrome.scripting.executeScript.mockRejectedValue(error);

      // Act
      await NavigationService.openActivity('url', 'id');

      // Assert
      expect(Logger.error).toHaveBeenCalledWith(
        'NavigationService',
        'Erro ao executar script de scroll',
        error
      );
    });

    it('deve aguardar tab.status === "loading" antes de injetar script', async () => {
      // Arrange
      const loadingTab = { id: 456, status: 'loading' };
      /** @type {jest.Mock} */ (Tabs.openOrSwitchTo).mockResolvedValue(loadingTab);

      // Mock do listener para simular completamento da tab
      // @ts-ignore - Mock do Jest não é reconhecido pelo TypeScript
      chrome.tabs.onUpdated.addListener.mockImplementation((callback) => {
        // Simula o evento onUpdated após um pequeno delay
        setTimeout(() => {
          callback(456, { status: 'complete' });
        }, 50);
      });

      // Act
      await NavigationService.openActivity('https://ava.univesp.br/week/2', '67890');

      // Assert
      expect(chrome.tabs.onUpdated.addListener).toHaveBeenCalled();
      expect(chrome.tabs.onUpdated.removeListener).toHaveBeenCalled();
      expect(chrome.scripting.executeScript).toHaveBeenCalledWith({
        target: { tabId: 456 },
        func: injectedScrollLogic,
        args: ['67890', false],
      });
    });
  });

  describe('openCourse', () => {
    it('deve chamar Tabs.openOrSwitchTo com URL e pattern', async () => {
      // Arrange
      const courseUrl = 'https://ava.univesp.br/course/123';
      const matchPattern = /course\/123/;
      const mockCourseTab = { id: 789, url: courseUrl };
      /** @type {jest.Mock} */ (Tabs.openOrSwitchTo).mockResolvedValue(mockCourseTab);

      // Act
      const result = await NavigationService.openCourse(courseUrl, matchPattern);

      // Assert
      expect(Tabs.openOrSwitchTo).toHaveBeenCalledWith(courseUrl, matchPattern);
      expect(result).toEqual(mockCourseTab);
    });
  });

  describe('injectedScrollLogic (JSDOM)', () => {
    let mockElement;

    beforeEach(() => {
      document.body.innerHTML = '<div id="app"></div>';
      mockElement = document.createElement('li');
      mockElement.id = 'contentListItem:12345';
      mockElement.scrollIntoView = jest.fn();
      mockElement.style.transition = '';
      mockElement.style.backgroundColor = '';
      mockElement.style.outline = '';

      // @ts-ignore - Mock de MutationObserver para testes
      global.MutationObserver = class {
        constructor(cb) {
          this.cb = cb;
        }
        observe() {}
        disconnect() {}
      };
    });

    it('deve encontrar elemento pelo ID completo e aplicar highlight', () => {
      // Arrange
      document.body.appendChild(mockElement);
      jest.useFakeTimers();

      // Act
      injectedScrollLogic('contentListItem:12345', false);

      // Assert
      expect(mockElement.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'center',
      });
      // Note: JSDOM might parse colors differently, checking logical call
      expect(mockElement.style.backgroundColor).not.toBe('');

      jest.runAllTimers();
    });

    it('deve encontrar elemento pelo ID curto', () => {
      // Arrange
      mockElement.id = '12345'; // Short ID case
      document.body.appendChild(mockElement);

      // Act
      injectedScrollLogic('contentListItem:12345', false); // Target expects full logic to fallback

      // Assert
      expect(mockElement.scrollIntoView).toHaveBeenCalled();
    });

    it('deve fechar modal (lbAction) se presente', () => {
      // Arrange
      const modalClose = document.createElement('a');
      modalClose.className = 'lbAction';
      modalClose.href = '#close';
      modalClose.click = jest.fn();
      document.body.appendChild(modalClose);

      // Act
      injectedScrollLogic('non-existent', false);

      // Assert
      expect(modalClose.click).toHaveBeenCalled();
    });

    it('deve usar MutationObserver se elemento não encontrado imediatamente', () => {
      // Arrange
      jest.useFakeTimers();
      const observerMock = { observe: jest.fn(), disconnect: jest.fn() };
      // @ts-ignore - Mock configuration
      global.MutationObserver = jest.fn((cb) => {
        observerMock.cb = cb;
        return observerMock;
      });

      // Act
      injectedScrollLogic('contentListItem:delayed', true);

      // Assert
      expect(global.MutationObserver).toHaveBeenCalled();
      expect(observerMock.observe).toHaveBeenCalled();

      // Simulate Mutation
      const delayedElement = document.createElement('div');
      delayedElement.id = 'contentListItem:delayed';
      delayedElement.scrollIntoView = jest.fn();
      document.body.appendChild(delayedElement);

      // Trigger observer callback
      observerMock.cb([], observerMock);

      expect(delayedElement.scrollIntoView).toHaveBeenCalled();
      expect(observerMock.disconnect).toHaveBeenCalled();
    });
  });
});
