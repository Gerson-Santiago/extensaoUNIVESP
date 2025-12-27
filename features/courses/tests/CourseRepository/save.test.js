import { CourseRepository } from '@features/courses/data/CourseRepository.js';

describe('CourseRepository - Operações de Salvamento', () => {
  beforeEach(() => {
    // Preparar (Arrange) - Limpar Mocks
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
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
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        callback();
      });

      // Agir (Act)
      CourseRepository.saveItems(coursesToSave, () => {
        // Verificar (Assert)
        expect(chrome.storage.sync.set).toHaveBeenCalledWith(
          { savedCourses: coursesToSave },
          expect.any(Function)
        );
        done();
      });
    });

    test('deve executar o callback após o salvamento', (done) => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        callback();
      });

      // Agir (Act)
      CourseRepository.saveItems([mockCourse1], () => {
        // Verificar (Assert)
        expect(chrome.storage.sync.set).toHaveBeenCalled();
        done();
      });
    });

    test('deve funcionar corretamente mesmo sem passar callback', () => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        callback();
      });

      // Agir (Act)
      CourseRepository.saveItems([mockCourse1]);

      // Verificar (Assert)
      expect(chrome.storage.sync.set).toHaveBeenCalled();
    });
  });
});
