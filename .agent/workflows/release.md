description: Versionamento + Release dev→main

RELEASE PARA PRODUÇÃO

1. VERSIONAMENTO

Determinar:
- Patch (2.9.6 → 2.9.7): Bugfixes
- Minor (2.9.x → 2.10.0): Features
- Major (2.x.x → 3.0.0): Breaking

Enterprise Protocol (Tripla Sincronização):
1. package.json → "version": "X.Y.Z"
2. manifest.json → "version": "X.Y.Z"
3. CHANGELOG.md → Unreleased → [X.Y.Z] - YYYY-MM-DD

Commit: chore(release): bump version to vX.Y.Z

Tag: git tag -a vX.Y.Z -m "Release vX.Y.Z"
     git push origin vX.Y.Z

2. RELEASE PRODUÇÃO

Checklist:
1. Validar dev:
   git switch dev && git pull
   npm run test:quick

2. Executar Versionamento (ver seção 1)

3. Merge dev → main:
   git switch main
   git pull origin main
   git merge dev --no-ff

4. Push:
   git push origin main
   git push origin tags

REGRAS:
NUNCA: Commit direto em main, pular versionamento, fast-forward
SEMPRE: Via dev, tripla sincronização, --no-ff

Refs: /git-flow, CHANGELOG.md
