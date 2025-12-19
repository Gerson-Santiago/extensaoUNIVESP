/**
 * FeedbackView - Wrapper para formulário de feedback do Google Forms
 *
 * Esta view é uma camada simples que embute um iframe apontando para um
 * Google Form. Não há lógica de negócio ou validação client-side, pois
 * todo o processamento é gerenciado pelo Google Forms.
 *
 * @class FeedbackView
 */
export class FeedbackView {
  constructor(callbacks = {}) {
    this.onBack = callbacks.onBack;
  }

  render() {
    const div = document.createElement('div');
    div.className = 'view-feedback';
    div.style.height = '100%';
    div.style.display = 'flex';
    div.style.flexDirection = 'column';

    div.innerHTML = `
      <div class="details-header">
          <button id="backBtn" class="btn-back">← Voltar</button>
          <h2 class="details-title">Feedback</h2>
      </div>
      <div style="flex: 1; overflow: hidden;">
        <iframe 
          src="https://docs.google.com/forms/d/e/1FAIpQLSekIKxMxYynkHBAJqYN_A1pe5_3_fwC6T4s7CX6z9tSkfEXtA/viewform?embedded=true" 
          width="100%" 
          height="100%" 
          frameborder="0" 
          marginheight="0" 
          marginwidth="0"
          style="border: none;"
        >Carregando…</iframe>
      </div>
    `;
    return div;
  }

  afterRender() {
    const backBtn = document.getElementById('backBtn');
    if (backBtn && this.onBack) {
      backBtn.onclick = () => this.onBack();
    }
  }
}
