import { ContentStrategy } from './ContentStrategy.js';

export class QuizStrategy extends ContentStrategy {
  matches(element) {
    const iconImg = element.querySelector('img.item_icon');
    // Check icon first
    if (iconImg) {
      const src = (iconImg.src || '').toLowerCase();
      const alt = (iconImg.alt || '').toLowerCase();
      if (
        src.includes('quiz') ||
        alt.includes('quiz') ||
        alt.includes('questionário') ||
        alt.includes('questionario')
      ) {
        return true;
      }
    }

    // Fallback: check URL
    const h3Link = element.querySelector('h3 a');
    if (h3Link && h3Link.href && h3Link.href.includes('/mod/quiz/')) {
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
      type: 'quiz',
      contentId: this.extractContentId(element),
      ...(status && { status }),
    };
  }
}
