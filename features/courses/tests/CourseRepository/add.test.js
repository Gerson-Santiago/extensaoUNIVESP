import { CourseRepository } from '@features/courses/data/CourseRepository.js';

describe('CourseRepository - Add Operations', () => {
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

  describe('addItem()', () => {
    beforeEach(() => {
      // Mock Date.now() para gerar IDs previsíveis
      jest.spyOn(Date, 'now').mockReturnValue(1234567890);
    });

    afterEach(() => {
      Date.now.mockRestore();
    });

    test('Deve adicionar curso com sucesso', (done) => {
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        callback();
      });

      CourseRepository.add('Novo Curso', 'https://ava.univesp.br/new', [], (success, message) => {
        expect(success).toBe(true);
        expect(message).toBe('Matéria adicionada com sucesso!');
        expect(chrome.storage.sync.set).toHaveBeenCalled();
        done();
      });
    });

    test('Deve gerar ID único usando Date.now()', (done) => {
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        const savedCourses = data.savedCourses;
        expect(savedCourses[0].id).toBe(1234567890);
        callback();
      });

      CourseRepository.add('Curso', 'https://test.com', [], () => {
        done();
      });
    });

    test('Deve rejeitar duplicata (mesma URL)', (done) => {
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [mockCourse1] });
      });

      CourseRepository.add(
        'Duplicado',
        'https://ava.univesp.br/course1',
        [],
        (success, message) => {
          expect(success).toBe(false);
          expect(message).toBe('Matéria já adicionada anteriormente.');
          expect(chrome.storage.sync.set).not.toHaveBeenCalled();
          expect(console.warn).toHaveBeenCalledWith(
            'Curso com URL já existe: https://ava.univesp.br/course1'
          );
          done();
        }
      );
    });

    test('Deve incluir weeks vazio por padrão', (done) => {
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        const course = data.savedCourses[0];
        expect(course.weeks).toEqual([]);
        callback();
      });

      CourseRepository.add('Curso', 'https://test.com', undefined, () => {
        done();
      });
    });

    test('Deve passar weeks customizado', (done) => {
      const customWeeks = [{ name: 'Semana 1', url: 'http://s1.com' }];
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        const course = data.savedCourses[0];
        expect(course.weeks).toEqual(customWeeks);
        callback();
      });

      CourseRepository.add('Curso', 'https://test.com', customWeeks, () => {
        done();
      });
    });

    test('Deve persistir termName passado via options', (done) => {
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        const course = data.savedCourses[0];
        expect(course.termName).toBe('2025/1 - 1º Bimestre');
        callback();
      });

      CourseRepository.add(
        'Curso Termo',
        'https://term.com',
        [],
        { termName: '2025/1 - 1º Bimestre' },
        (success) => {
          expect(success).toBe(true);
          done();
        }
      );
    });
  });

  describe('addItemsBatch()', () => {
    test('Deve adicionar múltiplos cursos', (done) => {
      const newItems = [
        { name: 'Curso A', url: 'https://a.com', weeks: [] },
        { name: 'Curso B', url: 'https://b.com', weeks: [] },
        { name: 'Curso C', url: 'https://c.com', weeks: [] },
      ];

      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        callback();
      });

      CourseRepository.addBatch(newItems, (addedCount, ignoredCount) => {
        expect(addedCount).toBe(3);
        expect(ignoredCount).toBe(0);
        expect(chrome.storage.sync.set).toHaveBeenCalled();
        done();
      });
    });

    test('Deve gerar IDs únicos para cada curso', (done) => {
      const newItems = [
        { name: 'Curso A', url: 'https://a.com' },
        { name: 'Curso B', url: 'https://b.com' },
      ];

      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        const courses = data.savedCourses;
        expect(courses[0].id).not.toBe(courses[1].id);
        callback();
      });

      CourseRepository.addBatch(newItems, () => {
        done();
      });
    });

    test('Deve ignorar duplicatas', (done) => {
      const newItems = [
        { name: 'Novo', url: 'https://novo.com' },
        { name: 'Duplicado', url: 'https://ava.univesp.br/course1' }, // Já existe
      ];

      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [mockCourse1] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        callback();
      });

      CourseRepository.addBatch(newItems, (addedCount, ignoredCount) => {
        expect(addedCount).toBe(1);
        expect(ignoredCount).toBe(1);
        done();
      });
    });

    test('Deve retornar contadores corretos', (done) => {
      const newItems = [
        { name: 'A', url: 'https://a.com' },
        { name: 'B', url: 'https://ava.univesp.br/course1' }, // duplicata
        { name: 'C', url: 'https://c.com' },
      ];

      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [mockCourse1] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        callback();
      });

      CourseRepository.addBatch(newItems, (addedCount, ignoredCount) => {
        expect(addedCount).toBe(2);
        expect(ignoredCount).toBe(1);
        done();
      });
    });

    test('Deve lidar com lista vazia', (done) => {
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [] });
      });

      CourseRepository.addBatch([], (addedCount, ignoredCount) => {
        expect(addedCount).toBe(0);
        expect(ignoredCount).toBe(0);
        expect(chrome.storage.sync.set).not.toHaveBeenCalled();
        done();
      });
    });

    test('Deve não salvar se todos são duplicatas', (done) => {
      const newItems = [
        { name: 'Dup1', url: 'https://ava.univesp.br/course1' },
        { name: 'Dup2', url: 'https://ava.univesp.br/course2' },
      ];

      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [mockCourse1, mockCourse2] });
      });

      CourseRepository.addBatch(newItems, (addedCount, ignoredCount) => {
        expect(addedCount).toBe(0);
        expect(ignoredCount).toBe(2);
        expect(chrome.storage.sync.set).not.toHaveBeenCalled();
        done();
      });
    });

    test('Deve persistir termName nos itens do lote', (done) => {
      const newItems = [{ name: 'Curso T', url: 'https://t.com', termName: 'Termo Teste' }];

      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        const course = data.savedCourses[0];
        expect(course.termName).toBe('Termo Teste');
        callback();
      });

      CourseRepository.addBatch(newItems, (added) => {
        expect(added).toBe(1);
        done();
      });
    });
  });
});
