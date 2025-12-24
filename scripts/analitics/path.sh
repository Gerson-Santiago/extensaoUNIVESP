echo "=========================================="
echo "Análise dos caminhos dos .md
echo "=========================================="
echo ""
find . -type f -name "*.md" | grep -vE "node_modules|coverage|.agent"