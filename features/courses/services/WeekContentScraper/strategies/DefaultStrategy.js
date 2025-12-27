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
    // 1. Tentar pegar link e texto do H3
    const h3Link = element.querySelector('h3 a');
    let url = '';
    let name = '';

    if (h3Link && h3Link.href) {
      url = h3Link.href;
      const span = h3Link.querySelector('span');
      name = this.cleanText(span ? span.textContent : h3Link.textContent);
    }

    // 2. Se falhou, tentar qualquer link válido
    if (!url) {
      const allLinks = element.querySelectorAll('a');
      for (const link of allLinks) {
        if (link.href && !link.href.includes('#') && !link.className.includes('ally')) {
          url = link.href;
          name = this.cleanText(link.textContent);
          break;
        }
      }
    }

    // 3. Se ainda sem URL, tentar iframe
    if (!url) {
      const iframe = element.querySelector('iframe');
      if (iframe && iframe.src) {
        url = iframe.src;
      }
    }

    // 4. Se ainda sem nome, tentar H3 ou texto completo (truncado)
    if (!name) {
      const h3 = element.querySelector('h3');
      if (h3) {
        name = this.cleanText(h3.textContent);
      } else {
        const fullText = element.textContent || '';
        name = this.cleanText(fullText.substring(0, 100));
      }
    }

    // Só retorna item se tiver pelo menos nome E link
    if (name && url) {
      const status = this.extractStatus(element);
      return {
        name,
        url,
        type: 'document', // Tipo genérico
        ...(status && { status }),
      };
    }

    return null;
  }
}
