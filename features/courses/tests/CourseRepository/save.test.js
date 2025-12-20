import { CourseRepository } from '@features/courses/data/CourseRepository.js';

describe('CourseRepository - Save Operations', () => {
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

  describe('saveItems()', () => {
    test('Deve salvar lista de cursos', (done) => {
      const coursesToSave = [mockCourse1, mockCourse2];
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        callback();
      });

      CourseRepository.saveItems(coursesToSave, () => {
        expect(chrome.storage.sync.set).toHaveBeenCalledWith(
          { savedCourses: coursesToSave },
          expect.any(Function)
        );
        done();
      });
    });

    test('Deve executar callback após salvar', (done) => {
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        callback();
      });

      CourseRepository.saveItems([mockCourse1], () => {
        expect(chrome.storage.sync.set).toHaveBeenCalled();
        done();
      });
    });

    test('Deve funcionar sem callback', () => {
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        callback();
      });

      CourseRepository.saveItems([mockCourse1]);
      expect(chrome.storage.sync.set).toHaveBeenCalled();
    });
  });
});
