# Guia de Verificação - Navegação e Layout

A interface agora possui uma **Barra de Navegação Superior** persistente.

## 1. Atualizar a Extensão
Recarregue a extensão em `chrome://extensions/`.

## 2. Testar Navegação Principal
*   **🏠 Home**: Deve mostrar a tela de Dashboard (Acesso Rápido + Configurações).
*   **🎓 Matérias**: Deve mostrar a lista de matérias salvas.
*   **⚙️ Configurações**: Deve abrir o menu dropdown de ações (Adicionar, Batch, etc).

## 3. Testar Funcionalidades por Tela

### Tela Home (Dashboard)
1.  **Acesso Rápido**: Clique nos links (SEI, AVA) e verifique se abrem.
2.  **Configurar Acesso**:
    *   Preencha um RA (ex: `2200123`).
    *   Clique em Salvar.
    *   Mensagem de sucesso deve aparecer.
    *   Recarregue a extensão e verifique se o RA persiste.

### Tela Matérias
1.  Verifique se suas matérias salvas aparecem aqui.
2.  Clique em uma matéria para ver os **Detalhes**.
3.  Nos Detalhes, clique em `← Voltar` (ou no ícone do Topo).
    *   Deve retornar para a lista de matérias.

### Menu de Ações (Engrenagem ⚙️)
*   **Adicionar Manualmente**: Abre o Modal -> Adicione -> Verifique na lista "Matérias".
*   **Importação em Lote**: Abre o Modal -> Teste o fluxo de scan.

## Arquitetura Nova
*   `sidepanel.html`: Main Layout (`nav` + `main`).
*   `sidepanel.js`: Roteamento (`switchView`).
*   `ui/homeDashboard.js`: Lógica da tela Home.
