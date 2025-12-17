# Log de Investigação - Agente "FBI"

## Objetivo
Identificar o comportamento exato do scroll na página de Cursos da UNIVESP/Blackboard.

## Suspeitas Iniciais
1.  O container de scroll não é `window`.
2.  O carregamento pode ser bloqueado por CORS se tentarmos ler iframes errados.
3.  A contagem de elementos pode variar dinamicamente.

## Dados Coletados (Schema)
Durante a execução, o script deve reportar:
-   [ ] Quem tem `scrollHeight > clientHeight`?
-   [ ] Qual a posição inicial (`scrollTop`)?
-   [ ] APÓS o comando de scroll, a posição mudou de verdade?
-   [ ] Quantos itens `.course-element-card` existem antes e depois?
-   [ ] Existem iframes na página? Quantos?
