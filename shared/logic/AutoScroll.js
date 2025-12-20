/**
 * Classe responsável por gerenciar a rolagem automática da página.
 * Ideal para carregar conteúdo via lazy loading (infinite scroll).
 */
/**
 * @typedef {Object} AutoScrollOptions
 * @property {number} [interval=800] - Intervalo em ms entre os scrolls
 * @property {number} [step=300] - Píxeis para rolar a cada passo
 * @property {number} [maxRetries=5] - Tentativas antes de desistir se a altura não mudar
 */

export class AutoScroll {
  /**
   * @param {AutoScrollOptions} [options] - Configurações do AutoScroll
   */
  constructor({ interval = 800, step = 300, maxRetries = 5 } = {}) {
    this.interval = interval;
    this.step = step;
    this.maxRetries = maxRetries;
    this.isRunning = false;
    this.timer = null;
    this.retries = 0;
    this.lastHeight = 0;
  }

  /**
   * Inicia o processo de auto-scroll.
   */
  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.retries = 0;
    this.lastHeight = document.documentElement.scrollHeight;

    this._scrollStep();
  }

  /**
   * Para o processo de auto-scroll.
   */
  stop() {
    this.isRunning = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  /**
   * Executa um passo de scroll e agenda o próximo.
   * @private
   */
  _scrollStep() {
    if (!this.isRunning) return;

    // Rola para baixo
    window.scrollTo({
      top: window.scrollY + this.step,
      behavior: 'smooth',
    });

    // Verifica se chegou ao fim ou se carregou mais conteúdo
    this.timer = setTimeout(() => {
      this._checkProgress();
    }, this.interval);
  }

  /**
   * Verifica se houve progresso (altura aumentou) ou se deve parar.
   * @private
   */
  _checkProgress() {
    if (!this.isRunning) return;

    const currentHeight = document.documentElement.scrollHeight;

    // Se a altura mudou, resetamos as tentativas (carregou coisas novas!)
    if (currentHeight > this.lastHeight) {
      this.lastHeight = currentHeight;
      this.retries = 0;
      this._scrollStep();
      return;
    }

    // Se a altura não mudou, incrementamos tentativas
    this.retries++;

    // Se atingiu o limite de tentativas sem mudança E parece estar no fim da página
    if (this.retries >= this.maxRetries) {
      this.stop();
      return;
    }

    // Tenta de novo (pode ser lentidão da rede)
    this._scrollStep();
  }
}
