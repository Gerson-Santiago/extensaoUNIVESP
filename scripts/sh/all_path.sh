#!/bin/bash
find . -name "*.md" -not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/.agent/*" -not -path "*/.cache/*" | sort
