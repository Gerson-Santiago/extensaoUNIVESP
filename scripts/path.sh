#!/bin/bash
echo "=========================================="
echo "Análise dos caminhos dos .md"
echo "=========================================="
echo ""
find "$(git rev-parse --show-toplevel)" -type f -name "*.md" | grep -vE "node_modules|coverage|.agent"