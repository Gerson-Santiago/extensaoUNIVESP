import { CourseRepository } from '@features/courses/data/CourseRepository.js';

describe('CourseRepository - Operações de Adição', () => {
  beforeEach(() => {
    // Preparar (Arrange) - Limpar Mocks globais
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

  describe('addItem() - Adicionar Curso Único', () => {
    beforeEach(() => {
      // Mock Date.now() para previsibilidade
      jest.spyOn(Date, 'now').mockReturnValue(1234567890);
    });

    afterEach(() => {
      /** @type {jest.Mock} */ (Date.now).mockRestore();
    });

    test('deve adicionar um curso com sucesso', (done) => {
      // Preparar (Arrange) - Mocks de Storage
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        callback();
      });

      // Agir (Act)
      CourseRepository.add('Novo Curso', 'https://ava.univesp.br/new', [], (success, message) => {
        // Verificar (Assert)
        expect(success).toBe(true);
        expect(message).toBe('Matéria adicionada com sucesso!');
        expect(chrome.storage.sync.set).toHaveBeenCalled();
        done();
      });
    });

    test('deve gerar um ID único baseado em Date.now()', (done) => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        // Verificar (Assert) - dentro do callback
        const savedCourses = data.savedCourses;
        expect(savedCourses[0].id).toBe(1234567890);
        callback();
      });

      // Agir (Act)
      CourseRepository.add('Curso', 'https://test.com', [], () => {
        done();
      });
    });

    test('deve rejeitar curso duplicado (mesma URL)', (done) => {
      // Preparar (Arrange) - Storage possui mockCourse1
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [mockCourse1] });
      });

      // Agir (Act)
      CourseRepository.add(
        'Duplicado',
        'https://ava.univesp.br/course1', // URL existente
        [],
        (success, message) => {
          // Verificar (Assert)
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

    test('deve inicializar semanas vazias por padrão', (done) => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        // Verificar (Assert)
        const course = data.savedCourses[0];
        expect(course.weeks).toEqual([]);
        callback();
      });

      // Agir (Act)
      CourseRepository.add('Curso', 'https://test.com', /** @type {any} */ (undefined), () => {
        done();
      });
    });

    test('deve aceitar semanas customizadas', (done) => {
      // Preparar (Arrange)
      const customWeeks = [{ name: 'Semana 1', url: 'http://s1.com' }];
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        // Verificar (Assert)
        const course = data.savedCourses[0];
        expect(course.weeks).toEqual(customWeeks);
        callback();
      });

      // Agir (Act)
      CourseRepository.add('Curso', 'https://test.com', customWeeks, () => {
        done();
      });
    });

    test('deve persistir nome do termo (semestre/bimestre) passado via options', (done) => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        // Verificar (Assert)
        const course = data.savedCourses[0];
        expect(course.termName).toBe('2025/1 - 1º Bimestre');
        callback();
      });

      // Agir (Act)
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

  describe('addItemsBatch() - Adicionar Múltiplos Cursos', () => {
    test('deve adicionar múltiplos cursos corretamente', (done) => {
      // Preparar (Arrange)
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

      // Agir (Act)
      CourseRepository.addBatch(newItems, (addedCount, ignoredCount) => {
        // Verificar (Assert)
        expect(addedCount).toBe(3);
        expect(ignoredCount).toBe(0);
        expect(chrome.storage.sync.set).toHaveBeenCalled();
        done();
      });
    });

    test('deve gerar IDs únicos para cada curso do lote', (done) => {
      // Preparar (Arrange)
      const newItems = [
        { name: 'Curso A', url: 'https://a.com' },
        { name: 'Curso B', url: 'https://b.com' },
      ];

      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        // Verificar (Assert)
        const courses = data.savedCourses;
        expect(courses[0].id).not.toBe(courses[1].id);
        callback();
      });

      // Agir (Act)
      CourseRepository.addBatch(newItems, () => {
        done();
      });
    });

    test('deve ignorar cursos duplicados dentro do lote', (done) => {
      // Preparar (Arrange)
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

      // Agir (Act)
      CourseRepository.addBatch(newItems, (addedCount, ignoredCount) => {
        // Verificar (Assert)
        expect(addedCount).toBe(1);
        expect(ignoredCount).toBe(1);
        done();
      });
    });

    test('deve lidar com lote vazio sem erros', (done) => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [] });
      });

      // Agir (Act)
      CourseRepository.addBatch([], (addedCount, ignoredCount) => {
        // Verificar (Assert)
        expect(addedCount).toBe(0);
        expect(ignoredCount).toBe(0);
        expect(chrome.storage.sync.set).not.toHaveBeenCalled();
        done();
      });
    });

    test('deve não chamar save() se todos os itens forem duplicatas', (done) => {
      // Preparar (Arrange)
      const newItems = [
        { name: 'Dup1', url: 'https://ava.univesp.br/course1' },
        { name: 'Dup2', url: 'https://ava.univesp.br/course2' },
      ];

      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [mockCourse1, mockCourse2] });
      });

      // Agir (Act)
      CourseRepository.addBatch(newItems, (addedCount, ignoredCount) => {
        // Verificar (Assert)
        expect(addedCount).toBe(0);
        expect(ignoredCount).toBe(2);
        expect(chrome.storage.sync.set).not.toHaveBeenCalled();
        done();
      });
    });

    test('deve persistir termName nos itens do lote', (done) => {
      // Preparar (Arrange)
      const newItems = [{ name: 'Curso T', url: 'https://t.com', termName: 'Termo Teste' }];

      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        // Verificar (Assert)
        const course = data.savedCourses[0];
        expect(course.termName).toBe('Termo Teste');
        callback();
      });

      // Agir (Act)
      CourseRepository.addBatch(newItems, (added) => {
        expect(added).toBe(1);
        done();
      });
    });
  });
});
