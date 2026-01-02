# ISSUE: Ciclo de Vida dos Navigation Chips (v2.9.1 Bug)

**Status:** Aberto | **Gravidade:** Média | **Contexto:** UX / Navegação

### 🎯 O Bug
Os Navigation Chips na `DetailsActivitiesWeekView` não mantêm a persistência e o comportamento esperado de "histórico recente". 

**Causa Raiz:**
1. **Identificação Frágil:** O `courseId` usado como chave no storage flutua entre `id` real e `courseName`, gerando históricos fragmentados.
2. **Contexto Volátil:** O `ChipsManager` vive dentro da View. Ao alternar entre semanas, o estado muitas vezes não sobrevive à destruição/recriação do componente.
3. **Redundância de Navegação:** O sistema muitas vezes tenta re-abrir abas que já estão abertas via `Tabs.js`, sem sincronizar o estado visual do chip com a aba ativa.

### 💡 O que ganharemos corrigindo?
- **Navegação "Instantânea"**: O aluno pode saltar entre Semana 1, 2 e 5 sem ter que voltar para a Home.
- **Memória de Longo Prazo**: Se o aluno fechar a extensão e abrir de novo, os chips dos últimos acessos daquela matéria estarão lá.

### 🚀 Sugestão de "Outra Forma" (v3.0.0 - O Chip Musculoso)
- **Navegação Sincronizada (Bidirecional)**: O Chip não apenas abre a aba; ele "move" a extensão para a view correta. Ao clicar num chip de "Inglês - Semana 2", a extensão troca seu estado interno para exibir as atividades daquela semana, enquanto o Chrome foca na aba correspondente.
- **Abas Ativas como Fonte**: Em vez de um histórico manual, os chips representam as **Abas do AVA abertas agora**.
- **Persistent Store Manager**: Retirar a lógica do `HistoryService` de dentro da View e movê-la para um `BackgroundService`.

### 🛡️ Segurança (Issue-028)
- Ao persistir histórico de navegação, usar **versionamento** para evitar race conditions entre múltiplas janelas/dispositivos.

---
*Relacionado ao Débito Técnico: [Breadcrumb como Estado Global](../TECH_DEBT/TECH_DEBT-breadcrumb-estado-global.md)*
