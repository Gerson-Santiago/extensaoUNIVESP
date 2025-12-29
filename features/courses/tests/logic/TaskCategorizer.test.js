/**
 * @file TaskCategorizer.test.js
 * @description Testes para categorização de tarefas do AVA
 */

import { categorizeTask } from '../../logic/TaskCategorizer.js';

describe('TaskCategorizer', () => {
  describe('categorizeTask', () => {
    it('deve categorizar Videoaula corretamente', () => {
      // Arrange
      const task = { title: 'Videoaula 4 - Conjuntos numéricos (Parte 1)' };

      // Act
      const result = categorizeTask(task);

      // Assert
      expect(result.type).toBe('VIDEOAULA');
      expect(result.number).toBe(4);
    });

    it('deve categorizar Quiz da Videoaula', () => {
      // Arrange
      const task = { title: 'Quiz da Videoaula 3' };

      // Act
      const result = categorizeTask(task);

      // Assert
      expect(result.type).toBe('QUIZ');
      expect(result.number).toBe(3);
    });

    it('deve categorizar Video-base', () => {
      // Arrange
      const task = { title: 'Video-base' };

      // Act
      const result = categorizeTask(task);

      // Assert
      expect(result.type).toBe('VIDEO_BASE');
      expect(result.number).toBeNull();
    });

    it('deve categorizar Texto-base', () => {
      // Arrange
      const task = { title: 'Texto-base' };

      // Act
      const result = categorizeTask(task);

      // Assert
      expect(result.type).toBe('TEXTO_BASE');
    });

    it('deve categorizar Aprofundando o Tema', () => {
      // Arrange
      const task = { title: 'Aprofundando o Tema' };

      // Act
      const result = categorizeTask(task);

      // Assert
      expect(result.type).toBe('APROFUNDANDO');
    });

    it('deve categorizar Atividade Avaliativa', () => {
      const cases = [
        'Semana 1 - Atividade Avaliativa',
        'Semana 2 - Atividade avaliativa',
        'Semana 7 - Avaliação Institucional',
      ];
      cases.forEach((title) => {
        const result = categorizeTask({ title });
        expect(result.type).toBe('ATIVIDADE_AVALIATIVA');
      });
    });

    it('deve categorizar Fórum Temático', () => {
      const task = { title: 'Semana 1 - Fórum temático - Congressos...' };
      const result = categorizeTask(task);
      expect(result.type).toBe('FORUM_TEMATICO');
    });

    it('deve categorizar Fórum de Dúvidas', () => {
      const task = { title: 'Fórum de dúvidas das semanas 1-7' };
      const result = categorizeTask(task);
      expect(result.type).toBe('FORUM_DUVIDAS');
    });

    it('deve categorizar Quiz Objeto Educacional', () => {
      const task = { title: 'Semana 1 - Quiz Objeto Educacional Semana 1' };
      const result = categorizeTask(task);
      expect(result.type).toBe('QUIZ_OBJETO_EDUCACIONAL');
    });

    it('deve categorizar Material Base/Apoio', () => {
      const cases = [
        'Material-base - How to write an abstract',
        'Material de apoio - Estratégias de leitura',
      ];
      cases.forEach((title) => {
        const result = categorizeTask({ title });
        expect(result.type).toBe('MATERIAL_BASE');
      });
    });

    it('deve categorizar Vídeo-base (Complementar)', () => {
      const task = { title: 'Vídeo-base - Conjuntos Numéricos' };
      const result = categorizeTask(task);
      expect(result.type).toBe('VIDEO_BASE_COMPLEMENTAR');
    });

    it('deve retornar OUTROS para tarefas não reconhecidas', () => {
      // Arrange
      const task = { title: 'Tarefa Completamente Desconhecida' };

      // Act
      const result = categorizeTask(task);

      // Assert
      expect(result.type).toBe('OUTROS');
    });

    it('deve preservar dados originais', () => {
      // Arrange
      const task = {
        title: 'Videoaula 1 - Introdução',
        id: '_1234_1',
        url: 'http://ava.univesp.br/...',
      };

      // Act
      const result = categorizeTask(task);

      // Assert
      expect(result.original).toEqual(task);
      expect(result.id).toBe('_1234_1');
    });
  });
});
