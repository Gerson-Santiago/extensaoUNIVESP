#!/bin/bash
set -e

echo "🚀 Iniciando recuperação e finalização da publicação de issues..."
echo ""

declare -A ISSUE_MAP

# 1. Mapear Issues Existentes (Recuperado manualmente)
ISSUE_MAP["002"]=18
ISSUE_MAP["019"]=15
ISSUE_MAP["021"]=16
ISSUE_MAP["032"]=17
ISSUE_MAP["028"]=20

echo "📊 Issues já publicadas:"
echo "   - ISSUE-002: #18"
echo "   - ISSUE-019: #15"
echo "   - ISSUE-021: #16"
echo "   - ISSUE-032: #17"
echo "   - ISSUE-028: #20"
echo ""

# Função helper
extract_number() {
    echo "$1" | grep -oE "#[0-9]+" | grep -oE "[0-9]+"
}

# 2. Publicar Issues Faltantes



echo "📦 ISSUE-022 - UX Preferences"
RESULT=$(gh issue create \
  --title "⚙️ Feature: UX Preferences & Behavior" \
  --body-file .github/ISSUES/OPEN/OPEN-ISSUE-022_ux-preferences.md \
  --label "enhancement,priority-high" \
  --milestone "v2.10.0")
NUM=$(extract_number "$RESULT")
ISSUE_MAP["022"]=$NUM
echo "   ✅ Criada: #$NUM"
echo ""

echo "📦 ISSUE-023 - About, Diagnostics & Support"
RESULT=$(gh issue create \
  --title "ℹ️ Feature: About, Diagnostics & Support" \
  --body-file .github/ISSUES/OPEN/OPEN-ISSUE-023_settings-about.md \
  --label "enhancement" \
  --milestone "v2.10.0")
NUM=$(extract_number "$RESULT")
ISSUE_MAP["023"]=$NUM
echo "   ✅ Criada: #$NUM"
echo ""

echo "📦 ISSUE-033 - MV3 Permission Justification"
RESULT=$(gh issue create \
  --title "🛡️ CWS: Permission Justification & Reduction" \
  --body-file .github/ISSUES/OPEN/OPEN-ISSUE-033_mv3-permission-audit.md \
  --label "priority-high" \
  --milestone "Pre-Launch")
NUM=$(extract_number "$RESULT")
ISSUE_MAP["033"]=$NUM
echo "   ✅ Criada: #$NUM"
echo ""

echo "📦 ISSUE-035 - Privacy Policy"
RESULT=$(gh issue create \
  --title "🛡️ Legal: Privacy Policy & Data Disclosure" \
  --body-file .github/ISSUES/OPEN/OPEN-ISSUE-035_privacy-policy.md \
  --label "priority-high,documentation" \
  --milestone "Pre-Launch")
NUM=$(extract_number "$RESULT")
ISSUE_MAP["035"]=$NUM
echo "   ✅ Criada: #$NUM"
echo ""

# 3. Gerar Arquivo de Mapeamento

echo "📊 Tabela Final:"
echo ""
echo "| Local      | GitHub |"
echo "|------------|--------|"
for KEY in "${!ISSUE_MAP[@]}"; do
  echo "| ISSUE-$KEY  | #${ISSUE_MAP[$KEY]}  |"
done

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

echo ""
echo "✅ Mapeamento salvo em /tmp/issue-mapping.txt"

# 4. Cleanup (Best Effort)
echo "🧹 Tentando fechar duplicatas de ISSUE-002..."
gh issue close 11 12 13 14 --reason "not planned" --comment "Duplicate of #18" || echo "⚠️  Falha ao fechar alguns items (ignore se já fechados)"

echo "🎉 Concluído!"
