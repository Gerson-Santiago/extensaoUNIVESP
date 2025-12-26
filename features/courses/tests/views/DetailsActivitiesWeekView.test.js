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
      const week = {
        name: 'Semana 1',
        url: 'http://ava.univesp.br/semana1',
        items: [],
      };

      view.setWeek(week);

      expect(view.week).toEqual(week);
    });
  });

  describe('render', () => {
    it('deve renderizar estrutura básica', () => {
      view.setWeek({
        name: 'Semana 1',
        url: 'http://ava.univesp.br/semana1',
        items: [],
      });

      const element = view.render();

      expect(element.className).toBe('view-details-activities');
      expect(element.querySelector('.details-header')).toBeTruthy();
      expect(element.querySelector('#activitiesContainer')).toBeTruthy();
    });

    it('deve exibir nome da semana no título', () => {
      view.setWeek({
        name: 'Semana 3 - Cálculo',
        url: 'http://ava.univesp.br/semana3',
        items: [],
      });

      const element = view.render();
      const title = element.querySelector('h2');

      expect(title.textContent).toContain('Semana 3 - Cálculo');
    });
  });

  describe('getTypeIcon', () => {
    it('deve retornar ícone correto para cada tipo', () => {
      const icons = {
        VIDEOAULA: expect.stringMatching(/./),
        QUIZ: expect.stringMatching(/./),
        TEXTO_BASE: expect.stringMatching(/./),
        OUTROS: expect.stringMatching(/./),
      };

      Object.keys(icons).forEach((type) => {
        expect(view.getTypeIcon(type)).toBeTruthy();
        expect(typeof view.getTypeIcon(type)).toBe('string');
      });
    });
  });
  describe('scrollToActivity', () => {
    it('deve chamar NavigationService.openActivity com URL da semana', async () => {
      const week = {
        name: 'Semana 1',
        url: 'http://ava.univesp.br/semana1',
        items: [],
      };
      view.setWeek(week);

      await view.scrollToActivity('activity-123', 'http://fallback.com');

      expect(NavigationService.openActivity).toHaveBeenCalledWith(week.url, 'activity-123');
    });

    it('deve chamar NavigationService.openCourse (fallback) se não houver URL da semana', async () => {
      view.setWeek({ name: 'Semana X', items: [] }); // Sem URL

      await view.scrollToActivity('activity-123', 'http://fallback.com');

      expect(NavigationService.openCourse).toHaveBeenCalledWith('http://fallback.com');
    });
  });
});
