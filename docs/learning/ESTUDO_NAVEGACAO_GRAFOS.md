# Estudo: Análise de Navegação e Grafos de Estado

## 1. Visão Geral
Este documento mapeia o fluxo de navegação da extensão e sua interação com o DOM do AVA (Blackboard). O objetivo é identificar "Dead Ends" (becos sem saída), "Loops" (recargas infinitas) e problemas de sincronia.

## 2. Grafo de Navegação (Extension vs Browser)

O diagrama abaixo ilustra como a Extensão "empurra" o estado do Navegador, mas o Navegador raramente atualiza a Extensão (Flow Unidirecional).

```mermaid
graph TD
    subgraph Extension[Extensão (Popup/Sidepanel)]
        Home[Home View] -->|Click Matéria| CourseView[Course View]
        CourseView -->|Click Semana| WeekView[Week Activities View]
        WeekView -->|Click 'Ir'| ActionScroll[Action: Open & Scroll]
    end

    subgraph Browser[Navegador (Chrome Tabs)]
        TabHome[Aba: Portal/Home]
        TabCourse[Aba: Curso (Ultra/Content)]
        TabWeek[Aba: Conteúdo da Semana]
    end

    %% Transições
    Home -->|Tabs.openOrSwitchTo| TabHome
    Home -->|Tabs.openOrSwitchTo| TabCourse
    
    CourseView -->|Tabs.openOrSwitchTo| TabCourse
    
    WeekView -->|NavigationService.openActivity| TabWeek
    
    %% O problema da Sincronia
    TabWeek -.->|Navegação Manual (Voltar)| TabCourse
    TabCourse -.->|X Sem feedback| Extension
```

### 2.1. Pontos de Sincronia (Sync Points)

| Ação na Extensão | Ação no Navegador | Sincronia | Obs |
| :--- | :--- | :--- | :--- |
| **Abrir Matéria** | Abre/Foca aba do Curso | ✅ Forçada | Se aba existir, reusa. Se não, cria. |
| **Abrir Semana** | Abre/Foca aba da Semana | ✅ Forçada | ID da semana é usado para match. |
| **Clicar 'Ir'** | Abre Semana + Scroll | ✅ Forçada | Usa `NavigationService` para garantir contexto pai. |
| **Navegação Manual** (Browser) | Nada acontece na Extensão | ❌ Nenhuma | Extensão mantém estado anterior. |

## 3. Matriz de Verificação (Mini Testes)

Cenários para validar a robustez da navegação:

### Grupo A: Fluxo Feliz (Happy Path)
- [ ] **A1. Home -> Curso -> Semana:** Começar na Home da extensão, clicar numa matéria, depois numa semana. 
    - *Esperado:* Aba do navegador muda para a URL da semana correta.
- [ ] **A2. Scroll Deep-Link:** Dentro de uma semana na extensão, clicar no botão "Ir" de um vídeo.
    - *Esperado:* Aba foca, carrega (se precisar) e rola suavemente até o vídeo.

### Grupo B: Resiliência (Chaos Links)
- [ ] **B1. Aba Fechada:** Usuário fecha a aba do AVA manualmente. Na extensão, clica em "Ir".
    - *Esperado:* Extensão abre NOVA aba, faz login (ou espera), e rola até o item.
- [ ] **B2. Aba em Outra Semana:** Navegador está na Semana 1. Extensão está na Semana 2. Clica "Ir" na Semana 2.
    - *Esperado:* Navegador navega para Semana 2 e faz o scroll. (Não deve tentar scrollar na Semana 1).

### Grupo C: Edge Cases (Onde quebrava antes)
- [ ] **C1. Recarregar (F5) na Extensão:** Recarregar a extensão. O estado volta para Home ou persiste? 
    - *Atual:* Volta para Home (React state reset).
- [ ] **C2. Loop do 'Ir':** Clicar em "Ir". Depois clicar em "Ir" de novo no mesmo item.
    - *Esperado:* Não deve recarregar a página (Flash), apenas focar e rolar.

## 4. Conclusão do Estudo
Atualmente, adotamos uma estratégia **"Extension-Driver"** (Extensão como Piloto). A extensão manda, o navegador obedece. 
Para resolver a "falta de sincronia" visualizada no ponto 2.1 (Navegação Manual), precisaríamos injetar um *Content Script* observador que enviasse mensagens `chrome.runtime.sendMessage` para a extensão atualizar seu estado React.
-> Dado a instabilidade do DOM do AVA, isso é considerado **Alto Risco** por enquanto. A estratégia atual é segura e previsível.
