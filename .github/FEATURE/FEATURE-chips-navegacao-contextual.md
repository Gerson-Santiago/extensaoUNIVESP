# Especificação: Barra de Navegação Contextual (Smart Chips)

> **Princípio**: Implementação 100% nativa (HTML/CSS/JS), sem bibliotecas de UI externas, garantindo alta performance e alinhamento visual premium.

## 1. Visão Geral (UI/UX)
Um componente de navegação secundária posicionado no topo, permitindo troca rápida entre contextos (ex: atividades da semana) sem recarregar a visualização inteira.

- **Localização**: Logo abaixo do cabeçalho principal.
- **Visibilidade**: Exclusivo para rota `Courses > {Matéria} > {Semana} > {Atividade}`.
- **Estética**: Design "Pill" (cápsula) moderno, com feedback tátil e visual suave.

### Especificações Visuais (CSS Puro)
Baseado na imagem de referência:
```css
.chips-container {
  display: flex;
  gap: 8px;
  overflow-x: auto; /* Scroll horizontal em mobile */
  padding: 8px 16px;
  scrollbar-width: none; /* Hide scrollbar */
}

/* Chip Base */
.chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 16px;
  border-radius: 9999px; /* Pill shape */
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: var(--surface-secondary, #e0e0e0);
  color: var(--text-primary, #333);
  border: 1px solid transparent;
  user-select: none;
}

/* Estado: Hover */
.chip:hover {
  background-color: var(--surface-hover, #d6d6d6);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* Estado: Ativo/Selecionado */
.chip--active {
  background-color: var(--primary-color, #6b63ff) !important;
  color: #ffffff !important;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(107, 99, 255, 0.3);
}

/* Estado: Ícone de Check (Opcional) */
.chip--active::before {
  content: "✓";
  margin-right: 6px;
  font-weight: bold;
}

/* UX: Truncamento de Texto Longo */
.chip span {
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* UX: Botão de Remover (Aparece no Hover) */
.chip .remove-btn {
  display: flex;
  margin-left: 6px;
  opacity: 0.6;
  border-radius: 50%;
  padding: 2px;
}
.chip .remove-btn:hover {
  background-color: rgba(0,0,0,0.1);
  opacity: 1;
}

/* Animação de Entrada */
@keyframes slideIn {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}
.chip {
  animation: slideIn 0.3s ease-out forwards;
}
```

## 2. Comportamento e Lógica
### Navegação Bivalente (Sincronizada)
O clique no Chip deve realizar duas ações simultâneas:
1.  **Navegador**: Focar ou abrir a aba correspondente àquela semana/atividade (`Tabs.openOrSwitchTo`).
2.  **Extensão**: Renderizar imediatamente a view daquela semana na extensão.

### Histórico Inteligente (Smart History - Por Matéria)
O histórico é contextual, ou seja, isolado por **Matéria** (Course ID).
*   **Cenário de Uso**:
    1.  Usuário acessa *Matemática*. Abre *Semana 1*. (Chip "Semana 1" criado).
    2.  Abre *Semana 2*. (Chip "Semana 2" adicionado).
    3.  Abre *Semana 3*. (Chip "Semana 3" adicionado, lista agora tem [Semana 3, Semana 2, Semana 1]).
    4.  Clica no Chip *Semana 1*:
        - Navegador foca na aba da Semana 1.
        - Extensão volta para a lista da Semana 1.

### Navegação SPA (Single Page Application behavior)
O clique em um chip **não** deve recarregar a página da extensão, apenas trocar o componente visível.
- **Armazenamento**: `chrome.storage.local` -> `recent_access_{courseID}`.

## 3. Implementação Técnica
### Estrutura do Componente
Sugestão de estrutura de dados para o renderizador:

```javascript
// Exemplo de strutura de dados para o Chip
interface ChipItem {
  id: string;
  label: string; // Ex: "Semana 1 - Vídeo Aula"
  targetId: string; // Content ID para navegação
  isActive: boolean;
}
```

### Requisitos de Acessibilidade (a11y)
- Usar tags `<button>` semânticas ou adicionar `role="button"` e `tabindex="0"`.
- Adicionar `aria-pressed="true"` no item ativo.
- Suporte a navegação por teclado (Enter/Space).

## 4. Configuração do Usuário
- Permitir que o usuário defina a **Cor de Destaque** dos chips ativos via painel de configurações.
- Slider para controlar quantos chips aparecem antes do scroll (densidade).