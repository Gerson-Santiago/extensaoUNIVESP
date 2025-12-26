# 📋 Gestão de Issues e Planejamento

Este diretório organiza **issues**, **bugs**, **features**, **refatorações** e **planejamento** do projeto.

---

## 📂 Estrutura

```
.github/
├── README.md              ← Este arquivo
├── EPICS/                 ← Épicos de planejamento estratégico
│   ├── EPIC-1-arquitetura-refatoracao.md
│   ├── EPIC-2-debito-tecnico-qualidade.md
│   ├── EPIC-3-features-gestao-tarefas.md
│   ├── EPIC-4-bugs-estabilidade.md
│   ├── EPIC-5-documentacao-conhecimento.md
│   └── README.md
├── ISSUES/                ← Bugs e problemas identificados
│   ├── BUG-navegacao-abas.md (🚧 Parcialmente Resolvido)
│   └── BUG-botao-abrir-materia.md
├── FEATURE/               ← Features implementadas
│   └── FEATURE-checkbox-conclusao.md ✅ [CONCLUÍDA]
├── NEXT/                  ← Próximas features planejadas
│   ├── NEXT-CSS-details-activities.md ✅ [CONCLUÍDA]
│   └── NEXT-doc-chrome-tabs-api.md
├── REFACTOR/              ← Refatorações planejadas
│   ├── REFACTOR-desacoplar-scraping-view.md
│   ├── REFACTOR-modernizacao-es2024.md
│   └── REFACTOR-persistencia-courseweektasksview.md
├── TECH_DEBT/             ← Débitos técnicos catalogados
│   ├── TECH_DEBT-breadcrumb-estado-global.md
│   ├── TECH_DEBT-cobertura-testes-courses.md
│   └── TECH_DEBT-unificar-estrutura-progresso.md
└── SPEC-v2.8.0.md         ← Especificação da versão atual (v2.8.7 LTS)
```

---

## 🐛 Issues Abertas (Bugs)

### 1. **BUG-navegacao-abas.md** 🚧
**Problema**: Navegação entre matérias diferentes reusa aba errada  
**Status**: Parcialmente Resolvido (Tabs.js refatorado, aguarda validação)  
**Impacto**: Médio (UX confusa)  
**Prioridade**: Média  

### 2. **BUG-botao-abrir-materia.md**
**Problema**: Botão "Abrir Matéria" falha quando há aba de semana aberta  
**Impacto**: Médio (bloqueia acesso)  
**Prioridade**: Média  

---

## ✅ Features Concluídas

- **FEATURE-checkbox-conclusao.md** ✅ - Sistema de progresso de atividades (v2.8.0, 2025-12-22)
- **NEXT-CSS-details-activities.md** ✅ - Padronização CSS (v2.8.0, 2025-12-23)

---

## 📝 Como Usar

### Criar Nova Issue:
1. Copiar template de issue existente
2. Criar arquivo em diretório apropriado (`ISSUES/`, `FEATURE/`, `REFACTOR/`, `TECH_DEBT/`)
3. Nomear: `BUG-descricao.md`, `FEATURE-nome.md`, `REFACTOR-nome.md`, `TECH_DEBT-nome.md`
4. Commitar

### Marcar como Concluída:
1. Atualizar header do arquivo com ✅ e data de conclusão
2. Atualizar status neste README
3. Mover informação para seção "Concluídas"

---

## 🎯 Convenções

**Nomenclatura**:
- `BUG-*.md` - Bugs identificados
- `FEATURE-*.md` - Novas funcionalidades planejadas ou implementadas
- `REFACTOR-*.md` - Refatorações planejadas
- `TECH_DEBT-*.md` - Débitos técnicos catalogados
- `NEXT-*.md` - Melhorias e próximas features

**Status**:
- 🐛 Bug Identificado
- 🚧 Em Progresso / Parcialmente Resolvido
- 📋 Planejado
- ✅ Concluído

---

**Última atualização**: 2025-12-26 (Auditoria de Documentação)  
**Versão do projeto**: v2.8.7 LTS

