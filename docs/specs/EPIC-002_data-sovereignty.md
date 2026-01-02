# EPIC-002: User Preferences & Data Sovereignty

**ID:** EPIC-002  
**Status:** 📋 Planejado (Depende de EPIC-001)  
**Versão Alvo:** v2.10.0  
**Owner:** Product Lead + Dev Team  
**QA Lead:** Aprovado para Execução  
**Data de Criação:** 02/01/2026

---

## 🎯 Objetivo de Negócio (Business Value)

Garantir que o usuário tenha **controle total e soberano** sobre seus dados acadêmicos armazenados pela extensão, incluindo capacidade de exportar (backup), importar (restauração) e destruir (factory reset) seus dados com segurança.

**Diferencial Competitivo:**
- ✅ Transparência total (usuário vê exatamente o que está armazenado)
- ✅ Portabilidade (pode mover dados entre dispositivos)
- ✅ Privacidade (pode apagar tudo sem rastros)

---

## 📖 Contexto Técnico

Este épico implementa a **camada de Settings** da extensão, focando em:

1. **Data Sovereignty (Soberania de Dados):** Usuário é dono absoluto dos seus dados (GDPR/LGPD compliance).
2. **User Safety (Segurança do Usuário):** Barreiras contra perda acidental de dados (confirmações duplas, validação de schema).
3. **Usability (Usabilidade):** Interface visual clara e hierárquica para configurações.

**Baseado em:**
- **ADR-003 (SafeResult Pattern):** Operações de backup/restore retornam `SafeResult` para tratamento de erros.
- **ADR-012 (Security-First):** Sanitização de JSON importado (anti-XSS).
- **Issue-035 (Privacy Policy):** Reset e backup devem ser mencionados na política de privacidade.

---

## 🔗 SPECs Derivadas (Child SPECs)

| SPEC ID | Título | Prioridade | Estimativa | Status | Ordem |
|---------|--------|------------|------------|--------|-------|
| **SPEC-022** | Settings UI Layout (Estrutura Base) | 🟡 Alta | 3 dias | 📋 Aberta | 1º |
| **SPEC-019** | Robust Backup System (Schema-Validated) | 🟡 Alta | 4 dias | 📋 Aberta | 2º |
| **SPEC-020** | Factory Reset with Safety Barriers | 🟡 Alta | 2 dias | 📋 Aberta | 3º |

**Total Estimado:** 9 dias de trabalho

**Nota:** SPEC-022 deve ser implementada PRIMEIRO (estrutura base), seguida por 019 e 020 (funcionalidades).

---

## ✅ Critérios de Aceite do Épico (Definition of Done)

Este épico estará **completo** quando:

- [ ] **Todas as SPECs derivadas (019, 020, 022) estão fechadas.**
- [ ] **Privacy Policy (Issue-035)** menciona explicitamente:
  - Capacidade de exportar dados.
  - Capacidade de apagar todos os dados via Factory Reset.
- [ ] **Testes de usabilidade** confirmam que usuário consegue:
  - Exportar backup em < 10 segundos.
  - Importar backup e ver dados restaurados imediatamente.
  - Executar factory reset sem perder dados acidentalmente (confirmação funciona).
- [ ] **SafeResult Pattern** usado em 100% das operações de I/O (backup, restore, clear).

---

## 🚨 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Usuário perde dados por importar JSON inválido | Média | Muito Alto | SPEC-019: Validação de schema + backup de emergência interno |
| Usuário clica em Reset acidentalmente | Baixa | Muito Alto | SPEC-020: Barreira de confirmação dupla (modal + input "CONFIRMAR") |
| Schema de backup incompatível entre versões | Média | Alto | SPEC-019: Versionamento de schema (`meta.version`) |
| UI de Settings confusa (muitas opções) | Baixa | Médio | SPEC-022: Hierarquia clara (abas com Geral/Dados/Sobre/Danger Zone) |

---

## 📊 Métricas de Sucesso

- **Usability Score:** Usuário consegue exportar backup na primeira tentativa (sem assistência).
- **Safety Score:** Zero relatos de perda de dados acidental pós-release.
- **Compliance Score:** Privacy Policy atende requisitos de GDPR/LGPD (direito ao esquecimento = factory reset).

---

## 🔗 Relacionado

- **ADRs:** ADR-003 (SafeResult), ADR-012 (Security-First)
- **Issues:** Issue-019, Issue-020, Issue-022, Issue-035 (Privacy Policy)
- **Dependencies:** EPIC-001 (Segurança) deve estar completo antes (storage seguro é pré-requisito)

---

## 📅 Timeline Sugerido

| Fase | SPECs | Duração | Dependências |
|------|-------|---------|--------------|
| **Fase 1** | SPEC-022 (UI Layout) | 3 dias | EPIC-001 completo |
| **Fase 2** | SPEC-019 (Backup System) | 4 dias | SPEC-022 completa |
| **Fase 3** | SPEC-020 (Factory Reset) | 2 dias | SPEC-022 completa |

**Total:** 9 dias (sequencial, não paralelo devido a dependências de UI)

---

**Aprovação QA Lead:** ✅ Épico estruturado, foco em Data Sovereignty e User Safety. SPECs derivadas prontas para detalhamento.
