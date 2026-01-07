# Roadmap de Produto & Estratégia (Source of Truth)

Este documento consolida a visão de longo prazo, princípios estratégicos e o plano tático de releases da Central Univesp.

> [!IMPORTANT]
> **Source of Truth (SoT):** Este roadmap reflete a intenção estratégica e o planejamento. A autoridade final sobre o que está implementado reside no **código-fonte** e nos **testes**.

---

## 🎯 1. Visão de Produto

**Missão**: Transformar a extensão UNIVESP em um **ecossistema completo de gestão acadêmica**, permitindo ao aluno organizar, monitorar e otimizar sua jornada universitária.

**Princípios**:
- **Local-First**: Dados do aluno permanecem privados e locais.
- **Zero Fricção**: Funciona sem configuração complexa.
- **Screaming Architecture**: O código comunica a intenção do negócio.

---

## 📅 2. Horizonte Tático: Release v2.11.0 (Refinement)

**Status:** 🚧 Planejamento (Fev/2026)

### [ ] M1: Ferramentas de Diagnóstico (Issue-023)
- **Painel Sobre:** Informações detalhadas de versão e ambiente.
- **Diagnóstico:** Auto-teste de conexões e permissões.

### [ ] M2: Controle de Automação (Issue-024)
- **Granularidade:** Ativar/Desativar scrapers por tipo (Notas, Fórum, Vídeos).
- **Agendamento:** Definição de intervalos de atualização.

---

## ✅ 3. Releases Concluídas

### v2.10.0 (Sovereignty & UX) - Jan/2026
- **[x] M1: Codebase Seguro & Compliance**: Eliminação de XSS, DOMSafe, conformidade CWS.
- **[x] M2: Experiência do Usuário (UX)**: Settings 2.0, Backup/Restore, Factory Reset, Contextual Chips.
- **[x] M3: Engenharia de Distribuição**: Assets profissionais, changelog automatizado, pipeline de build.

---

## 🏔️ 4. Futuro Próximo (v2.12.0+)

### EPIC-006: Segurança de Elite
- **Criptografia**: Backup com AES-GCM.
- **Assinatura Digital**: Verificação de integridade de dados importados.

---

## 🔭 4. Longo Prazo (2027+)

### Visão Aspiracional
1.  **Integração Comunitária**: Fórum, grupos de estudo e compartilhamento (opt-in).
2.  **Análise Preditiva**: Sugestões baseadas em desempenho e padrões de estudo.
3.  **Multiplataforma**: Possível expansão para Mobile ou PWA.

> **Nota**: Itens de longo prazo são exploratórios e dependem de viabilidade técnica e demanda da comunidade.

---

[Voltar para o Índice](README.md)
