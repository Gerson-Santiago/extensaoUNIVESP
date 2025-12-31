import { CourseRepository } from '@features/courses/repositories/CourseRepository.js';

describe('CourseRepository - Operações de Adição', () => {
  beforeEach(() => {
    // Preparar (Arrange) - Limpar Mocks globais
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
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockResolvedValue({ savedCourses: [] });

      // Agir (Act)
      CourseRepository.add('Novo Curso', 'https://ava.univesp.br/new', [], (success, message) => {
        // Verificar (Assert)
        expect(success).toBe(true);
        expect(message).toBe('Matéria adicionada com sucesso!');
        // Note: CourseStorage agora usa chrome.storage.local via ChunkedStorage
        expect(chrome.storage.local.set).toHaveBeenCalled();
        done();
      });
    });

    test('deve gerar um ID único baseado em Date.now()', (done) => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockResolvedValue({ savedCourses: [] });
      /** @type {jest.Mock} */ (chrome.storage.local.set).mockImplementation((data, callback) => {
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
      CourseRepository.add(
        'Duplicado',
        'https://ava.univesp.br/course1', // URL existente
        [],
        (success, message) => {
          // Verificar (Assert)
          expect(success).toBe(false);
          expect(message).toBe('Matéria já adicionada anteriormente.');
          expect(chrome.storage.local.set).not.toHaveBeenCalled();
          expect(console.warn).toHaveBeenCalledWith(
            '[CourseRepository]',
            'Curso com URL já existe: https://ava.univesp.br/course1'
          );
          done();
        }
      );
    });

    test('deve inicializar semanas vazias por padrão', (done) => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockResolvedValue({ savedCourses: [] });
      /** @type {jest.Mock} */ (chrome.storage.local.set).mockImplementation((data, callback) => {
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
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockResolvedValue({ savedCourses: [] });
      /** @type {jest.Mock} */ (chrome.storage.local.set).mockImplementation((data) => {
        // Verificar (Assert)
        const course = data.savedCourses[0];
        expect(course.weeks).toEqual(customWeeks);
        return Promise.resolve();
      });

      // Agir (Act)
      CourseRepository.add('Curso', 'https://test.com', customWeeks, () => {
        done();
      });
    });

    test('deve persistir nome do termo (semestre/bimestre) passado via options', (done) => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockResolvedValue({ savedCourses: [] });
      /** @type {jest.Mock} */ (chrome.storage.local.set).mockImplementation((data, callback) => {
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

      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockResolvedValue({ savedCourses: [] });
      /** @type {jest.Mock} */ (chrome.storage.local.set).mockResolvedValue(undefined);

      // Agir (Act)
      CourseRepository.addBatch(newItems, (addedCount, ignoredCount) => {
        // Verificar (Assert)
        expect(addedCount).toBe(3);
        expect(ignoredCount).toBe(0);
        expect(chrome.storage.local.set).toHaveBeenCalled();
        done();
      });
    });

    test('deve gerar IDs únicos para cada curso do lote', (done) => {
      // Preparar (Arrange)
      const newItems = [
        { name: 'Curso A', url: 'https://a.com' },
        { name: 'Curso B', url: 'https://b.com' },
      ];

      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockResolvedValue({ savedCourses: [] });
      /** @type {jest.Mock} */ (chrome.storage.local.set).mockImplementation((data) => {
        // Verificar (Assert)
        const courses = data.savedCourses;
        expect(courses[0].id).not.toBe(courses[1].id);
        return Promise.resolve();
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
      CourseRepository.addBatch(newItems, (addedCount, ignoredCount) => {
        // Verificar (Assert)
        expect(addedCount).toBe(1);
        expect(ignoredCount).toBe(1);
        done();
      });
    });

    test('deve lidar com lote vazio sem erros', (done) => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockResolvedValue({});

      // Agir (Act)
      CourseRepository.addBatch([], (addedCount, ignoredCount) => {
        // Verificar (Assert)
        expect(addedCount).toBe(0);
        expect(ignoredCount).toBe(0);
        //Note: chrome.storage.local.set pode ser chamado pela migração de dados
        done();
      });
    });

    test('deve não chamar save() se todos os itens forem duplicatas', (done) => {
      // Preparar (Arrange)
      const newItems = [
        { name: 'Dup1', url: 'https://ava.univesp.br/course1' },
        { name: 'Dup2', url: 'https://ava.univesp.br/course2' },
      ];

      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockResolvedValue({});
      /** @type {jest.Mock} */ (chrome.storage.local.get).mockImplementation((keys) => {
        const keysArray = Array.isArray(keys) ? keys : [keys];
        // Simular que os cursos já existem no novo formato
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
      CourseRepository.addBatch(newItems, (addedCount, ignoredCount) => {
        // Verificar (Assert)
        expect(addedCount).toBe(0);
        expect(ignoredCount).toBe(2);
        expect(chrome.storage.local.set).not.toHaveBeenCalled();
        done();
      });
    });

    test('deve persistir termName nos itens do lote', (done) => {
      // Preparar (Arrange)
      const newItems = [{ name: 'Curso T', url: 'https://t.com', termName: 'Termo Teste' }];

      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockResolvedValue({ savedCourses: [] });
      /** @type {jest.Mock} */ (chrome.storage.local.set).mockImplementation((data) => {
        // Verificar (Assert)
        const course = data.savedCourses[0];
        expect(course.termName).toBe('Termo Teste');
        return Promise.resolve();
      });

      // Agir (Act)
      CourseRepository.addBatch(newItems, (added) => {
        expect(added).toBe(1);
        done();
      });
    });
  });
});
