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

    it('deve retornar OUTROS para tarefas não reconhecidas', () => {
      // Arrange
      const task = { title: 'Material de Apoio Especial' };

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
