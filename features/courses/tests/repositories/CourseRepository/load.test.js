import { CourseRepository } from '@features/courses/repositories/CourseRepository.js';

describe('CourseRepository - Operações de Carregamento', () => {
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

  describe('loadItems()', () => {
    test('deve retornar lista vazia se nenhum curso estiver salvo', (done) => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockResolvedValue({});

      // Agir (Act)
      CourseRepository.loadItems((courses) => {
        // Verificar (Assert)
        expect(courses).toEqual([]);
        done();
      });
    });

    test('deve carregar cursos existentes corretamente', (done) => {
      // Preparar (Arrange)
      const mockData = [mockCourse1, mockCourse2];
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockResolvedValue({});
      /** @type {jest.Mock} */ (chrome.storage.local.get).mockImplementation((keys) => {
        const keysArray = Array.isArray(keys) ? keys : [keys];
        if (keysArray.includes('courses_metadata')) {
          return Promise.resolve({
            courses_metadata: {
              chunked: false,
              compressed: false,
              data: JSON.stringify({ courseIds: [mockCourse1.id, mockCourse2.id] }),
            },
          });
        }
        if (keysArray.includes(`course_${mockCourse1.id}`)) {
          return Promise.resolve({
            [`course_${mockCourse1.id}`]: {
              chunked: false,
              compressed: false,
              data: JSON.stringify(mockCourse1),
            },
          });
        }
        if (keysArray.includes(`course_${mockCourse2.id}`)) {
          return Promise.resolve({
            [`course_${mockCourse2.id}`]: {
              chunked: false,
              compressed: false,
              data: JSON.stringify(mockCourse2),
            },
          });
        }
        return Promise.resolve({});
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
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockResolvedValue({});
      /** @type {jest.Mock} */ (chrome.storage.local.get).mockImplementation((keys) => {
        const keysArray = Array.isArray(keys) ? keys : [keys];
        if (keysArray.includes('courses_metadata')) {
          return Promise.resolve({
            courses_metadata: {
              chunked: false,
              compressed: false,
              data: JSON.stringify({ courseIds: [mockCourse1.id] }),
            },
          });
        }
        if (keysArray.includes(`course_${mockCourse1.id}`)) {
          return Promise.resolve({
            [`course_${mockCourse1.id}`]: {
              chunked: false,
              compressed: false,
              data: JSON.stringify(mockCourse1),
            },
          });
        }
        return Promise.resolve({});
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
