# 🔧 ISSUE-056: Dívida Técnica Unificada (Scraper + Tipos + Scripts)

---
**Type:** 🔧 Tech Debt  
**Priority:** 🟡 Medium  
**Status:** 📋 Open  
**Component:** Multiple (Scraper/Types/Scripts)  
**Effort:** 5-7 days  
**Labels:** `tech-debt` `scraper` `types` `scripts`
---


---

## 🎯 Objetivo (Unificado)
Consolidar a infraestrutura de extração de dados e garantir a integridade técnica através de tipagem forte, eliminando redundâncias e melhorando a performance.
*Absorve: ISSUE-001, ISSUE-003, ISSUE-005 e ISSUE-031.*

## 📝 Descrição e Requisitos

### 1. Otimização de Seletores (Arquitetura)
- [ ] Migrar de `document.querySelectorAll('a')` para seletores de menu estruturados (`li[id^="paletteItem"]`).
- [ ] Implementar sistema de fallback automático para garantir compatibilidade retroativa.
- [ ] **Ganho Esperado**: Redução de ~80% no processamento de elementos DOM durante a extração de semanas.

### 2. Ciclo de Vida e Estados (Chips)
- [ ] Garantir que o estado dos chips de navegação reflita dinamicamente a presença de conteúdos especiais (ex: Semanas de Revisão).
- [ ] Resolver inconsistências de renderização ao trocar de cursos rapidamente.

### 3. Hardening de Tipos (TypeScript/JSDoc)
- [ ] Refinar as definições JSDoc para os objetos retornados pelo Scraper (Domain Models).
- [ ] Eliminar o uso excessivo de `any` ou tipos implícitos em funções utilitárias compartilhadas.
- [ ] Garantir que o `npm run check` passe sem avisos de tipagem.

### 4. Refatoração de Scripts
- [ ] Limpeza de códigos legados no `background/index.js` e coordenação de mensagens entre Content Scripts.

---
**Tags:** `//ISSUE-tech-debt-unified` | **Sprint:** Backlog
