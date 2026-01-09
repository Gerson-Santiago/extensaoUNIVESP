#!/bin/bash

echo "🔍 Auditando Dependências Não Usadas..."
echo ""
echo "⚠️  Nota: Depcheck tem limitações:"
echo "   - Não detecta uso em configs (.mjs, .json)"
echo "   - Não detecta uso em npm scripts"
echo "   - Não detecta uso em setupFiles"
echo ""

# Ignora dependências que SÃO usadas mas depcheck não detecta
# (usadas em configs de ferramentas, não em imports)
npx depcheck \
  --ignores="@types/*,husky,eslint*,prettier,@eslint/*,@commitlint/*,@secretlint/*,babel-jest,jest-environment-jsdom,jest-webextension-mock" \
  --skip-missing

echo ""
echo "💡 Para remover dependências não usadas:"
echo "   npm uninstall <package-name>"
