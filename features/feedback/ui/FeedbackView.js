/**
 * FeedbackView - Wrapper para formulário de feedback do Google Forms
 *
 * Esta view é uma camada simples que embute um iframe apontando para um
 * Google Form. Não há lógica de negócio ou validação client-side, pois
 * todo o processamento é gerenciado pelo Google Forms.
 *
 * @class FeedbackView
 */
import { DOMSafe } from '../../../shared/utils/DOMSafe.js';

export class FeedbackView {
  constructor(callbacks = {}) {
    this.onBack = callbacks.onBack;
  }

  render() {
    const h = DOMSafe.createElement;

    const backBtn = h('button', { id: 'backBtn', className: 'btn-back' }, '← Voltar');
    const title = h('h2', { className: 'details-title' }, 'Feedback');

    const header = h('div', { className: 'details-header' }, [backBtn, title]);

    const iframe = h(
      'iframe',
      {
        src: 'https://docs.google.com/forms/d/e/1FAIpQLSekIKxMxYynkHBAJqYN_A1pe5_3_fwC6T4s7CX6z9tSkfEXtA/viewform?embedded=true',
        width: '100%',
        height: '100%',
        frameBorder: '0',
        marginheight: '0',
        marginwidth: '0',
        style: { border: 'none' },
      },
      'Carregando…'
    ); // Fallback text safely appended

    const iframeContainer = h(
      'div',
      {
        style: { flex: '1', overflow: 'hidden' },
      },
      iframe
    );

    return h(
      'div',
      {
        className: 'view-feedback',
        style: { height: '100%', display: 'flex', flexDirection: 'column' },
      },
      [header, iframeContainer]
    );
  }

  afterRender() {
    const backBtn = document.getElementById('backBtn');
    if (backBtn && this.onBack) {
      backBtn.onclick = () => this.onBack();
    }
  }
}
