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

  it('deve alternar a exibição do preview ao clicar na mesma semana duas vezes (toggle)', async () => {
    // Preparar (Arrange)
    const mockItems = [{ name: 'V1', status: 'DONE', type: 'video', url: 'http://test.com/1' }];
    /** @type {jest.Mock} */ (WeekActivitiesService.getActivities).mockResolvedValue(mockItems);

    const semana = { name: 'Semana 1', url: 'http://ava.com/semana1' };
    const elementoReal = document.createElement('div');
    elementoReal.className = 'week-item';

    // Agir (Act) - Primeiro clique para mostrar
    await view.showPreview(semana, elementoReal);

    // Verificar (Assert)
    expect(view.activeWeek).toBe(semana);
    expect(elementoReal.classList.contains('week-item-active')).toBe(true);

    // Agir (Act) - Simular existência do preview e clicar novamente para esconder
    const previewDiv = document.createElement('div');
    previewDiv.className = 'week-preview-dynamic';
    elementoReal.insertAdjacentElement('afterend', previewDiv);

    await view.showPreview(semana, elementoReal);

    // Verificar (Assert)
    expect(view.activeWeek).toBe(semana); // Mantém a referência por UX
    expect(document.querySelector('.week-preview-dynamic')).toBeNull();
  });

  it('deve remover o preview anterior ao trocar de semana clicada', async () => {
    // Preparar (Arrange)
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

    // Agir (Act) - Clicar na semana 1
    await view.showPreview(semana1, el1);

    // Verificar (Assert)
    expect(view.activeWeek).toBe(semana1);
    expect(el1.classList.contains('week-item-active')).toBe(true);

    // Agir (Act) - Clicar na semana 2
    await view.showPreview(semana2, el2);

    // Verificar (Assert)
    expect(view.activeWeek).toBe(semana2);
    expect(el1.classList.contains('week-item-active')).toBe(false);
    expect(el2.classList.contains('week-item-active')).toBe(true);
  });

  it('deve limpar o estado ativo caso ocorra erro na coleta de atividades', async () => {
    // Preparar (Arrange)
    /** @type {jest.Mock} */ (WeekActivitiesService.getActivities).mockRejectedValue(
      new Error('Falha na coleta')
    );

    const semana = { name: 'Semana Erro', url: 'http://ava.com/erro' };
    const el = document.createElement('div');
    el.className = 'week-item';

    // Agir (Act)
    await view.showPreview(semana, el);

    // Verificar (Assert)
    expect(el.classList.contains('week-item-active')).toBe(false);
    expect(view.activeWeek).toBeNull();
  });
});
