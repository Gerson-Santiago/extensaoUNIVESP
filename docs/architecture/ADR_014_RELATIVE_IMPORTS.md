# ADR 014: Relative Imports Standard
Status: Aceito | Data: 2026-01-02

## Contexto
Imports absolutos (baseados em root do projeto) quebram quando a estrutura de pastas é reorganizada. Em projetos com Screaming Architecture (ADR-000-A), features são movidas frequentemente para manter coesão.

Problema com imports absolutos:
```javascript
// ❌ Import absoluto quebra ao mover feature
import { Logger } from 'shared/utils/Logger.js';
// Se movermos a feature para outro nível, precisa atualizar todos imports
```

VIS_MANIFESTO.md define "Relativo é Lei" mas decisão não estava formalizada em ADR.

## Decisão
**Regra obrigatória**: Sempre usar imports relativos em todos os arquivos do projeto.

```javascript
// ✅ Import relativo (resiliente a refatoração)
import { Logger } from '../../shared/utils/Logger.js';
import { SafeResult } from '../../../shared/utils/ErrorHandler.js';
```

**Exceção**: Nenhuma. Mesmo em `shared/` usamos relativos.

### Benefícios Técnicos
1. **Refatoração segura**: IDEs atualizam paths automaticamente
2. **Portabilidade**: Subdiretórios podem virar pacotes npm sem quebrar
3. **Build-free**: Não precisamos de bundler para resolver aliases
4. **Screaming Architecture**: Reforça isolamento de features (imports mostram distância arquitetural)

### VSCode Auto-complete
Editor sugere paths relativos automaticamente ao digitar `import`:
```json
// .vscode/settings.json
{
  "javascript.preferences.importModuleSpecifier": "relative"
}
```

## Consequências
- **Positivo**: Refatoração de estrutura não quebra imports
- **Positivo**: Features são portáveis (podem virar npm packages)
- **Positivo**: Alinha com ES Modules padrão (sem build step)
- **Negativo**: Verbosidade em arquivos profundamente aninhados (`../../../`)
- **Negativo**: Menos legível que aliases (`@shared/utils`)
- **Mitigação**: Estrutura rasa (max 3 níveis) minimiza `../` aninhados

## Relacionado
- ADR-000-A (Screaming Architecture depende de imports resilientes)
- VIS_MANIFESTO.md (pilar "Relativo é Lei")
- `.vscode/settings.json` (configuração de IDE)
