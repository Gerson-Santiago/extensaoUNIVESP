# Estudo: Gerenciamento de Abas (Singleton Pattern)

## O Problema
Em fluxos de trabalho comuns, o usuário tende a clicar repetidamente nos mesmos links (ex: "Ir para o AVA", "Abrir SEI"). No comportamento padrão web (`target="_blank"`), isso gera uma poluição de abas, com múltiplas instâncias da mesma página abertas desnecessariamente.

## A Solução: Padrão Singleton Tab
O objetivo é garantir que, para determinada aplicação ou contexto, exista **apenas uma aba aberta**. Se o usuário solicitar a abertura de um link que já está aberto:
1.  O sistema identifica a aba existente.
2.  A aba é trazida para o foco (`active: true`).
3.  A janela que contém a aba é focada (`focused: true`).

## Implementação Técnica

### `shared/utils/Tabs.js`
Utilizamos a API `chrome.tabs` para gerenciar isso.

```javascript
import { Tabs } from '../../shared/utils/Tabs.js';

// Uso Básico
Tabs.openOrSwitchTo('https://ava.univesp.br/');

// Uso com Pattern (Recomendado para Portais)
// Garante foco em qualquer aba do domínio, ignorando caminhos
Tabs.openOrSwitchTo('https://sei.univesp.br/', 'sei.univesp.br');
```

### Estratégias de Match
A decisão ocorre nesta ordem de prioridade:

1.  **Match Customizado (`matchPattern`):** Se fornecido, busca qualquer aba cuja URL contenha esse texto (ou satisfaça a Regex). Ideal para "portais" onde qualquer página interna serve (ex: SEI).
2.  **Match por IDs (Específico):** Se a URL contém IDs (ex: `course_id=_123_1`), busca abas com os mesmos IDs.
3.  **Match Exato:** Busca URL idêntica.
4.  **Match por Prefixo (Hierárquico):** Se pedimos `site.com/app` e temos `site.com/app/pagina`, o sistema foca na aba existente.

## Onde é utilizado
- **Lista de Matérias (`CoursesList`):** Ao clicar em uma matéria.
- **Home Dashboard (`HomeView`):** Links de acesso rápido (AVA, SEI, Provas).
- **Semana (`WeekItem`):** Navegação para semanas do curso.
