# EPIC-003: Pre-Launch Compliance & Polish

**ID:** EPIC-003  
**Status:** 📋 Planejado (Pode iniciar em paralelo com EPIC-001)  
**Versão Alvo:** v2.10.0  
**Owner:** Dev Team + QA Lead  
**QA Lead:** Aprovado para Execução  
**Data de Criação:** 02/01/2026

---

## 🎯 Objetivo de Negócio (Business Value)

Completar **todas as atividades de compliance e polish** necessárias para publicação na Chrome Web Store, incluindo auditorias finais de código, criação de política de privacidade, preparação de metadados e validação de UX.

**Impacto da Não-Conformidade:**
- ❌ Rejeição na CWS por falta de Privacy Policy (legal blocker)
- ❌ Rejeição por permissões excessivas (tabs vs activeTab)
- ❌ Baixa qualidade de listagem (screenshots ruins, descrição confusa)

---

## 📖 Contexto Técnico

Este épico agrupa as **atividades de compliance não-código** e **auditorias finais** que são blockers de publicação mas não dependem diretamente da refatoração de DOM (EPIC-001).

**Diferencial vs EPIC-001:**
- EPIC-001 = Código (DOM, Types, Scripts)
- EPIC-003 = Políticas, Auditorias, Metadata (pode rodar em paralelo)

---

## 🔗 SPECs Derivadas (Child SPECs)

| SPEC ID | Título | Prioridade | Estimativa | Status | Pode Paralelo? |
|---------|--------|------------|------------|--------|----------------|
| **SPEC-037** | Remote Code Audit | 🔴 Crítica | 1 dia | 📋 Aberta | ✅ Sim |
| **SPEC-035** | Privacy Policy | 🔴 Crítica | 1 dia | 📋 Aberta | ✅ Sim |
| **SPEC-033** | Permission Audit | 🔴 Crítica | 2 dias | 📋 Aberta | ⚠️ Após manifest review |
| **SPEC-034** | Service Worker Lifecycle Audit | 🟡 Alta | 1 dia | 📋 Aberta | ✅ Sim |
| **SPEC-036** | CWS Metadata Preparation | 🟡 Alta | 2 dias | 📋 Aberta | ✅ Sim |
| **SPEC-038** | sidePanel UX Compliance | 🟡 Alta | Custom | 📋 Aberta | ⚠️ Após UI impl |

**Total Estimado:** 7 dias de trabalho (com paralelização: ~3-4 dias)

---

## ✅ Critérios de Aceite do Épico (Definition of Done)

- [ ] **Todas as SPECs derivadas (033-038) estão fechadas.**
- [ ] **Privacy Policy** publicada e acessível via HTTPS.
- [ ] **Permissão `tabs`** removida do manifest OU justificada (SPEC-033).
- [ ] **Zero código remoto** detectado (grep validation passou).
- [ ] **Screenshots e ícones** aprovados por QA (não pixelizados).
- [ ] **Metadata da CWS** (description, category) finalizada.

---

## 🚨 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Privacy Policy rejeitada (muito genérica) | Média | Alto | Usar template específico para Chrome Extensions |
| Permissão `tabs` é essencial (não pode remover) | Média | Alto | SPEC-033 deve provar com code grep ou aceitar warning |
| Screenshots ruins (rejeitados por Quality) | Baixa | Médio | SPEC-036: validação técnica (dimensões, formato) |

---

## 📊 Métricas de Sucesso

- **Compliance Score:** 100% das políticas CWS atendidas (checklist manual).
- **Pre-Submission Test:** Upload de teste na CWS Developer Console sem warnings críticos.

---

## 🔗 Relacionado

- **ADRs:** ADR-012 (Security-First)
- **Issues:** Issues 033-038
- **Dependencies:** Independente de EPIC-001 (pode rodar em paralelo)

---

## 📅 Timeline Sugerido (Paralelização Otimizada)

### Semana 1 (Paralelo com EPIC-001)
- **Dia 1:** SPEC-037 (Remote Code) + SPEC-035 (Privacy Policy) - 2 SPECs em paralelo
- **Dia 2:** SPEC-034 (Service Worker) + SPEC-036 (Metadata) - 2 SPECs em paralelo
- **Dia 3-4:** SPEC-033 (Permissions) - depende de manifest review

### Semana 2+ (Após EPIC-001)
- **SPEC-038:** sidePanel UX (depende de UI estar implementada)

**Total com Paralelização:** 4 dias (vs 7 dias sequencial)

---

**Aprovação QA Lead:** ✅ Épico estruturado, pode iniciar em paralelo com EPIC-001. SPECs de auditoria (037, 034) são rápidas e não-bloqueantes de dev work.
