# 🐛 ISSUE-003: Navigation Chips - Ciclo de Vida e Histórico

**Status:** 📋 Aberta  
**Prioridade:** 🟡 Média  
**Componente:** `ContextualChips`, `NavigationService`  
**Versão:** v2.10.0

---

## 🎯 Objetivo
Corrigir bugs de persistência e sincronização dos chips de navegação contextual, garantindo que o histórico de cursos visitados seja mantido corretamente e limpo ao trocar de abas.

## 📖 Contexto
Os chips mostram as últimas semanas visitadas pelo usuário. Atualmente há problemas:
1. Chips desaparecem após reload da página
2. Estado não sincroniza entre abas diferentes
3. Identificação de curso/semana flutua (não usa `courseId` consistente)

### 🛡️ MV3 Compliance (Relatório - Seção 4.3)
- **Context Separation:** O painel lateral deve gerenciar estado por aba usando `chrome.tabs.onActivated`.
- **Risk:** Mostrar chips da "Semana 1" quando usuário está em outra aba = vaz amento de contexto.
- **Relacionado:** Issue-038 (sidePanel UX Compliance)

---

## 🔧 Plano de Ação

### 1. Persistência via Storage (Issue-028)
- Usar `chrome.storage.local` com versionamento otimista
- Salvar array de `{courseId, weekId, timestamp}` a cada navegação

### 2. Sincronização entre Abas
- Listener `chrome.tabs.onActivated` para detectar troca de aba
- Limpar ou atualizar chips se aba atual não é AVA UNIVESP

### 3. Identificação Consistente
- Garantir que `courseId` é extraído do URL (não do título da página)
- Usar regex consistente com `WEEK_IDENTIFIER_REGEX`

---

## ✅ Critérios de Aceite (v2.10.0)

- [ ] **Persistência:** Chips sobrevivem a `chrome.runtime.reload()`.
- [ ] **Context Management:** Ao trocar de aba (AVA → Gmail), chips desaparecem ou mostram "Nenhum curso ativo".
- [ ] **Identificação:** Mesmo curso sempre gera mesmo `courseId` (não flutua).
- [ ] **Storage Compliance:** Usa versionamento (Issue-028 pattern).
- [ ] **Testes:** Cenário de "trocar aba + reabrir sidePanel" funciona corretamente.

---

**Tags:** `//ISSUE-chips-lifecycle` | **Sprint:** v2.10.0  
**Relacionado:** Issue-028 (Storage), Issue-038 (sidePanel MV3)
