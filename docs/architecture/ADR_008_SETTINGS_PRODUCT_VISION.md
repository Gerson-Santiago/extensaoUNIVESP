# ADR-008: Settings Product Vision
**Status**: Aceito (v2.10.x) | **Data**: 2025-12-31

## Problema
Necessidade de hierarquia profissional nas configurações da extensão, organizando funcionalidades de forma intuitiva e segura para os usuários.

## Solução
Estrutura de configurações organizada em **4 blocos principais**:

1. **Preferências**: Customizações visuais não-destrutivas (tema, idioma, notificações)
2. **Comportamento**: Configurações funcionais (auto-refresh, intervalo de sincronização, cache)
3. **Privacidade**: Controles de dados e segurança (telemetria opt-in, compartilhamento de dados anônimos, logs de debug)
4. **Sobre**: Informações e ações administrativas (versão, créditos, licenças, ações destrutivas como limpar cache/reset)

Isolamento de ações destrutivas na seção "Sobre" para evitar cliques acidentais.

## Trade-offs
- ✅ **Benefícios**: UX previsível com agrupamento lógico, isolamento de ações destrutivas, facilita expansão futura sem poluir interface
- ⚠️ **Riscos**: Requer mais navegação para acessar configurações específicas (mitigado por implementar busca/filtro dentro das configurações)

## Refs
- [ADR-000](ADR_000_FUNDAMENTALS.md) - Screaming Architecture (features gritam propósito)
- Issues: v2.10.x relacionadas a Settings UI

