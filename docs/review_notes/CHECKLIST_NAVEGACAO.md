# Checklist de Revisão: Navegação (Mini Testes)

Cenários criados para validar a robustez do novo sistema de Navegação Hierárquica e Breadcrumb.

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
