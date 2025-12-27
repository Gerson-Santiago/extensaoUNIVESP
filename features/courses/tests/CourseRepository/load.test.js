import { CourseRepository } from '@features/courses/data/CourseRepository.js';

describe('CourseRepository - Operações de Carregamento', () => {
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

  describe('loadItems()', () => {
    test('deve retornar lista vazia se nenhum curso estiver salvo', (done) => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({}); // Simula 'savedCourses' ausente
      });

      // Agir (Act)
      CourseRepository.loadItems((courses) => {
        // Verificar (Assert)
        expect(courses).toEqual([]);
        expect(chrome.storage.sync.get).toHaveBeenCalledWith(
          ['savedCourses'],
          expect.any(Function)
        );
        done();
      });
    });

    test('deve carregar cursos existentes corretamente', (done) => {
      // Preparar (Arrange)
      const mockData = [mockCourse1, mockCourse2];
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: mockData });
      });

      // Agir (Act)
      CourseRepository.loadItems((courses) => {
        // Verificar (Assert)
        expect(courses).toEqual(mockData);
        expect(courses).toHaveLength(2);
        done();
      });
    });

    test('deve garantir que os dados carregados correspondam aos salvos', (done) => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [mockCourse1] });
      });

      // Agir (Act)
      CourseRepository.loadItems((courses) => {
        // Verificar (Assert)
        expect(courses[0].name).toBe('Curso Teste 1');
        expect(courses[0].url).toBe('https://ava.univesp.br/course1');
        done();
      });
    });
  });
});
