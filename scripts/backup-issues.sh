#!/bin/bash

TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR="backups/issues"
BACKUP_FILE="issues_${TIMESTAMP}.tar.gz"

# Cria diretório se não existir
mkdir -p "$BACKUP_DIR"

echo "💾 Criando backup de issues..."
echo ""

# Cria backup
tar -czf "${BACKUP_DIR}/${BACKUP_FILE}" .github/issues/ 2>/dev/null

if [ $? -eq 0 ]; then
  SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_FILE}" | cut -f1)
  echo "✅ Backup criado com sucesso!"
  echo ""
  echo "📁 Arquivo: ${BACKUP_FILE}"
  echo "📊 Tamanho: ${SIZE}"
  echo "📂 Local: ${BACKUP_DIR}/"
  
  # Lista backups existentes
  echo ""
  echo "📋 Backups existentes:"
  ls -lht "$BACKUP_DIR" | tail -n +2 | head -5 | \
    awk '{printf "   %s %s  %s\n", $6, $7, $9}'
  
  # Avisa se tiver muitos backups
  COUNT=$(ls -1 "$BACKUP_DIR" | wc -l)
  if [ $COUNT -gt 10 ]; then
    echo ""
    echo "💡 Dica: Você tem $COUNT backups. Considere limpar os antigos."
  fi
else
  echo "❌ Erro ao criar backup"
  exit 1
fi
