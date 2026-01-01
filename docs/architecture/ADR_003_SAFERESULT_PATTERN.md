# ADR 003: SafeResult Pattern
Status: Aceito | Data: 2025-12-29

Contexto: try/catch dispersos e retornos ambíguos.
Decisão: Usar trySafe() para normalizar retornos {success, data, error}.
Consequências: Contratos explícitos e tratamento de erro obrigatório.
