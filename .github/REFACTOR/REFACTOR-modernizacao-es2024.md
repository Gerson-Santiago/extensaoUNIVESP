# Refatoração Modernizadora: Adoção do Padrão ES2024

> **Status**: 📝 Planejado
> **Prioridade**: Média (Débito Técnico Estratégico)
> **Relacionado**: [Diagnóstico ES2024](../../.cursorrules)

## 📌 Contexto

O ambiente de execução (Node.js v24.12.x) e o compilador (Target ES2024) suportam nativamente as features mais recentes do ECMAScript. No entanto, a codebase atual utiliza implementações manuais ("polyfills verbosos") para funcionalidades que agora são nativas.

## 🎯 Objetivos

1.  Reduzir linhas de código e complexidade ciclomática.
2.  Delegar para a engine (V8) a otimização de operações comuns.
3.  Aumentar a legibilidade com padrões semânticos modernos.

## 🔍 Oportunidades Identificadas

### 1. Agrupamento Nativo (`Object.groupBy`)
- **Alvo**: `features/courses/logic/CourseGrouper.js`.
- **Estado Atual**: Implementação manual usando `Map` + `.forEach()` para agrupar cursos por termo.
- **Refatoração**: Substituir pela API nativa `Object.groupBy(items, callback)`.
- **Ganho Estimado**: Redução de ~15 linhas de lógica imperativa para 2 linhas declarativas.

### 2. Promessas Modernas (`Promise.withResolvers`)
- **Alvo**: `shared/utils/Tabs.js` e utilitários assíncronos.
- **Estado Atual**: Wrapper tradicional `new Promise((resolve, reject) => { ... })`.
- **Refatoração**: Usar `const { promise, resolve, reject } = Promise.withResolvers();` para evitar aninhamento excessivo (executor hell).

### 3. Encapsulamento Real (Private Fields `#`)
- **Alvo**: Classes de Service e Repository (ex: `features/courses/services/ScraperService.js`).
- **Estado Atual**: Métodos "privados" por convenção (sem prefixo ou apenas documentados via JSDoc).
- **Refatoração**: Utilizar `#metodoPrivado()` para garantir encapsulamento a nível de runtime.

### 4. Arrays Modernos (`.at()`, `toSorted()`)
- **Alvo**: Manipulação de listas em Views e Services.
- **Estado Atual**: `items[items.length - 1]` ou `[...items].sort()`.
- **Refatoração**: `.at(-1)` e `toSorted()` para imutabilidade garantida.

## 🛡️ Plano de Segurança

A refatoração deve seguir o **Workflow de Refatoração** (`/refactor`):
1.  **Green State**: Garantir que todos os testes atuais passem.
2.  **Refactor**: Aplicar mudança arquivo por arquivo.
3.  **Verify**: Testes devem continuar passando sem alteração (Green-Green).

> **Nota**: Não é necessário adicionar polyfills, pois o target é estrito para Chrome moderno/Node 24.
