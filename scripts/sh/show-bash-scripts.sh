#!/bin/bash

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${BOLD}${CYAN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${CYAN}   🛠️  Scripts Bash Utilitários - Central UNIVESP${NC}"
echo -e "${BOLD}${CYAN}════════════════════════════════════════════════════════════════${NC}"
echo ""

# GIT UTILITIES
echo -e "${BOLD}${BLUE}🔀 UTILITÁRIOS GIT${NC}"
echo -e "  ${GREEN}npm run legenda${NC}        - Mostra legenda de commits git do projeto"
echo -e "                         ${YELLOW}(tipos: feat, fix, refactor, docs, etc)${NC}"
echo -e "  ${GREEN}npm run verlog${NC}         - Visualiza log de commits formatado"
echo ""

# PROJECT INFO
echo -e "${BOLD}${BLUE}📊 INFORMAÇÕES DO PROJETO${NC}"
echo -e "  ${GREEN}npm run dashboard${NC}      - Dashboard completo do projeto"
echo -e "                         ${YELLOW}(métricas, status, health check)${NC}"
echo -e "  ${GREEN}npm run path${NC}           - Mostra caminhos importantes do projeto"
echo -e "  ${GREEN}npm run all_path${NC}       - Lista TODOS os caminhos do projeto"
echo -e "  ${GREEN}npm run rows${NC}           - Contagem de linhas de código"
echo -e "                         ${YELLOW}(por tipo de arquivo, feature, etc)${NC}"
echo ""

# QUALITY & ANALYSIS
echo -e "${BOLD}${BLUE}🔍 QUALIDADE & ANÁLISE${NC}"
echo -e "  ${GREEN}npm run check-bundle${NC}   - Verifica tamanho do bundle de distribuição"
echo -e "                         ${YELLOW}(alerta se exceder limites recomendados)${NC}"
echo -e "  ${GREEN}npm run check-deps${NC}     - Identifica dependências não utilizadas"
echo -e "                         ${YELLOW}(ajuda a limpar package.json)${NC}"
echo -e "  ${GREEN}npm run audit${NC}          - Auditoria de segurança customizada"
echo -e "                         ${YELLOW}(análise além do npm audit padrão)${NC}"
echo ""

# ISSUE TRACKING
echo -e "${BOLD}${BLUE}📝 GERENCIAMENTO DE ISSUES${NC}"
echo -e "  ${GREEN}npm run backup-issues${NC}  - Faz backup das issues locais"
echo -e "                         ${YELLOW}(salva snapshot em .github/ISSUES/BACKUP/)${NC}"
echo -e "  ${GREEN}npm run validate-issues${NC}"
echo -e "                         - Valida formato e estrutura das issues"
echo -e "                         ${YELLOW}(verifica campos obrigatórios, numeração, etc)${NC}"
echo ""

# COMO EXECUTAR
echo -e "${BOLD}${CYAN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${MAGENTA}💡 COMO EXECUTAR${NC}"
echo ""
echo -e "${YELLOW}Via npm (recomendado):${NC}"
echo -e "  ${GREEN}npm run <comando>${NC}  # Exemplo: npm run dashboard"
echo ""
echo -e "${YELLOW}Diretamente via bash:${NC}"
echo -e "  ${GREEN}bash scripts/sh/<script>.sh${NC}  # Exemplo: bash scripts/sh/dashboard.sh"
echo ""
echo -e "${BOLD}${CYAN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}📂 Localização:${NC} Todos os scripts estão em ${GREEN}scripts/sh/${NC}"
echo -e "${BOLD}${CYAN}════════════════════════════════════════════════════════════════${NC}"
echo ""
