# SPEC-002: Single Purpose Statement & Manifest Review

**ID:** SPEC-002  
**Epic Parent:** EPIC-001 (Segurança e Conformidade MV3)  
**Prioridade:** 🔴 Crítica (Bloqueador de CWS)  
**Estimativa:** 3 dias  
**Status:** 📋 Aberta  
**Owner:** Product Lead + Dev Team  
**QA Reviewer:** QA Lead  
**Data:** 02/01/2026

---

## 🎯 Objetivo de Negócio

Garantir conformidade com a **Single Purpose Policy** da Chrome Web Store, criando uma narrativa coesa que conecte todas as funcionalidades da extensão (Gestão de Cursos AVA, Navegação Inteligente, Autopreenchimento SEI) sob um único propósito: **Produtividade Acadêmica UNIVESP**.

**Justificativa CWS:**
> "An extension must have a single purpose that is narrow and easy to understand" (Quality Guidelines)

**Risco de Não-Conformidade:**
- Rejeição por "Yellow Zinc" (Keyword Spam / Single Purpose Violation)
- Revisores interpretam SEI (autofill) como funcionalidade "órfã"

---

## 📖 Contexto Técnico

### Estado Atual (Problemático)
**Descrição do manifest.json (linha 5):**
```json
"description": "Ferramentas de produtividade para alunos UNIVESP: Gestão de Cursos, Navegação Inteligente no AVA e Autopreenchimento SEI."
```

**Problemas:**
1. **Lista de features desconexas:** Parece "canivete suíço" (3 funcionalidades separadas).
2. **Falta de contexto:** Não explica POR QUE SEI está incluído (parece genérico).
3. **Keyword stuffing potencial:** "Gestão, Navegação, Autopreenchimento" pode ser interpretado como spam.

---

### Estado Desejado (Conforme)
**Nova descrição (max 132 chars, CWS limit):**
```json
"description": "Produtividade acadêmica para UNIVESP: organize cursos do AVA, navegue atividades e agilize protocolos no SEI."
```

**Mudanças:**
- ✅ Foco único: "Produtividade acadêmica UNIVESP"
- ✅ Verbo de ligação: "organize, navegue, agilize" (fluxo, não lista)
- ✅ Contexto SEI: "protocolos" (função acadêmica, não autofill genérico)

---

## 📋 Requisitos Funcionais

### RF-001: Criar SINGLE_PURPOSE_STATEMENT.md
**Localização:** `docs/governance/SINGLE_PURPOSE_STATEMENT.md`

**Conteúdo Obrigatório:**
```markdown
# Single Purpose Statement - Central Univesp

## Propósito Único
Esta extensão tem um **único propósito**: Maximizar a produtividade acadêmica de alunos da UNIVESP durante todo o ciclo de estudos.

## Convergência Funcional

### 1. Gestão de Cursos (AVA)
- **O que faz:** Organiza materiais e atividades do Ambiente Virtual de Aprendizagem.
- **Por que é essencial:** Alunos lidam com múltiplos cursos simultâneos. Navegar sem organização causa perda de prazos.

### 2. Navegação Inteligente (sidePanel + Chips)
- **O que faz:** Painel lateral com histórico de navegação contextual.
- **Por que é essencial:** Acesso rápido a semanas recentes evita recarregamentos repetitivos do AVA.

### 3. Autopreenchimento SEI
- **O que faz:** Preenche automaticamente RA e dados em protocolos do SEI (Sistema Eletrônico de Informações).
- **Por que é essencial:** SEI é usado para matrícula, trancamento, declarações (processos acadêmicos). Agilizar isso economiza tempo do aluno para focar nos estudos.

## Narrativa de Coesão
Todas as funcionalidades convergem para um **único fluxo de valor**: 
**Estudante → Acessa AVA (1) → Navega com eficiência (2) → Resolve processos acadêmicos rapidamente (3) → Foca nos estudos.**

Sem qualquer uma dessas peças, o ciclo de produtividade é quebrado.

## Conformidade CWS
Esta extensão **NÃO é**:
- ❌ Um agregador genérico de ferramentas (não tem clima, criptomoedas, etc.)
- ❌ Um autofill genérico (SEI é específico de UNIVESP)
- ❌ Uma suíte multiuso (tudo serve à **produtividade acadêmica**)

**Veredito:** Propósito único e coeso.
```

---

### RF-002: Atualizar manifest.json
**Arquivo:** `manifest.json` (linha 5)

**Mudança:**
```diff
- "description": "Ferramentas de produtividade para alunos UNIVESP: Gestão de Cursos, Navegação Inteligente no AVA e Autopreenchimento SEI."
+ "description": "Produtividade acadêmica para UNIVESP: organize cursos do AVA, navegue atividades e agilize protocolos no SEI."
```

**Validação:**
- [ ] Descrição <= 132 caracteres (limite CWS).
- [ ] Sem keyword stuffing (máximo 5 repetições de mesma keyword).
- [ ] Verbos de ação conectam features (não lista isolada).

---

### RF-003: Auditoria de Feature Creep
**Objetivo:** Garantir que NENHUMA funcionalidade "órfã" existe.

**Checklist:**
- [ ] Todas as features estão documentadas no Single Purpose Statement?
- [ ] Todas servem ao objetivo "Produtividade Acadêmica UNIVESP"?
- [ ] Se removermos uma feature, o propósito único ainda funciona?

**Se alguma feature falhar:** Remover ou justificar no Statement.

---

## 🔒 Requisitos Não-Funcionais

### RNF-001: Clareza de Comunicação (CWS Quality Guidelines)
- Statement deve ser **compreensível** para não-técnicos.
- Evitar jargão (ex: "scraping", "DOM manipulation").
- Usar linguagem de produto (ex: "organiza", "agiliza").

### RNF-002: Evidência de Conformidade
- Statement será **anexado ao painel do desenvolvedor CWS** no campo "Single Purpose Justification" (se solicitado).

---

## ✅ Critérios de Aceite (Testáveis)

### CA-001: Documento Criado
```bash
# ✅ Arquivo DEVE existir
test -f docs/governance/SINGLE_PURPOSE_STATEMENT.md && echo "OK" || echo "FAIL"
```

### CA-002: Manifest Atualizado
```bash
# ✅ Descrição DEVE ter <= 132 chars
length=$(jq -r '.description | length' manifest.json)
[ "$length" -le 132 ] && echo "OK" || echo "FAIL: $length chars"
```

### CA-003: Revisão por Pares
- [ ] **Product Lead** revisa e aprova o Statement (narrativa de negócio).
- [ ] **QA Lead** revisa e aprova a descrição do manifest (compliance).

### CA-004: Teste de "Elevator Pitch"
> **Teste:** Alguém fora do projeto lê a descrição do manifest e consegue explicar o propósito da extensão em 1 frase?
- [ ] Sim → Aprovado
- [ ] Não → Revisar descrição

---

## 📦 Entregáveis

1. **Documentação:**
   - [ ] `docs/governance/SINGLE_PURPOSE_STATEMENT.md` criado.

2. **Código:**
   - [ ] `manifest.json` atualizado (linha 5: description).

3. **Validação:**
   - [ ] PR com aprovação de Product Lead e QA Lead.

---

## 🧪 Plano de Testes

### Teste 1: Keyword Density Check
```bash
# ❌ NÃO pode ter mesma keyword > 5 vezes
description=$(jq -r '.description' manifest.json)
echo "$description" | tr '[:space:]' '\n' | sort | uniq -c | sort -rn | head -5
# Exemplo de FAIL: "UNIVESP" aparece 7 vezes
```

### Teste 2: Conformidade com CWS Guidelines
**Pergunta para QA:** A descrição atende TODOS estes critérios?
- [ ] Descreve apenas 1 propósito principal?
- [ ] Evita lista de features desconexas?
- [ ] Não usa termos enganosos ("cheat", "hack")?
- [ ] Não promete funcionalidades impossíveis?

---

## 🔗 Dependencies

| Dependency | Tipo | Bloqueador? |
|------------|------|-------------|
| Consenso de Product sobre propósito | Governança | ✅ Sim |
| Issue-032 fechada | Rastreamento | ✅ Sim (esta SPEC fecha Issue-032) |

---

## 🚨 Riscos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Revisores CWS ainda rejeitam (subjetividade) | Média | Muito Alto | Preparar argumento escrito baseado no Statement para appeal |
| Feature SEI ainda parece "órfã" | Baixa | Alto | Enfatizar "protocolos acadêmicos" no Statement (não "autofill genérico") |

---

## 📅 Timeline Sugerido

| Dia | Atividade |
|-----|-----------|
| **D1** | Rascunho do Single Purpose Statement (Product Lead draft) |
| **D2** | Revisão e refinamento (Dev Team feedback) |
| **D3** | Atualizar manifest.json + Aprovação final (QA + Product) |

---

**Aprovação QA Lead:** ✅ SPEC completa, critérios claros. Requer aprovação de Product Lead antes de implementar.
