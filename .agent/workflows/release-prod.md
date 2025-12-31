---
description: Realiza o merge da dev para main (Release) com verificação de segurança.
---

# 🚀 Workflow: Release para Produção

Este protocolo orquestra a promoção de código da branch de integração (`dev`) para a branch de produção (`main`), garantindo estabilidade e versionamento correto.

## 1. Pré-requisitos de Segurança
O release deve ser iniciado a partir de uma `dev` estável.
- [ ] `git switch dev` && `git pull origin dev`
- [ ] Executar o Quality Gate: `/verificar` (`npm run verify`)

## 2. Preparação da Versão (Protocolo Sincronizado)
Antes do merge, a versão deve ser incrementada de forma consistente em todos os arquivos de manifesto e no histórico.
- Protocolo: `/versionamento`

**Arquivos que devem estar sincronizados:**
- `package.json`
- `manifest.json`
- `CHANGELOG.md`

## 3. Promoção de Código (Merge)
// turbo
```bash
# 1. Preparar main
git switch main
git pull origin main

# 2. Integrar dev (Merge --no-ff para preservar histórico de branch)
git merge dev --no-ff

# 3. Publicar
git push origin main
```

## 4. Marcação de Versão (Git Tag)
// turbo
```bash
# Criar tag anotada com a nova versão
git tag -a vX.Y.Z -m "Release vX.Y.Z: [Resumo das mudanças]"
git push origin vX.Y.Z
```

## 5. Retorno à Base
// turbo
```bash
git switch dev
```

---

## ⛔ Bloqueadores de Release
- Se `npm run verify` falhar em qualquer etapa.
- Se houver divergência entre as versões do `package.json` e `manifest.json`.
- Se o `CHANGELOG.md` não contiver os detalhes da nova versão.
