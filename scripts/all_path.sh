#!/bin/bash
find . -name "*.md" -not -path "*/node_modules/*" | sort
