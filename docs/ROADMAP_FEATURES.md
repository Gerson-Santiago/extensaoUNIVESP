# Roadmap Estratégico

Este documento descreve a **visão de longo prazo** e os **marcos estratégicos** do projeto.

> **Nota**: Este é um roadmap estratégico (trimestral). Para tarefas táticas e backlog de sprint, consulte [`.github/README.md`](../.github/README.md).

---

## 🎯 Visão de Produto

**Missão**: Transformar a extensão UNIVESP em um **ecossistema completo de gestão acadêmica**, permitindo ao aluno organizar, monitorar e otimizar sua jornada universitária.

**Princípios**:
- **Local-First**: Dados do aluno permanecem privados
- **Zero Fricção**: Funciona sem configuração adicional
- **Screaming Architecture**: Código comunica intenção

---

## 📅 Horizonte Atual: Q4 2025 - Q1 2026

### Tema: **Estabilização e Consolidação Arquitetural**

**Objetivo**: Alcançar base sólida para expansão futura

**Marcos**:
- ✅ **Screaming Architecture** (v2.7.0) - Modularização em Features
- ✅ **Gestão de Tarefas** (v2.8.0) - Sistema de checklist e progresso
- 🔄 **Resolução de Dívidas Técnicas** - Console cleanup, cobertura de testes
- 🔄 **Estabilidade de Navegação** - Resolução de bugs críticos de UX

**Entregáveis Esperados** (v2.9.0):
- Cobertura de testes: 85%+
- Zero bugs críticos de navegação
- Documentação técnica completa (ADRs, READMEs)

---

## 📅 Médio Prazo: Q2-Q3 2026

### Tema: **Expansão de UX e Engajamento**

**Objetivo**: Aumentar valor percebido e retenção de usuários

### 🎮 Sistema de Gamificação
**Status**: Análise Técnica (Q1 2026)

**Proposta de Valor**:
- Recompensas visuais por progresso acadêmico
- Sistema de XP por tarefa concluída
- Persistência de conquistas

**Perguntas a Responder**:
- Viabilidade técnica: Como persistir achievements local-first?
- UX: Gamificação motiva ou distrai?
- Escopo: MVP vs Full Feature

**Decisão Go/No-Go**: Fim de Q1 2026

---

### 📊 Grade Manager (Gestão de Notas)
**Status**: Planejado (Q2-Q3 2026)

**Proposta de Valor**:
- Monitoramento de desempenho acadêmico
- Scraping de boletim do AVA
- Projeção de médias necessárias
- Alertas de risco de reprovação

**Dependências**:
- Gamificação (se aprovada) deve estar estável
- Scraping do boletim validado tecnicamente

**Decisão de Priorização**: Q1 2026

---

## 📅 Longo Prazo: 2027+

### Tema: **Ecossistema Acadêmico Completo**

**Visão Aspiracional**:

1. **Integração com Comunidade**:
   - Fórum de dúvidas integrado
   - Compartilhamento de anotações (opt-in)
   - Grupos de estudo

2. **Análise Preditiva**:
   - IA para sugerir próximos passos
   - Identificação de padrões de estudo eficazes

3. **Multiplataforma**:
   - Mobile app (se demanda validar)
   - Sync cross-device (se migrar de Local-First)

> **Nota**: Itens de 2027+ são **candidatos**, não compromissos. Priorização depende de feedback de usuários e viabilidade técnica.

---

## 🔄 Processo de Priorização

Uma feature entra no roadmap trimestral quando satisfaz **todos** os critérios:

1. **Valor Claro**: Resolve problema real validado por usuários
2. **Viabilidade Técnica**: Compatível com arquitetura Local-First
3. **Manutenibilidade**: Não introduz complexidade excessiva
4. **ROI Positivo**: Benefício > Custo de desenvolvimento + suporte

**Fluxo de Decisão**:
```
Ideia → Análise Técnica (1 sprint) → ADR → Go/No-Go → Roadmap
```

---

## 📜 Release Log (Histórico)

### v2.8.8 (Atual - 2025-12-27)
- Auditoria de alinhamento documental
- ADRs criados (Console Cleanup, EPICs, BatchScraper)
- Limpeza de tech debts

### v2.8.0 (2025-12-22)
- Sistema de checklist por semana
- Persistência granular de status de tarefa
- Cálculo visual de progresso
- ActivityProgress model unificado

### v2.7.0 (2025-12-XX)
- Screaming Architecture implementada
- Refatoração completa de estrutura
- Modularização em Features

### Versões Anteriores
Ver [CHANGELOG.md](../CHANGELOG.md) para histórico completo

---

## 🔗 Documentos Relacionados

- **Backlog Tático**: [`.github/README.md`](../.github/README.md)
- **Decisões Arquiteturais**: [`.github/ADR/`](../.github/ADR/)
- **Fluxos de Trabalho**: [`FLUXOS_DE_TRABALHO.md`](./FLUXOS_DE_TRABALHO.md)

---

**Última Atualização**: 2025-12-27 (Auditoria de Alinhamento Documental)
