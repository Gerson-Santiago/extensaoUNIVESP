# 🗺️ Roadmap de Features Futuras

Este documento registra features que foram **intencionalmente adiadas** para versões futuras, aguardando validação e feedback da comunidade.

---

## v2.9.0+ (Futuro) - Performance & Gamificação
> **Status**: 🔮 Planejado (aguardando demanda da comunidade)

### Feature: Gamificação (XP System)
**Objetivo**: Aumentar engajamento através de recompensas visuais por completar tarefas.

**Funcionalidades Planejadas**:
- Sistema de pontos (XP) por conclusão de tarefas
  - ⚪ → 🔵 (Iniciou): **+10 XP**
  - 🔵 → 🟢 (Concluiu): **+50 XP**  
  - ⚪ → 🟢 (Direto): **+60 XP** (bônus)
  - 🟢 → ⚪ (Reverteu): **-50 XP** (penalidade)
- Barra de progresso visual (`XPBar` component)
- Notificações de conquistas via Toaster
- Persistência de XP total no `chrome.storage`

**Arquitetura Preliminar**:
```
features/performance/
├── logic/
│   └── XPEngine.js       # Calcula XP baseado em eventos
├── data/
│   └── PerformanceStorage.js
└── ui/
    └── XPBar.js          # Componente visual
```

**Event Bus**: Usa `chrome.storage.onChanged` para detectar mudanças em `tasks` sem acoplamento direto.

---

### Feature: Grade Manager (Gestão de Notas)
**Objetivo**: Fornecer visibilidade e projeções sobre desempenho acadêmico.

**Funcionalidades Planejadas**:
- **Scraping Automático**: Extração de notas da página do AVA
- **Cálculo de Médias**: Projeção de média final por matéria
- **Alertas de Risco**: Notificação se nota estiver abaixo da média mínima
- **Badges de Status**: Injeção de indicadores visuais nos cards de curso
  - 🟢 Aprovado
  - 🟡 Em Risco
  - 🔴 Crítico

**Arquitetura Preliminar**:
```
features/performance/
├── services/
│   └── GradeScraper.js   # Extrai notas do DOM
├── logic/
│   └── GradeCalculator.js # Projeção de médias
└── ui/
    └── GradeBadge.js     # Componente de badge
```

**Integração**: Injeção não-invasiva em `CourseItem` via `CoursesView`.

---

## Critérios para Implementação

Uma feature deste roadmap só será implementada quando **todos** os critérios forem atendidos:

- [ ] **Demanda Explícita**: Issue ou Discussion com +5 reações da comunidade
- [ ] **Validação do Core**: Feature `tasks` (v2.8.0) funcionando sem bugs críticos
- [ ] **Impacto Medido**: Análise de que a feature não degrada performance
- [ ] **Recursos Disponíveis**: Capacidade técnica para manter a feature

---

## Como Solicitar uma Feature

1. **Abra uma** [**Discussion**](https://github.com/Gerson-Santiago/extensaoUNIVESP/discussions) ou [**Issue**](https://github.com/Gerson-Santiago/extensaoUNIVESP/issues)
2. **Descreva o caso de uso**: Por que a feature seria útil?
3. **Engaje a comunidade**: Reações 👍 e comentários ajudam a priorizar
4. **Aguarde análise**: Mantenedores avaliarão viabilidade técnica

---

## Histórico de Decisões

### v2.8.0 - Remoção da Gamificação (2025-12-21)
**Decisão**: Adiar features de gamificação e notas para focar no core (gestão de tarefas).

**Justificativa**:
- Seguir princípio de **MVP** (Minimum Viable Product)
- Reduzir complexidade inicial
- Validar core antes de adicionar extras
- Aguardar feedback real de uso

**Referência**: [SPEC-v2.8.0_GESTAO_ACADEMICA.md](specs/SPEC-v2.8.0_GESTAO_ACADEMICA.md)

---

> [!TIP]
> Este roadmap é um documento vivo. Features podem ser adicionadas, modificadas ou removidas baseado em evolução do projeto e necessidades da comunidade.
