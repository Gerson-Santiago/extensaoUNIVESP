import { VideoStrategy } from './strategies/VideoStrategy.js';
import { QuizStrategy } from './strategies/QuizStrategy.js';
import { ForumStrategy } from './strategies/ForumStrategy.js';
import { ResourceStrategy } from './strategies/ResourceStrategy.js';
import { UrlStrategy } from './strategies/UrlStrategy.js';
import { DefaultStrategy } from './strategies/DefaultStrategy.js';

export class StrategyRegistry {
  constructor() {
    this.strategies = [
      new VideoStrategy(),
      new QuizStrategy(),
      new ForumStrategy(),
      new ResourceStrategy(),
      new UrlStrategy(),
      new DefaultStrategy(), // Deve ser sempre o último
    ];
  }

  /**
   * Obtém a primeira estratégia que sabe lidar com o elemento.
   * @param {HTMLElement} element
   * @returns {import('./strategies/ContentStrategy.js').ContentStrategy}
   */
  getStrategy(element) {
    return this.strategies.find((strategy) => strategy.matches(element));
  }
}
