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
    jest.clearAllMocks();

    // Default mocks
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

    it('Deve garantir que a semana (pai) seja carregada antes de focar na atividade', async () => {
      await NavigationService.openActivity(weekUrl, activityId);

      // 1. Deve abrir a semana
      expect(Tabs.openOrSwitchTo).toHaveBeenCalledWith(weekUrl);
    });

    it('Deve executar script de scroll na aba correta', async () => {
      const mockTab = { id: 888, windowId: 222, url: weekUrl };
      /** @type {jest.Mock} */ (Tabs.openOrSwitchTo).mockResolvedValue(mockTab);

      await NavigationService.openActivity(weekUrl, activityId);

      // 2. Deve injetar script na aba retornada
      expect(chrome.scripting.executeScript).toHaveBeenCalledWith({
        target: { tabId: 888 },
        func: expect.any(Function), // A função de scroll
        args: [activityId],
      });
    });

    it('Não deve tentar executar script se falhar ao abrir aba', async () => {
      /** @type {jest.Mock} */ (Tabs.openOrSwitchTo).mockResolvedValue(null);

      await NavigationService.openActivity(weekUrl, activityId);

      expect(chrome.scripting.executeScript).not.toHaveBeenCalled();
    });
  });
});
