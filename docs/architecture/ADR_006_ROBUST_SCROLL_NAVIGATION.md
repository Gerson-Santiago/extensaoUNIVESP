# ADR 006: Robust Scroll Navigation
Status: Aceito | Data: 2025-12-30

Contexto: Elementos carregados via SidePanel nem sempre estavam prontos para scroll.
Decisão: NavigationService com MutationObserver e retry.
Consequências: Navegação contextual estável.
