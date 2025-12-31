# 🧪 TEST-COV: Integração do CourseRefresher

**Status:** 📋 Planejado (v2.9.6)
**Prioridade:** Alta (Critical/Coverage)
**Componentes:** `CourseRefresher`, `StorageService`, `NotificationService`
**Tipo:** Testes / Confiabilidade

---

## 🔗 Relacionado

**ISSUE Pai:** [ISSUES_v2.9.6](./ISSUES-[013-016]-OPEN-v2.9.6.md)
**Decisão Arquitetural:** [ADR-009 CourseRefresher Test Strategy](../../docs/architecture/ADR_009_TEST_STRATEGY_REFRESHER.md)

Devido à baixa cobertura (25.71%) e alta complexidade deste orquestrador, precisamos de testes que garantam o funcionamento do fluxo completo.

---

## 📋 Problema Atual

### **Cobertura Crítica:**
- **Statements:** 25.71%
- **Functions:** 0% (Reportado, possivelmente erro de instrumentação ou apenas construtor coberto)
- **Áreas Descobertas:** Linhas 18-69 (Lógica principal de refresh)

O `CourseRefresher` orquestra:
1.  Busca de cursos no DOM/API.
2.  Comparação com cache (`ChunkedStorage`).
3.  Identificação de novos materiais.
4.  Atualização de timestamps.
5.  Disparo de notificações.

**Riscos:**
- Refatorações no scraper podem quebrar o refresh silenciosamente.
- Bugs de atualização de cache podem passar despercebidos (ex: loop de atualizações).

## 📐 Padrões Arquiteturais Obrigatórios
- **[ADR 000-C: Padrão AAA](../../docs/architecture/ADR_000_C_AAA_TESTING_PATTERN.md)**: Todos os testes devem seguir estritamente Arrange-Act-Assert e títulos em português "Deve...".

---

## ✅ Solução Proposta

### **Testes de Integração:**
Em vez de mocks excessivos para cada dependência, vamos usar um teste de integração que:
1.  Mocka apenas as bordas do sistema (`fetch`/`DOM`, `chrome.storage`, `chrome.notifications`).
2.  Instancia o `CourseRefresher` real.
3.  Executa o método `refreshCourseList`.
4.  Verifica os efeitos colaterais no "banco" (storage mock) e notificações.

---

## 🛠️ Implementação Proposta

### **Novo Arquivo de Teste:**
`features/courses/services/__tests__/CourseRefresher.integration.test.js`

```javascript
describe('CourseRefresher Integration', () => {
    let storageMock;
    let refresher;

    beforeEach(() => {
        // Setup de mocks controlados
        setupGlobalMocks(); 
        refresher = new CourseRefresher();
    });

    it('deve identificar novos materiais e atualizar storage', async () => {
        // Arrange
        mockPageContent(fixtureMaterialNovo);
        
        // Act
        await refresher.refresh();

        // Assert
        expect(storageMock.get('courses')).toContain('novo-material');
        expect(notificationMock).toHaveBeenCalled();
    });
});
```

---

## 🧪 Plano de Testes

### **Cenários a Cobrir:**
1.  **Fluxo Feliz:** Detecção de novos materiais -> Atualização de Storage -> Notificação.
2.  **Fluxo Idempotente:** Execução sem novidades -> Sem writes no storage -> Sem notificações.
3.  **Fluxo de Erro:** Falha ao baixar página -> Log de erro -> Não corrompe storage.
4.  **Edge Case:** Curso removido ou renomeado.

---

## ✅ Critérios de Sucesso

- [ ] Arquivo de teste de integração criado.
- [ ] Mocks de `chrome.storage` e `fetch` configurados e reutilizáveis.
- [ ] Cobertura de statements do `CourseRefresher.js` > 70%.
- [ ] Pipeline de CI executando e passando os novos testes.

---

**Tags:** `//ISSUE-course-refresher-coverage` | **Tipo:** Testing | **Versão:** 2.9.6
**Criado:** 2025-12-31 | **Autor:** Prof. Antigravity
