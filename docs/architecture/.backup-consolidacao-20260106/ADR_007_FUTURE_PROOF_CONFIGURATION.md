# ADR 007: Future Proof Configuration
Status: Aceito | Data: 2025-12-31

## Contexto
Configurações voláteis entre dispositivos do usuário. `chrome.storage.local` persistia apenas no device atual; `chrome.storage.sync` tinha quota limitada (100KB total, 8KB por item).

## Decisão
Estratégia híbrida baseada no volume de dados:
- **Sync storage**: Preferências e configurações pequenas (<5KB)
  - Tema, idioma, flags de feature
  - Sincroniza entre dispositivos do usuário
- **Local storage**: Dados volumosos (cache, atividades)
  - Cache de cursos, progresso de leitura
  - Específico por dispositivo

Serviços recebem configuração de storage via injeção (ADR-006).

## Consequências
- **Positivo**: UX consistente entre dispositivos (preferências)
- **Positivo**: Respeita quotas do Chrome
- **Negativo**: Complexidade de gerenciar 2 storages
- **Mitigação**: Abstração em `StorageService` para isolar lógica

## Relacionado
- `shared/services/StorageService.js` (abstração planejada)
- ADR-006 (Configuração injetável)
- Chrome Storage Quotas: https://developer.chrome.com/docs/extensions/reference/storage/
