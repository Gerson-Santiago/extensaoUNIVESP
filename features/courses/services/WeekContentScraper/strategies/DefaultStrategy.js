import { ContentStrategy } from './ContentStrategy.js';

/**
 * Estratégia de fallback para itens que não casaram com nenhuma estratégia específica.
 * Tenta extrair o máximo de informação possível usando heurísticas genéricas.
 */
export class DefaultStrategy extends ContentStrategy {
  matches(_element) {
    return true; // Sempre dá match como fallback
  }

  extract(element) {
    let url = '';
    let name = '';

    // 1. Extração de NOME (Prioridade: H3)
    const h3 = element.querySelector('h3');
    if (h3) {
      // Tenta achar o span de texto (ignorando ícones de reordenar/editar)
      const titleSpan = h3.querySelector('span:not(.reorder):not(.hideme)');
      if (titleSpan) {
        name = this.cleanText(titleSpan.textContent);
      } else {
        // Fallback: pega texto direto do H3, mas cuidado com filhos indesejados
        name = this.cleanText(h3.innerText); // innerText costuma ignorar hidden
      }
    }

    // 2. Extração de URL (Prioridade 1: Link do Título)
    const h3Link = element.querySelector('h3 a');
    if (h3Link && h3Link.href && !h3Link.href.toLowerCase().startsWith('javascript:')) {
      url = h3Link.href;
    }

    // 3. Extração de URL (Prioridade 2: Iframe/Vídeo)
    // Importante: Checar isso ANTES de sair caçando links aleatórios
    if (!url) {
      const iframe = element.querySelector('iframe');
      if (iframe && iframe.src) {
        url = iframe.src;
      }
    }

    // 4. Extração de URL (Prioridade 3: Fallback genérico)
    if (!url) {
      const allLinks = element.querySelectorAll('a');
      for (const link of allLinks) {
        const href = link.href;
        // Filtros de segurança para evitar links de sistema/controle
        const isJavascript = !href || href.toLowerCase().startsWith('javascript:');
        const isAnchor = href && href.includes('#');
        const isAlly = link.className.includes('ally'); // Botões de acessibilidade
        const isMarkReviewed =
          (link.textContent && link.textContent.includes('Marca Revista')) ||
          (href && href.includes('markReviewed'));

        if (href && !isJavascript && !isAnchor && !isAlly && !isMarkReviewed) {
          url = href;
          // Se ainda não tínhamos nome (caso sem H3?), tenta pegar do link
          if (!name) {
            name = this.cleanText(link.textContent);
          }
          break;
        }
      }
    }

    // 5. Fallback final de nome (Texto truncado)
    if (!name) {
      const fullText = element.textContent || '';
      name = this.cleanText(fullText.substring(0, 100));
    }

    // Validação Final: Só retorna se tiver URL válida e Nome
    if (name && url) {
      const status = this.extractStatus(element);

      // Extrair Content ID para navegação precisa (scroll)
      // NOTA: IDs são únicos por curso/semana, não globalmente
      // Usado apenas para scroll dentro da mesma página
      let contentId = null;
      if (element.id && element.id.startsWith('contentListItem:')) {
        contentId = element.id.replace('contentListItem:', '');
      } else {
        // Fallback: tentar pegar do div.item interno
        const itemDiv = element.querySelector('.item');
        if (itemDiv && itemDiv.id) {
          contentId = itemDiv.id;
        }
      }

      return {
        name,
        url,
        type: 'document', // Tipo genérico
        ...(contentId && { contentId }),
        ...(status && { status }),
      };
    }

    return null;
  }
}
