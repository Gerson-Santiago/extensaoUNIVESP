# EPIC-001: Security & MV3 Compliance Core

**Status**: 🏃 Em Andamento  
**Prioridade**: 🔴 Crítica (Blocker CWS)  
**Tamanho**: M (3.5 - 5.5 dias restantes) | ✅ SPEC-004 concluída (1.5 dias)
**Tags**: `security`, `mv3`, `refactoring`

## 🎯 Objetivo
Tornar a extensão segura (Zero XSS) e 100% compatível com Manifest V3 para aprovação na Chrome Web Store.

## 📋 Contexto
A auditoria de segurança (02/01/2026) revelou vulnerabilidades críticas de XSS e necessidade de proteção contra race conditions no storage.

## 🛠️ Especificações (SPECs)

| SPEC ID | Título | Prioridade | Estimate | Status |
|---------|--------|------------|----------|--------|
| **SPEC-001** | DOM Safe Refactoring (XSS Fix) | 🔴 Crítica | 3-4 dias | 📋 Aberta |
| **SPEC-002** | Single Purpose Statement | 🔴 Crítica | 0.5 dia | 📋 Aberta |
| **SPEC-003** | Content Script Security | 🟡 Alta | 0.5 dia | 📋 Aberta |
| **SPEC-004** | Storage Concurrency | 🔴 Crítica | 1-2 dias | ✅ Fechada |

**Estimativa Total**: 5.5 a 7.5 dias.

## ✅ Critérios de Aceite (Definition of Done)
1. **Zero InnerHTML**: Nenhum uso de `innerHTML` com dados não-sanitizados.
2. ✅ **Race Conditions Eliminadas**: Repositórios usam locking/versioning (StorageGuard implementado).
3. **MV3 Compliant**: Service Worker efêmero e permissões mínimas.
4. **Testes**: Testes de segurança (XSS) e concorrência passando.
