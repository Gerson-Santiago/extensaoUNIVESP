import { ActivityRepository } from '../../repositories/ActivityRepository.js';

// Mock do Chrome Storage
const storageMock = {};
global.chrome = {
  storage: {
    // @ts-expect-error - Partial mock for testing, doesn't implement full LocalStorageArea interface
    local: {
      get: jest.fn((keys) => {
        const result = {};
        if (typeof keys === 'string') {
          result[keys] = storageMock[keys];
        } else if (Array.isArray(keys)) {
          keys.forEach((k) => (result[k] = storageMock[k]));
        } else {
          Object.keys(keys).forEach((k) => (result[k] = storageMock[k]));
        }
        return Promise.resolve(result);
      }),
      set: jest.fn((items) => {
        Object.assign(storageMock, items);
        return Promise.resolve();
      }),
    },
  },
};

describe('Security: Storage Concurrency & Race Conditions', () => {
  beforeEach(() => {
    // Limpar mock antes de cada teste
    for (const key in storageMock) delete storageMock[key];
    jest.clearAllMocks();
  });

  test('🔴 DEVE FALHAR: Deve impedir sobrescrita cega (Last Write Wins) via Optimistic Locking', async () => {
    // Cenário: Dois atores tentam atualizar a mesma atividade simultaneamente
    const courseId = '100';
    const contentId = '555';

    // 1. Estado Inicial (v1)
    const initialItems = [{ id: '1', completed: false }];
    await ActivityRepository.save(courseId, contentId, initialItems, 'MANUAL');

    // 2. Leitura Concorrente (User A e User B leem v1)
    // Precisamos simular que ambos obtiveram a MESMA versão
    // No código atual, não existe campo version, então isso é implícito

    // Simulação:
    // A intenção é que o save exija envio da versão anterior conhecida.
    // Como o save atual não aceita version, o teste vai falhar já na assinatura ou na execução cega.

    // Para TDD estrito, vamos tentar usar a API atual simulando o comportamento desejado
    // Mas como ainda não mudamos a assinatura do método save, não temos como passar a versão.
    // Então este teste está testando a *ausência* da proteção.

    // Act: User A salva atualização
    const itemsA = [{ id: '1', completed: true }];
    await ActivityRepository.save(courseId, contentId, itemsA, 'MANUAL'); // v2

    // Act: User B tenta salvar algo conflitante baseando-se no estado inicial (que ele "leu" antes)
    // Sem Optimistic Locking, isso funcionaria e apagaria o trabalho de A.
    const itemsB = [{ id: '1', completed: false, note: 'User B was here' }];

    // ASSERT: Esperamos que o sistema REJEITE salvar se não tivermos a versão mais recente.
    // Como implementaremos isso? Provavelmente passando um token de versão ou verificando antes.
    // O teste ideal de integração verificaria se o save falha quando o dado no banco mudou.

    // Como o ActivityRepository.save atual é "cego", ele vai sobrescrever.
    // O teste deve falhar dizendo: "Esperava erro de conflito, mas salvou com sucesso"

    /* 
           NOTA PARA O FUTURO IMPLEMENTADOR (Eu mesmo):
           Para corrigir isso, teremos que mudar a assinatura do save para:
           save(courseId, contentId, items, method, expectedVersion)
        */

    // Por enquanto, testamos a lógica de "Check-And-Set" que não existe.
    // Vamos assumir que vamos mudar a assinatura ou que o método interno faria a checagem.

    // Vamos verificar se o dado final é inconsistente com uma abordagem de "Blind Write"
    await ActivityRepository.save(courseId, contentId, itemsB, 'MANUAL'); // Sobrescreve v2 (trabalho de A perdido)

    const finalState = await ActivityRepository.get(courseId, contentId);

    // Se o código fosse seguro, o trabalho de A (completed: true) teria sido preservado via merge
    // OU o salvamento de B teria falhado.

    // A expectativa deste teste RED é: PROVAR QUE O SISTEMA É INSEGURO ou EXIGIR SEGURANÇA.
    // Vamos exigir segurança: O sistema deveria ter rejeitado ou mergeado.
    // Como sabemos que ele é Last-Write-Wins, vamos afirmar que ele NÃO deve ter perdido o dado de A.

    const isSecure = finalState.items[0].completed === true; // Se A persistiu (via merge) ou B falhou (mantendo A)

    expect(isSecure).toBe(true);
    // ISTO VAI FALHAR: Porque itemsB tem completed: false e sobrescreveu itemsA.
  });
});
