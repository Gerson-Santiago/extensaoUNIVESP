# 📋 Plano de Estabilização v2.9.x (Maintenance)

Este documento centraliza a estratégia de Estabilização, Cobertura e Manutenção para a linha v2.9.x, visando entregar uma base sólida antes da v2.10.0.

**Meta:** Elevar a confiabilidade do sistema atacando as áreas críticas de dívida técnica e garantindo um processo de release profissional.

---

## 📂 Visão Geral das Issues

| ID | Issue | Componente | Cobertura Atual | Meta | Prioridade |
|----|-------|------------|-----------------|------|------------|
| **025** | [📋 Coverage: Import & Utils](./OPEN-ISSUE-025_coverage-batch-import-utils.md) | `Import/Utils` | < 60% | > 85% | 🔴 **Alta** |

---


### **[ADR-000-C: Padrão AAA](../../docs/architecture/ADR_000_C_AAA_TESTING_PATTERN.md)** (Global)
Todas as implementações de teste **DEVEM** seguir rigorosamente a estrutura Arrange-Act-Assert e usar nomenclatura em português ("Deve...").

### **[ADR-009: Hybrid Integration Strategy](../../docs/architecture/ADR_009_TEST_STRATEGY_REFRESHER.md)**
Define a "Inversão da Pirâmide" para testar o `CourseRefresher`. Em vez de mocks unitários frágeis, usaremos testes de integração com fixtures de estado, garantindo que o orquestrador funcione de ponta a ponta.

---

## 🛠️ Detalhes Táticos

### 1. UX & Confiabilidade (Issues 018 & 015)
Foco em garantir que as interações do usuário (botões de refresh, scroll automático) funcionem. Atualmente, os handlers têm 0% de testes funcionais.
*   *Ação:* Implementar testes unitários com JSDOM para validar estados de loading e feedback visual.

### 2. Core Business Logic (Issues 013 & 014)
Foco no coração da extensão: encontrar e atualizar cursos.
*   *Ação:* Testar parsers contra HTMLs reais (fixtures) e validar o fluxo de atualização do `CourseRefresher`.

### 3. Engenharia de Release (Issue 017)
Foco na profissionalização da entrega.
*   *Ação:* Sincronizar manifestos, gerar Changelog semântico e limpar a documentação.

---
**Gerado em:** 01/01/2026 | **Status:** 🚦 Ciclo v2.9.7 / v2.9.8 em andamento
