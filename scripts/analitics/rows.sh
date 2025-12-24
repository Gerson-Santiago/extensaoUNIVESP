#!/bin/bash

echo "=========================================="
echo "Análise de Tamanho de Arquivos (Quantas linhas)"
echo "=========================================="
echo ""

find . -type f -print0 | \
grep -z -vE "node_modules|coverage|\.git|\.github|\.agent|\.(png|jpg|jpeg|gif|svg|ico|webp)$" | \
xargs -0 wc -l | \
grep -v " total$" | \
sort -n
