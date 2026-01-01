---
description: Versionamento + Release dev→main
---

# Release para Produção

Workflow completo de versionamento e merge para produção.

## 1. Versionamento

### Determinar Tipo
- Patch (2.9.6 → 2.9.7): Bugfixes
- Minor (2.9.x → 2.10.0): Features
- Major (2.x.x → 3.0.0): Breaking changes

### Enterprise Protocol (Tripla Sincronização)
Atualizar 3 arquivos obrigatoriamente:

1. package.json → "version": "X.Y.Z"
2. manifest.json → "version": "X.Y.Z"
3. CHANGELOG.md → Seção "Unreleased" → ## [X.Y.Z] - YYYY-MM-DD

### Commit
chore(release): bump version to vX.Y.Z

### Tag Git
git tag -a vX.Y.Z -m "Release vX.Y.Z"
git push origin vX.Y.Z

## 2. Release Produção

### Checklist de Segurança

#### Validar dev
git switch dev && git pull
npm run test:quick

#### Executar Versionamento
Ver seção 1 acima

#### Merge dev → main
git switch main
git pull origin main
git merge dev --no-ff

#### Push & Tags
git push origin main
git push origin tags

## Regras

NUNCA:
- Commitar direto em main
- Pular versionamento
- Fazer fast-forward merge

SEMPRE:
- Passar por dev primeiro
- Tripla sincronização (pkg + manifest + changelog)
- Merge explícito (--no-ff)

Refs: /git-flow, CHANGELOG.md
