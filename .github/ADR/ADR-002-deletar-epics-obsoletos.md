# ADR-002: Deletar EPICs Obsoletos

## Status
✅ **Aceito** (2025-12-27)

## Contexto

EPICs da v2.8.0 (6 arquivos, 1073 linhas) estão massivamente desatualizados:
- **17 links quebrados** (SPEC-v2.8.0.md deletada, arquivos movidos para ARCHIVED/)
- **15+ dados incorretos** (progresso, status, paths)
- **Informação duplicada** (cada issue tem arquivo próprio em REFACTOR/, TECH_DEBT/, etc.)

**Situação**: Branch `docs/auditoria-alinhamento-2025-12`, v2.8.8, reorganização documental ativa.

---

## Método Aplicado

**Matriz de Decisão Ponderada** (ISO/IEC 25010)

### Critérios e Pesos

| Critério | Peso | Justificativa |
|----------|------|---------------|
| Manutenibilidade | 5 | **Crítico** - docs devem ser fáceis de manter |
| Eficiência de Tempo | 4 | Importante - quick wins em auditoria |
| Rastreabilidade | 3 | Útil mas não crítico (git history rastreia) |
| Consistência de Dados | 5 | **Crítico** - docs inconsistentes pior que ausentes |
| Custo de Oportunidade | 4 | Importante - tempo limitado |

---

## Cálculo Matemático

**Fórmula**: $Resultado = \sum (Nota \times Peso)$

| Opção | Pontuação | Delta |
|-------|-----------|-------|
| **Deletar `.github/EPICS/`** | **92** | **VENCE** |
| Arquivar como `EPICS-v2.8.0/` | 73 | -27% |
| Atualizar todos arquivos | 48 | -92% |

---

## Decisão

**Deletar `.github/EPICS/` completamente**

### Razões Matemáticas
- Pontuação: 92/100 (27% acima do segundo colocado)
- Critérios dominantes: Manutenibilidade (25) + Consistência (25) = 54% do score

### Razões Estratégicas
1. **Zero Manutenção**: Nenhum arquivo para sincronizar
2. **Zero Duplicação**: `.github/README.md` já lista todas issues
3. **Consistência Perfeita**: Sem desatualização possível
4. **Quick Win**: < 5min de trabalho vs 3-4h (Atualizar)
5. **Git History Preserva Tudo**: Commits já rastreiam decisões

---

## Alternativas Rejeitadas

### Arquivar (73 pontos)

**Por que perdeu**:
- Ganho de apenas +15 pontos em Rastreabilidade (5 vs 2)
- Mas perde -5 pontos em Eficiência (4 vs 5)
- Trade-off: Ganho marginal não justifica trabalho extra

**Quando faria sentido**:
- EPICs como documentos únicos (não são - info duplicada)
- Regulamentação exigindo histórico (não há)
- Equipe grande precisando snapshots (projeto solo)

### Atualizar (48 pontos)

**Por que perdeu**:
- Pior pontuação em Manutenibilidade (1), Eficiência (1), Custo (1)
- 3-4h de trabalho agora + manutenção contínua futura
- 44 pontos de desvantagem (-92%)

**Quando faria sentido**:
- EPICs como fonte única de verdade (não são)
- Equipe grande com visão por "tema" (projeto solo)
- Ferramenta automatizando sync (não há)

---

## Consequências

### ✅ Positivas (O que ganhamos)

1. **Consistência Garantida**:
   - Fonte única: `.github/README.md` + arquivos individuais
   - Zero duplicação = zero desatualização

2. **Manutenção Zero**:
   - Mudança em issue = atualizar 1 arquivo (não 2+)
   - Nenhum EPIC para sincronizar

3. **Limpeza Imediata**:
   - -6 arquivos, -1073 linhas
   - -17 links quebrados eliminados
   - -15+ dados obsoletos removidos

4. **Eficiência**:
   - < 5min de trabalho
   - Libera tempo para trabalho real

### ⚠️ Negativas (Trade-offs Aceitos)

1. **Perde Visão por EPIC**:
   - Não há mais agrupamento temático de issues
   - **Mitigação**: `.github/README.md` lista por categoria (REFACTOR/, TECH_DEBT/, FEATURE/, ISSUES/)

2. **Perde Snapshot da v2.8.0**:
   - Histórico "planejado vs realizado" perdido
   - **Mitigação**: Git history preserva (commits c517207, 12cf046, 5dd4927 documentam tudo)

3. **Perde Diagrama de Dependências**:
   - Não há mais visualização Mermaid
   - **Mitigação**: Diagrama era confuso (issues trabalham independentemente)

**Aceitamos** porque:
- Git history + ADRs rastreiam decisões
- Projeto solo (não precisa "visão executiva")
- Issues individuais são fonte da verdade

---

## Implementação

**Comando executado**:
```bash
git rm -r .github/EPICS/
```

**Impacto**:
- Deletados: 6 arquivos (.md)
- Linhas removidas: ~1073
- Links quebrados eliminados: 17

**Tempo real**: < 5 minutos (conforme estimado)

---

## Referências

- **Matriz Completa**: [matriz_epics.md](file:///home/sant/.gemini/antigravity/brain/936bbe04-87d5-4fb2-bdd0-16e953a70b70/matriz_epics.md)
- **Auditoria EPICs**: [auditoria_epics_final.md](file:///home/sant/.gemini/antigravity/brain/936bbe04-87d5-4fb2-bdd0-16e953a70b70/auditoria_epics_final.md)
- **Método**: ISO/IEC 25010 (Software Quality Standard)

---

## Revisões

| Data | Mudança |
|------|---------|
| 2025-12-27 | Criação (decisão baseada em Matriz Ponderada) |

---

**Assinatura**: ADR-002 | Auditoria de Alinhamento Documental 2025-12
