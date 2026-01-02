# EPIC-001: Segurança e Conformidade Manifest V3

**ID:** EPIC-001  
**Status:** 🔴 Bloqueador Crítico  
**Versão Alvo:** v2.10.0  
**Owner:** Equipe de Desenvolvimento  
**QA Lead:** Aprovado para Execução  
**Data de Criação:** 02/01/2026

---

## 🎯 Objetivo de Negócio (Business Value)

Garantir que a extensão **Central Univesp** seja aprovada na Chrome Web Store (CWS) sem rejeições, eliminando vetores de segurança críticos (XSS) e assegurando conformidade com as políticas de **Single Purpose** e **Code Readability** do Manifest V3.

**Impacto da Não-Conformidade:**
- ❌ Rejeição permanente na CWS (códigos "Purple Potassium", "Blue Argon")
- ❌ Suspensão da conta de desenvolvedor
- ❌ Impossibilidade de distribuir a extensão publicamente

---

## 📖 Contexto Técnico

Este épico agrupa todas as atividades de **conformidade obrigatória** para publicação na Chrome Web Store. Baseia-se em:

1. **ADR-012 (Security-First Development):** Eliminar `innerHTML`, validar inputs, usar SafeResult.
2. **CWS Program Policies (Seção "Code Readability"):** Código não pode ser ofuscado, deve usar Chrome APIs corretamente.
3. **CWS Program Policies (Seção "Quality Guidelines"):** Single Purpose - funcionalidades devem convergir para um objetivo único e claro.

---

## 🔗 SPECs Derivadas (Child SPECs)

| SPEC ID | Título | Prioridade | Estimativa | Status |
|---------|--------|------------|------------|--------|
| **SPEC-001** | Refatoração DOM Safe (innerHTML → createElement) | 🔴 Crítica | 5 dias | 📋 Aberta |
| **SPEC-002** | Single Purpose Statement & Manifest Review | 🔴 Crítica | 3 dias | 📋 Aberta |
| **SPEC-003** | Content Script Security Audit (SeiLoginContentScript) | 🔴 Crítica | 2 dias | 📋 Aberta |

**Total Estimado:** 10 dias de trabalho

---

## ✅ Critérios de Aceite do Épico (Definition of Done)

Este épico estará **completo** quando:

- [ ] **Todas as SPECs derivadas (001, 002, 003) estão fechadas.**
- [ ] **Zero violações de ADR-012** detectadas em code review.
- [ ] **Manifest.json** contém Single Purpose Statement aprovado.
- [ ] **Testes de segurança automatizados** passam (XSS injection tests).
- [ ] **Pré-submissão à CWS** executada sem warnings críticos.

---

## 🚨 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Refatoração de DOM quebra UI | Média | Alto | Testes visuais de regressão (manual) + VRT (futuro) |
| Single Purpose rejeitado (SEI órfão) | Média | Muito Alto | Criar narrativa de coesão forte ("gestão acadêmica UNIVESP completa") |
| Prazo de 10 dias insuficiente | Baixa | Médio | Priorizar SPEC-001 e SPEC-002 (SPEC-003 pode ser paralela) |

---

## 📊 Métricas de Sucesso

- **Security Score:** Zero `innerHTML` com dados dinâmicos (grep validation).
- **Compliance Score:** 100% das políticas CWS atendidas (checklist manual).
- **Test Coverage:** >85% branch coverage mantida após refatoração.

---

## 🔗 Relacionado

- **ADRs:** ADR-012 (Security-First), ADR-000-A (Screaming Architecture)
- **Issues:** Issue-030, Issue-032, Issue-039
- **CWS Policies:** [Quality Guidelines](https://developer.chrome.com/docs/webstore/program-policies/#quality_guidelines), [Code Readability](https://developer.chrome.com/docs/webstore/program-policies/#code_readability_requirements)

---

**Aprovação QA Lead:** ✅ Épico estruturado, SPECs derivadas prontas para implementação.
