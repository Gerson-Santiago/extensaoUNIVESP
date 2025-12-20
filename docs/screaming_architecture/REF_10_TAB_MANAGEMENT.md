# Referência 10: Gerenciamento de Abas (Singleton Architecture)

> **Documento**: Arquitetura de Navegação e Tabs
> **Status**: Implementado (v2.6.1)
> **Componente**: `shared/utils/Tabs.js`

## 1. O Problema Arquitetural

Em extensões de navegador focadas em produtividade, a **poluição de contexto** é um problema crítico.
O fluxo padrão da web (`target="_blank"`) incentiva a abertura de novas abas para cada interação. Isso resulta em:
1.  **Dissonância Cognitiva**: O usuário perde a referência de onde estava.
2.  **Consumo de Recursos**: Múltiplas instâncias de SPAs pesadas (AVA, SEI) rodando simultaneamente.
3.  **Estado Fragmentado**: O usuário pode realizar uma ação na "Aba A" esperando refletir na "Aba B" (mesmo site), mas são contextos isolados.

## 2. A Escolha Arquitetural: Singleton Tab Pattern

Decidimos adotar o padrão **Singleton Tab** como regra de navegação para as principais ferramentas da UNIVESP.

### 2.1 Definição
Para cada **Domínio Principal** (AVA, SEI, Portal do Aluno), o sistema garante que **exista no máximo uma aba ativa** (ou conjunto hierárquico).

### 2.2 Por que `shared/utils/Tabs.js`?
Seguindo a **Screaming Architecture**:
- O gerenciamento de abas não pertence a uma Feature específica (ex: não é responsabilidade exclusiva de `courses`).
- É uma **preocupação transversal** (Cross-Cutting Concern) utilizada por:
    - `features/home` (Links rápidos)
    - `features/courses` (Navegação para matérias)
    - `features/import` (Scraping em abas abertas)

Portanto, a lógica reside na camada **Shared Infrastructure** (`shared/utils`).

## 3. Lógica de Decisão

O `Tabs.openOrSwitchTo(url, matchPattern)` implementa uma heurística de decisão em **quatro etapas** para garantir a melhor experiência:

### Prioridade 1: Match Customizado (`matchPattern`)
Se o componente fornece um padrão explícito (ex: `sei.univesp.br`), qualquer aba que contenha esse texto é considerada válida.
*Justificativa*: Resolve problemas de redirecionamento (Login -> Dashboard) em portais complexos como SEI e AVA.

### Prioridade 2: Match de Conteúdo (ID)
Se a URL contém IDs específicos (`course_id`, `content_id`), busca abas com os mesmos IDs.
*Justificativa*: Garante que se o usuário clicou para ver a "Aula 2", ele não seja jogado para a "Aula 1" só porque é o mesmo curso.

### Prioridade 3: Match Exato
Se a URL é idêntica.
*Justificativa*: Precisão máxima.

### Prioridade 4: Match Hierárquico (Prefixo)
Se o usuário pula para uma "parent URL" (app root) e já tem uma "child URL" (detail page) aberta.

## 4. Diagrama de Fluxo

```mermaid
graph TD
    A[Usuário Clica no Link] --> B{URL é nula?}
    B -- Sim --> C[Retorna]
    B -- Não --> D[Busca Abas Abertas]
    
    D --> E{Existe Match Pattern?}
    E -- Sim --> F[Focar Aba (Pattern)]
    E -- Não --> G{Existe Match IDs?}
    
    G -- Sim --> H[Focar Aba (ID)]
    G -- Não --> I{Existe Match Exato?}
    
    I -- Sim --> J[Focar Aba (Exata)]
    I -- Não --> K{Existe Match Prefixo?}
    
    K -- Sim --> J
    K -- Não --> L[Criar Nova Aba]
    
    H & F & J --> M[Focar Janela (chrome.windows)]
```
