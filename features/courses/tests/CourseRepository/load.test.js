import { CourseRepository } from '@features/courses/data/CourseRepository.js';

describe('CourseRepository - Load Operations', () => {
  beforeEach(() => {
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
    test('Deve carregar lista vazia por padrão', (done) => {
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({}); // Sem savedCourses
      });

      CourseRepository.loadItems((courses) => {
        expect(courses).toEqual([]);
        expect(chrome.storage.sync.get).toHaveBeenCalledWith(
          ['savedCourses'],
          expect.any(Function)
        );
        done();
      });
    });

    test('Deve carregar cursos existentes', (done) => {
      const mockData = [mockCourse1, mockCourse2];
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: mockData });
      });

      CourseRepository.loadItems((courses) => {
        expect(courses).toEqual(mockData);
        expect(courses).toHaveLength(2);
        done();
      });
    });

    test('Deve chamar callback com dados corretos', (done) => {
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [mockCourse1] });
      });

      CourseRepository.loadItems((courses) => {
        expect(courses[0].name).toBe('Curso Teste 1');
        expect(courses[0].url).toBe('https://ava.univesp.br/course1');
        done();
      });
    });
  });
});
