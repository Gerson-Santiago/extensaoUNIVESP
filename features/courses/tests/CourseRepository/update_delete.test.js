import { CourseRepository } from '@features/courses/data/CourseRepository.js';

describe('CourseRepository - Update & Delete Operations', () => {
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

  describe('deleteItem()', () => {
    test('Deve remover curso existente', (done) => {
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [mockCourse1, mockCourse2] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        const courses = data.savedCourses;
        expect(courses).toHaveLength(1);
        expect(courses[0].id).toBe(1000000002);
        callback();
      });

      CourseRepository.delete(1000000001, () => {
        done();
      });
    });

    test('Deve lidar com ID inexistente', (done) => {
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [mockCourse1] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        const courses = data.savedCourses;
        expect(courses).toHaveLength(1); // Nada removido
        callback();
      });

      CourseRepository.delete(99999999, () => {
        done();
      });
    });

    test('Deve executar callback', (done) => {
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        callback();
      });

      CourseRepository.delete(123, () => {
        expect(chrome.storage.sync.set).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('updateItem()', () => {
    test('Deve atualizar curso existente', (done) => {
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [mockCourse1] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        const updated = data.savedCourses[0];
        expect(updated.name).toBe('Nome Atualizado');
        expect(updated.id).toBe(1000000001); // ID permanece
        callback();
      });

      CourseRepository.update(1000000001, { name: 'Nome Atualizado' }, () => {
        done();
      });
    });

    test('Deve mesclar updates com dados existentes', (done) => {
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [mockCourse1] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        const updated = data.savedCourses[0];
        expect(updated.name).toBe('Nome Atualizado');
        expect(updated.url).toBe('https://ava.univesp.br/course1'); // URL original mantida
        expect(updated.weeks).toEqual(mockCourse1.weeks); // Weeks mantidos
        callback();
      });

      CourseRepository.update(1000000001, { name: 'Nome Atualizado' }, () => {
        done();
      });
    });

    test('Deve lidar com ID inexistente sem falhar', (done) => {
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [mockCourse1] });
      });

      CourseRepository.update(99999999, { name: 'Teste' }, () => {
        expect(console.warn).toHaveBeenCalledWith(
          'Item com id 99999999 não encontrado para atualização.'
        );
        expect(chrome.storage.sync.set).not.toHaveBeenCalled();
        done();
      });
    });

    test('Deve executar callback mesmo com ID inexistente', (done) => {
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [] });
      });

      CourseRepository.update(123, { name: 'Test' }, () => {
        done();
      });
    });
  });

  describe('clearItems()', () => {
    test('Deve limpar todos os cursos', (done) => {
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        expect(data.savedCourses).toEqual([]);
        callback();
      });

      CourseRepository.clear(() => {
        done();
      });
    });

    test('Deve chamar saveItems com array vazio', (done) => {
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        expect(data.savedCourses).toHaveLength(0);
        callback();
      });

      CourseRepository.clear(() => {
        done();
      });
    });

    test('Deve executar callback', (done) => {
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        callback();
      });

      CourseRepository.clear(() => {
        expect(chrome.storage.sync.set).toHaveBeenCalled();
        done();
      });
    });
  });
});
