import { ActivityProgress } from '../../models/ActivityProgress.js';

describe('ActivityProgress Model', () => {
  describe('fromScraped', () => {
    it('deve criar progresso a partir de status scraped DONE', () => {
      const progress = ActivityProgress.fromScraped('activity_1', 'DONE');

      expect(progress.activityId).toBe('activity_1');
      expect(progress.status).toBe('DONE');
      expect(progress.markedByUser).toBe(false);
      expect(progress.completedInAVA).toBe(true);
      expect(progress.lastUpdated).toBeGreaterThan(0);
    });

    it('deve criar progresso a partir de status scraped TODO', () => {
      const progress = ActivityProgress.fromScraped('activity_2', 'TODO');

      expect(progress.status).toBe('TODO');
      expect(progress.completedInAVA).toBe(false);
    });

    it('deve criar progresso com status DOING', () => {
      const progress = ActivityProgress.fromScraped('activity_3', 'DOING');

      expect(progress.status).toBe('DOING');
      expect(progress.completedInAVA).toBe(false);
    });
  });

  describe('fromUserToggle', () => {
    it('deve criar progresso DONE quando usuário marca como concluído', () => {
      const progress = ActivityProgress.fromUserToggle('activity_4', true);

      expect(progress.status).toBe('DONE');
      expect(progress.markedByUser).toBe(true);
      expect(progress.completedInAVA).toBe(false);
    });

    it('deve criar progresso TODO quando usuário desmarca', () => {
      const progress = ActivityProgress.fromUserToggle('activity_5', false);

      expect(progress.status).toBe('TODO');
      expect(progress.markedByUser).toBe(true);
    });
  });

  describe('isCompleted', () => {
    it('deve retornar true para status DONE', () => {
      /** @type {Partial<import('../../models/ActivityProgress.js').ActivityProgressData>} */
      const progress = { status: 'DONE' };
      expect(ActivityProgress.isCompleted(progress)).toBe(true);
    });

    it('deve retornar false para status TODO', () => {
      /** @type {Partial<import('../../models/ActivityProgress.js').ActivityProgressData>} */
      const progress = {
        status: /** @type{import('../../models/ActivityProgress.js').ProgressStatus} */ ('TODO'),
      };
      expect(ActivityProgress.isCompleted(progress)).toBe(false);
    });

    it('deve retornar false para status DOING', () => {
      /** @type {Partial<import('../../models/ActivityProgress.js').ActivityProgressData>} */
      const progress = {
        status: /** @type {import('../../models/ActivityProgress.js').ProgressStatus} */ ('DOING'),
      };
      expect(ActivityProgress.isCompleted(progress)).toBe(false);
    });

    it('deve retornar false para progresso null', () => {
      expect(ActivityProgress.isCompleted(null)).toBe(false);
    });

    it('deve retornar false para progresso undefined', () => {
      expect(ActivityProgress.isCompleted(undefined)).toBe(false);
    });
  });

  describe('generateId', () => {
    it('deve gerar ID composto correto', () => {
      const id = ActivityProgress.generateId('LET100', 'semana1', 'elem_9');
      expect(id).toBe('LET100_semana1_elem_9');
    });

    it('deve gerar ID com caracteres especiais', () => {
      const id = ActivityProgress.generateId('MAT-101', 'semana_02', 'anonymous_element_15');
      expect(id).toBe('MAT-101_semana_02_anonymous_element_15');
    });
  });

  describe('STATUS constants', () => {
    it('deve ter constantes definidas', () => {
      expect(ActivityProgress.STATUS.TODO).toBe('TODO');
      expect(ActivityProgress.STATUS.DOING).toBe('DOING');
      expect(ActivityProgress.STATUS.DONE).toBe('DONE');
    });
  });
});
