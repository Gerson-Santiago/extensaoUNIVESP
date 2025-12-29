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
- ✅ **Estabilização e Robustez** (v2.9.1) - Logging estruturado e Navegação resiliente (ADR-007)
- 🔄 **Resolução de Dívidas Técnicas** - Cobertura de testes (alcançar 85%+)

**Entregáveis Esperados** (v2.9.1):
- Cobertura de testes: 80% (atual) -> Alvo 85% (Q1 2026)
- Zero bugs de navegação (Scroll Navigation robusta)
- Sistema de Log centralizado (Logger.js) com tags semânticas

---

## 📅 Médio Prazo: Q2-Q3 2026

### Tema: **Expansão de UX e Engajamento**

**Objetivo**: Aumentar valor percebido e retenção de usuários

### 📊 Grade Manager (Gestão de Notas)
**Status**: Análise Técnica (Q1 2026)

**Proposta de Valor**:
- Monitoramento de desempenho acadêmico
- Scraping de boletim do AVA
- Projeção de médias necessárias
- Alertas de risco de reprovação

**Perguntas a Responder**:
- Viabilidade técnica: Scraping de notas possível no AVA atual?
- UX: Quanto valor isso agrega vs esforço?
- Privacidade: Como garantir que dados sensíveis (notas) permanecem locais?

**Decisão Go/No-Go**: Fim de Q1 2026 (após validação técnica)

**Dependências**:
- Estabilização (v2.9.1) deve estar completa
- POC de scraping de boletim validado

---

## 📅 Longo Prazo: 2027+

### Tema: **Ecossistema Acadêmico Completo**

**Visão Aspiracional** (Candidatos, não compromissos):

1. **Integração com Comunidade**:
   - Fórum de dúvidas integrado
   - Compartilhamento de anotações (opt-in)
   - Grupos de estudo

2. **Análise Preditiva**:
   - Sugestão de próximos passos baseada em padrões
   - Identificação de tópicos com maior dificuldade

3. **Multiplataforma**:
   - Mobile app (se demanda validar)
   - Sync cross-device (requer decisão sobre Local-First)

> **Nota**: Itens de 2027+ são **exploratórios**. Priorização depende de validação com usuários reais e análise de viabilidade técnica (ADR-driven).

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

### v2.9.1 (Atual - 2025-12-29)
- **Refatoração de Logging**: Centralização com `Logger.js` e tagging semântico (#LOG_UI, #LOG_SYSTEM).
- **Navigation Fix**: Navegação de scroll robusta com `MutationObserver` e fallbacks (ADR-007).
- **Security**: Fix de Regex insegura em `TaskCategorizer.js`.
- **Qualidade**: 455 testes passando e zero warnings no lint.

### v2.9.0 (2025-12-29)
- Release com SafeResult Pattern e Correção de DOM Zumbi (Container Freshness).
- ADRs 005 e 006.

### v2.8.14 (2025-12-28)
- Modernização de Testes (Promises + ChunkedStorage)
- Correção total de Lint e TypeScript (Zero Errors)
- Novos scripts de teste (summary/failed)

### v2.8.9 (2025-12-27)
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

**Última Atualização**: 2025-12-29 (Consolidação v2.9.1)
