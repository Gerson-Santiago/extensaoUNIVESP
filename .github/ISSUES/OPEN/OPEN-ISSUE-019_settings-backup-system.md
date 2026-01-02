# 📝 ISSUE-019: Refatoração de Settings e Sistema de Backup Robusto

**Status:** 📋 Aberta
**Prioridade:** Alta
**Componente:** `features/settings`
**Versão:** v2.9.6+ (Próxima)

---

## 🎯 Objetivo

Implementar um sistema de backup (Export/Import) verdadeiramente robusto e refatorar a feature de Settings para seguir os novos padrões arquiteturais (Screaming Architecture, JSDoc estrito e Testes AAA). O usuário deve ser capaz de baixar e restaurar a integridade total do seu estado acadêmico (Cursos, Semanas, Atividades e Configurações).

---

## 📖 Contexto

Atualmente o `BackupService` realiza um dump bruto do `chrome.storage.local`. Embora funcional, carece de:
1.  **Validação de Esquema:** Impedir que JSONs corrompidos ou de versões incompatíveis travem a extensão.
2.  **Granularidade:** O backup deve garantir que dados de cursos e atividades estejam sincronizados.
3.  **Arquitetura:** A feature `settings` precisa estar 100% alinhada ao ADR-000-A (Screaming Architecture).
4.  **Feedback:** Notificar conclusão da exportação/importação via Toaster simples.

---

## 🛠️ Requisitos Técnicos

### 1. Refatoração de Domínio (ADR-000-A)
- Mover lógica de negócio de `SettingsView.js` para um `SettingsController.js` ou similar.
- Garantir que o `BackupService.js` seja tratado como um *Infrastructure Service* com interfaces claras.

### 2. Fortalecimento do BackupService
- **Schema Validation:** Implementar uma verificação de integridade ao importar (ex: chaves obrigatórias).
- **Meta-Informação:** Incluir no JSON a data e versão da extensão.
- **Restauração Segura:** Garantir que o `chrome.storage.local.clear()` seguido de `set()` não deixe o sistema em estado inconsistente em caso de erro.

### 3. Tipagem e Documentação (ADR-000-B)
- Definir tipos JSDoc para `BackupPayload`, `SettingsConfig` e `CourseData`.
- Remover qualquer uso de `any` ou `unknown` na camada de lógica.

### 4. 🛡️ Segurança (ADR-012)
- **Validação de Injection:** Ao restaurar backup, validar que o JSON não contenha scripts ou payloads maliciosos (ex: valores com `<script>`).
- **Sanitização:** Usar `JSON.parse` com schema validation (ex: verificar se todas as chaves esperadas existem e possuem tipos corretos).
- **Fail-Safe:** Em caso de falha na importação, o storage original NÃO deve ser corrompido (usar transação simulada: ler, validar, escrever OU reverter).

---

## ✅ Critérios de Aceite (Critérios de Sucesso)

- [ ] O usuário consegue baixar um arquivo `.json` contendo todos os seus dados.
- [ ] O arquivo exportado contém as chaves `meta` (versão, data) e `data` (storage bruto).
- [ ] A importação de um JSON inválido exibe um Toaster de erro claro ao invés de quebrar a extensão.
- [ ] Após a restauração, a extensão recarrega automaticamente e exibe os dados restaurados com 100% de precisão.
- [ ] A estrutura de pastas de `features/settings` segue o padrão: `ui/`, `components/`, `logic/`, `services/`, `tests/`.

---

## 🧪 Plano de Verificação (AAA Pattern)

Criação de `BackupService.test.js` seguindo o ADR-000-C:

1.  **Cenário: Exportação de Dados**
    - **Arrange:** Mock do `chrome.storage.local` com dados pré-definidos (cursos e configs).
    - **Act:** Chamar `BackupService.exportData()`.
    - **Assert:** Verificar se o objeto JSON gerado contém as meta-informações corretas e os dados do storage.

2.  **Cenário: Importação com Sucesso**
    - **Arrange:** Um string JSON válido com estado de exemplo.
    - **Act:** Chamar `BackupService.importData(json)`.
    - **Assert:** Verificar se `chrome.storage.local.set` foi chamado com os dados corretos.

3.  **Cenário: Falha na Importação (JSON Malformado)**
    - **Arrange:** Uma string aleatória não-JSON.
    - **Act:** Chamar `BackupService.importData(badInput)`.
    - **Assert:** Garantir que o erro é capturado e o storage original não é afetado (ou é tratado defensivamente).

---

**Tags:** `//ISSUE-settings-backup` | **Tipo:** Feature/Refactor | **Sprint:** v2.9.6-Quality-Gate
**Relatada por:** IA do Projeto | **Data:** 31/12/2025
