# SPEC-019: Robust Backup System (Schema-Validated)

**ID:** SPEC-019  
**Epic Parent:** EPIC-002 (Data Sovereignty)  
**Prioridade:** 🟡 Alta (User Value)  
**Estimativa:** 4 dias  
**Status:** 📋 Aberta  
**Owner:** TBD  
**QA Reviewer:** QA Lead  
**Data:** 02/01/2026

---

## 🎯 Objetivo de Negócio

Substituir o sistema atual de backup (dump cru do `chrome.storage`) por um sistema **robusto, versionado e validado** que previna corrupção de dados e permita migração entre versões futuras da extensão.

**Justificativa:**
- **User Safety:** Usuário não pode perder todos os dados por importar arquivo corrompido.
- **GDPR Compliance:** Usuário tem direito de exportar seus dados (data portability).

---

## 📖 Contexto Técnico

### Estado Atual (Problemático)
```javascript
// ❌ ATUAL: Dump cru sem validação
export async function exportData() {
  const data = await chrome.storage.local.get(null);
  const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  // Download blob...
}

export async function importData(jsonString) {
  const data = JSON.parse(jsonString); // ☠️ Sem validação!
  await chrome.storage.local.clear();
  await chrome.storage.local.set(data); // ☠️ Se falhar, dados perdidos!
}
```

**Problemas:**
1. **Nenhuma validação:** JSON malformado quebra a extensão.
2. **Sem atomicidade:** Se `set()` falhar após `clear()`, usuário perde TUDO.
3. **Sem versionamento:** Futuras versões não conseguem migrar schemas antigos.

---

### Estado Desejado (Seguro e Versionado)

#### Estrutura do JSON de Backup
```typescript
interface BackupPayload {
  meta: {
    version: string;      // ex: "2.10.0"
    exportedAt: string;   // ISO 8601
    extensionName: string; // "Central Univesp"
  };
  data: {
    courses: Course[];
    ui_settings: object;
    user_preferences: object;
  };
}
```

#### Fluxo de Importação Seguro
```javascript
// ✅ SEGURO: Validação + Atomicidade Simulada
export async function importData(fileContent) {
  // 1. Parse e Valida Schema
  const result = BackupSchema.validate(fileContent);
  if (result.isFailure()) {
    return SafeResult.failure('JSON inválido');
  }
  
  // 2. Backup de Emergência (snapshot atual)
  const currentData = await chrome.storage.local.get(null);
  
  // 3. Sanitiza (Anti-XSS)
  const sanitized = BackupSchema.sanitize(result.value);
  
  // 4. Limpa e Escreve (com try/catch)
  try {
    await chrome.storage.local.clear();
    await chrome.storage.local.set(sanitized.data);
    return SafeResult.success();
  } catch (error) {
    // 5. Rollback: Restaura snapshot
    await chrome.storage.local.set(currentData);
    return SafeResult.failure('Falha ao importar', error);
  }
}
```

---

## 📋 Requisitos Funcionais

### RF-001: Schema Validation (Pré-Importação)
**Localização:** `features/settings/domain/BackupSchema.js`

**Validações Obrigatórias:**
```javascript
export class BackupSchema {
  static validate(jsonString) {
    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch {
      return SafeResult.failure('JSON malformado');
    }
    
    // Validação de estrutura
    if (!parsed.meta || !parsed.meta.version) {
      return SafeResult.failure('Falta campo meta.version');
    }
    
    if (!parsed.data || !Array.isArray(parsed.data.courses)) {
      return SafeResult.failure('Falta campo data.courses ou não é array');
    }
    
    return SafeResult.success(parsed);
  }
}
```

**Critérios:**
- [ ] Rejeita JSON sem `meta.version`.
- [ ] Rejeita JSON sem `data.courses`.
- [ ] Rejeita JSON onde `data.courses` não é array.

---

### RF-002: Sanitização Anti-XSS
**Objetivo:** Prevenir que JSON malicioso injete scripts.

**Implementação:**
```javascript
static sanitize(payload) {
  const dangerous = /<script|javascript:|onerror=/gi;
  
  // Varrer recursivamente todas as strings
  function cleanStrings(obj) {
    if (typeof obj === 'string') {
      if (dangerous.test(obj)) {
        throw new Error('Conteúdo malicioso detectado');
      }
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map(cleanStrings);
    }
    if (typeof obj === 'object') {
      const cleaned = {};
      for (const [key, value] of Object.entries(obj)) {
        cleaned[key] = cleanStrings(value);
      }
      return cleaned;
    }
    return obj;
  }
  
  return cleanStrings(payload);
}
```

**Critérios:**
- [ ] Rejeita JSON contendo `<script>`.
- [ ] Rejeita JSON contendo `javascript:`.
- [ ] Aceita JSON limpo (sem modificações desnecessárias).

---

### RF-003: Atomicidade Simulada (Backup de Emergência)
**Objetivo:** Nunca deixar usuário sem dados.

**Fluxo:**
1. **Ler** estado atual do storage (snapshot).
2. **Validar** JSON importado.
3. **Limpar** storage.
4. **Tentar** escrever novo estado.
5. **Se falhar:** Restaurar snapshot (rollback).

**Critérios:**
- [ ] Se `chrome.storage.local.set()` falhar, snapshot é restaurado.
- [ ] Teste de simulação de falha (desconectar storage mock) deve passar.

---

### RF-004: Versionamento de Schema
**Objetivo:** Suportar migração de versões antigas.

**Implementação:**
```javascript
static migrate(payload) {
  const version = payload.meta.version;
  
  if (version === '2.9.x') {
    // Migrar de 2.9.x para 2.10.0
    payload.data.user_preferences = {}; // Adicionar campo novo
  }
  
  return payload;
}
```

**Critérios:**
- [ ] Importação de backup v2.9.x funciona (migrado automaticamente).
- [ ] Campo `meta.version` é atualizado após migração.

---

## 🔒 Requisitos Não-Funcionais

### RNF-001: Performance
- **Exportação:** < 1 segundo para até 100 cursos.
- **Importação:** < 3 segundos (inclui validação + escrita).

### RNF-002: Usabilidade
- **Nome do arquivo:** `central-univesp-backup-YYYY-MM-DD.json` (não `download.json`).
- **Feedback:** Toaster mostra "Backup exportado com sucesso" ou erro específico.

### RNF-003: Observabilidade (ADR-005)
- Logs estruturados:
  ```javascript
  Logger.info('Backup exportado', { coursesCount: 42, size: '12KB' });
  Logger.error('Importação falhou', { reason: 'Schema inválido' });
  ```

---

## ✅ Critérios de Aceite (Testáveis)

### CA-001: Validação de JSON Inválido
```bash
# Input: JSON corrompido
{"meta": "INVALID"}

# Output Esperado:
# - SafeResult.failure retornado
# - Toaster: "Formato de arquivo inválido"
# - chrome.storage não foi alterado
```

### CA-002: Importação com Rollback
```javascript
// Simular falha no storage.set
chrome.storage.local.set = jest.fn().mockRejectedValue(new Error('Falha'));

// Act
await ImportController.execute(validBackup);

// Assert
expect(chrome.storage.local.get()).toEqual(originalData); // Rollback funcionou
```

### CA-003: Exportação com Timestamp
```bash
# Arquivo baixado DEVE ter formato:
central-univesp-backup-2026-01-02.json

# Não aceitar:
download.json
backup.json
```

---

## 📦 Entregáveis

1. **Domain Layer:**
   - [ ] `features/settings/domain/BackupSchema.js` (validação + sanitização)

2. **Logic Layer:**
   - [ ] `features/settings/logic/ExportController.js`
   - [ ] `features/settings/logic/ImportController.js`

3. **Service Layer:**
   - [ ] Atualizar `shared/services/StorageService.js` (se necessário)

4. **Testes:**
   - [ ] `BackupSchema.test.js` (validação + sanitização)
   - [ ] `ImportController.test.js` (rollback scenario)

---

## 🧪 Plano de Testes (AAA Pattern)

### Teste 1: Importação de Backup Antigo (v2.9.x)
```javascript
describe('ImportController', () => {
  it('deve migrar backup v2.9.x automaticamente', async () => {
    // Arrange
    const oldBackup = `{
      "meta": { "version": "2.10.0" },
      "data": { "courses": [] }
    }`;
    
    // Act
    const result = await ImportController.execute(oldBackup);
    
    // Assert
    expect(result.isSuccess()).toBe(true);
    const newData = await chrome.storage.local.get('user_preferences');
    expect(newData).toBeDefined(); // Campo novo adicionado
  });
});
```

### Teste 2: JSON com Script Malicioso
```javascript
it('deve rejeitar JSON com <script>', async () => {
  // Arrange
  const maliciousBackup = `{
    "meta": { "version": "2.10.0" },
    "data": { 
      "courses": [{ "name": "<script>alert('XSS')</script>" }]
    }
  }`;
  
  // Act
  const result = await ImportController.execute(maliciousBackup);
  
  // Assert
  expect(result.isFailure()).toBe(true);
  expect(result.error).toContain('malicioso');
});
```

---

## 🔗 Dependencies

| Dependency | Tipo | Bloqueador? |
|------------|------|-------------|
| ADR-003 (SafeResult) aprovado | Governança | ❌ Não (já existe) |
| SPEC-022 (Settings UI) | Técnica | ✅ Sim (botões de export/import precisam de UI) |
| Issue-035 (Privacy Policy) | Legal | ⚠️ Parcial (deve mencionar export) |

---

## 🚨 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Migração de schema falha (v2.9 → v2.10) | Média | Alto | Testes com backups reais de v2.9 |
| Rollback não restaura tudo (estado parcial) | Baixa | Muito Alto | Testar com mock de falha no `set()` |
| Usuário tenta importar backup de outra extensão | Baixa | Médio | Validar `meta.extensionName` |

---

## 📅 Timeline Sugerido

| Dia | Atividade |
|-----|-----------|
| **D1** | Implementar `BackupSchema` (validação + sanitização) + testes |
| **D2** | Implementar `ExportController` + gerar arquivo com timestamp |
| **D3** | Implementar `ImportController` (atomicidade + rollback) |
| **D4** | Testes de integração + validação de migração v2.9.x |

---

**Aprovação QA Lead:** ✅ SPEC completa, altamente defensiva contra perda de dados. Arquitetura SafeResult garante robustez.
