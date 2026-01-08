# 📦 ISSUE-055: Análise de Bundle Size e Tree-Shaking

---
**Type:** 🛠️ Maintenance  
**Priority:** 🟢 Low  
**Status:** 📋 Open  
**Component:** Build/Performance  
**Effort:** 2-3 days  
**Labels:** `maintenance` `build` `performance` `bundle`
---


**Status:** 📋 Aberta  
**Prioridade:** 🟢 Baixa  
**Componente:** Build System | Todos os módulos  
**Versão:** v2.11.0+  
**Impacto:** Load inicial da extensão

---

## 🎯 Problema

Não há análise de tamanho dos bundles JavaScript, podendo haver imports desnecessários ou código morto.

### Situação Atual

- ✅ Extensão usa ESM (Tree-shaking possível)
- ❌ Sem ferramentas de visualização de bundle
- ❌ Sem métricas de tamanho por módulo
- ❌ Não sabemos se tree-shaking está funcionando

### Exemplo de Problema Potencial

```javascript
// Se algum arquivo importa biblioteca inteira:
import _ from 'lodash'; // ❌ 70kb
// Em vez de:
import debounce from 'lodash/debounce'; // ✅ 2kb
```

---

## 💡 Solução Proposta

### Fase 1: Adicionar Ferramentas de Análise

```bash
npm install --save-dev rollup-plugin-visualizer
```

```javascript
// rollup.config.js (ou webpack.config.js)
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  // ...
  plugins: [
    visualizer({
      filename: 'dist/bundle-stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ]
};
```

### Fase 2: Executar Análise

```bash
npm run build
# Abre bundle-stats.html automaticamente
```

### Fase 3: Otimizar Baseado nos Dados

**Ações baseadas em achados:**
- Remover imports não utilizados
- Substituir bibliotecas grandes por alternativas leves
- Implementar code splitting se relevante
- Verificar que tree-shaking está funcionando

---

## ✅ Critérios de Aceite

- [ ] Ferramentas de análise integradas ao build
- [ ] Script `npm run analyze` gera relatório visual
- [ ] Documentação dos tamanhos atuais (baseline)
- [ ] Identificados 3+ oportunidades de otimização
- [ ] Implementadas otimizações de baixo esforço
- [ ] Bundle size reduzido em ≥10% (se possível)

---

## 🧪 Plano de Análise

### Métricas a Coletar

```bash
# 1. Tamanho atual da extensão
du -sh dist/

# 2. Tamanho de cada arquivo principal
ls -lh dist/*.js

# 3. Gzip/Brotli sizes
gzip -c dist/sidepanel.js | wc -c
```

### Análise Visual

```html
<!-- bundle-stats.html mostrará:
- Tamanho de cada módulo
- Dependências duplicadas
- Código morto (não alcançável)
- Imports problemáticos
-->
```

---

## 📊 Baseline Atual (Estimado)

| Arquivo | Tamanho | Gzipped |
|---------|---------|---------|
| sidepanel.js | ~8kb | ? |
| background.js | ~2.2kb | ? |
| Total dist/ | ~1.18 MB (zip) | ? |

**Meta:** Reduzir tamanho gzipped total em 10-20%

---

## 🎯 Otimizações Identificáveis

### Baixa Complexidade
- [ ] Remover imports não utilizados (ESLint já detecta)
- [ ] Verificar se DOMSafe está sendo tree-shaken corretamente
- [ ] Confirmar que utilities estão em módulos separados

### Média Complexidade
- [ ] Code splitting: separar views em chunks lazy-loaded
- [ ] Substituir bibliotecas grandes por alternativas

### Alta Complexidade
- [ ] Dynamic imports para modais raramente usados
- [ ] Minificação agressiva (terser com opções avançadas)

---

## 🔗 Relacionado

- **Análise:** [implementation_plan.md](file:///home/sant/.gemini/antigravity/brain/fc2368ed-2c8e-4483-aee9-e3e77262bcd1/implementation_plan.md)
- **Package:** [package.json](file:///home/sant/extensaoUNIVESP/package.json)

---

## 🔗 GitHub Issue

- **Status:** N/A
- **Link:** Aguardando publicação
- **Data:** -

---
**Tags:** `//ISSUE-performance-bundle` | **Tipo:** Performance | Build Optimization  
**Criado:** 2026-01-08 | **Autor:** Auditoria de Performance
