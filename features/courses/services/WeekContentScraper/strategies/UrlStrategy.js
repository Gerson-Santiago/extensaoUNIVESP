import { ContentStrategy } from './ContentStrategy.js';

export class UrlStrategy extends ContentStrategy {
  matches(element) {
    const iconImg = element.querySelector('img.item_icon');
    if (iconImg) {
      const src = (iconImg.src || '').toLowerCase();
      const alt = (iconImg.alt || '').toLowerCase();
      if (src.includes('url') || alt.includes('url')) {
        return true;
      }
    }

    const h3Link = element.querySelector('h3 a');
    if (h3Link && h3Link.href && h3Link.href.includes('/mod/url/')) {
      return true;
    }

    return false;
  }

  extract(element) {
    const h3Link = element.querySelector('h3 a');
    if (!h3Link || !h3Link.href) return null;

    const span = h3Link.querySelector('span');
    const name = this.cleanText(span ? span.textContent : h3Link.textContent);
    const url = h3Link.href;
    const status = this.extractStatus(element);

    return {
      name,
      url,
      type: 'url',
      contentId: this.extractContentId(element),
      ...(status && { status }),
    };
  }
}
