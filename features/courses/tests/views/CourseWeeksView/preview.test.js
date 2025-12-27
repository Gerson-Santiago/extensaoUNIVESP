/**
 * @jest-environment jsdom
 */
import { CourseWeeksView } from '../../../views/CourseWeeksView/index.js';
import { WeekActivitiesService } from '../../../services/WeekActivitiesService.js';

// Mock dependencies
jest.mock('../../../services/WeekActivitiesService.js');

describe('CourseWeeksView - Preview de Semanas', () => {
  let view;
  let mockCallbacks;

  beforeEach(() => {
    mockCallbacks = {
      onBack: jest.fn(),
      onOpenCourse: jest.fn(),
    };
    view = new CourseWeeksView(mockCallbacks);
    document.body.innerHTML = '';

    // Reset mocks
    jest.clearAllMocks();
  });

  describe('showPreview', () => {
    it('deve mostrar o preview legado quando o botão de tarefas da semana é clicado', async () => {
      // Arrange (Preparar)
      const mockItens = [
        { name: 'T1', status: 'DONE', type: 'video', url: 'http://teste.com/1' },
        { name: 'T2', status: 'TODO', type: 'pdf', url: 'http://teste.com/2' },
      ];
      /** @type {jest.Mock} */ (WeekActivitiesService.getActivities).mockResolvedValue(mockItens);

      const semana = { name: 'Semana 1', url: 'http://ava.univesp.br/week1', items: [] };
      view.setCourse({ name: 'Curso de Teste', weeks: [semana] });

      const elemento = view.render();
      document.body.appendChild(elemento);
      view.afterRender();

      // Act (Agir)
      await view.showPreview(semana); // Chama sem elemento = legado

      // Assert (Verificar)
      const previewLegado = document.getElementById('activeWeekPreview');
      expect(previewLegado).toBeTruthy();
      expect(previewLegado.style.display).toBe('block');
      expect(previewLegado.textContent).toContain('Semana 1');
    });

    it('deve mostrar o preview dinâmico quando o elemento da semana é fornecido', async () => {
      // Arrange (Preparar)
      const mockItens = [{ name: 'T1', status: 'DONE' }];
      /** @type {jest.Mock} */ (WeekActivitiesService.getActivities).mockResolvedValue(mockItens);

      const semana = { name: 'Semana Dinâmica', url: 'http://ava.univesp.br/dinamica' };
      const elSemana = document.createElement('div');
      elSemana.className = 'week-item';
      document.body.appendChild(elSemana);

      // Act (Agir)
      await view.showPreview(semana, elSemana);

      // Assert (Verificar)
      const previewDinamico = document.querySelector('.week-preview-dynamic');
      expect(previewDinamico).toBeTruthy();
      expect(previewDinamico.textContent).toContain('Semana Dinâmica');
      expect(previewDinamico.previousElementSibling).toBe(elSemana);
    });

    it('deve renderizar os ícones de status corretamente no preview', async () => {
      // Arrange (Preparar)
      const mockItens = [
        { name: 'T1', status: 'DONE', type: 'video', url: 'http://teste.com/1' },
        { name: 'T2', status: 'DONE', type: 'pdf', url: 'http://teste.com/2' },
        { name: 'T3', status: 'TODO', type: 'quiz', url: 'http://teste.com/3' },
      ];
      /** @type {jest.Mock} */ (WeekActivitiesService.getActivities).mockResolvedValue(mockItens);

      const semana = { name: 'Semana 1', url: 'http://ava.univesp.br/week1', items: [] };
      view.setCourse({ name: 'Curso de Teste', weeks: [semana] });

      const elemento = view.render();
      document.body.appendChild(elemento);
      view.afterRender();

      // Act (Agir)
      await view.showPreview(semana);

      // Assert (Verificar)
      const statusDiv = document.getElementById('previewStatus');
      expect(statusDiv).toBeTruthy();
      expect(statusDiv.textContent).toBe('✅✅🔵');
    });

    it('deve calcular o progresso corretamente no preview', async () => {
      // Arrange
      const mockItens = [
        { name: 'T1', status: 'DONE', type: 'video', url: 'http://teste.com/1' },
        { name: 'T2', status: 'DONE', type: 'pdf', url: 'http://teste.com/2' },
        { name: 'T3', status: 'TODO', type: 'quiz', url: 'http://teste.com/3' },
      ];
      /** @type {jest.Mock} */ (WeekActivitiesService.getActivities).mockResolvedValue(mockItens);

      const semana = { name: 'Semana 1', url: 'http://ava.univesp.br/week1', items: [] };
      view.setCourse({ name: 'Curso de Teste', weeks: [semana] });

      const elemento = view.render();
      document.body.appendChild(elemento);
      view.afterRender();

      // Act
      await view.showPreview(semana);

      // Assert
      const progressDiv = document.getElementById('previewProgress');
      expect(progressDiv).toBeTruthy();
      // 2 CONCLUÍDAS de 3 = 67%
      expect(progressDiv.textContent).toContain('67%');
    });

    it('deve lidar com erros de coleta graciosamente no preview', async () => {
      // Arrange (Preparar)
      /** @type {jest.Mock} */ (WeekActivitiesService.getActivities).mockRejectedValue(
        new Error('Falha na coleta')
      );

      const semana = { name: 'Semana 1', url: 'http://ava.univesp.br/semana1', items: [] };
      view.setCourse({ name: 'Curso de Teste', weeks: [semana] });

      const elemento = view.render();
      document.body.appendChild(elemento);
      view.afterRender();

      // Act & Assert (Agir e Verificar - Não deve lançar erro)
      await expect(view.showPreview(semana)).resolves.not.toThrow();

      // Assert (Verificar UI)
      const preview = document.getElementById('activeWeekPreview');
      expect(preview).toBeTruthy();
    });

    it('deve esconder o preview dinâmico quando hidePreview é chamado', async () => {
      // Arrange
      const mockItens = [{ name: 'T1', status: 'DONE' }];
      /** @type {jest.Mock} */ (WeekActivitiesService.getActivities).mockResolvedValue(mockItens);

      const semana = { name: 'Semana 1', url: 'http://ava.univesp.br/week1' };
      const elSemana = document.createElement('div');
      elSemana.className = 'week-item';
      document.body.appendChild(elSemana);

      // Act
      await view.showPreview(semana, elSemana);
      expect(document.querySelector('.week-preview-dynamic')).toBeTruthy();

      view.hidePreview();

      // Assert
      expect(document.querySelector('.week-preview-dynamic')).toBeNull();
    });

    it('deve esconder o preview legado quando hidePreview é chamado', () => {
      // Arrange
      const preview = document.createElement('div');
      preview.id = 'activeWeekPreview';
      preview.style.display = 'block';
      document.body.appendChild(preview);

      // Act
      view.hidePreview();

      // Assert
      expect(preview.style.display).toBe('none');
    });
  });
});
