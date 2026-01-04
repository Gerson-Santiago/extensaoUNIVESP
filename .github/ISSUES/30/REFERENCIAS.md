# Referências Externas - Issue-030

Este documento lista todos os arquivos relacionados à Issue-030 que estão em outros diretórios do projeto.

----------

## Especificações (docs/specs/)

### SPEC-001_dom-safe-refactor.md
Localização: `docs/specs/SPEC-001_dom-safe-refactor.md`
Conteúdo: Especificação técnica detalhada do refactor DOMSafe
Relacionamento: Implementação técnica da Issue-030

### SPEC-003_content-script-security.md
Localização: `docs/specs/SPEC-003_content-script-security.md`
Conteúdo: Segurança de content scripts contra XSS
Relacionamento: Aplicação dos princípios da Issue-030 em content scripts

----------

## Decisões Arquiteturais (docs/architecture/)

### ADR_012_SECURITY_FIRST.md
Localização: `docs/architecture/ADR_012_SECURITY_FIRST.md`
Conteúdo: Princípio Security-First Development
Relacionamento: Fundamentação filosófica da Issue-030

### ADR_017_DOM_FACTORY_PATTERN.md
Localização: `docs/architecture/ADR_017_DOM_FACTORY_PATTERN.md`
Conteúdo: Decisão de usar Factory Pattern para DOMSafe
Relacionamento: Padrão arquitetural central da Issue-030

----------

## Épicos (docs/specs/)

### EPIC-001_security-mv3-compliance.md
Localização: `docs/specs/EPIC-001_security-mv3-compliance.md`
Conteúdo: Epic de segurança e compliance Manifest V3
Relacionamento: Issue-030 é parte deste epic

### EPIC-003_prelaunch-compliance.md
Localização: `docs/specs/EPIC-003_prelaunch-compliance.md`
Conteúdo: Epic de compliance pré-lançamento
Relacionamento: Validação de segurança XSS para lançamento

----------

## Outros Documentos (docs/)

### ANTI_PADROES.md
Localização: `docs/ANTI_PADROES.md`
Conteúdo: Lista de anti-padrões proibidos no projeto
Relacionamento: innerHTML listado como anti-padrão crítico

### JSDOC_BEST_PRACTICES.md
Localização: `docs/standards/JSDOC_BEST_PRACTICES.md`
Conteúdo: Melhores práticas de documentação JSDoc
Relacionamento: Tipagem e documentação de DOMSafe

----------

## Código Fonte Principal

### shared/utils/DOMSafe.js
Localização: `shared/utils/DOMSafe.js`
Conteúdo: Implementação da classe DOMSafe
Relacionamento: Implementação principal da Issue-030

### tests/unit/shared/utils/DOMSafe.test.js
Localização: `tests/unit/shared/utils/DOMSafe.test.js`
Conteúdo: Testes unitários de segurança XSS
Relacionamento: Validação da implementação DOMSafe

----------

## Como Acessar

Todos os caminhos são relativos à raiz do projeto: `/home/sant/extensaoUNIVESP/`

Exemplo:
```bash
# Ver ADR-017
cat docs/architecture/ADR_017_DOM_FACTORY_PATTERN.md

# Ver implementação DOMSafe
cat shared/utils/DOMSafe.js

# Ver testes
cat tests/unit/shared/utils/DOMSafe.test.js
```

----------

Mantido por: Equipe de Arquitetura
Última Atualização: 2026-01-04
