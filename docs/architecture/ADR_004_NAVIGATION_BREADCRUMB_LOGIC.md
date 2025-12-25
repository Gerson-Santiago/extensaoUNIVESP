# ADR 004: Lógica de Navegação Hierárquica (Breadcrumb)

## Status
Proposto

## Contexto
A extensão permite navegar para Cursos, Semanas e Atividades.
Atualmente, existe um risco de navegação "órfã": abrir uma atividade diretamente sem garantir que o contexto da Semana (pai) esteja ativo no AVA.
Isso quebra funcionalidades que dependem do DOM da semana para listar ou interagir com atividades.

## Decisão
Adotaremos uma estratégia de **Navegação Hierárquica Estrita (Breadcrumb Logic)** para todas as interações da extensão.

### Regra de Ouro
> **Nenhuma Atividade deve ser aberta sem garantir que sua Semana pai esteja carregada.**

### Estratégia de Implementação

1.  **Navigation Service Único**:
    Centralizar chamadas em `services/NavigationService.js` (ou similar) que abstrai `Tabs.js`.

2.  **Fluxo de Abertura de Atividade**:
    Ao invés de `Tabs.openOrSwitchTo(activityUrl)`, o fluxo será:
    ```javascript
    async function openActivity(weekUrl, activityId) {
      // 1. Garantir Semana
      const tab = await Tabs.openOrSwitchTo(weekUrl);
      
      // 2. Aguardar Carregamento (se necessário)
      
      // 3. Executar Scroll/Highlight na Atividade
      await executeScrollScript(tab.id, activityId);
    }
    ```

3.  **UI de Breadcrumb**:
    A interface da extensão deve refletir essa hierarquia:
    `Curso > Semana X > Atividades`

## Consequências
*   **Positivo**: Garante que scripts de scraping/interação sempre tenham o contexto necessário.
*   **Positivo**: Previne duplicação de abas (contexto é reusado).
*   **Negativo**: Leve aumento na complexidade da função de navegação (requer `await`).

## Ações Técnicas
*   [ ] Refatorar `Tabs.js` para retornar Promise<Tab> (Em andamento).
*   [ ] Criar `NavigationService` para orquestrar essa lógica.
*   [ ] Refatorar `DetailsActivitiesWeekView` para usar esse serviço.
