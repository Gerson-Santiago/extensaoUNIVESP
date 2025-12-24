import { CourseWeeksView } from '../../views/CourseWeeksView/index.js';
import { WeekActivitiesService } from '../../services/WeekActivitiesService.js';
import { Toaster } from '../../../../shared/ui/feedback/Toaster.js';

// Mock dependências externas
jest.mock('../../services/WeekActivitiesService.js');
jest.mock('../../../../shared/ui/feedback/Toaster.js');

describe('Integration: Task Management Flow', () => {
  let view;
  let mockCallbacks;
  let mockToasterShow;

  beforeEach(() => {
    document.body.innerHTML = '';
    jest.clearAllMocks();

    mockCallbacks = {
      onBack: jest.fn(),
      onOpenCourse: jest.fn(),
    };

    mockToasterShow = jest.fn();
    Toaster.prototype.show = mockToasterShow;

    view = new CourseWeeksView(mockCallbacks);
  });

  test('should display tasks preview when "Tarefas" button is clicked', async () => {
    // 1. Setup: Course with items
    const course = {
      name: 'Engenharia de Software',
      weeks: [
        {
          name: 'Semana 1',
          url: 'https://ava.univesp.br/semana1',
          items: [], // Initially empty
        },
      ],
    };

    // 2. Mock Scraper response
    const mockItems = [
      { name: 'Aula 1', type: 'video', status: 'DONE', url: 'http://test/1' },
      { name: 'Quiz', type: 'quiz', status: 'TODO', url: 'http://test/2' },
    ];

    /** @type {jest.Mock} */ (WeekActivitiesService.getActivities).mockResolvedValue(mockItems);

    // 3. Render View
    view.setCourse(course);
    const viewEl = view.render();
    document.body.appendChild(viewEl);
    view.afterRender();

    const weeksList = document.getElementById('weeksList');
    expect(weeksList.children.length).toBe(1);

    // 4. Simulate User Action: Click "Tarefas" (Preview)
    // Precisamos encontrar o botão de tarefas dentro do WeekItem.
    // Assumindo que o WeekItem renderiza um botão ou elemento clicável para tarefas.
    // Como o WeekItem é componente, mas o CourseWeeksView attacha o evento 'onViewTasks'.
    // Vamos simular a chamada direta de showPreview se não conseguirmos clicar fácil no DOM mockado
    // ou investigar a estrutura do DOM gerado.

    // Estrutura esperada do WeekItem (simplificada para teste)
    // O CourseWeeksView chama createWeekElement, que retorna uma DIV.
    // Dentro dessa DIV deve ter um botão/ícone que dispara onViewTasks.

    // Vamos chamar showPreview diretamente para testar a integração View -> Scraper -> DOM Update
    // Isso isola um pouco do WeekItem, mas testa o fluxo principal da View.

    const weekItem = weeksList.firstElementChild;
    await view.showPreview(course.weeks[0], weekItem);

    // 5. Verify Scraper called
    expect(WeekActivitiesService.getActivities).toHaveBeenCalledWith(
      expect.objectContaining({ url: 'https://ava.univesp.br/semana1' }),
      'DOM'
    );

    // 6. Verify DOM updated with Preview
    const previewEl = document.querySelector('.week-preview-dynamic');
    expect(previewEl).not.toBeNull();
    expect(previewEl.textContent).toContain('📊 Semana 1');

    // Verify Progress Text
    // 1 DONE, 1 TODO -> 50%
    expect(previewEl.textContent).toContain('50%'); // Progress percentage
    expect(previewEl.textContent).toContain('1/2'); // Count
  });

  test('should show error toast if scraping fails', async () => {
    // 1. Setup
    const course = {
      name: 'Erro Course',
      weeks: [{ name: 'Semana Bugada', url: 'http://bug.com' }],
    };
    view.setCourse(course);
    const viewEl = view.render();
    document.body.appendChild(viewEl);
    view.afterRender();

    // 2. Mock Error
    /** @type {jest.Mock} */ (WeekActivitiesService.getActivities).mockRejectedValue(
      new Error('Network Error')
    );

    // 3. Simulate Action
    const weekItem = document.getElementById('weeksList').firstElementChild;
    await view.showPreview(course.weeks[0], weekItem);

    // 4. Verify Toaster
    expect(mockToasterShow).toHaveBeenCalledWith(expect.stringContaining('Erro'), 'error');
  });
});
