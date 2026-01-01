# 🚫 Anti-Padrões: O Que NUNCA Fazer

Este documento registra **padrões proibidos** identificados durante o desenvolvimento do projeto. Eles causam erros recorrentes de lint, type-check ou quebram em runtime.

> **Filosofia**: Se o padrão já causou erro uma vez, **ele não pode ser escrito novamente**.

---

## 1️⃣ Manipulação de `window.location`

### ❌ NUNCA faça

```javascript
// PROIBIDO: Reassign direto de window.location
window.location = new URL('https://example.com');
delete window.location;
window.location = { href: '...' }; // Quebra TypeScript
```

### ✅ SEMPRE faça

```javascript
// Produção: Navegação simples
window.location.href = 'https://example.com';

// Testes: Mock correto com Object.defineProperty
Object.defineProperty(window, 'location', {
  value: { href: 'https://example.com', origin: 'https://example.com' },
  writable: true,
  configurable: true
});

// OU adicione @ts-ignore com justificativa
// @ts-ignore - Mock para teste
delete window.location;
// @ts-ignore - Mock para teste
window.location = { href: 'https://test.com' };
```

**Motivo**: `window.location` tem tipo `Location` no DOM. Reassign direto quebra o contrato de tipos.

---

## 2️⃣ Mocks de APIs Globais (Response, Request, etc.)

### ❌ NUNCA faça

```javascript
// PROIBIDO: Mock incompleto
global.Response = class {
  constructor(body) { this.body = body; }
};
```

### ✅ SEMPRE faça

```javascript
// Mock completo respeitando interface DOM
// @ts-ignore - Mock simplificado para teste
global.Response = class {
  constructor(body) { this.body = body; }
  async arrayBuffer() { return new ArrayBuffer(0); }
  static error() { return new Response(); }
  static json(data) { return new Response(JSON.stringify(data)); }
  static redirect(url, status = 302) { return new Response(); }
};
```

**Motivo**: TypeScript valida que mocks globais implementem a interface completa. Mocks parciais geram erros de tipo.

---

## 3️⃣ Spies em Métodos de Elementos DOM

### ❌ NUNCA faça

```javascript
// PROIBIDO: Spy direto em instância
const element = document.querySelector('button');
const clickSpy = jest.spyOn(element, 'click');
```

### ✅ SEMPRE faça

```javascript
// Opção 1: Mock direto do método
const element = document.querySelector('button');
const clickMock = jest.fn();
// @ts-ignore - Mock para teste
element.click = clickMock;

// Opção 2: Spy no prototype (se aplicável)
const clickSpy = jest.spyOn(HTMLElement.prototype, 'click');
```

**Motivo**: Métodos como `click()` são herdados do prototype. Espionar diretamente na instância falha em JSDOM.

---

## 4️⃣ Variáveis Importadas Não Utilizadas

### ❌ NUNCA faça

```javascript
// PROIBIDO: Import sem uso
import { parseCourseTerm, getCourseDisplayId, extractWeeks } from './utils.js';

// Só usa parseCourseTerm...
const result = parseCourseTerm(data);
```

### ✅ SEMPRE faça

```javascript
// Importe APENAS o que usa
import { parseCourseTerm } from './utils.js';

const result = parseCourseTerm(data);
```

**Motivo**: `no-unused-vars` é configurado com `max-warnings=0`. Imports não usados quebram o CI.

**Regra mental**: Se o editor sublinhar de amarelo → **remova na hora**.

---

## 5️⃣ Strings com Aspas Inconsistentes

### ❌ NUNCA faça

```javascript
// PROIBIDO: Mixing quotes
const name = "AdminCourse";
const url = 'https://example.com';
```

### ✅ SEMPRE faça

```javascript
// Sempre single quotes
const name = 'AdminCourse';
const url = 'https://example.com';

// Exceção: Template literals para interpolação
const message = `Olá, ${name}!`;
```

**Motivo**: ESLint configurado com `quotes: ['error', 'single']`. O auto-fix resolve, mas idealmente você **nunca digita aspas duplas**.

**Dica**: Configure o editor para substituir `"` por `'` automaticamente.

---

## 6️⃣ RegExp com Source Dinâmica Sem Justificativa

### ❌ NUNCA faça

```javascript
// PROIBIDO sem justificativa
const regex = new RegExp(userInput, 'i');
```

### ✅ SEMPRE faça

```javascript
// Adicione eslint-disable com justificativa técnica
// eslint-disable-next-line security/detect-non-literal-regexp -- weekRegexSource vem do parâmetro WEEK_IDENTIFIER_REGEX.source centralizado
const weekRegex = new RegExp(weekRegexSource, 'i');
```

**Motivo**: `security/detect-non-literal-regexp` previne ReDoS. Toda exceção **exige** justificativa explícita de onde vem a source.

---

## 7️⃣ Testes JSDOM sem Polyfills Necessários

### ❌ NUNCA faça

```javascript
// PROIBIDO: Assumir que APIs globais existem
const encoded = new TextEncoder().encode('data');
```

### ✅ SEMPRE faça

```javascript
// Adicione polyfill no topo do arquivo de teste
if (typeof global.TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
}

// Agora pode usar
const encoded = new TextEncoder().encode('data');
```

**Motivo**: JSDOM não implementa todas as APIs Web. `TextEncoder`, `CompressionStream`, etc. precisam de polyfill explícito.

---

## 🧠 Regras Mentais (Memorize)

1. **window.location**: nunca reassign, sempre `.href` ou `Object.defineProperty`
2. **Mocks globais**: sempre interface completa + `@ts-ignore`
3. **Spies DOM**: nunca em instância, sempre prototype ou mock direto
4. **Imports**: se não usa, **não importe**
5. **Quotes**: sempre single (`'`), nunca double (`"`)
6. **RegExp dinâmico**: sempre com `eslint-disable` + justificativa
7. **JSDOM**: sempre polyfill de APIs Web ausentes

---

## 🛡️ Prevenção Automática

### Editor (VS Code)

Arquivo `.vscode/settings.json` já configurado com:
- Auto-fix de ESLint ao salvar
- Validação de tipos em tempo real
- Formatação automática

### Scripts

```bash
# Antes de commitar, SEMPRE rode:
npm run check

# Valida lint + types de uma vez
```

### Hook de Pre-commit (Opcional)

```bash
npx husky add .husky/pre-commit "npm run check"
```

---

## 📚 Referências

- [ESLint Rules](../.eslintrc.js)
- [TypeScript Config](../jsconfig.json)
- [Testing Best Practices](./PADROES.md#testes)

---

**Última Atualização**: 2026-01-01  
**Mantido por**: IA do Projeto
