#!/bin/bash
#
# Script: Publicar Issues Selecionadas no GitHub
# Autor: Sistema de Rastreamento
# Data: 2026-01-03

set -e

echo "🚀 Iniciando publicação de 8 issues estratégicas..."
echo ""

# Array para armazenar mapeamento
declare -A ISSUE_MAP

# Função para extrair número da issue criada
extract_number() {
    echo "$1" | grep -oE "#[0-9]+" | grep -oE "[0-9]+"
}

# ============================================================================
# BUGS CRÍTICOS RESOLVIDOS
# ============================================================================

echo "📦 1/8: ISSUE-002 - Missing Revision Week (BUG RESOLVIDO)"
RESULT=$(gh issue create \
  --title "🐛 Bug Crítico: Semana de Revisão Faltando no Scraper" \
  --body-file .github/ISSUES/CLOSED/CLOSED-ISSUE-002_missing-revision-week.md \
  --label "bug")
NUM=$(extract_number "$RESULT")
ISSUE_MAP["002"]=$NUM
echo "   ✅ Criada: #$NUM"
gh issue close $NUM --reason "completed" --comment "Issue resolvida em v2.9.0"
echo "   🔒 Fechada"
echo ""

echo "📦 2/8: ISSUE-028 - Storage Race Condition (BUG CRÍTICO)"
RESULT=$(gh issue create \
  --title "🛡️ Bug Crítico: Race Condition - Perda de Dados (Storage)" \
  --body-file .github/ISSUES/CLOSED/CLOSED-ISSUE-028_storage-concurrency.md \
  --label "bug" \
  --milestone "v2.9.7")
NUM=$(extract_number "$RESULT")
ISSUE_MAP["028"]=$NUM
echo "   ✅ Criada: #$NUM"
gh issue close $NUM --reason "completed" --comment "Issue resolvida em v2.10.0 com implementação de StorageGuard"
echo "   🔒 Fechada"
echo ""

# ============================================================================
# FEATURES USER-FACING
# ============================================================================

echo "📦 3/8: ISSUE-019 - Settings & Backup System"
RESULT=$(gh issue create \
  --title "💾 Feature: Settings & Backup System" \
  --body-file .github/ISSUES/OPEN/OPEN-ISSUE-019_settings-backup-system.md \
  --label "enhancement,priority-high" \
  --milestone "v2.10.0")
NUM=$(extract_number "$RESULT")
ISSUE_MAP["019"]=$NUM
echo "   ✅ Criada: #$NUM"
echo ""

echo "📦 4/8: ISSUE-021 - Release Documentation v2.10.0"
RESULT=$(gh issue create \
  --title "📦 Release: Documentation v2.10.0" \
  --body-file .github/ISSUES/OPEN/OPEN-ISSUE-021_release-documentation-v2.10.0.md \
  --label "documentation" \
  --milestone "v2.10.0")
NUM=$(extract_number "$RESULT")
ISSUE_MAP["021"]=$NUM
echo "   ✅ Criada: #$NUM"
echo ""

echo "📦 5/8: ISSUE-022 - UX Preferences"
RESULT=$(gh issue create \
  --title "⚙️ Feature: UX Preferences & Behavior" \
  --body-file .github/ISSUES/OPEN/OPEN-ISSUE-022_ux-preferences.md \
  --label "enhancement,priority-high" \
  --milestone "v2.10.0")
NUM=$(extract_number "$RESULT")
ISSUE_MAP["022"]=$NUM
echo "   ✅ Criada: #$NUM"
echo ""

echo "📦 6/8: ISSUE-023 - About, Diagnostics & Support"
RESULT=$(gh issue create \
  --title "ℹ️ Feature: About, Diagnostics & Support" \
  --body-file .github/ISSUES/OPEN/OPEN-ISSUE-023_settings-about.md \
  --label "enhancement" \
  --milestone "v2.10.0")
NUM=$(extract_number "$RESULT")
ISSUE_MAP["023"]=$NUM
echo "   ✅ Criada: #$NUM"
echo ""

# ============================================================================
# COMPLIANCE CWS
# ============================================================================

echo "📦 7/8: ISSUE-032 - MV3 Single Purpose"
RESULT=$(gh issue create \
  --title "🛡️ CWS: Single Purpose Policy Validation" \
  --body-file .github/ISSUES/OPEN/OPEN-ISSUE-032_mv3-single-purpose.md \
  --label "priority-high" \
  --milestone "Pre-Launch")
NUM=$(extract_number "$RESULT")
ISSUE_MAP["032"]=$NUM
echo "   ✅ Criada: #$NUM"
echo ""

echo "📦 8/8: ISSUE-033 - MV3 Permission Justification"
RESULT=$(gh issue create \
  --title "🛡️ CWS: Permission Justification & Reduction" \
  --body-file .github/ISSUES/OPEN/OPEN-ISSUE-033_mv3-permission-audit.md \
  --label "priority-high" \
  --milestone "Pre-Launch")
NUM=$(extract_number "$RESULT")
ISSUE_MAP["033"]=$NUM
echo "   ✅ Criada: #$NUM"
echo ""

echo "📦 9/9: ISSUE-035 - Privacy Policy"
RESULT=$(gh issue create \
  --title "🛡️ Legal: Privacy Policy & Data Disclosure" \
  --body-file .github/ISSUES/OPEN/OPEN-ISSUE-035_privacy-policy.md \
  --label "priority-high,documentation" \
  --milestone "Pre-Launch")
NUM=$(extract_number "$RESULT")
ISSUE_MAP["035"]=$NUM
echo "   ✅ Criada: #$NUM"
echo ""

# ============================================================================
# TABELA DE MAPEAMENTO
# ============================================================================

echo "📊 Tabela de Mapeamento:"
echo ""
echo "| Local      | GitHub | Categoria  |"
echo "|------------|--------|------------|"
echo "| ISSUE-002  | #${ISSUE_MAP["002"]}  | Bug Resolvido |"
echo "| ISSUE-028  | #${ISSUE_MAP["028"]}  | Bug Crítico   |"
echo "| ISSUE-019  | #${ISSUE_MAP["019"]}  | Feature       |"
echo "| ISSUE-021  | #${ISSUE_MAP["021"]}  | Release       |"
echo "| ISSUE-022  | #${ISSUE_MAP["022"]}  | Feature       |"
echo "| ISSUE-023  | #${ISSUE_MAP["023"]}  | Feature       |"
echo "| ISSUE-032  | #${ISSUE_MAP["032"]}  | Compliance    |"
echo "| ISSUE-033  | #${ISSUE_MAP["033"]}  | Compliance    |"
echo "| ISSUE-035  | #${ISSUE_MAP["035"]}  | Legal         |"
echo ""

# Salvar mapeamento em arquivo
cat > /tmp/issue-mapping.txt << EOF
ISSUE-002=${ISSUE_MAP["002"]}
ISSUE-028=${ISSUE_MAP["028"]}
ISSUE-019=${ISSUE_MAP["019"]}
ISSUE-021=${ISSUE_MAP["021"]}
ISSUE-022=${ISSUE_MAP["022"]}
ISSUE-023=${ISSUE_MAP["023"]}
ISSUE-032=${ISSUE_MAP["032"]}
ISSUE-033=${ISSUE_MAP["033"]}
ISSUE-035=${ISSUE_MAP["035"]}
EOF

echo "✅ Mapeamento salvo em /tmp/issue-mapping.txt"
echo ""
echo "🎉 Publicação concluída!"
