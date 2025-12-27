/**
 * @file DetailsActivitiesWeekView.test.js
 * @description Testes para DetailsActivitiesWeekView
 */

import { DetailsActivitiesWeekView } from '../../views/DetailsActivitiesWeekView/index.js';
import { NavigationService } from '../../../../shared/services/NavigationService.js';

jest.mock('../../../../shared/services/NavigationService.js');

describe('DetailsActivitiesWeekView', () => {
  let view;
  let mockCallbacks;

  beforeEach(() => {
    mockCallbacks = {
      onBack: jest.fn(),
    };
    view = new DetailsActivitiesWeekView(mockCallbacks);
  });

  describe('setWeek', () => {
    it('deve definir a semana corretamente', () => {
      // Preparar (Arrange)
      const week = {
        name: 'Semana 1',
        url: 'http://ava.univesp.br/semana1',
        items: [],
      };

      // Agir (Act)
      view.setWeek(week);

      // Verificar (Assert)
      expect(view.week).toEqual(week);
    });
  });

  describe('render', () => {
    it('deve renderizar estrutura básica', () => {
      // Preparar (Arrange)
      view.setWeek({
        name: 'Semana 1',
        url: 'http://ava.univesp.br/semana1',
        items: [],
      });

      // Agir (Act)
      const element = view.render();

      // Verificar (Assert)
      expect(element.className).toBe('view-details-activities');
      expect(element.querySelector('.details-header')).toBeTruthy();
      expect(element.querySelector('#activitiesContainer')).toBeTruthy();
    });

    it('deve exibir nome da semana no título', () => {
      // Preparar (Arrange)
      view.setWeek({
        name: 'Semana 3 - Cálculo',
        url: 'http://ava.univesp.br/semana3',
        items: [],
      });

      // Agir (Act)
      const element = view.render();
      const title = element.querySelector('h2');

      // Verificar (Assert)
      expect(title.textContent).toContain('Semana 3 - Cálculo');
    });
  });

  describe('scrollToActivity', () => {
    it('deve chamar NavigationService.openActivity com URL da semana', async () => {
      // Preparar (Arrange)
      const week = {
        name: 'Semana 1',
        url: 'http://ava.univesp.br/semana1',
        items: [],
      };
      view.setWeek(week);

      // Agir (Act)
      await view.scrollToActivity('activity-123', 'http://fallback.com');

      // Verificar (Assert)
      expect(NavigationService.openActivity).toHaveBeenCalledWith(week.url, 'activity-123');
    });

    it('deve chamar NavigationService.openCourse (fallback) se não houver URL da semana', async () => {
      // Preparar (Arrange)
      view.setWeek({ name: 'Semana X', items: [] }); // Sem URL

      // Agir (Act)
      await view.scrollToActivity('activity-123', 'http://fallback.com');

      // Verificar (Assert)
      expect(NavigationService.openCourse).toHaveBeenCalledWith('http://fallback.com');
    });
  });
});
