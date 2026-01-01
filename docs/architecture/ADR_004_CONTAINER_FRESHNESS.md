# ADR 004: Container Freshness
Status: Aceito | Data: 2025-12-30

Contexto: Cache de elementos DOM gerava "Zombie DOM" após navegação.
Decisão: Sempre recriar renderers com containers novos. Proibido cachear referências a elementos em instâncias de view.
Consequências: Elimina bugs de renderização órfã.
