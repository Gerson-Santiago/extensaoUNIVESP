import { CourseRepository } from '@features/courses/repositories/CourseRepository.js';

describe('CourseRepository - Operações de Salvamento', () => {
  beforeEach(() => {
    // Preparar (Arrange) - Limpar Mocks
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    // Mockar chrome.storage.local (usado por ChunkedStorage)
    /** @type {jest.Mock} */ (chrome.storage.local.get).mockResolvedValue({});
    /** @type {jest.Mock} */ (chrome.storage.local.set).mockResolvedValue(undefined);
    /** @type {jest.Mock} */ (chrome.storage.local.remove).mockResolvedValue(undefined);
  });

  afterEach(() => {
    /** @type {jest.Mock} */ (console.warn).mockRestore();
  });

  const mockCourse1 = {
    id: 1000000001,
    name: 'Curso Teste 1',
    url: 'https://ava.univesp.br/course1',
    weeks: [{ name: 'Semana 1', url: 'http://test.com/s1' }],
  };

  const mockCourse2 = {
    id: 1000000002,
    name: 'Curso Teste 2',
    url: 'https://ava.univesp.br/course2',
    weeks: [],
  };

  describe('saveItems()', () => {
    test('deve salvar a lista de cursos no storage corretamente', (done) => {
      // Preparar (Arrange)
      const coursesToSave = [mockCourse1, mockCourse2];

      // Agir (Act)
      CourseRepository.saveItems(coursesToSave, () => {
        // Verificar (Assert)
        // Note: CourseStorage agora usa chrome.storage.local via ChunkedStorage
        expect(chrome.storage.local.set).toHaveBeenCalled();
        done();
      });
    });

    test('deve executar o callback após o salvamento', (done) => {
      // Preparar (Arrange) - Already mocked in beforeEach

      // Agir (Act)
      CourseRepository.saveItems([mockCourse1], () => {
        // Verificar (Assert)
        expect(chrome.storage.local.set).toHaveBeenCalled();
        done();
      });
    });

    test('deve funcionar corretamente mesmo sem passar callback', async () => {
      // Preparar (Arrange) - Already mocked in beforeEach

      // Agir (Act)
      await CourseRepository.saveItems([mockCourse1]);

      // Verificar (Assert)
      expect(chrome.storage.local.set).toHaveBeenCalled();
    });
  });
});
