import { RefreshHandler } from '../RefreshHandler.js';
import { WeekActivitiesService } from '../../../../services/WeekActivitiesService.js';
import { Logger } from '../../../../../../shared/utils/Logger.js';

// Mocks
jest.mock('../../../../services/WeekActivitiesService');
jest.mock('../../../../../../shared/utils/Logger');
jest.mock('../../../../../../shared/ui/feedback/Toaster', () => ({
  Toaster: jest.fn().mockImplementation(() => ({
    show: jest.fn(),
  })),
}));

describe('RefreshHandler', () => {
  let handler;
  let mockWeek;
  let mockOnRefreshComplete;
  let mockBtn;

  beforeEach(() => {
    jest.clearAllMocks();
    mockWeek = { name: 'Semana 1', items: [], method: 'DOM' };
    mockOnRefreshComplete = jest.fn();
    mockBtn = { textContent: 'Refresh', disabled: false };

    handler = new RefreshHandler(mockWeek, mockOnRefreshComplete);
  });

  it('deve inicializar corretamente', () => {
    expect(handler.week).toBe(mockWeek);
    expect(handler.onRefreshComplete).toBe(mockOnRefreshComplete);
  });

  it('não deve fazer nada se week não existir', async () => {
    handler.week = null;
    await handler.handleRefresh(mockBtn);
    expect(WeekActivitiesService.getActivities).not.toHaveBeenCalled();
  });

  it('deve executar o ciclo de refresh com sucesso', async () => {
    const mockItems = [{ title: 'Nova Atividade' }];
    /** @type {jest.Mock} */ (WeekActivitiesService.getActivities).mockResolvedValue(mockItems);

    await handler.handleRefresh(mockBtn);

    // Estado loading
    // Nota: Como é assíncrono, não conseguimos verificar o estado 'intermediário' facilmente sem hooks
    // Mas podemos verificar se ele restaurou o estado no final
    expect(mockBtn.disabled).toBe(false);
    expect(mockBtn.textContent).toBe('Refresh');

    // Chamadas
    expect(WeekActivitiesService.getActivities).toHaveBeenCalledWith(mockWeek, 'DOM');
    expect(handler.week.items).toBe(mockItems);
    expect(mockOnRefreshComplete).toHaveBeenCalled();
  });

  it('deve usar método padrão DOM se não especificado', async () => {
    delete mockWeek.method;
    /** @type {jest.Mock} */ (WeekActivitiesService.getActivities).mockResolvedValue([]);
    await handler.handleRefresh(mockBtn);
    expect(WeekActivitiesService.getActivities).toHaveBeenCalledWith(mockWeek, 'DOM');
  });

  it('deve lidar com erros durante o refresh', async () => {
    const error = new Error('Erro de conexão');
    /** @type {jest.Mock} */ (WeekActivitiesService.getActivities).mockRejectedValue(error);

    await handler.handleRefresh(mockBtn);

    expect(Logger.error).toHaveBeenCalledWith('RefreshHandler', 'Erro ao atualizar:', error);
    // Verificar se chamou Toaster (implícito pelo mock, mas bom validar integração se possível)

    // Estado restaurado
    expect(mockBtn.disabled).toBe(false);
    expect(mockBtn.textContent).toBe('Refresh');

    // Não atualiza callback
    expect(mockOnRefreshComplete).not.toHaveBeenCalled();
  });

  it('deve funcionar sem callback onRefreshComplete', async () => {
    handler = new RefreshHandler(mockWeek, null);
    /** @type {jest.Mock} */ (WeekActivitiesService.getActivities).mockResolvedValue([]);

    await handler.handleRefresh(mockBtn);

    expect(WeekActivitiesService.getActivities).toHaveBeenCalled();
    expect(handler.week.items).toEqual([]);
  });
});
