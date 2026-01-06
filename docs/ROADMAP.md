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

## 📅 2. Horizonte Tático: Release v2.10.0 (Contextual Chips)

**Status**: 🚀 Lançamento / Estabilização (Jan/2026)

### [x] M1: Codebase Seguro & Compliance
- **Segurança**: Eliminação de XSS (DOMSafe) e Race Conditions (StorageGuard).
- **Compliance**: Adequação total às políticas da Chrome Web Store (Privacidade, Permissões).

### [/] M2: Experiência do Usuário (UX)
- **Contextualidade**: Chips de navegação bidirecionais.
- **Preferências**: Sistema de configuração (`SettingsView`) reimaginado.
- **Reset**: Funcionalidade de Factory Reset para soberania de dados.

### [ ] M3: Engenharia de Distribuição
- Assets de loja profissionais (Screenshots, Ícones).
- Pipeline de build e empacotamento otimizado.

---

## 🏔️ 3. Futuro Próximo (v2.11.0+)

### EPIC-004: Soberania e Personalização
- **Painel de Diagnóstico**: Ferramentas de auto-reparo e análise de integridade.
- **Controle Fino**: Opções para ativar/desativar scrapers específicos.

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
