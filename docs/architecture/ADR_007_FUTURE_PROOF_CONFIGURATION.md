# ADR-007: Future Proof Configuration
**Status**: Aceito | **Data**: 2025-12-31

## Problema
Configurações voláteis entre dispositivos do usuário. `chrome.storage.local` persistia apenas no device atual; `chrome.storage.sync` tinha quota limitada (100KB total, 8KB por item).

## Solução
Estratégia híbrida baseada no volume de dados:

**Sync storage** (preferências pequenas <5KB):
- Tema, idioma, flags de feature
- Sincroniza entre dispositivos do usuário

**Local storage** (dados volumosos):
- Cache de cursos, progresso de leitura
- Específico por dispositivo

Serviços recebem configuração de storage via injeção de dependência.

## Trade-offs
- ✅ **Benefícios**: UX consistente entre dispositivos (preferências), respeita quotas do Chrome
- ⚠️ **Riscos**: Complexidade de gerenciar 2 storages (mitigado por abstração futura em `StorageService`)

## Refs
- [ADR-009](ADR_009_SECURITY_COMPLIANCE.md) - Restrições de quota MV3
- `shared/services/StorageService.js` (abstração planejada)
- [Chrome Storage Quotas](https://developer.chrome.com/docs/extensions/reference/storage/)

