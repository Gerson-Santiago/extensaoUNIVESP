#!/bin/bash

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

echo -e "${BOLD}${CYAN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${CYAN}   📚 Scripts NPM Disponíveis - Central UNIVESP${NC}"
echo -e "${BOLD}${CYAN}════════════════════════════════════════════════════════════════${NC}"
echo ""

# BUILD & DEPLOY
echo -e "${BOLD}${BLUE}🏗️  BUILD & DEPLOY${NC}"
echo -e "  ${GREEN}npm run build${NC}          - Gera build de distribuição otimizado"
echo -e "  ${GREEN}npm run dist${NC}           - Alias para build"
echo ""

# QUALITY & CHECKS
echo -e "${BOLD}${BLUE}✅ QUALIDADE & VERIFICAÇÃO${NC}"
echo -e "  ${GREEN}npm run check${NC}          - Executa lint + type-check"
echo -e "  ${GREEN}npm run verify${NC}         - Executa test + lint + type-check (completo)"
echo -e "  ${GREEN}npm run lint${NC}           - ESLint com cache"
echo -e "  ${GREEN}npm run lint:fix${NC}       - ESLint com auto-correção"
echo -e "  ${GREEN}npm run format${NC}         - Formata código com Prettier"
echo -e "  ${GREEN}npm run format:check${NC}   - Verifica formatação sem alterar"
echo -e "  ${GREEN}npm run format:clean${NC}   - Executa formação em todos os arquivos"
echo -e "  ${GREEN}npm run type-check${NC}     - Verifica tipos TypeScript/JSDoc"
echo -e "  ${GREEN}npm run type-check:quiet${NC} - Type-check silencioso (só exit code)"
echo -e "  ${GREEN}npm run type-check:verbose${NC} - Type-check com lista de arquivos processados"
echo -e "  ${GREEN}npm run precommit${NC}      - Verifica secrets + lint-staged (hook git)"
echo ""

# TESTING
echo -e "${BOLD}${BLUE}🧪 TESTES${NC} ${YELLOW}(use 'npm run scripts:test' para mais detalhes)${NC}"
echo -e "  ${GREEN}npm run test${NC}           - Executa todos os testes"
echo -e "  ${GREEN}npm run test:coverage${NC}  - Testes com relatório de cobertura"
echo -e "  ${GREEN}npm run test:watch${NC}     - Modo watch (re-executa ao salvar)"
echo -e "  ${GREEN}npm run test:quick${NC}     - Executa apenas testes que falharam"
echo ""

# SECURITY
echo -e "${BOLD}${BLUE}🔒 SEGURANÇA${NC}"
echo -e "  ${GREEN}npm run security${NC}           - Auditoria completa de segurança"
echo -e "  ${GREEN}npm run security:secrets${NC}  - Verifica vazamento de secrets"
echo -e "  ${GREEN}npm run security:audit${NC}    - Auditoria de dependências (npm audit)"
echo -e "  ${GREEN}npm run security:lint${NC}     - Linting de segurança"
echo ""

# BASH UTILITIES
echo -e "${BOLD}${BLUE}🛠️  UTILITÁRIOS BASH${NC} ${YELLOW}(use 'npm run scripts:bash' para mais detalhes)${NC}"
echo -e "  ${GREEN}npm run legenda${NC}            - Legenda de commits git"
echo -e "  ${GREEN}npm run dashboard${NC}          - Dashboard do projeto"
echo -e "  ${GREEN}npm run path${NC}               - Mostra caminhos importantes"
echo -e "  ${GREEN}npm run rows${NC}               - Contagem de linhas de código"
echo -e "  ${GREEN}npm run backup-issues${NC}      - Backup das issues locais"
echo -e "  ${GREEN}npm run validate-issues${NC}    - Valida formato das issues"
echo -e "  ${GREEN}npm run check-bundle${NC}       - Verifica tamanho do bundle"
echo -e "  ${GREEN}npm run check-deps${NC}         - Verifica dependências não utilizadas"
echo -e "  ${GREEN}npm run audit${NC}              - Auditoria de segurança customizada"
echo ""

# FOOTER
echo -e "${BOLD}${CYAN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}💡 Dicas:${NC}"
echo -e "  • ${GREEN}npm run scripts:test${NC} - Documentação detalhada dos testes"
echo -e "  • ${GREEN}npm run scripts:bash${NC} - Documentação dos scripts bash"
echo -e "${BOLD}${CYAN}════════════════════════════════════════════════════════════════${NC}"
echo ""
