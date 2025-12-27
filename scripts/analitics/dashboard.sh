#!/bin/bash

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "\n${BLUE}==============================================${NC}"
echo -e "${BLUE}   📊  ANALYTICS (Real Source Code)  ${NC}"
echo -e "${BLUE}==============================================${NC}\n"

# 1. Definição de escopo REFINADA
# Ignora: node_modules, git, husky, dist, coverage, builds e imagens
FILES=$(find . -type f \
    -not -path '*/node_modules/*' \
    -not -path '*/.git/*' \
    -not -path '*/.husky/*' \
    -not -path '*/dist/*' \
    -not -path '*/build/*' \
    -not -path '*/coverage/*' \
    -not -path '*/.vscode/*' \
    -not -path '*/.idea/*' \
    -not -name 'package-lock.json' \
    -not -name 'yarn.lock' \
    -not -name '*.png' \
    -not -name '*.jpg' \
    -not -name '*.jpeg' \
    -not -name '*.ico' \
    -not -name '*.svg' \
    -not -name '*.woff2')

# 2. Contagem
TOTAL_LOC=$(echo "$FILES" | xargs wc -l | tail -n 1 | awk '{print $1}')
TOTAL_FILES=$(echo "$FILES" | wc -l)

echo -e "${GREEN}1. VISÃO GERAL${NC}"
echo "----------------------------------------------"
echo -e "Total de Arquivos Reais: \t$TOTAL_FILES"
echo -e "Total de Linhas (LOC):   \t$TOTAL_LOC"
if [ "$TOTAL_FILES" -gt 0 ]; then
    AVG=$(echo "$TOTAL_LOC / $TOTAL_FILES" | bc)
    echo -e "Média Linhas/Arquivo:    \t$AVG"
fi
echo ""

# 3. Distribuição
echo -e "${GREEN}2. POR LINGUAGEM${NC}"
echo "----------------------------------------------"
printf "%-10s %-10s %-10s\n" "Ext" "Arqs" "Linhas"
echo "----------------------------------------------"

for ext in js json css md html; do
    SUBFILES=$(find . -type f -name "*.$ext" \
        -not -path '*/node_modules/*' \
        -not -path '*/.git/*' \
        -not -path '*/coverage/*' \
        -not -path '*/dist/*' \
        -not -name 'package-lock.json')
    
    COUNT=$(echo "$SUBFILES" | wc -l)
    
    if [ "$COUNT" -gt 0 ] && [ -n "$SUBFILES" ]; then
        LINES=$(echo "$SUBFILES" | xargs wc -l | tail -n 1 | awk '{print $1}')
        printf "%-10s %-10s %-10s\n" ".$ext" "$COUNT" "$LINES"
    fi
done
echo ""

# 4. Top 10 Gigantes (Reais)
echo -e "${RED}3. ARQUIVOS MAIS COMPLEXOS (Top 10)${NC}"
echo "----------------------------------------------"
# Ordena numericamente reverso e pega os 10 primeiros
echo "$FILES" | xargs wc -l | sort -nr | head -n 10 | awk '{printf "%-6s %s\n", $1, $2}'
echo ""