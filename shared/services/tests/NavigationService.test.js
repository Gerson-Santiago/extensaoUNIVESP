/**
 * @file shared/services/tests/NavigationService.test.js
 * @description Testes para o NavigationService (Breadcrumb Logic)
 */

import { NavigationService } from '../NavigationService.js';
import { Tabs } from '../../utils/Tabs.js';

// Mock Tabs.js
jest.mock('../../utils/Tabs.js');

describe('NavigationService', () => {
  beforeEach(() => {
    // Arrange (Default)
    jest.clearAllMocks();

    /** @type {jest.Mock} */ (Tabs.openOrSwitchTo).mockResolvedValue({
      id: 999,
      windowId: 111,
      url: 'http://week-url',
    });

    /** @type {jest.Mock} */ (chrome.scripting.executeScript).mockResolvedValue([{ result: true }]);
  });

  describe('openActivity', () => {
    const weekUrl =
      'https://ava.univesp.br/webapps/blackboard/content/listContent.jsp?course_id=_123_1&content_id=_WEEK_1';
    const activityId = '_ACTIVITY_1';

    it('deve garantir que a semana (pai) seja carregada antes de focar na atividade', async () => {
      // Arrange (implícito no beforeEach para weekUrl padrão de sucesso)

      // Act
      await NavigationService.openActivity(weekUrl, activityId);

      // Assert
      // 1. Deve abrir a semana
      expect(Tabs.openOrSwitchTo).toHaveBeenCalledWith(weekUrl);
    });

    it('deve executar script de scroll na aba correta', async () => {
      // Arrange
      const mockTab = { id: 888, windowId: 222, url: weekUrl };
      /** @type {jest.Mock} */ (Tabs.openOrSwitchTo).mockResolvedValue(mockTab);

      // Act
      await NavigationService.openActivity(weekUrl, activityId);

      // Assert
      // 2. Deve injetar script na aba retornada
      expect(chrome.scripting.executeScript).toHaveBeenCalledWith({
        target: { tabId: 888 },
        func: expect.any(Function), // A função de scroll
        args: [activityId],
      });
    });

    it('não deve tentar executar script se falhar ao abrir aba', async () => {
      // Arrange
      /** @type {jest.Mock} */ (Tabs.openOrSwitchTo).mockResolvedValue(null);

      // Act
      await NavigationService.openActivity(weekUrl, activityId);

      // Assert
      expect(chrome.scripting.executeScript).not.toHaveBeenCalled();
    });
  });
});
