echo "=========================================="
echo "Análise dos caminhos dos .md"
echo "=========================================="
echo ""
find "$(git rev-parse --show-toplevel)" -type d \( -name "node_modules" -o -name "coverage" \) -prune -o -name "*.md" -print | sort
