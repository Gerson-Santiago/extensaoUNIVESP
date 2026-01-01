# 📋 Plano de Qualidade v2.9.6 (Master Index)

Este documento centraliza a estratégia de Release, Qualidade e Testes para a versão v2.9.6.

**Meta:** Elevar a confiabilidade do sistema atacando as áreas críticas de dívida técnica e garantindo um processo de release profissional.

---

## 📂 Visão Geral das Issues

| ID | Issue | Componente | Cobertura Atual | Meta | Prioridade |
|----|-------|------------|-----------------|------|------------|
| **019** | [📋 Settings & Backup System](./ISSUE-019_settings-backup-system.md) | `Settings` | - | 100% | 🔼 **Alta** |
| **018** | [✅ 🧪 Handlers UI](./ISSUE-018_handlers-coverage.md.resolved) | `Clear/RefreshHandler` | 100% | 100% | ✅ **Done** |
| **013** | [✅ 🧪 Integração CourseRefresher](./ISSUE-013_course-refresher-tests.md.resolved) | `CourseRefresher` | 100% | > 70% | ✅ **Done** |
| **017** | [✅ 📝 Release Eng & Docs](./ISSUE-017_release-documentation.md.resolved) | `Release v2.9.6` | 100% | 100% | ✅ **Done** |
| **014** | [✅ 🧪 Parsers WeekContent](./ISSUE-014_week-scraper-coverage.md.resolved) | `WeekContentScraper` | 91.26% | > 80% | ✅ **Done** |
| **015** | [✅ 🧪 Mock NavigationService](./ISSUE-015_navigation-service-mock.md.resolved) | `NavigationService` | 61.66% | > 60% | ✅ **Done** |
| **016** | [✅ 🧪 Testes VideoStrategy](./ISSUE-016_video-strategy-tests.md.resolved) | `VideoStrategy` | 100% | > 90% | ✅ **Done** |

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
**Gerado em:** 31/12/2025 | **Status:** 🚦 Pronto apra Execução
