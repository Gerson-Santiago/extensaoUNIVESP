# Guia de Verificação - Refatoração UI

A interface foi limpa e as ações de adicionar matérias foram movidas para o **Menu de Configurações** (engrenagem ⚙️).

## 1. Atualizar a Extensão
Recarregue a extensão em `chrome://extensions/` para aplicar as mudanças de estrutura.

## 2. Testar Nova Navegação
1.  Abra o Painel Lateral.
    *   **Verifique**: O formulário de adição manual no rodapé *desapareceu*? A lista deve estar mais limpa.
2.  Clique no ícone de engrenagem (⚙️) no topo direito.
    *   **Verifique**: Um menu dropdown deve aparecer com 3 opções:
        *   Adicionar Manualmente
        *   Adicionar Página Atual
        *   Importação em Lote

## 3. Testar Funcionalidades
### A. Adicionar Manualmente
1.  Clique na opção "Adicionar Manualmente".
2.  Um modal deve abrir.
3.  Preencha Nome e URL.
4.  Clique em Adicionar.
5.  **Verifique**: A matéria aparece na lista.

### B. Adicionar Página Atual
1.  Navegue para uma página qualquer.
2.  No menu, clique em "Adicionar Página Atual".
3.  Aceite a confirmação (`confirm`).
4.  **Verifique**: A página atual é salva na lista.

### C. Importação em Lote
1.  Vá para a página de cursos do AVA.
2.  No menu, clique em "Importação em Lote".
3.  O modal de importação (antigo settings) deve abrir.
4.  Teste o fluxo de escanear e importar.

## Arquitetura Nova
Arquivos criados para organizar o código:
*   `sidepanel/ui/menu.js`
*   `sidepanel/ui/forms/manualForm.js`
*   `sidepanel/ui/forms/batchForm.js`
