import { ClearHandler } from '../ClearHandler.js';
import { WeekActivitiesService } from '../../../../services/WeekActivitiesService.js';
import { Logger } from '../../../../../../shared/utils/Logger.js';

// Mocks
jest.mock('../../../../services/WeekActivitiesService');
jest.mock('../../../../../../shared/utils/Logger');

describe('ClearHandler', () => {
  let handler;
  let mockWeek;
  let mockOnBack;

  beforeEach(() => {
    jest.clearAllMocks();
    global.confirm = jest.fn();
    global.alert = jest.fn();

    mockWeek = { name: 'Semana 1', items: [1, 2, 3] };
    mockOnBack = jest.fn();
    handler = new ClearHandler(mockWeek, mockOnBack);
  });

  it('deve inicializar corretamente', () => {
    expect(handler.week).toBe(mockWeek);
    expect(handler.onBack).toBe(mockOnBack);
  });

  it('não deve fazer nada se week não existir', async () => {
    handler.week = null;
    await handler.handleClear();
    expect(global.confirm).not.toHaveBeenCalled();
  });

  it('não deve limpar se usuário cancelar', async () => {
    /** @type {jest.Mock} */ (global.confirm).mockReturnValue(false);
    await handler.handleClear();
    expect(global.confirm).toHaveBeenCalledWith(expect.stringContaining('Deseja limpar'));
    expect(WeekActivitiesService.clearCache).not.toHaveBeenCalled();
    expect(mockOnBack).not.toHaveBeenCalled();
  });

  it('deve limpar cache e voltar ao confirmar', async () => {
    /** @type {jest.Mock} */ (global.confirm).mockReturnValue(true);
    /** @type {jest.Mock} */ (WeekActivitiesService.clearCache).mockResolvedValue();

    await handler.handleClear();

    expect(WeekActivitiesService.clearCache).toHaveBeenCalledWith(mockWeek);
    expect(mockOnBack).toHaveBeenCalled();
    expect(global.alert).not.toHaveBeenCalled();
  });

  it('deve lidar com erro ao limpar cache', async () => {
    /** @type {jest.Mock} */ (global.confirm).mockReturnValue(true);
    const erroCache = new Error('Falha de cache');
    /** @type {jest.Mock} */ (WeekActivitiesService.clearCache).mockRejectedValue(erroCache);

    await handler.handleClear();

    expect(Logger.error).toHaveBeenCalledWith('ClearHandler', 'Erro ao limpar cache:', erroCache);
    expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Erro ao limpar'));
    expect(mockOnBack).not.toHaveBeenCalled();
  });

  it('deve funcionar sem callback onBack', async () => {
    handler = new ClearHandler(mockWeek, null);
    /** @type {jest.Mock} */ (global.confirm).mockReturnValue(true);
    /** @type {jest.Mock} */ (WeekActivitiesService.clearCache).mockResolvedValue();

    await handler.handleClear();

    expect(WeekActivitiesService.clearCache).toHaveBeenCalled();
  });
});
