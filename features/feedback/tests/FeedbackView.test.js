import { FeedbackView } from '../ui/FeedbackView.js';

describe('FeedbackView - Renderização', () => {
  let feedbackView;
  let mockOnBack;

  beforeEach(() => {
    mockOnBack = jest.fn();
    feedbackView = new FeedbackView({ onBack: mockOnBack });
    document.body.innerHTML = '';
  });

  test('Deve renderizar a view com classe correta', () => {
    const element = feedbackView.render();
    expect(element.className).toBe('view-feedback');
  });

  test('Deve conter header com botão voltar', () => {
    const element = feedbackView.render();
    document.body.appendChild(element);

    const header = element.querySelector('.details-header');
    expect(header).toBeTruthy();

    const backBtn = element.querySelector('#backBtn');
    expect(backBtn).toBeTruthy();
    expect(backBtn.textContent).toContain('Voltar');
  });

  test('Deve conter título "Feedback"', () => {
    const element = feedbackView.render();
    const title = element.querySelector('.details-title');
    expect(title).toBeTruthy();
    expect(title.textContent).toBe('Feedback');
  });

  test('Deve renderizar iframe com URL do Google Forms', () => {
    const element = feedbackView.render();
    const iframe = element.querySelector('iframe');

    expect(iframe).toBeTruthy();
    expect(iframe.src).toContain('docs.google.com/forms');
    expect(iframe.src).toContain('1FAIpQLSekIKxMxYynkHBAJqYN_A1pe5_3_fwC6T4s7CX6z9tSkfEXtA');
  });

  test('Iframe deve ter atributos de acessibilidade corretos', () => {
    const element = feedbackView.render();
    const iframe = element.querySelector('iframe');

    expect(iframe.width).toBe('100%');
    expect(iframe.height).toBe('100%');
    expect(iframe.frameBorder).toBe('0');
  });

  test('Botão voltar deve chamar callback onBack quando clicado', () => {
    const element = feedbackView.render();
    document.body.appendChild(element);

    feedbackView.afterRender();

    const backBtn = document.getElementById('backBtn');
    backBtn.click();

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  test('afterRender deve funcionar mesmo sem callback onBack', () => {
    const viewSemCallback = new FeedbackView({});
    const element = viewSemCallback.render();
    document.body.appendChild(element);

    expect(() => viewSemCallback.afterRender()).not.toThrow();
  });

  test('Deve ter layout flexível para acomodar iframe', () => {
    const element = feedbackView.render();

    expect(element.style.height).toBe('100%');
    expect(element.style.display).toBe('flex');
    expect(element.style.flexDirection).toBe('column');
  });
});
