#!/bin/bash

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "\n${BLUE}==============================================${NC}"
echo -e "${BLUE}   📊  ANALYTICS 2.1 (Optimized)   ${NC}"
echo -e "${BLUE}==============================================${NC}\n"

# Função centralizada de busca com PRUNE para performance
# Ignora recursivamente .git, node_modules, etc.
find_smart() {
    local search_path="$1"
    shift
    
    find "$search_path" \
        -type d \( -name .git -o -name node_modules -o -name dist -o -name build -o -name coverage -o -name .vscode -o -name .idea -o -name .husky -o -name .agent -o -name .cache -o -name history_coverage \) -prune \
        -o -type f \
        \( \
           -not -name 'package-lock.json' \
           -not -name 'yarn.lock' \
           -not -name '*.zip' \
           -not -name '*.tar.gz' \
           -not -name '*.png' \
           -not -name '*.jpg' \
           -not -name '*.jpeg' \
           -not -name '*.ico' \
           -not -name '*.svg' \
           -not -name '*.woff2' \
           -not -name '*.mp4' \
           -not -name '*.webm' \
        \) \
        "$@" -print
}

# 1. Visão Geral
FILES=$(find_smart .)
TOTAL_FILES=$(echo "$FILES" | wc -l)
# wc -l pode falhar se lista vazia, mas FILES nunca deve ser vazio num projeto real
if [ -n "$FILES" ]; then
    TOTAL_LOC=$(echo "$FILES" | xargs wc -l 2>/dev/null | tail -n 1 | awk '{print $1}')
else
    TOTAL_LOC=0
fi

echo -e "${GREEN}1. VISÃO GERAL${NC}"
echo "----------------------------------------------"
echo -e "Total de Arquivos Reais: \t$TOTAL_FILES"
echo -e "Total de Linhas (LOC):   \t$TOTAL_LOC"
if [ "$TOTAL_FILES" -gt 0 ] && [ "$TOTAL_LOC" -gt 0 ]; then
    AVG=$(awk "BEGIN {printf \"%.2f\", $TOTAL_LOC/$TOTAL_FILES}")
    echo -e "Média Linhas/Arquivo:    \t$AVG"
fi
echo ""

# 2. Detalhe JavaScript (Produção vs Testes)
echo -e "${GREEN}2. RAIO-X JAVASCRIPT (.js)${NC}"
echo "----------------------------------------------"
# Busca todos os JS
ALL_JS=$(find_smart . -name "*.js")

if [ -n "$ALL_JS" ]; then
    TEST_FILES=$(echo "$ALL_JS" | grep "\.test\.js$")
    PROD_FILES=$(echo "$ALL_JS" | grep -v "\.test\.js$")
else
    TEST_FILES=""
    PROD_FILES=""
fi

count_files() {
    if [ -z "$1" ]; then echo 0; else echo "$1" | wc -l; fi
}
count_loc() {
    if [ -z "$1" ]; then echo 0; else echo "$1" | xargs wc -l 2>/dev/null | tail -n 1 | awk '{print $1}'; fi
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
            
            # Busca arquivos dentro da feature
            FEAT_FILES=$(find_smart "$dir")
            
            if [ -n "$FEAT_FILES" ]; then
                F_COUNT=$(echo "$FEAT_FILES" | wc -l)
                F_LOC=$(echo "$FEAT_FILES" | xargs wc -l 2>/dev/null | tail -n 1 | awk '{print $1}')
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

# 4. Top 30 Gigantes
echo -e "${RED}4. ARQUIVOS MAIS COMPLEXOS (Top 30)${NC}"
echo "----------------------------------------------"

if [ -n "$FILES" ]; then
    # Captura output do Top 30
    TOP_OUTPUT=$(echo "$FILES" | xargs wc -l 2>/dev/null | sort -nr | head -n 30)
    
    # Imprime tabela formatada (removendo path excessivo se quiser, mas aqui mantemos full)
    echo "$TOP_OUTPUT" | awk '{printf "%-6s %s\n", $1, $2}'
    
    # Check especial para BatchScraper (ADR-002)
    if echo "$TOP_OUTPUT" | grep -q "BatchScraper"; then
        echo -e "\n${CYAN}ℹ️  CONTEXTO:${NC} O ${YELLOW}BatchScraper${NC} aparece listado como arquivo grande."
        echo -e "   ↳ Motivo: Design 'Monolito Funcional' para compatibilidade com Chrome Manifest V3 (Content Script)."
        echo -e "   ↳ ADR: ${BLUE}docs/architecture/ADR_002_BATCHSCRAPER_ARCHITECTURE.md${NC}"
    fi
else
    echo "Nenhum arquivo encontrado."
fi
echo ""

# 5. Dívida Técnica
echo -e "${YELLOW}5. DÍVIDA TÉCNICA${NC}"
echo "----------------------------------------------"
# Exclui pastas pesadas para grep também. 
# Nota: Usamos multiplos flags para evitar problemas de expansão de chaves em diferentes shells.
GREP_EXCLUDE="--exclude-dir=node_modules --exclude-dir=dist --exclude-dir=.git --exclude-dir=coverage --exclude-dir=build --exclude-dir=.vscode --exclude-dir=.idea --exclude-dir=.husky --exclude-dir=.agent"
TOTAL_TODOS=$(grep -r "TODO" . $GREP_EXCLUDE 2>/dev/null | wc -l)
TOTAL_FIXMES=$(grep -r "FIXME" . $GREP_EXCLUDE 2>/dev/null | wc -l)
echo -e "TODOs: \t\t$TOTAL_TODOS"
echo -e "FIXMEs: \t$TOTAL_FIXMES"
echo ""

# 6. Relatório CLOC
if command -v cloc &> /dev/null; then
    echo -e "${BLUE}6. RELATÓRIO OFICIAL (CLOC)${NC}"
    echo "----------------------------------------------"
    cloc . --exclude-dir=node_modules,dist,.git,build,coverage,.husky,.vscode,.idea,.agent --not-match-f='package-lock.json|yarn.lock'
fi
echo ""
