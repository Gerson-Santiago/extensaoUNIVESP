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

## 📅 Horizonte Próximo: Q1 2026

### Tema: **Evolução de UX e Ciclo de Vida** (v2.10.0)

**Objetivo**: Resolver o "Bug do Chip" e consolidar o estado global de navegação.

**Marcos**:
- 🔄 **v2.10.0 (Chip Musculoso)**: Implementar navegação bidirecional e gestão de abas ativas como chips.
- 🔧 **Refatoração Tática**: Migrar Breadcrumb para estado global (Opção 2 do Tech Debt).

---

## 📅 Médio Prazo: Q2-Q3 2026

### Tema: **Gestão de Notas e Inteligência** (v3.0.0)

**Objetivo**: A entrega da "Grande Feature" de Notas.

### 📊 Grade Manager (v3.0.0)
**Status**: Planejado / Futuro Distante

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
- **Robustez**: Fix de Scroll (ADR-007) e Centralização de Logs (#LOG_*).
- **Segurança**: Fix de Regex ReDoS e Zero Warnings de Lint.

> 📦 Para histórico detalhado das versões v2.0.0 a v2.9.0, consulte o [CHANGELOG.md](../CHANGELOG.md).

---

## 🔗 Documentos Relacionados

- **Backlog Tático**: [`.github/README.md`](../.github/README.md)
- **Decisões Arquiteturais**: [`.github/ADR/`](../.github/ADR/)
- **Fluxos de Trabalho**: [`FLUXOS_DE_TRABALHO.md`](./FLUXOS_DE_TRABALHO.md)

---

**Última Atualização**: 2025-12-29 (Consolidação v2.9.1)
