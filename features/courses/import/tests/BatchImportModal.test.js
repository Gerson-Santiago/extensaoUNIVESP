import { BatchImportModal } from '@features/courses/import/components/BatchImportModal.js';

// Mocks
jest.mock('@features/courses/import/services/BatchScraper/index.js', () => ({
  scrapeAvailableTerms: jest.fn(),
  processSelectedCourses: jest.fn(),
}));

jest.mock('@features/courses/repositories/CourseRepository.js', () => ({
  CourseRepository: {
    addBatch: jest.fn(),
  },
}));

/**
 * Suíte de Testes para Lógica de Renderização do BatchImportModal
 * Verifica:
 * 1. Ordem de classificação (Mais recente primeiro)
 * 2. Exibição de agrupamento
 * 3. Checkboxes granulares por curso
 */
describe('Lógica de Renderização do BatchImportModal', () => {
  let modal;
  let container;

  beforeEach(() => {
    // Arrange (Setup Comum)
    // Reset DOM
    document.body.innerHTML = '';
    container = document.createElement('div');
    modal = new BatchImportModal(() => {});
  });

  test('Deve ordenar termos decrescente (mais recente primeiro) e renderizar cursos com checkboxes', () => {
    // Arrange
    const mockTerms = [
      {
        name: '2024/1 - 1º Bimestre',
        courses: [{ name: 'Curso Antigo', url: 'http://old', courseId: '1' }],
      },
      {
        name: '2025/2 - 4º Bimestre',
        courses: [
          { name: 'Curso Recente A', url: 'http://recA', courseId: '2' },
          { name: 'Curso Recente B', url: 'http://recB', courseId: '3' },
        ],
      },
      {
        name: '2025/1 - 1º Bimestre',
        courses: [{ name: 'Curso Intermediário', url: 'http://mid', courseId: '4' }],
      },
    ];

    modal.foundTerms = mockTerms;

    // Act
    modal.renderTerms(container);

    // Assert
    const termHeaders = container.querySelectorAll('.term-header');
    expect(termHeaders.length).toBe(3);

    // Verificar Ordem: Espera 2025/2 - 4º Bimestre PRIMEIRO
    expect(termHeaders[0].textContent).toContain('2025/2 - 4º Bimestre');
    expect(termHeaders[1].textContent).toContain('2025/1 - 1º Bimestre');
    expect(termHeaders[2].textContent).toContain('2024/1 - 1º Bimestre');

    // Verificar Cursos
    const recentGroup = container.querySelector('.term-group:nth-child(1)');
    const coursesInRecent = recentGroup.querySelectorAll('.course-item');
    expect(coursesInRecent.length).toBe(2);
    expect(coursesInRecent[0].textContent).toContain('Curso Recente A');
    expect(coursesInRecent[1].textContent).toContain('Curso Recente B');

    // Verificar Checkboxes
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    // Esperamos 1 checkbox por curso = 1 + 2 + 1 = 4 checkboxes
    expect(checkboxes.length).toBe(4);
  });

  test('Deve lidar graciosamente com termos vazios', () => {
    // Arrange
    modal.foundTerms = [];

    // Act
    modal.renderTerms(container);

    // Assert
    expect(container.textContent).toContain('Nenhum termo encontrado');
  });
});

describe('Interações do BatchImportModal', () => {
  let modal;

  beforeEach(() => {
    // Arrange
    document.body.innerHTML = '';
    modal = new BatchImportModal(() => {});
  });

  test('Deve ter um botão de recarregar que dispara loadTerms', () => {
    // Arrange
    // 1. Spy em loadTerms (o método que queremos re-disparar)
    const loadTermsSpy = jest.spyOn(modal, 'loadTerms').mockImplementation(() => {});

    // Act
    // 2. Abrir o modal (renderiza UI)
    modal.open();
    const overlay = document.querySelector('.modal-overlay');

    // 3. Encontrar botão de reload
    /** @type {HTMLButtonElement} */
    const reloadBtn = overlay.querySelector('.btn-refresh');

    // Assert Pré-click
    expect(reloadBtn).not.toBeNull();
    expect(reloadBtn.title).toBe('Recarregar Cursos');

    // Act 2
    // 4. Clicar nele
    reloadBtn.click();

    // Assert
    // 5. Verificar se loadTerms foi chamado duas vezes (uma pelo open(), outra pelo click)
    expect(loadTermsSpy).toHaveBeenCalledTimes(2);
  });
});
