# Padrões do Projeto (Standards & Conventions)

> **Objetivo:** Documento unificado  de padrões técnicos, convenções de código e especificação de commits.

---

## 1. Stack Tecnológica

- **Plataforma**: Google Chrome Extension (Manifest V3)
- **Linguagem**: JavaScript (ES2024+ / ES Modules)
- **Runtime de Dev**: Node.js >= 24.x
- **Tipagem**: JSDoc + TypeScript Check
- **Testes**: Jest + jsdom
- **CI/CD

**: Husky + Commitlint + Secretlint

---

## 2. Padrões de Qualidade e Análise Estática

### 2.1 Linting (ESLint)
**Configuração:** `eslint.config.mjs` (Flat Config)  
**Política:** **Tolerância Zero** → `npm run lint` deve retornar exit code 0

**Regras Críticas:**
- `semi`: Obrigatório (`always`)
- `quotes`: Aspas simples (`single`)
- `no-console`: Proibido em produção (apenas `warn`/`error`/`debug`)
- `no-unused-vars`: Proibido (exceto prefixo `_`)

### 2.2 Formatação (Prettier)
**Configuração:** `.prettierrc`  
**Política:** Automática e não negociável em Code Review

- Largura: 100 caracteres
- Aspas simples, Ponto e vírgula, Trailing Comma (ES5)

### 2.3 Tipagem Estática (JSDoc + TypeScript)
**Validação:** `npm run type-check`

**Hierarquia de Tipos:**
1. **Models Canônicos** (`features/*/models/`): Fonte única da verdade
2. **Imports de Tipos**: `@typedef {import(...)}` para reutilização
3. **Definições Inline**: Apenas para tipos locais (com justificativa)

**Exemplo:**
```javascript
// Model canônico
/** @typedef {{id: string, name: string}} Course */
export const Course = {};

// Reutilização
/** @typedef {import('../models/Course.js').Course} Course */
```

---

## 3. Testes Automatizados

### 3.1 Framework
- **Runner:** Jest
- **Environment:** `jest-environment-jsdom`
- **Mocking:** `jest-webextension-mock` (Chrome API)

### 3.2 Estratégia
- **Localização:** Colocizados com implementação ou em `tests/`
- **Cobertura:** Foco em `logic/` e serviços críticos
- **Padrão AAA:** Arrange, Act, Assert (obrigatório)

**Exemplo AAA:**
```javascript
describe('getUsuario', () => {
  it('deve retornar usuário existente', async () => {
    // Arrange
    const userId = '123';
    const mockUser = { id: userId, name: 'João' };
    
    // Act
    const result = await getUsuario(userId);
    
    // Assert
    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockUser);
  });
});
```

### 3.3 SafeResult Pattern (Error Handling Robusto)

O projeto adota o **SafeResult Pattern** para error handling previsível e testável.

**Contrato SafeResult:**
```javascript
/**
 * @template T
 * @typedef {Object} SafeResult
 * @property {boolean} success - Indica se a operação foi bem-sucedida
 * @property {T|null} data - Dados retornados (null em caso de erro)
 * @property {Error|null} error - Erro capturado (null em caso de sucesso)
 */
```

**Wrapper `trySafe`:**
```javascript
import { trySafe } from '@shared/utils/ErrorHandler.js';

/**
 * Busca atividades da semana.
 * @param {string} weekId
 * @returns {Promise<SafeResult<Activity[]>>}
 */
async function getActivities(weekId) {
  const result = await trySafe(
    WeekContentScraper.scrape(weekId)
  );
  
  if (!result.success) {
    console.error('Falha ao buscar atividades:', result.error);
    return { success: false, data: [], error: result.error };
  }
  
  return { success: true, data: result.data, error: null };
}
```

**Benefícios:**
- ✅ Erros tratados de forma consistente
- ✅ Tipo de retorno explícito (`SafeResult<T>`)
- ✅ Testável sem mocks complexos
- ✅ Evita try/catch aninhados

**Referência:** [`ADR_005_SAFERESULT_PATTERN.md`](../docs/architecture/ADR_005_SAFERESULT_PATTERN.md)

---

## 4. Arquitetura e Modularização

### 4.1 Screaming Architecture
A estrutura reflete os domínios de negócio:
- **`features/`:** Módulos independentes por contexto (courses, settings)
- **`shared/`:** Componentes agnósticos de domínio
- **`models/`:** Definições de tipo colocalizadas

### 4.2 Convenções de Código
- **ECMAScript Modules:** Uso estrito de `import`/`export`
- **Classes vs Funções:**
  - Classes → Serviços com estado (ex: `SessionManager`)
  - Funções Puras → Lógica de negócio (ex: `TermParser.parseTerm`)

### 4.3 Padrões de Frontend
- **Eventos:** Uso exclusivo de `PointerEvent` (não `onclick`)
- **Motivo:** Interop 2025+, suporte a touch/pen em navegadores modernos

---

## 5. Padrões de Persistência (Storage)

### 5.1 Repository Pattern
Acesso a dados encapsulado em Repositories (ex: `CourseRepository`)

### 5.2 Estratégias
- **chrome.storage.local:** Cache pesado (atividades, 5MB quota)
- **chrome.storage.sync:** Configurações leves (100KB/item)
- **Auto-Save:** Operações de scraping persistem imediatamente
- **Cache-First:** UI renderiza do Storage antes de network

**Referência:** [`ADR_004`](file:///home/sant/extensaoUNIVESP/docs/architecture/ADR_004_NAVIGATION_BREADCRUMB_LOGIC.md)

---

## 6. Scripts de Automação

### 6.1 Verificação e Qualidade

| Script | Descrição | Quando Usar |
| :--- | :--- | :--- |
| `npm run verify` | **Pipeline completa** (tests + lint + type-check) | Obrigatório antes de PR |
| `npm run lint` | ESLint com zero tolerância | Validação de código |
| `npm run lint:fix` | ESLint com correção automática | Corrigir erros de lint |
| `npm run format` | Prettier (formata todo projeto) | Primeira vez ou mudança de config |
| `npm run type-check` | Verificação de tipos JSDoc | Validação estática |

### 6.2 Testes (Jest)

**Core:**
| Script | Comando | Quando Usar |
| :--- | :--- | :--- |
| `npm test` | `jest` | Suite completa (437 testes) |
| `npm run test:watch` | `jest --watch` | Desenvolvimento ativo |
| `npm run test:coverage` | `jest --coverage` | Análise de cobertura |

**Por Feature:**
- `npm run test:courses`
- `npm run test:settings`
- `npm run test:unit` / `npm run test:integration`

### 6.3 Segurança (3 Camadas)

| Script | Ferramenta | O Que Detecta |
| :--- | :--- | :--- |
| `npm run security:secrets` | Secretlint | API keys, tokens, passwords |
| `npm run security:audit` | npm audit | CVE high/critical em dependências |
| `npm run security:lint` | ESLint Security | eval, injection, XSS |
| `npm run security` | **Todas acima** | Gate completo |

**Bloqueadores Automáticos:**
- ❌ Commits com secrets detectados
- ❌ Dependências com CVE high/critical
- ❌ Código com vulnerabilidades conhecidas

### 6.4 Pre-commit (Automático)

**Executado em todo `git commit`:**
1. `security:secrets` → Detecta secrets (~0.5s)
2. `lint-staged` → ESLint + Prettier + Jest (apenas arquivos alterados)

**Performance:** ~16s (apenas testes relacionados)  
**Bypass:** `git commit --no-verify` (não recomendado)

---

## 7. Especificação de Commits (Conventional Commits)

### 7.1 Formato
```
<tipo>(<escopo opcional>): <descrição>

[corpo opcional]

[rodapé opcional]
```

### 7.2 Regras de Sintaxe
1. Assunto em **minúscula**, verbo **imperativo**
2. Sem ponto final, máximo 100 caracteres
3. Idioma: **Português Brasileiro**

### 7.3 Tipos de Commit

| Tipo | Descrição | Exemplo |
| :--- | :--- | :--- |
| `feat` | Nova funcionalidade | `feat: implementa login automático` |
| `fix` | Correção de bug | `fix: resolve crash no scraper` |
| `docs` | Alterações em documentação | `docs: atualiza diagrama` |
| `style` | Formatação (sem lógica) | `style: aplica prettier` |
| `refactor` | Mudança sem alterar comportamento | `refactor: extrai service` |
| `test` | Adição/correção de testes | `test: adiciona cobertura` |
| `chore` | Manutenção de build/deps | `chore: atualiza eslint` |
| `perf` | Melhoria de performance | `perf: otimiza renderização` |

### 7.4 Escopos
Deve seguir a estrutura de diretórios ou domínios lógicos:
- `features` (ou feature específica: `courses`, `settings`)
- `shared`, `ui`, `core`, `deps`, `security`

### 7.5 Exemplos Reais
```bash
feat(courses): adiciona cache de atividades com localStorage

fix(ux): destaque azul permanece quando preview fecha

refactor(eng): adota SafeResult pattern para error handling

chore(security): adiciona secretlint no pre-commit
```

### 7.6 Automação (Commitlint + Husky)
Commits que violem regras são **rejeitados automaticamente** no `commit-msg` hook.

**Validação Manual:**
```bash
echo "feat: minha mensagem" | npx commitlint
```

---

## 8. Compliance

> **Regra:** Pull Requests que não aderem a estes padrões serão reprovados na revisão.

**Checklist Pré-PR:**
- [ ] `npm run verify` passou (437 testes, 0 warnings, 0 type errors)
- [ ] Commit segue Conventional Commits
- [ ] Código tem cobertura de testes adequada (AAA pattern)
- [ ] JSDoc está completo e preciso

---

## 9. Código Intencional (Auditoria de Decisão)

Para garantir que o Vanilla JS não se torne um emaranhado de lógicas implícitas, seguimos o **Framework de Auditoria de Controle Técnica**. Toda estrutura de decisão deve ser questionada:

### 10.1 Checklist de Decisão (Review & Refactor)

**Intenção:**
- [ ] A decisão é de negócio, validação ou proteção técnica?
- [ ] O sistema perde comportamento essencial se este bloco for removido?

**Fluxo (if/else/switch):**
- [ ] A condição é binária ou existem estados inválidos não tratados?
- [ ] Podemos usar **Early Return** para reduzir aninhamento?
- [ ] A condição é legível em voz alta (sem decodificar símbolos)?

**Exceções (try/catch):**
- [ ] O erro está sendo silenciado ou tratado com contexto para debug?
- [ ] O sistema permanece em estado consistente após a falha?

**Arquitetura:**
- [ ] Esta lógica pertence ao **Núcleo** (regra) ou à **Borda** (detalhe técnico)?
- [ ] Estamos acoplando regras de negócio dentro de controles de infraestrutura?

---

## 10. Referências

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Keep a Changelog](https://keepachangelog.com/pt-BR/)
- [Screaming Architecture](https://blog.cleancoder.com/uncle-bob/2011/09/30/Screaming-Architecture.html)
- **Docs Internas:** [`ENGINEERING_GUIDE.md`](file:///home/sant/extensaoUNIVESP/docs/ENGINEERING_GUIDE.md), [`TECNOLOGIAS_E_ARQUITETURA.md`](file:///home/sant/extensaoUNIVESP/docs/TECNOLOGIAS_E_ARQUITETURA.md)
