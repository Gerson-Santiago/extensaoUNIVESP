grep -RIn \
  --exclude-dir=node_modules \
  --exclude-dir=coverage \
  --exclude-dir=.git \
  --exclude-dir=.github \
  --exclude-dir=dist \
  --exclude-dir=build \
  --exclude-dir=.vscode \
  --exclude-dir=.husky \
  --exclude-dir=.cache \
  --exclude-dir=.agent \
  --exclude-dir=docs \
  --exclude-dir=tests \
  --exclude-dir=__tests__ \
  --exclude=*.md \
  --exclude=*.log \
  -E '\b(console\.(log|error|warn|info|debug)|logger\.(log|error|warn|info|debug))\b' \
  .
