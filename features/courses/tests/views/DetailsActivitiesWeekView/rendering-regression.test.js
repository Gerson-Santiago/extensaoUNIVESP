/**
 * @file DetailsActivitiesWeekView.rendering-regression.test.js
 * @description Testes de Regressão: Blindagem contra Bug de "DOM Zumbi"
 *
 * CONTEXTO DO BUG (2025-12-29):
 * - O ActivityRenderer era cachado e guardava referência ao container antigo
 * - Quando a view era re-renderizada (skeleton → dados), um novo DOM era criado
 * - O renderer continuava renderizando no container ANTIGO (zumbi), invisível
 * - Resultado: Dados chegavam, logs mostravam sucesso, mas UI ficava travada no Skeleton
 *
 * SOLUÇÃO:
 * - Sempre criar novo ActivityRenderer com container fresco do elemento atual
 * - Garantir que `this.element` seja a fonte de verdade para queries
 *
 * OBJETIVO DESTES TESTES:
 * - Prevenir regressão se alguém voltar a cachear o renderer ou container
 * - Validar que múltiplas renderizações não quebram a exibição
 */

import { DetailsActivitiesWeekView } from '../../../views/DetailsActivitiesWeekView/index.js';

// Mocks
jest.mock('../../../../../shared/services/NavigationService.js');
jest.mock('@features/courses/services/HistoryService.js');

describe('DetailsActivitiesWeekView - Regressão: Bug de DOM Zumbi', () => {
  let view;
  let mockCallbacks;

  const mockWeek = {
    name: 'Semana 1',
    courseName: 'Matemática Básica',
    url: 'https://ava.univesp.br/semana1',
    courseId: '123',
    contentId: '456',
    items: [
      { name: 'Videoaula 1', type: 'video', status: 'DONE', url: 'http://test/1', id: '1' },
      { name: 'Quiz 1', type: 'quiz', status: 'TODO', url: 'http://test/2', id: '2' },
      { name: 'Fórum', type: 'forum', status: 'TODO', url: 'http://test/3', id: '3' },
    ],
  };

  beforeEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();

    mockCallbacks = {
      onBack: jest.fn(),
      onNavigateToWeek: jest.fn(),
    };

    view = new DetailsActivitiesWeekView(mockCallbacks);

    // Mock storage (complete LocalStorageArea interface)
    global.chrome = {
      ...global.chrome,
      storage: /** @type {any} */ ({
        local: {
          get: jest.fn().mockResolvedValue({}),
          set: jest.fn().mockResolvedValue(undefined),
          clear: jest.fn().mockResolvedValue(undefined),
          remove: jest.fn().mockResolvedValue(undefined),
          getBytesInUse: jest.fn().mockResolvedValue(0),
          setAccessLevel: jest.fn().mockResolvedValue(undefined),
          onChanged: { addListener: jest.fn(), removeListener: jest.fn(), hasListener: jest.fn() },
          QUOTA_BYTES: 5242880,
        },
      }),
    };
  });

  describe('Cenário Crítico: Múltiplas Renderizações (Skeleton → Dados)', () => {
    test('BLINDAGEM: Deve renderizar atividades corretamente mesmo após re-renderização da view', () => {
      // Arrange: Simula fluxo real onde view é renderizada 2x
      view.setWeek({ ...mockWeek, items: [] }); // 1ª vez: sem dados

      // Act: Primeira renderização (Skeleton)
      const firstElement = view.render();
      document.body.appendChild(firstElement);
      view.afterRender();

      // Assert: Skeleton deve estar visível
      let container = document.querySelector('#activitiesContainer');
      expect(container).not.toBeNull();
      expect(container.querySelector('.skeleton-container')).not.toBeNull();

      // Act: Atualiza dados e re-renderiza (simula retorno do scraping)
      view.setWeek(mockWeek); // Agora COM dados
      document.body.innerHTML = ''; // Simula limpeza do MainLayout
      const secondElement = view.render();
      document.body.appendChild(secondElement);
      view.renderActivities(); // Chama explicitamente

      // Assert: Lista de atividades deve estar visível no NOVO elemento
      container = document.querySelector('#activitiesContainer');
      expect(container).not.toBeNull();

      const activitiesList = container.querySelector('.activities-list');
      expect(activitiesList).not.toBeNull();
      expect(activitiesList.children.length).toBe(3); // 3 atividades

      // Assert: Skeleton NÃO deve estar mais presente
      expect(container.querySelector('.skeleton-container')).toBeNull();
    });

    test('BLINDAGEM: Container do ActivityRenderer deve sempre ser o elemento VISÍVEL', () => {
      // Arrange
      view.setWeek({ ...mockWeek, items: [] });

      // Act: Primeira renderização
      const firstElement = view.render();
      document.body.appendChild(firstElement);
      const firstContainer = firstElement.querySelector('#activitiesContainer');

      // Act: Segunda renderização (novo DOM)
      document.body.innerHTML = '';
      view.setWeek(mockWeek); // COM dados
      const secondElement = view.render();
      document.body.appendChild(secondElement);
      const secondContainer = secondElement.querySelector('#activitiesContainer');

      // Assert: Containers devem ser diferentes (novo DOM)
      expect(firstContainer).not.toBe(secondContainer);

      // Act: Renderiza atividades
      view.renderActivities();

      // Assert: Atividades devem estar no SEGUNDO container (visível)
      const visibleList = secondContainer.querySelector('.activities-list');
      expect(visibleList).not.toBeNull();
      expect(visibleList.children.length).toBe(3);

      // Assert: Primeiro container (zumbi) NÃO deve ter a lista
      expect(firstContainer.querySelector('.activities-list')).toBeNull();
    });
  });

  describe('Cenário: View com Dados Desde o Início', () => {
    test('Deve renderizar atividades corretamente quando dados já existem', () => {
      // Arrange
      view.setWeek(mockWeek);

      // Act
      const element = view.render();
      document.body.appendChild(element);
      view.afterRender();

      // Assert
      const container = document.querySelector('#activitiesContainer');
      const activitiesList = container.querySelector('.activities-list');
      expect(activitiesList).not.toBeNull();
      expect(activitiesList.children.length).toBe(3);
    });
  });

  describe('Cenário: Navegação Entre Semanas (Múltiplas setWeek)', () => {
    test('BLINDAGEM: Deve atualizar corretamente ao navegar entre semanas diferentes', () => {
      // Arrange: Semana 1
      view.setWeek(mockWeek);
      const element1 = view.render();
      document.body.appendChild(element1);
      view.afterRender();

      // Assert: 3 atividades da Semana 1
      let activitiesList = document.querySelector('.activities-list');
      expect(activitiesList.children.length).toBe(3);

      // Act: Navega para Semana 2 (simula MainLayout.navigateTo recriar o DOM)
      const mockWeek2 = {
        ...mockWeek,
        name: 'Semana 2',
        items: [
          { name: 'Videoaula 2', type: 'video', status: 'TODO', url: 'http://test/4', id: '4' },
          { name: 'Quiz 2', type: 'quiz', status: 'TODO', url: 'http://test/5', id: '5' },
        ],
      };
      view.setWeek(mockWeek2);
      document.body.innerHTML = '';
      const element2 = view.render();
      document.body.appendChild(element2);
      view.afterRender();

      // Assert: 2 atividades da Semana 2 (não 3 da Semana 1)
      activitiesList = document.querySelector('.activities-list');
      expect(activitiesList.children.length).toBe(2);
    });
  });

  describe('Cenário: Estado de Erro', () => {
    test('Deve renderizar estado de erro corretamente no elemento atual', () => {
      // Arrange
      const weekWithError = { ...mockWeek, error: 'Falha ao carregar', items: [] };
      view.setWeek(weekWithError);

      // Act
      const element = view.render();
      document.body.appendChild(element);
      view.afterRender();

      // Assert
      const errorState = document.querySelector('.state-error');
      expect(errorState).not.toBeNull();
      expect(errorState.textContent).toContain('Não foi possível carregar');
      expect(errorState.textContent).toContain('Falha ao carregar');
    });
  });
});
