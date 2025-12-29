#!/bin/bash

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "\n${BLUE}==============================================${NC}"
echo -e "${BLUE}   📊  ANALYTICS 2.0 (Deep Dive)   ${NC}"
echo -e "${BLUE}==============================================${NC}\n"

# 0. Configuração Centralizada de Exclusões
# (Facilita manutenção e reuso nos comandos find)
EXCLUDE_PARAMS=(-type f 
    -not -path '*/node_modules/*' 
    -not -path '*/.git/*' 
    -not -path '*/.husky/*' 
    -not -path '*/dist/*' 
    -not -path '*/build/*' 
    -not -path '*/coverage/*' 
    -not -path '*/.vscode/*' 
    -not -path '*/.idea/*' 
    -not -name 'package-lock.json' 
    -not -name 'yarn.lock' 
    -not -name '*.png' 
    -not -name '*.jpg' 
    -not -name '*.jpeg' 
    -not -name '*.ico' 
    -not -name '*.svg' 
    -not -name '*.woff2')

# 1. Visão Geral
FILES=$(find . "${EXCLUDE_PARAMS[@]}")
TOTAL_LOC=$(echo "$FILES" | xargs wc -l | tail -n 1 | awk '{print $1}')
TOTAL_FILES=$(echo "$FILES" | wc -l)

echo -e "${GREEN}1. VISÃO GERAL${NC}"
echo "----------------------------------------------"
echo -e "Total de Arquivos Reais: \t$TOTAL_FILES"
echo -e "Total de Linhas (LOC):   \t$TOTAL_LOC"
if [ "$TOTAL_FILES" -gt 0 ]; then
    AVG=$(awk "BEGIN {printf \"%.2f\", $TOTAL_LOC/$TOTAL_FILES}")
    echo -e "Média Linhas/Arquivo:    \t$AVG"
fi
echo ""

# 2. Detalhe JavaScript (Produção vs Testes)
echo -e "${GREEN}2. RAIO-X JAVASCRIPT (.js)${NC}"
echo "----------------------------------------------"
# Busca todos os JS
ALL_JS=$(find . "${EXCLUDE_PARAMS[@]}" -name "*.js")

# Filtra o que termina em .test.js
TEST_FILES=$(echo "$ALL_JS" | grep "\.test\.js$")
# Filtra o que NÃO termina em .test.js (Inverte o grep com -v)
PROD_FILES=$(echo "$ALL_JS" | grep -v "\.test\.js$")

# Contagens
count_loc() {
    if [ -z "$1" ]; then echo 0; else echo "$1" | xargs wc -l | tail -n 1 | awk '{print $1}'; fi
}
count_files() {
    if [ -z "$1" ]; then echo 0; else echo "$1" | wc -l; fi
}

NUM_TESTS=$(count_files "$TEST_FILES")
LOC_TESTS=$(count_loc "$TEST_FILES")

NUM_PROD=$(count_files "$PROD_FILES")
LOC_PROD=$(count_loc "$PROD_FILES")

printf "%-20s %-10s %-10s\n" "Tipo" "Arqs" "Linhas"
echo "----------------------------------------------"
printf "%-20s %-10s %-10s\n" "Produção (Logic)" "$NUM_PROD" "$LOC_PROD"
printf "%-20s %-10s %-10s\n" "Testes (.test.js)" "$NUM_TESTS" "$LOC_TESTS"
echo "----------------------------------------------"
# Cálculo simples de proporção
if [ "$LOC_PROD" -gt 0 ]; then
    RATIO=$(awk "BEGIN {printf \"%.2f\", $LOC_TESTS/$LOC_PROD}")
    echo -e "Ratio Teste/Código:      \t${YELLOW}${RATIO}:1${NC} (Ideal > 0.5)"
fi
echo ""

# 3. Análise por Pasta em FEATURES
echo -e "${GREEN}3. MAPA DE CALOR: FEATURES/${NC}"
echo "----------------------------------------------"
printf "%-25s %-10s %-10s\n" "Feature (Pasta)" "Arqs" "Linhas"
echo "----------------------------------------------"

if [ -d "features" ]; then
    for dir in features/*; do
        if [ -d "$dir" ]; then
            FEATURE_NAME=$(basename "$dir")
            
            # Busca arquivos APENAS dentro dessa feature específica
            FEAT_FILES=$(find "$dir" "${EXCLUDE_PARAMS[@]}")
            
            if [ -n "$FEAT_FILES" ]; then
                F_COUNT=$(echo "$FEAT_FILES" | wc -l)
                F_LOC=$(echo "$FEAT_FILES" | xargs wc -l | tail -n 1 | awk '{print $1}')
                printf "%-25s %-10s %-10s\n" "$FEATURE_NAME" "$F_COUNT" "$F_LOC"
            else
                printf "%-25s %-10s %-10s\n" "$FEATURE_NAME" "0" "0"
            fi
        fi
    done
else
    echo "Pasta 'features' não encontrada na raiz."
fi
echo ""

# 4. Top 10 Gigantes
echo -e "${RED}4. ARQUIVOS MAIS COMPLEXOS (Top 10)${NC}"
echo "----------------------------------------------"
echo "$FILES" | xargs wc -l | sort -nr | head -n 10 | awk '{printf "%-6s %s\n", $1, $2}'
echo ""

# 5. Dívida Técnica
echo -e "${YELLOW}5. DÍVIDA TÉCNICA${NC}"
echo "----------------------------------------------"
TOTAL_TODOS=$(grep -r "TODO" . --exclude-dir={node_modules,dist,.git,coverage,build} | wc -l)
TOTAL_FIXMES=$(grep -r "FIXME" . --exclude-dir={node_modules,dist,.git,coverage,build} | wc -l)
echo -e "TODOs: \t\t$TOTAL_TODOS"
echo -e "FIXMEs: \t$TOTAL_FIXMES"
echo ""

# 6. Relatório CLOC (Opcional, mas mantido)
if command -v cloc &> /dev/null; then
    echo -e "${BLUE}6. RELATÓRIO OFICIAL (CLOC)${NC}"
    echo "----------------------------------------------"
    cloc . --exclude-dir=node_modules,dist,.git,build,coverage,.husky,.vscode,.idea --not-match-f='package-lock.json|yarn.lock'
fi
echo ""
