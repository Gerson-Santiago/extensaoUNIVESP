# ADR 007: Navegação Robusta com MutationObserver e Seletores Dinâmicos

## Status
Aceito

## Contexto
A funcionalidade de navegação direta para atividades ("Ir") na view de Detalhes da Semana apresentava falhas intermitentes. O AVA frequentemente carrega conteúdo de forma assíncrona (lazy loading) ou altera IDs dinamicamente, fazendo com que a lógica anterior baseada em `setTimeout` fixo falhasse em localizar o elemento alvo, frustrando o usuário.

Além disso, os IDs das atividades apresentavam variações de prefixo (`contentListItem:` vs ID curto), o que exigia uma estratégia de seleção mais flexível.

## Decisão
Decidimos refatorar o `NavigationService` para adotar uma abordagem reativa e resiliente:

1.  **Uso de MutationObserver**: Em vez de polling ou timeouts fixos, injetamos um script que instancia um `MutationObserver`. Se o elemento não for encontrado imediatamente, o observer monitora o DOM por até 10 segundos, reagindo instantaneamente assim que o nó alvo é inserido na árvore.
2.  **Estratégia de Seletores Híbrida**: O serviço agora tenta localizar o elemento usando uma cascata de seletores:
    *   ID Exato Completo (`contentListItem:12345`)
    *   ID Curto (`12345`)
    *   Query Selector com `startsWith` ou `contains` para o ID Curto.
3.  **Feedback Visual Aprimorado**: Implementamos um highlight visual (fundo amarelo e borda dourada) com transição suave para garantir que o usuário identifique o foco, mesmo em páginas densas.

## Consequências
### Positivas
*   **Confiabilidade**: A taxa de sucesso na navegação aumenta drasticamente, eliminando falhas por lentidão de rede ou renderização do AVA.
*   **UX Superior**: O usuário recebe feedback visual claro do item encontrado.
*   **Resiliência**: A extensão tolera mudanças sutis na estrutura de IDs do AVA sem quebrar.

### Negativas
*   **Execução de Script**: A lógica injetada é levemente mais complexa do que um simples `scrollIntoView`.
*   **Latência Potencial**: Em casos de falha real (item não existente), o script mantém o observer ativo por 10 segundos antes de desistir, o que é um timeout seguro, mas maior que o anterior.

## Data
2025-12-29
