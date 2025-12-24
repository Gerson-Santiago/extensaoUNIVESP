import { ActivityProgressRepository } from '../repository/ActivityProgressRepository.js';
import { ActivityProgress } from '../models/ActivityProgress.js';

describe('ActivityProgressRepository', () => {
    beforeEach(async () => {
        await ActivityProgressRepository.clear();
    });

    afterEach(async () => {
        await ActivityProgressRepository.clear();
    });

    describe('save and get', () => {
        it('deve salvar e recuperar progresso', async () => {
            const progress = ActivityProgress.fromUserToggle('test_1', true);

            await ActivityProgressRepository.save(progress);
            const retrieved = await ActivityProgressRepository.get('test_1');

            expect(retrieved).toEqual(progress);
        });

        it('deve retornar null para atividade não existente', async () => {
            const result = await ActivityProgressRepository.get('non_existent');
            expect(result).toBeNull();
        });
    });

    describe('toggle', () => {
        it('deve criar e alternar progresso', async () => {
            // Primeira vez: cria como DONE
            const first = await ActivityProgressRepository.toggle('test_toggle');
            expect(first?.status).toBe('DONE');

            // Segunda vez: alterna para TODO
            const second = await ActivityProgressRepository.toggle('test_toggle');
            expect(second?.status).toBe('TODO');

            // Terceira vez: volta para DONE
            const third = await ActivityProgressRepository.toggle('test_toggle');
            expect(third?.status).toBe('DONE');
        });
    });

    describe('delete', () => {
        it('deve deletar progresso', async () => {
            const progress = ActivityProgress.fromUserToggle('test_delete', true);
            await ActivityProgressRepository.save(progress);

            await ActivityProgressRepository.delete('test_delete');
            const result = await ActivityProgressRepository.get('test_delete');

            expect(result).toBeNull();
        });
    });

    describe('clear', () => {
        it('deve limpar todo progresso', async () => {
            const p1 = ActivityProgress.fromUserToggle('test_1', true);
            const p2 = ActivityProgress.fromUserToggle('test_2', true);

            await ActivityProgressRepository.save(p1);
            await ActivityProgressRepository.save(p2);
            await ActivityProgressRepository.clear();

            const r1 = await ActivityProgressRepository.get('test_1');
            const r2 = await ActivityProgressRepository.get('test_2');

            expect(r1).toBeNull();
            expect(r2).toBeNull();
        });
    });
});
