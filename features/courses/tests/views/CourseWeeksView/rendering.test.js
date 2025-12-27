/**
 * @jest-environment jsdom
 */
import { CourseWeeksView } from '../../../views/CourseWeeksView/index.js';
import { WeekActivitiesService } from '../../../services/WeekActivitiesService.js';

// Mock dependencies
jest.mock('../../../services/WeekActivitiesService.js');

describe('CourseWeeksView - Comportamento de Preview Dinâmico', () => {
  let view;

  beforeEach(() => {
    view = new CourseWeeksView({ onBack: jest.fn(), onOpenCourse: jest.fn() });
    jest.clearAllMocks();
  });

  it('deve alternar a exibição do preview ao clicar na mesma semana duas vezes', async () => {
    // Arrange (Preparar)
    const mockItems = [{ name: 'T1', status: 'DONE', type: 'video', url: 'http://test.com/1' }];
    /** @type {jest.Mock} */ (WeekActivitiesService.getActivities).mockResolvedValue(mockItems);

    const semana = { name: 'Semana 1', url: 'http://ava.com/semana1' };
    const elementoReal = document.createElement('div');
    elementoReal.className = 'week-item';

    // Act (Agir) - Primeiro clique para mostrar
    await view.showPreview(semana, elementoReal);

    // Assert (Verificar)
    expect(view.activeWeek).toBe(semana);
    expect(elementoReal.classList.contains('week-item-active')).toBe(true);

    // Act (Agir) - Segundo clique para esconder
    // Simulamos a existência do preview para o toggle
    const previewDiv = document.createElement('div');
    previewDiv.className = 'week-preview-dynamic';
    elementoReal.insertAdjacentElement('afterend', previewDiv);

    await view.showPreview(semana, elementoReal);

    // Assert (Verificar)
    expect(view.activeWeek).toBe(semana); // Continua ativa (UX)
    expect(document.querySelector('.week-preview-dynamic')).toBeNull();
  });

  it('deve remover o preview anterior ao clicar em uma semana diferente', async () => {
    // Arrange (Preparar)
    const mockItems = [{ name: 'T1', status: 'DONE' }];
    /** @type {jest.Mock} */ (WeekActivitiesService.getActivities).mockResolvedValue(mockItems);

    const semana1 = { name: 'Semana 1', url: 'http://ava.com/semana1' };
    const semana2 = { name: 'Semana 2', url: 'http://ava.com/semana2' };
    const el1 = document.createElement('div');
    el1.className = 'week-item';
    const el2 = document.createElement('div');
    el2.className = 'week-item';

    document.body.appendChild(el1);
    document.body.appendChild(el2);

    // Act (Agir) - Clicar na semana 1
    await view.showPreview(semana1, el1);

    // Assert (Verificar)
    expect(view.activeWeek).toBe(semana1);
    expect(el1.classList.contains('week-item-active')).toBe(true);

    // Act (Agir) - Clicar na semana 2
    await view.showPreview(semana2, el2);

    // Assert (Verificar)
    expect(view.activeWeek).toBe(semana2);
    expect(el1.classList.contains('week-item-active')).toBe(false);
    expect(el2.classList.contains('week-item-active')).toBe(true);
  });

  it('deve lidar com erros de coleta e remover o estado ativo', async () => {
    // Arrange (Preparar)
    /** @type {jest.Mock} */ (WeekActivitiesService.getActivities).mockRejectedValue(
      new Error('Falha na coleta')
    );

    const semana = { name: 'Semana Erro', url: 'http://ava.com/erro' };
    const el = document.createElement('div');
    el.className = 'week-item';

    // Act (Agir)
    await view.showPreview(semana, el);

    // Assert (Verificar)
    expect(el.classList.contains('week-item-active')).toBe(false);
    expect(view.activeWeek).toBeNull();
  });
});
