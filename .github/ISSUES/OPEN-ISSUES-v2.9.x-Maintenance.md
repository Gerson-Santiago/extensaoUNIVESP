# 📋 Plano de Estabilização v2.9.x (Maintenance)

Este documento centraliza a estratégia de Estabilização, Cobertura e Manutenção para a linha v2.9.x, visando entregar uma base sólida antes da v2.10.0.

**Meta:** Elevar a confiabilidade do sistema atacando as áreas críticas de dívida técnica e garantindo um processo de release profissional.

---

## 📂 Visão Geral das Issues

| ID | Issue | Componente | Cobertura Atual | Meta | Prioridade |
|----|-------|------------|-----------------|----|------------|
| **025** | [📋 Coverage: Import & Utils](./OPEN-ISSUE-025_coverage-batch-import-utils.md) | `Import/Utils` | < 60% | > 85% | 🔴 **Alta** |
| **001** | [📋 Selector Resilience](./OPEN-ISSUE-001_improve-scraper-selector.md) | `ScraperService` | ~ 48% | > 80% | ⏺️ **Média** |
| **003** | [📋 Chips Lifecycle](./OPEN-ISSUE-003_navigation-chips-lifecycle.md) | `UI/Navigation` | - | - | 🟢 **Baixa** |
| **027** | [📋 Coverage: UI Critical](./OPEN-ISSUE-027_ui-components-coverage.md) | `UI/Main` | ~ 52% | > 85% | ⏺️ **Média** |

---


### **[ADR-000-C: Padrão AAA](../../docs/architecture/ADR_000_C_AAA_TESTING_PATTERN.md)** (Global)
Todas as implementações de teste **DEVEM** seguir rigorosamente a estrutura Arrange-Act-Assert e usar nomenclatura em português ("Deve...").

### **[ADR-009: Hybrid Integration Strategy](../../docs/architecture/ADR_009_TEST_STRATEGY_REFRESHER.md)**
Define a "Inversão da Pirâmide" para testar o `CourseRefresher`. Em vez de mocks unitários frágeis, usaremos testes de integração com fixtures de estado, garantindo que o orquestrador funcione de ponta a ponta.

---

---

## 🗺️ Roadmap de Estabilização (v2.9.x)

### 🎯 v2.9.7: Núcleo e Resiliência
- **Foco:** Utils Fundamentais + Seletores Resilientes.
- **Entregáveis:** ISSUE-025 (parcial), ISSUE-001.
- **Meta:** Garantir que o motor de raspagem não quebre com mudanças menores no AVA.

### 🎯 v2.9.8: Alta Performance e Cobertura
- **Foco:** Otimização de Scrapers em Lote.
- **Entregáveis:** ISSUE-025 (conclusão), ISSUE-003.
- **Meta:** 85% de cobertura global e UI síncrona com estado do storage.

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
