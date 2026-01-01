# ADR 002: BatchScraper Architecture
Status: Aceito (v2.8.x) | Data: 2025-12-27

Contexto: Manifest V3 proíbe imports em scripts injetados.
Decisão: BatchScraper como monolito funcional auto-contido.
Consequências: Funciona sem build/bundler; requer duplicação de helpers.
