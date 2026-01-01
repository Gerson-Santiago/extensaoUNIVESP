# ADR 005: Observability Logger
Status: Aceito | Data: 2025-12-30

Contexto: console.log poluía produção e dificultava auditoria.
Decisão: Centralização em shared/utils/Logger.js.
Consequências: Logs estruturados e controle via UNIVESP_DEBUG.
