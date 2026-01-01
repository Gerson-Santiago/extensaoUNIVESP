import { ContentStrategy } from './ContentStrategy.js';

export class VideoStrategy extends ContentStrategy {
  matches(element) {
    // 1. Detecção por Ícone (Padrão Moodle/Blackboard)
    const iconImg = element.querySelector('img.item_icon');
    if (iconImg) {
      const src = (iconImg.src || '').toLowerCase();
      const alt = (iconImg.alt || '').toLowerCase();
      if (src.includes('video') || alt.includes('video')) return true;
    }

    // 2. Detecção por iframe (YouTube, Vimeo, Univesp TV)
    const iframe = element.querySelector('iframe');
    if (iframe) {
      const src = (iframe.src || '').toLowerCase();
      if (src.includes('youtube.com') || src.includes('vimeo.com') || src.includes('univesp.tv')) {
        return true;
      }
    }

    // 3. Detecção por tag HTML5 <video>
    const video = element.querySelector('video');
    if (video) return true;

    return false;
  }

  extract(element) {
    const h3Link = element.querySelector('h3 a');
    const iframe = element.querySelector('iframe');
    const video = element.querySelector('video');

    // Prioridade 1: Link do H3 (Formato padrão Blackboard)
    let url = h3Link ? h3Link.href : null;
    let name = '';

    if (h3Link) {
      const span = h3Link.querySelector('span');
      name = this.cleanText(span ? span.textContent : h3Link.textContent);
    }

    // Prioridade 2: Iframe (Caso o link não exista ou seja genérico)
    if (!url && iframe && iframe.src) {
      url = iframe.src;
      if (!name) name = this.cleanText(iframe.title || 'Vídeo detectado');
    }

    // Prioridade 3: Tag Video
    if (!url && video && video.src) {
      url = video.src;
      if (!name) name = 'Vídeo HTML5';
    }

    if (!url) return null;

    // Limpeza básica de URL (remover tokens de tracking/embed se necessário)
    url = this.sanitizeUrl(url);

    const status = this.extractStatus(element);

    return {
      name: name || 'Vídeo sem título',
      url,
      type: 'video',
      contentId: this.extractContentId(element),
      ...(status && { status }),
    };
  }

  /**
   * Limpa a URL removendo parâmetros desnecessários de embed/tracking.
   * @param {string} url
   * @returns {string}
   */
  sanitizeUrl(url) {
    try {
      const urlObj = new URL(url);
      // Exemplo: Limpeza simples preservando o essencial
      if (urlObj.hostname.includes('youtube.com')) {
        // Manter video id mas remover trackers
        const queryParams = urlObj.searchParams;
        const v = queryParams.get('v');
        if (v) return `https://www.youtube.com/watch?v=${v}`;
      }
      return url;
    } catch {
      return url;
    }
  }
}
