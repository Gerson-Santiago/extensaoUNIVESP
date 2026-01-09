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
echo -e "${BOLD}${CYAN}   🧪 Scripts de Teste - Central UNIVESP${NC}"
echo -e "${BOLD}${CYAN}════════════════════════════════════════════════════════════════${NC}"
echo ""

# PRINCIPAIS
echo -e "${BOLD}${BLUE}📌 COMANDOS PRINCIPAIS${NC}"
echo -e "  ${GREEN}npm run test${NC}              - Executa todos os testes (padrão Jest)"
echo -e "  ${GREEN}npm run test:coverage${NC}     - Gera relatório de cobertura"
echo -e "  ${GREEN}npm run test:watch${NC}        - Modo watch (re-executa ao salvar)"
echo -e "  ${GREEN}npm run test:save${NC}         - Salva snapshot de cobertura"
echo ""

# MODOS DE EXECUÇÃO
echo -e "${BOLD}${BLUE}⚙️  MODOS DE EXECUÇÃO${NC}"
echo -e "  ${GREEN}npm run test:quick${NC}        - Apenas testes que falharam (--onlyFailures)"
echo -e "  ${GREEN}npm run test:debug${NC}        - Debug com verbose e detecção de handles"
echo -e "  ${GREEN}npm run test:stable${NC}       - Execução serial sem cache (--runInBand)"
echo -e "  ${GREEN}npm run test:ci${NC}           - Modo CI com coverage e serial"
echo -e "  ${GREEN}npm run test:list${NC}         - Lista todos os arquivos de teste"
echo ""

# POR TIPO
echo -e "${BOLD}${BLUE}📂 TESTES POR TIPO${NC}"
echo -e "  ${GREEN}npm run test:unit${NC}         - Apenas testes unitários (exclui integration/)"
echo -e "  ${GREEN}npm run test:integration${NC}  - Apenas testes de integração"
echo ""

# POR FEATURE
echo -e "${BOLD}${BLUE}🎯 TESTES POR FEATURE${NC}"
echo -e "  ${GREEN}npm run test:courses${NC}      - Testes da feature de cursos"
echo -e "  ${GREEN}npm run test:feedback${NC}     - Testes da feature de feedback"
echo -e "  ${GREEN}npm run test:home${NC}         - Testes da feature home"
echo -e "  ${GREEN}npm run test:session${NC}      - Testes da feature de sessão"
echo -e "  ${GREEN}npm run test:settings${NC}     - Testes da feature de configurações"
echo -e "  ${GREEN}npm run test:shared${NC}       - Testes de componentes compartilhados"
echo ""

# TESTES COMPLEXOS
echo -e "${BOLD}${BLUE}🔥 TESTES COMPLEXOS${NC}"
echo -e "  ${GREEN}npm run test:details-complex${NC}"
echo -e "    - Testes das views/services complexos de atividades semanais"
echo ""

# EXEMPLOS DE USO
echo -e "${BOLD}${CYAN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}${MAGENTA}💡 EXEMPLOS DE USO${NC}"
echo ""
echo -e "${YELLOW}Desenvolvimento rápido:${NC}"
echo -e "  ${GREEN}npm run test:watch${NC}  # Re-executa ao salvar arquivos"
echo ""
echo -e "${YELLOW}Debugar testes falhando:${NC}"
echo -e "  ${GREEN}npm run test:quick${NC}  # Executa só os que falharam"
echo -e "  ${GREEN}npm run test:debug${NC}  # Com verbose e detecção de problemas"
echo ""
echo -e "${YELLOW}Verificar feature específica:${NC}"
echo -e "  ${GREEN}npm run test:courses${NC}  # Só testes de cursos"
echo ""
echo -e "${YELLOW}Antes de commit/PR:${NC}"
echo -e "  ${GREEN}npm run verify${NC}  # Testes + lint + type-check completo"
echo ""
echo -e "${BOLD}${CYAN}════════════════════════════════════════════════════════════════${NC}"
echo ""
