#!/bin/bash

# clean-all.sh
# Script para limpar completamente todas as pastas temporárias e de build do projeto.
# Use com cuidado, pois exigirá 'npm install' novamente após a execução.

echo "🧹 [CLEAN] Iniciando limpeza profunda do projeto..."

# 1. node_modules (Dependências)
if [ -d "node_modules" ]; then
    echo "🗑️  Removendo node_modules/..."
    rm -rf node_modules
else
    echo "⏭️  node_modules/ não encontrado, pulando."
fi

# 2. dist (Build)
if [ -d "dist" ]; then
    echo "🗑️  Removendo dist/..."
    rm -rf dist
else
    echo "⏭️  dist/ não encontrado, pulando."
fi

# 3. coverage (Relatório de Testes)
if [ -d "coverage" ]; then
    echo "🗑️  Removendo coverage/..."
    rm -rf coverage
else
    echo "⏭️  coverage/ não encontrado, pulando."
fi

# 4. .cache (Caches do ESLint/Prettier/Jest)
if [ -d ".cache" ]; then
    echo "🗑️  Removendo .cache/..."
    rm -rf .cache
else
    echo "⏭️  .cache/ não encontrado, pulando."
fi

# 5. Arquivos ZIP de distribuição antigos
echo "🗑️  Procurando e removendo arquivos .zip na raiz..."
find . -maxdepth 1 -name "*.zip" -type f -delete

echo "✨ [SUCESSO] Limpeza completa! O projeto está zerado."

# 6. node_modules (Dependências)
npm install

echo "✨ [SUCESSO] Instalação de dependências concluída."
