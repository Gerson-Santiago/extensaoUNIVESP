/**
 * @jest-environment jsdom
 */
import { CourseWeeksView } from '../../../views/CourseWeeksView/index.js';

describe('CourseWeeksView - Cálculo de Progresso', () => {
  let view;
  let mockCallbacks;

  beforeEach(() => {
    mockCallbacks = {
      onBack: jest.fn(),
      onOpenCourse: jest.fn(),
    };
    view = new CourseWeeksView(mockCallbacks);
    document.body.innerHTML = '';
  });

  describe('calculateProgress', () => {
    it('deve retornar 0% para lista de itens vazia', () => {
      // Arrange
      const itens = [];

      // Act
      const progresso = view.calculateProgress(itens);

      // Assert
      expect(progresso).toBe(0);
    });

    it('deve retornar 100% quando todos os itens estão CONCLUÍDOS', () => {
      // Arrange
      const itens = [
        { name: 'T1', status: 'DONE' },
        { name: 'T2', status: 'DONE' },
      ];

      // Act
      const progresso = view.calculateProgress(itens);

      // Assert
      expect(progresso).toBe(100);
    });

    it('deve retornar 0% quando todos os itens estão A FAZER', () => {
      // Arrange
      const itens = [
        { name: 'T1', status: 'TODO' },
        { name: 'T2', status: 'TODO' },
      ];

      // Act
      const progresso = view.calculateProgress(itens);

      // Assert
      expect(progresso).toBe(0);
    });

    it('deve lidar com itens sem status (considerar A FAZER por padrão)', () => {
      // Arrange
      const itens = [
        { name: 'T1', status: 'DONE' },
        { name: 'T2' }, // sem status
      ];

      // Act
      const progresso = view.calculateProgress(itens);

      // Assert
      expect(progresso).toBe(50);
    });
  });

  describe('renderStatusIcons', () => {
    it('deve renderizar os ícones corretos para cada status', () => {
      // Arrange
      const itens = [
        { name: 'T1', status: 'DONE' },
        { name: 'T2', status: 'TODO' },
        { name: 'T3' }, // sem status = TODO
      ];

      // Act
      const icones = view.renderStatusIcons(itens);

      // Assert
      expect(icones).toBe('✅🔵🔵');
    });

    it('deve retornar string vazia para lista de itens vazia', () => {
      // Arrange
      const itens = [];

      // Act
      const icones = view.renderStatusIcons(itens);

      // Assert
      expect(icones).toBe('');
    });
  });
});
