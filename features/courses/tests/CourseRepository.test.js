import { CourseRepository } from '@features/courses/data/CourseRepository.js';

describe('Storage - CRUD de Cursos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Limpa console.warn para não poluir output
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    /** @type {jest.Mock} */ (console.warn).mockRestore();
  });

  // Dados de teste reutilizáveis
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
