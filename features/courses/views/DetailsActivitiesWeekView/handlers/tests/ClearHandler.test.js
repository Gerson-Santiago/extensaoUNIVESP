// @ts-nocheck
/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals';
import { ClearHandler } from '../ClearHandler.js';
import { WeekActivitiesService } from '../../../../services/WeekActivitiesService.js';
import { Logger } from '../../../../../../shared/utils/Logger.js';

// Mock Dependencies
jest.mock('../../../../services/WeekActivitiesService.js');
jest.mock('../../../../../../shared/utils/Logger.js');

describe('ClearHandler', () => {
  let mockWeek;
  let mockOnBack;
  let handler;
  let originalConfirm;
  let originalAlert;

  beforeEach(() => {
    mockWeek = { id: 1, name: 'Semana 1' };
    mockOnBack = jest.fn();
    handler = new ClearHandler(mockWeek, mockOnBack);

    // Mock Window methods
    originalConfirm = window.confirm;
    originalAlert = window.alert;
    window.confirm = jest.fn();
    window.alert = jest.fn();

    // Reset Mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    window.confirm = originalConfirm;
    window.alert = originalAlert;
  });

  it('deve cancelar a ação se o usuário não confirmar', async () => {
    window.confirm.mockReturnValue(false);

    await handler.handleClear();

    expect(window.confirm).toHaveBeenCalled();
    expect(WeekActivitiesService.clearCache).not.toHaveBeenCalled();
    expect(mockOnBack).not.toHaveBeenCalled();
  });

  it('deve limpar o cache e voltar se o usuário confirmar', async () => {
    window.confirm.mockReturnValue(true);
    WeekActivitiesService.clearCache.mockResolvedValue();

    await handler.handleClear();

    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringContaining('Deseja limpar o cache de atividades')
    );
    expect(WeekActivitiesService.clearCache).toHaveBeenCalledWith(mockWeek);
    expect(mockOnBack).toHaveBeenCalled();
  });

  it('deve lidar com erros ao limpar cache', async () => {
    window.confirm.mockReturnValue(true);
    const mockError = new Error('Falha no cache');
    WeekActivitiesService.clearCache.mockRejectedValue(mockError);

    await handler.handleClear();

    expect(WeekActivitiesService.clearCache).toHaveBeenCalled();
    expect(Logger.error).toHaveBeenCalledWith('ClearHandler', 'Erro ao limpar cache:', mockError);
    expect(window.alert).toHaveBeenCalledWith('Erro ao limpar cache. Tente novamente.');
    expect(mockOnBack).not.toHaveBeenCalled();
  });

  it('não deve fazer nada se a semana não for fornecida', async () => {
    const emptyHandler = new ClearHandler(null, mockOnBack);
    await emptyHandler.handleClear();
    expect(window.confirm).not.toHaveBeenCalled();
  });
});
