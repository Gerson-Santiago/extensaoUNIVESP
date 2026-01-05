# 🔷 ISSUE-044: Type Safety Enhancement - Tipagem TypeScript/JSDoc

**Status:** 📋 Aberta  
**Prioridade:** 🔵 Alta  
**Componentes:** `Core`, `Types`, `DX`, `Quality`  
**GitHub Issue:** _(a ser criado)_

---

## 🎯 Objetivo

Implementar sistema estruturado e consistente de tipagem TypeScript/JSDoc para melhorar **type safety**, **developer experience** e **manutenibilidade** do código.

---

## 📊 Auditoria Inicial - Estado Atual

### Métricas do Projeto
- **Total de arquivos JS (produção):** 87 arquivos
- **Arquivos com `@typedef` existente:** ~40 (46% do código)
- **Arquivos com `@ts-check`:** 0 ❌
- **Modelos principais identificados:** `Activity`, `Course`, `Week`
- **Arquivo de tipos globais:** `types/globals.d.ts` ✅

### Análise de Cobertura

#### ✅ Bem Documentados (JSDoc completo)
- `features/courses/models/` - Modelos de domínio
- `features/courses/repositories/` - Repositórios
- `shared/services/BackupService.js`
- `shared/utils/DOMSafe.js`
- `shared/utils/StorageGuard.js`

#### ⚠️ Documentação Parcial
- Componentes de UI (`shared/ui/`, `features/*/views/`)
- Serviços de scraping (`ScraperService`, `BatchScraper`)
- Handlers e controllers

#### ❌ Sem Tipos Definidos
- Tipos de retorno de funções complexas
- Contratos de serviços (interfaces)
- Tipos compartilhados entre módulos
- Validação de schemas (dados externos)

### Gaps Identificados

1. **Falta de Tipos Centralizados**
   - Modelos redeclaram tipos múltiplas vezes
   - Não há "source of truth" para tipos complexos
   - Sem contratos explícitos para serviços

2. **Inconsistência**
   - Alguns arquivos usam JSDoc detalhado
   - Outros não têm documentação de tipos
   - Sem padrão de nomenclatura para tipos

3. **Validação em Runtime**
   - Falta validação de tipos em dados externos (scraping)
   - Sem assertions para dados do Chrome Storage
   - Erros de tipo só aparecem em produção

---

## 📋 Plano de Implementação

### **Fase 1: Fundação e Auditoria Profunda** 🎯

#### 1.1 Auditoria Detalhada
- [ ] Criar script para gerar relatório de tipos existentes
- [ ] Mapear todos os `@typedef` do projeto
- [ ] Identificar tipos duplicados e oportunidades de unificação
- [ ] Documentar contratos de serviços críticos

**Entregável:** `docs/TYPE_AUDIT_REPORT.md`

#### 1.2 Infraestrutura Base
- [ ] Criar estrutura de pastas em `types/`
  ```
  types/
  ├── globals.d.ts          # ✅ Já existe
  ├── models/               # Tipos de domínio
  │   ├── activity.d.ts
  │   ├── course.d.ts
  │   ├── week.d.ts
  │   └── session.d.ts
  ├── services/             # Contratos de serviços
  │   ├── storage.d.ts
  │   ├── navigation.d.ts
  │   └── scraper.d.ts
  ├── repositories/         # Tipos de repositórios
  │   └── base.d.ts
  └── chrome/               # Extensões Chrome API
      └── extensions.d.ts
  ```
- [ ] Atualizar `jsconfig.json` com referências
- [ ] Criar template de JSDoc padrão

#### 1.3 Tipos Core (Quick Wins)
- [ ] Criar `types/models/activity.d.ts`
  ```typescript
  export interface Activity {
    id: string;
    title: string;
    url: string;
    type: ActivityType;
    // ...
  }
  ```
- [ ] Criar `types/models/course.d.ts`
- [ ] Criar `types/models/week.d.ts`
- [ ] Adicionar `@ts-check` em modelos principais

**Critério de Aceitação:**
- Modelos core têm tipos `.d.ts` centralizados
- `npm run type-check` passa sem erros
- Relatório de auditoria documentado

---

### **Fase 2: Expansão e Padronização** 🚀

#### 2.1 Tipos de Serviços
- [ ] Definir interfaces para `ActivityRepository`
- [ ] Definir interfaces para `NavigationService`
- [ ] Definir interfaces para `ScraperService`
- [ ] Documentar contratos de comunicação Chrome API

#### 2.2 Migração Progressiva
- [ ] Migrar repositórios para usar tipos centralizados
- [ ] Padronizar JSDoc em toda a pasta `features/`
- [ ] Padronizar JSDoc em toda a pasta `shared/`

#### 2.3 Validação em Runtime
- [ ] Criar utilitário `TypeValidator.js` para runtime checks
- [ ] Adicionar validação em dados de scraping
- [ ] Adicionar assertions em dados do Storage

**Critério de Aceitação:**
- 80% dos arquivos com JSDoc completo
- Serviços críticos têm contratos `.d.ts`
- Validação em runtime para dados externos

---

### **Fase 3: Excelência e Manutenção** ✨

#### 3.1 Ferramentas de DX
- [ ] Script para gerar tipos automaticamente (se viável)
- [ ] Lint rule customizada: exigir JSDoc em exports
- [ ] Template de arquivo com JSDoc pré-configurado

#### 3.2 Migração Completa (Opcional)
- [ ] Avaliar conversão gradual `.js` → `.ts`
- [ ] Criar guia de migração para o time
- [ ] Converter módulos isolados como POC

#### 3.3 Documentação
- [ ] Guia: "Como escrever tipos no projeto"
- [ ] Exemplos de JSDoc para casos comuns
- [ ] Atualizar CONTRIBUTING.md

**Critério de Aceitação:**
- 100% dos exports públicos documentados
- Guia de tipagem disponível
- CI valida tipagem em PRs

---

## 🎓 Referências e Boas Práticas

### Padrões de JSDoc
```javascript
/**
 * @typedef {Object} Activity
 * @property {string} id - Identificador único
 * @property {string} title - Título da atividade
 * @property {ActivityType} type - Tipo da atividade
 */

/**
 * Busca atividades por ID
 * @param {string} activityId - ID da atividade
 * @returns {Promise<Activity|null>} Atividade ou null
 * @throws {Error} Se o ID for inválido
 */
async function findActivity(activityId) {
  // ...
}
```

### Referências
- [TypeScript JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- [Google TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- ADR-000: Architectural Decision Records (interno)

---

## 🔗 Issues Relacionadas

- ISSUE-030: Security Audit (usa Trusted Types em `globals.d.ts`)
- ISSUE-025: Test Coverage (tipos ajudam mocks)
- ISSUE-021: Release Documentation (documenta tipos)

---

## 📝 Notas de Implementação

### Decisões Técnicas
1. **Por que JSDoc + `.d.ts` em vez de TypeScript puro?**
   - Migração gradual sem breaking changes
   - Não requer refactor de build pipeline
   - Time já familiarizado com JavaScript

2. **Quando usar `.d.ts` vs JSDoc inline?**
   - `.d.ts`: Tipos compartilhados, modelos complexos, contratos públicos
   - JSDoc: Documentação local, tipos simples, casos específicos

3. **Priorização**
   - Fase 1 é crítica (fundação)
   - Fase 2 traz maior ROI (produtividade)
   - Fase 3 é opcional (nice-to-have)

### Riscos
- ⚠️ Overhead inicial em aprendizado de JSDoc avançado
- ⚠️ Manutenção de tipos pode ficar desatualizada
- ✅ Mitigação: CI checks, code review, templates

---

**Tags:** `#typescript` `#jsdoc` `#dx` `#quality` `#type-safety`  
**Sprint:** v2.10.x-Quality  
**Estimativa:** 3-5 dias (Fase 1), 5-7 dias (Fase 2), 3 dias (Fase 3)
