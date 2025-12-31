// @ts-nocheck
/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';
import { RefreshHandler } from '../RefreshHandler.js';
import { Logger } from '../../../../../../shared/utils/Logger.js';

// Mock Modules with dynamic imports
jest.mock('../../../../services/WeekActivitiesService.js', () => ({
  WeekActivitiesService: {
    getActivities: jest.fn(),
  },
}));

const mockShow = jest.fn();

jest.mock('../../../../../../shared/ui/feedback/Toaster.js', () => ({
  Toaster: jest.fn(() => ({
    show: mockShow,
  })),
}));

jest.mock('../../../../../../shared/utils/Logger.js');

describe('RefreshHandler', () => {
  let mockWeek;
  let mockOnRefreshComplete;
  let handler;
  let mockBtn;

  beforeEach(() => {
    mockWeek = { id: 1, name: 'Semana 1', items: [], method: 'DOM' };
    mockOnRefreshComplete = jest.fn();
    handler = new RefreshHandler(mockWeek, mockOnRefreshComplete);

    // Mock Button
    mockBtn = document.createElement('button');
    mockBtn.textContent = 'Atualizar';
    mockBtn.disabled = false;

    jest.clearAllMocks();
  });

  it('deve atualizar a lista com sucesso', async () => {
    const { WeekActivitiesService } = await import('../../../../services/WeekActivitiesService.js');
    const mockItems = [{ id: 1, name: 'Item Novo' }];
    WeekActivitiesService.getActivities.mockResolvedValue(mockItems);

    const promise = handler.handleRefresh(mockBtn);

    // Check loading state immediately
    expect(mockBtn.disabled).toBe(true);
    expect(mockBtn.textContent).toBe('⏳');

    await promise;

    // Check success state
    expect(WeekActivitiesService.getActivities).toHaveBeenCalledWith(mockWeek, 'DOM');
    expect(mockWeek.items).toEqual(mockItems);
    expect(mockOnRefreshComplete).toHaveBeenCalled();

    // Check cleanup
    expect(mockBtn.disabled).toBe(false);
    expect(mockBtn.textContent).toBe('Atualizar');
  });

  it('deve lidar com erros durante a atualização', async () => {
    const { WeekActivitiesService } = await import('../../../../services/WeekActivitiesService.js');
    await import('../../../../../../shared/ui/feedback/Toaster.js');

    const mockError = new Error('Network Error');
    WeekActivitiesService.getActivities.mockRejectedValue(mockError);

    await handler.handleRefresh(mockBtn);

    expect(Logger.error).toHaveBeenCalledWith('RefreshHandler', 'Erro ao atualizar:', mockError);
    // Verificar Toaster
    expect(mockShow).toHaveBeenCalledWith('Erro ao atualizar lista. Tente novamente.', 'error');

    // Estado da view não deve mudar
    expect(mockWeek.items).toEqual([]);
    expect(mockOnRefreshComplete).not.toHaveBeenCalled();

    // Botão deve ser restaurado
    expect(mockBtn.disabled).toBe(false);
    expect(mockBtn.textContent).toBe('Atualizar');
  });

  it('não deve fazer nada se a semana não for fornecida', async () => {
    const emptyHandler = new RefreshHandler(null, mockOnRefreshComplete);
    await emptyHandler.handleRefresh(mockBtn);

    expect(mockBtn.disabled).toBe(false); // Should remain untouched (or false if checking strict logic)
    // Check logic: if (!this.week) return; -> doesn't touch button.
    // But button was initialized enabled.
    // If logic returns early, button props are not changed.
  });
});
