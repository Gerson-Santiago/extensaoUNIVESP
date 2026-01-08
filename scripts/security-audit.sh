#!/bin/bash

echo "🛡️ Auditoria de Segurança..."
echo ""

ERRORS=0

# 1. NPM Audit
echo "1️⃣ Verificando vulnerabilidades npm..."
if npm audit --audit-level=moderate > /dev/null 2>&1; then
  echo "   ✅ Sem vulnerabilidades"
else
  echo "   ❌ Vulnerabilidades encontradas!"
  npm audit --audit-level=moderate
  ERRORS=$((ERRORS + 1))
fi

# 2. innerHTML Check
echo ""
echo "2️⃣ Verificando innerHTML..."
INNER_HTML=$(grep -rn "\.innerHTML\s*=" \
  --include="*.js" \
  --exclude-dir=node_modules \
  --exclude-dir=dist \
  --exclude-dir=tests \
  . | grep -v "DOMSafe" | grep -v "test.js" || true)

if [ -n "$INNER_HTML" ]; then
  echo "   ⚠️  innerHTML encontrado (verificar XSS):"
  echo "$INNER_HTML"
  ERRORS=$((ERRORS + 1))
else
  echo "   ✅ Sem innerHTML direto"
fi

# 3. eval() Check
echo ""
echo "3️⃣ Verificando eval/Function..."
if grep -rn "\beval\(" \
  --include="*.js" \
  --exclude-dir=node_modules \
  --exclude-dir=dist \
  --exclude-dir=tests \
  . > /dev/null 2>&1; then
  echo "   ❌ eval() encontrado (proibido MV3)!"
  grep -rn "\beval\(" --include="*.js" --exclude-dir=node_modules --exclude-dir=dist .
  ERRORS=$((ERRORS + 1))
else
  echo "   ✅ Sem eval()"
fi

# 4. External URLs
echo ""
echo "4️⃣ Verificando URLs externas..."
URLS=$(grep -rohn "https\?://[^'\"]*" \
  --include="*.js" \
  --exclude-dir=node_modules \
  --exclude-dir=dist \
  --exclude-dir=tests \
  features/ shared/ 2>/dev/null | \
  grep -v "ava.univesp.br" | grep -v "sei.univesp.br" || true)

if [ -n "$URLS" ]; then
  echo "   ⚠️  URLs externas encontradas:"
  echo "$URLS" | sort -u | head -10
else
  echo "   ✅ Sem URLs externas"
fi

# 5. CSP Validation
echo ""
echo "5️⃣ Validando CSP no manifest..."
if grep -q "script-src 'self'" manifest.json; then
  echo "   ✅ CSP configurado"
else
  echo "   ⚠️  CSP pode estar incorreto"
fi

# Resultado
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $ERRORS -eq 0 ]; then
  echo "✅ Auditoria de segurança passou!"
  exit 0
else
  echo "❌ Encontrados $ERRORS problemas de segurança"
  exit 1
fi
