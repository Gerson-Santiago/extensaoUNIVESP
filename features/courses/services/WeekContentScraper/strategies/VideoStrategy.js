import { ContentStrategy } from './ContentStrategy.js';

export class VideoStrategy extends ContentStrategy {
  matches(element) {
    const iconImg = element.querySelector('img.item_icon');
    if (!iconImg) return false;

    const src = (iconImg.src || '').toLowerCase();
    const alt = (iconImg.alt || '').toLowerCase();

    return src.includes('video') || alt.includes('video');
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
      type: 'video',
      contentId: this.extractContentId(element),
      ...(status && { status }),
    };
  }
}
