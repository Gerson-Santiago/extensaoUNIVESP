import { CourseRepository } from '@features/courses/data/CourseRepository.js';

describe('CourseRepository - Operações de Atualização e Remoção', () => {
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

  describe('deleteItem()', () => {
    test('deve remover um curso existente', (done) => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [mockCourse1, mockCourse2] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        // Verificar (Assert)
        const courses = data.savedCourses;
        expect(courses).toHaveLength(1);
        expect(courses[0].id).toBe(1000000002);
        callback();
      });

      // Agir (Act)
      CourseRepository.delete(1000000001, () => {
        done();
      });
    });

    test('deve fazer nada se o ID não existir (operação segura)', (done) => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [mockCourse1] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        // Verificar (Assert)
        const courses = data.savedCourses;
        expect(courses).toHaveLength(1); // Manteve o original
        callback();
      });

      // Agir (Act)
      CourseRepository.delete(99999999, () => {
        done();
      });
    });

    test('deve executar o callback após a tentativa de remoção', (done) => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockResolvedValue({});

      // Agir (Act)
      CourseRepository.delete(123, () => {
        // Verificar (Assert)
        expect(chrome.storage.local.set).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('updateItem()', () => {
    test('deve atualizar um curso existente corretamente', (done) => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [mockCourse1] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        // Verificar (Assert)
        const updated = data.savedCourses[0];
        expect(updated.name).toBe('Nome Atualizado');
        expect(updated.id).toBe(1000000001); // ID permanece
        callback();
      });

      // Agir (Act)
      CourseRepository.update(1000000001, { name: 'Nome Atualizado' }, () => {
        done();
      });
    });

    test('deve mesclar (merge) atualizações com os dados existentes', (done) => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [mockCourse1] });
      });
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        // Verificar (Assert)
        const updated = data.savedCourses[0];
        expect(updated.name).toBe('Nome Atualizado');
        expect(updated.url).toBe('https://ava.univesp.br/course1'); // URL original mantida
        expect(updated.weeks).toEqual(mockCourse1.weeks); // Weeks mantidos
        callback();
      });

      // Agir (Act)
      CourseRepository.update(1000000001, { name: 'Nome Atualizado' }, () => {
        done();
      });
    });

    test('deve logar aviso se tentar atualizar ID inexistente', (done) => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [mockCourse1] });
      });

      // Agir (Act)
      CourseRepository.update(99999999, { name: 'Teste' }, () => {
        // Verificar (Assert)
        expect(console.warn).toHaveBeenCalledWith(
          'Item com id 99999999 não encontrado para atualização.'
        );
        expect(chrome.storage.sync.set).not.toHaveBeenCalled();
        done();
      });
    });

    test('deve executar callback mesmo se o ID não for encontrado', (done) => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (chrome.storage.sync.get).mockImplementation((keys, callback) => {
        callback({ savedCourses: [] });
      });

      // Agir (Act)
      CourseRepository.update(123, { name: 'Test' }, () => {
        done();
      });
    });
  });

  describe('clearItems()', () => {
    test('deve limpar todos os cursos do storage', (done) => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        // Verificar (Assert) - dentro do mock
        expect(data.savedCourses).toEqual([]);
        callback();
      });

      // Agir (Act)
      CourseRepository.clear(() => {
        done();
      });
    });

    test('deve chamar saveItems com array vazio internamente', (done) => {
      // Preparar (Arrange)
      /** @type {jest.Mock} */ (chrome.storage.sync.set).mockImplementation((data, callback) => {
        // Verificar (Assert)
        expect(data.savedCourses).toHaveLength(0);
        callback();
      });

      // Agir (Act)
      CourseRepository.clear(() => {
        done();
      });
    });

    test('deve executar o callback após o clear', (done) => {
      // Preparar (Arrange) - Already mocked in beforeEach

      // Agir (Act)
      CourseRepository.clear(() => {
        // Verificar (Assert)
        expect(chrome.storage.local.set).toHaveBeenCalled();
        done();
      });
    });
  });
});
