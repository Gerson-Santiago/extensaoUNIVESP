#!/bin/bash

echo "📋 Validando Estrutura de Issues..."
echo ""

ERRORS=0

# 1. Verifica metadata em OPEN
echo "1️⃣ Verificando metadata tags..."
MISSING_META=0
for issue in .github/issues/open/*.md; do
  if [ -f "$issue" ]; then
    if ! grep -q "^\*\*Type:\*\*" "$issue"; then
      echo "   ❌ Falta metadata: $(basename "$issue")"
      MISSING_META=$((MISSING_META + 1))
    fi
  fi
done

if [ $MISSING_META -eq 0 ]; then
  echo "   ✅ Todas issues OPEN têm metadata"
else
  echo "   ❌ $MISSING_META issues sem metadata completa"
  ERRORS=$((ERRORS + 1))
fi

# 2. Conta issues
echo ""
echo "2️⃣ Validando contagem no INDEX.md..."
OPEN_COUNT=$(find .github/issues/open -name "*.md" -type f | wc -l)
INDEX_OPEN=$(grep -c '\[open/' .github/issues/index.md 2>/dev/null || echo 0)

echo "   Issues OPEN reais: $OPEN_COUNT"
echo "   Issues no INDEX: $INDEX_OPEN"

if [ "$OPEN_COUNT" != "$INDEX_OPEN" ]; then
  echo "   ⚠️  INDEX.md pode estar desatualizado"
  ERRORS=$((ERRORS + 1))
else
  echo "   ✅ Contagem correta"
fi

# 3. Verifica links quebrados
echo ""
echo "3️⃣ Verificando links no INDEX.md..."
BROKEN=0
if [ -f ".github/issues/index.md" ]; then
  while IFS= read -r line; do
    if [[ $line =~ \[(.*)\]\((open/[^)]+\.md)\) ]]; then
      file="${BASH_REMATCH[2]}"
      if [ ! -f ".github/issues/$file" ]; then
        echo "   ❌ Link quebrado: $file"
        BROKEN=$((BROKEN + 1))
      fi
    fi
  done < .github/issues/index.md
fi

if [ $BROKEN -eq 0 ]; then
  echo "   ✅ Sem links quebrados"
else
  echo "   ❌ $BROKEN links quebrados"
  ERRORS=$((ERRORS + 1))
fi

# 4. Verifica pastas obrigatórias
echo ""
echo "4️⃣ Verificando estrutura de pastas..."
REQUIRED_DIRS=("open" "backlog" "closed")
for dir in "${REQUIRED_DIRS[@]}"; do
  if [ ! -d ".github/issues/$dir" ]; then
    echo "   ❌ Pasta ausente: $dir/"
    ERRORS=$((ERRORS + 1))
  fi
done
echo "   ✅ Estrutura de pastas OK"

# Resultado
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
  echo "✅ Estrutura de issues válida!"
  exit 0
else
  echo "❌ Encontrados $ERRORS problemas"
  echo ""
  echo "💡 Dica: Atualize o INDEX.md após criar/mover issues"
  exit 1
fi
