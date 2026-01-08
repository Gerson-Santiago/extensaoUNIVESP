#!/bin/bash

echo "📦 Analisando Tamanho do Bundle..."
echo ""

# Limites (em KB)
LIMIT_TOTAL=5000  # 5MB (unpacked)
WARN_THRESHOLD=80 # Alerta em 80%

# Verifica se dist existe
if [ ! -d "dist" ]; then
  echo "❌ Pasta dist/ não encontrada"
  echo "   Execute: npm run build"
  exit 1
fi

# 1. Tamanho total
TOTAL_SIZE=$(du -sk dist | cut -f1)
WARN_SIZE=$((LIMIT_TOTAL * WARN_THRESHOLD / 100))

echo "📊 Bundle total: ${TOTAL_SIZE}KB / ${LIMIT_TOTAL}KB"
echo ""

if [ $TOTAL_SIZE -gt $LIMIT_TOTAL ]; then
  echo "❌ LIMITE EXCEDIDO!"
  echo "   Chrome Web Store limita em 5MB (unpacked)"
  exit 1
elif [ $TOTAL_SIZE -gt $WARN_SIZE ]; then
  PCT=$((TOTAL_SIZE * 100 / LIMIT_TOTAL))
  echo "⚠️  Atenção: ${PCT}% do limite"
else
  PCT=$((TOTAL_SIZE * 100 / LIMIT_TOTAL))
  echo "✅ OK (${PCT}% do limite)"
fi

# 2. Top 15 maiores arquivos
echo ""
echo "📋 Top 15 arquivos maiores:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
find dist -type f -exec du -k {} + | \
  sort -rn | \
  head -15 | \
  awk '{printf "%6dKB  %s\n", $1, $2}'

# 3. Estatísticas por tipo
echo ""
echo "📊 Por tipo de arquivo:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
for ext in js css html json; do
  SIZE=$(find dist -name "*.$ext" -exec du -k {} + 2>/dev/null | \
    awk '{sum+=$1} END {print sum}')
  COUNT=$(find dist -name "*.$ext" | wc -l)
  if [ "$SIZE" != "" ] && [ "$SIZE" -gt 0 ]; then
    printf "%-6s %6dKB  (%d arquivos)\n" ".$ext" "$SIZE" "$COUNT"
  fi
done

echo ""
echo "💡 Dica: Use 'npm run build' para atualizar dist/"
