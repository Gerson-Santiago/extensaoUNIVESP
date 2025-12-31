---
description: Workflow para bump de versão consistente em todos os arquivos (Enterprise Protocol)
---

# 🔢 Protocolo: Versionamento Unificado

Garante que a extensão e o ecossistema npm compartilhem a mesma versão, mantendo o histórico de mudanças (`CHANGELOG.md`) sincronizado.

## ⚠️ MANDATO DE CONSISTÊNCIA
A versão **DEVE** ser exatamente a mesma em:
1. `package.json` (Node/npm)
2. `manifest.json` (Chrome Extension)
3. `CHANGELOG.md` (Release Notes)

## 1. Definição do Tipo de Bump (SemVer)
- **PATCH** (`2.9.x`): Correções de bugs.
- **MINOR** (`2.10.x`): Novas features não-destrutivas.
- **MAJOR** (`3.x.x`): Mudanças arquiteturais ou breaking changes.

## 2. Execução do Bump
// turbo
```bash
# Atualiza package.json sem criar commit automático
npm version [patch|minor|major] --no-git-tag-version
```

## 3. Sincronização de Manifest
Abra o `manifest.json` e iguale a versão com a do `package.json`.

## 4. Registro Histórico (CHANGELOG)
Adicione a nova versão e a data atual no topo do `CHANGELOG.md`.
```markdown
## [X.Y.Z] - YYYY-MM-DD
### 🎉 Adicionado
...
### 🐛 Corrigido
...
```

## 5. Script de Verificação de Integridade
// turbo
```bash
# Valida se os artefatos estão em sincronia
PACKAGE_V=$(node -p "require('./package.json').version")
MANIFEST_V=$(node -p "require('./manifest.json').version")

if [ "$PACKAGE_V" != "$MANIFEST_V" ]; then
  echo "❌ ERRO CRÍTICO: DIVERGÊNCIA DE VERSÃO"
  exit 1
else
  echo "✅ VERSÃO SINCRONIZADA: $PACKAGE_V"
fi
```

## 🔗 Próximo Passo
Após versionar, prossiga para a finalização do release: `/release-prod`
