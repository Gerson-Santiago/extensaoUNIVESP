# 📝 ISSUE-022: Preferências de UX e Comportamento Inteligente

**Status:** 📋 Aberta
**Prioridade:** Alta
**Componente:** `features/settings` | `shared/ui`
**Versão:** v2.10.0

---

## 🎯 Objetivo

Implementar os blocos de **Preferências** e **Comportamento** nas configurações, focando em duas dores reais: a poluição visual em listas grandes e o atrito de ter que re-navegar para a última semana ativa.

---

## 📖 Contexto

Seguindo a visão de produto maduro, estas não são regras de negócio, mas ajustes de como o aluno interage com a ferramenta. O **Auto-Pin** reduz a carga cognitiva, enquanto a **Densidade** adapta a extensão ao hardware e preferência visual do usuário.

---

## 🛠️ Requisitos Técnicos

### 1. Bloco: Preferências do Usuário
- **Densidade Visual**: Adicionar toggle em `SettingsView` que injeta uma classe CSS global (`is-compact`) no body do sidepanel.
  - Estilizar a classe `.is-compact` para reduzir margins e paddings nos itens de curso e semanas.

### 2. Bloco: Comportamento da Aplicação
- **Auto-Pin (Última Semana)**: 
  - Ao carregar um curso, verificar no `storage` qual foi o último `weekNumber` expandido.
  - Se ativado, acionar o evento de expansão automaticamente.

### 3. Type Safety (ADR-000-B, Issue-031)
- Definir `@typedef UserPreferences` com todas as chaves de configuração.
- Validar valores de storage antes de aplicar (ex: `density` deve ser `'compact' | 'comfortable'`).

---

## ✅ Critérios de Aceite

- [ ] Usuário pode alternar entre modo "Compacto" e "Confortável".
- [ ] Usuário pode ativar/desativar a lembrança da última semana visitada.
- [ ] Todas as novas chaves residem no `chrome.storage.local` sob o namespace `user_preferences`.

---

## 🧪 Verificação (AAA)

1. **Cenário: Persistência de Densidade**
   - **Arrange**: Configurar densidade como 'compacto'.
   - **Act**: Recarregar a extensão.
   - **Assert**: Verificar se a classe CSS `.is-compact` está presente no componente principal.

---
**Tags:** `//ISSUE-settings-ux` | **Tipo:** UX / Feature
**Relatada por:** IA do Projeto | **Data:** 31/12/2025
