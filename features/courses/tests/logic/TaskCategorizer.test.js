/**
 * @file TaskCategorizer.test.js
 * @description Testes para categorização de tarefas do AVA
 */

import { categorizeTask } from '../../logic/TaskCategorizer.js';

describe('TaskCategorizer', () => {
  describe('categorizeTask', () => {
    it('deve categorizar Videoaula corretamente', () => {
      const task = { title: 'Videoaula 4 - Conjuntos numéricos (Parte 1)' };
      const result = categorizeTask(task);

      expect(result.type).toBe('VIDEOAULA');
      expect(result.number).toBe(4);
    });

    it('deve categorizar Quiz da Videoaula', () => {
      const task = { title: 'Quiz da Videoaula 3' };
      const result = categorizeTask(task);

      expect(result.type).toBe('QUIZ');
      expect(result.number).toBe(3);
    });

    it('deve categorizar Video-base', () => {
      const task = { title: 'Video-base' };
      const result = categorizeTask(task);

      expect(result.type).toBe('VIDEO_BASE');
      expect(result.number).toBeNull();
    });

    it('deve categorizar Texto-base', () => {
      const task = { title: 'Texto-base' };
      const result = categorizeTask(task);

      expect(result.type).toBe('TEXTO_BASE');
    });

    it('deve categorizar Aprofundando o Tema', () => {
      const task = { title: 'Aprofundando o Tema' };
      const result = categorizeTask(task);

      expect(result.type).toBe('APROFUNDANDO');
    });

    it('deve retornar OUTROS para tarefas não reconhecidas', () => {
      const task = { title: 'Material de Apoio Especial' };
      const result = categorizeTask(task);

      expect(result.type).toBe('OUTROS');
    });

    it('deve preservar dados originais', () => {
      const task = {
        title: 'Videoaula 1 - Introdução',
        id: '_1234_1',
        url: 'http://ava.univesp.br/...',
      };
      const result = categorizeTask(task);

      expect(result.original).toEqual(task);
      expect(result.id).toBe('_1234_1');
    });
  });
});
