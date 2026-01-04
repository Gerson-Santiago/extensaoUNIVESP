# Glossário - Segurança XSS

Versão: v2.11.0
Data: 2026-01-04

----------

## Termos de Segurança

### XSS (Cross-Site Scripting)
Vulnerabilidade de segurança que permite injeção de código malicioso (geralmente JavaScript) em páginas web visualizadas por outros usuários.

### Vetor de Ataque
Método ou caminho usado por um atacante para explorar uma vulnerabilidade no sistema.

### Sanitização
Processo de limpeza e validação de dados de entrada para remover ou neutralizar caracteres perigosos que possam executar código malicioso.

### Escape de HTML
Conversão de caracteres especiais HTML em entidades HTML seguras que são exibidas como texto literal ao invés de serem interpretadas como markup.

### Parser HTML
Componente do navegador que interpreta strings HTML e as transforma em estrutura DOM.

### Manifest V3
Terceira versão da especificação de manifesto para extensões de navegador, com foco em segurança, privacidade e performance.

----------

## APIs do DOM

### innerHTML
Propriedade que define ou retorna o conteúdo HTML de um elemento. Insegura quando usada com dados dinâmicos pois executa o parser HTML.

### textContent
Propriedade que define ou retorna o conteúdo de texto de um elemento, escapando automaticamente todo HTML.

### createElement()
Método que cria um novo elemento HTML através da API do DOM, sem parsing de strings.

### appendChild()
Método que adiciona um Node como último filho de um elemento pai.

### append()
Método moderno que adiciona um ou mais Nodes ou strings como filhos de um elemento.

### replaceChildren()
Método que substitui todos os filhos de um elemento por novos Nodes fornecidos.

### createTextNode()
Método que cria um novo nó de texto contendo o texto especificado, sempre escapado.

### setAttribute()
Método que define o valor de um atributo em um elemento especificado.

----------

## Padrões de Projeto

### Factory Pattern (Padrão de Fábrica)
Padrão de projeto que usa métodos factory para criar objetos sem especificar suas classes exatas. No projeto, usado em `DOMSafe.createElement`.

### DRY (Don't Repeat Yourself)
Princípio que enfatiza a redução de repetição de código através de abstração e centralização de lógica.

### Single Source of Truth (Fonte Única da Verdade)
Prática de estruturar dados e lógica de forma que cada parte do conhecimento tenha uma representação única e autoritativa.

----------

## Termos da Issue-030

### Extreme Safety Standard
Padrão de segurança rigoroso adotado no projeto que visa zero tolerância para vulnerabilidades XSS.

### DOMSafe
Classe utilitária do projeto que centraliza criação segura de elementos DOM com sanitização automática.

### ViewTemplate
Componente responsável por gerar estruturas de UI. Antes retornava strings HTML, agora retorna HTMLElements.

### Acceptance Criteria (Critérios de Aceitação)
Condições que devem ser atendidas para que uma funcionalidade seja considerada completa.

----------

## Protocolos Perigosos

### javascript:
Protocolo de URL que executa código JavaScript quando acessado (ex: `javascript:alert(1)`).

### vbscript:
Protocolo de URL legado que executa VBScript, usado em versões antigas do Internet Explorer.

### data:
Protocolo que permite incorporar dados inline em URLs, pode ser usado para XSS via `data:text/html`.

----------

## Referências

- OWASP XSS Prevention Cheat Sheet
- MDN Web Docs - DOM API
- Manifest V3 - Chrome Extensions Documentation
