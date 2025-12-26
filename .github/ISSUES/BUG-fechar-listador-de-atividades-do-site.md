# BUG: Interferência do Modal "Quick Links" (Lightbox)

## Descrição do Problema
Ao interagir com o AVA (Blackboard) para obter dados de links rápidos (ex: para popular a lista de atividades da semana), o site oficial renderiza um **Modal (Lightbox)** que cobre a tela ou bloqueia a interação. Esse modal precisa ser fechado programaticamente para garantir uma experiência de navegação fluida na extensão.

## Análise Técnica
O elemento de bloqueio foi identificado como parte da estrutura padrão do Blackboard.

### Seletor do Alvo (Botão Fechar)
O botão nativo de fechar o modal possui a seguinte assinatura no DOM:
```html
<a class="lbAction u_floatThis-right" href="#close" title="Fechar" role="button">
    <img src="..." alt="Fechar">
</a>
```

### Seletor CSS Recomendado
```css
/* Seletor de alta especificidade para o botão de fechar */
a.lbAction[href="#close"][title="Fechar"]
```

## Estratégia de Solução (Algoritmo)

Devemos implementar um "Guard" (Guarda) que verifica e limpa esse modal sempre que a extensão realiza uma ação de navegação ou raspagem de dados.

### `DomUtils.ensureModalClosed()`

1.  **Detecção**: Verificar se o container do modal (`.lb-content` ou `.lb-bg`) está visível no DOM.
2.  **Ação**:
    - Buscar o botão de fechar usando o seletor `a.lbAction[href="#close"]`.
    - Disparar evento de clique nativo (`element.click()`).
    - **Fallback**: Se o clique falhar, injetar estilo `display: none !important` no container `.lb-container`.
3.  **Observação**: Usar `MutationObserver` se o modal abrir assincronamente logo após o carregamento da página.

### Snippet de Implementação

```javascript
function closeBlackboardModal() {
    const closeBtn = document.querySelector('a.lbAction[href="#close"]');
    if (closeBtn) {
        console.log('[Extensão] Fechando modal do Blackboard detectado.');
        closeBtn.click();
        return true;
    }
    return false;
}

// Chamar esta função:
// 1. Logo após o carregamento da página (content script)
// 2. Antes de iniciar qualquer scraping de "Links Rápidos"
```
