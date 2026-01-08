# 📝 ISSUE-024: Controle de Automação e Contexto (Sob Demanda)

**Status:** 🗄️ BACKLOG (Adiada)  
**Prioridade:** Baixa  
**Componente:** `features/courses/logic` | `features/settings`  
**Versão:** v2.11.0+ (se necessário)

---

> [!NOTE]
> **Motivo do Adiamento:** Issue questionada internamente ("não acho que precisa ser feito isso").
> Funcionalidade atual (scrapers sob demanda via botões) já atende necessidade.
> Movida para BACKLOG: pode ser útil futuramente, mas não é prioritária.


## 🎯 Objetivo

Dar ao usuário o controle de *quando* a extensão deve atuar. Atualmente os scrapers e o `CourseRefresher` rodam ao carregar a página. O objetivo é permitir que o usuário escolha rodar apenas quando ele clicar nos botões de atualização.

---

## 🛠️ Requisitos

1.  **Modo de Execução**: Toggle "Atualizar automaticamente ao entrar no AVA" (on/off).
2.  **Lógica de Bloqueio**:
    - Se "off", o `CourseRefresher` e os `InitialScrapers` devem abortar a execução automática.
    - O feedback visual (seletor de semanas) ainda deve aparecer, mas os dados só serão atualizados se o botão `Refresh` for clicado manualmente.

### 🛡️ Segurança (ADR-000-B, Issue-031)
- **Type Safety:** Validar que a flag de automação é `boolean` antes de usar (evitar truthy coercion acidental).

---

## ✅ Critérios de Aceite

- [ ] A configuração desativa a rotina de atualização automática no carregamento das páginas do AVA.
- [ ] O usuário consegue forçar a atualização via botão manual mesmo com a automação global desativada.

---

## 🔗 GitHub Issue

- **Status:** N/A
- **Link:** Aguardando publicação
- **Data:** -

---
**Tags:** `//ISSUE-settings-automation` | **Tipo:** Feature / Behavior
