import { FeedbackView } from '../ui/FeedbackView.js';

describe('FeedbackView - Renderização', () => {
  let feedbackView;
  let mockOnBack;

  beforeEach(() => {
    // Preparar (Arrange)
    mockOnBack = jest.fn();
    feedbackView = new FeedbackView({ onBack: mockOnBack });
    document.body.innerHTML = '';
  });

  test('Deve renderizar a view com classe correta', () => {
    // Agir (Act)
    const element = feedbackView.render();

    // Verificar (Assert)
    expect(element.className).toBe('view-feedback');
  });

  test('Deve conter header com botão voltar', () => {
    // Agir (Act)
    const element = feedbackView.render();
    document.body.appendChild(element);

    // Verificar (Assert)
    const header = element.querySelector('.details-header');
    expect(header).toBeTruthy();

    const backBtn = element.querySelector('#backBtn');
    expect(backBtn).toBeTruthy();
    expect(backBtn.textContent).toContain('Voltar');
  });

  test('Deve conter título "Feedback"', () => {
    // Agir (Act)
    const element = feedbackView.render();

    // Verificar (Assert)
    const title = element.querySelector('.details-title');
    expect(title).toBeTruthy();
    expect(title.textContent).toBe('Feedback');
  });

  test('Deve renderizar iframe com URL do Google Forms', () => {
    // Agir (Act)
    const element = feedbackView.render();

    // Verificar (Assert)
    const iframe = element.querySelector('iframe');
    expect(iframe).toBeTruthy();
    expect(iframe.src).toContain('docs.google.com/forms');
    expect(iframe.src).toContain('1FAIpQLSekIKxMxYynkHBAJqYN_A1pe5_3_fwC6T4s7CX6z9tSkfEXtA');
  });

  test('Iframe deve ter atributos de acessibilidade corretos', () => {
    // Agir (Act)
    const element = feedbackView.render();

    // Verificar (Assert)
    const iframe = element.querySelector('iframe');
    expect(iframe.width).toBe('100%');
    expect(iframe.height).toBe('100%');
    expect(iframe.getAttribute('frameborder')).toBe('0'); // Usando getAttribute por consistência de DOM
  });

  test('Botão voltar deve chamar callback onBack quando clicado', () => {
    // Preparar (Arrange)
    const element = feedbackView.render();
    document.body.appendChild(element);
    feedbackView.afterRender();

    // Agir (Act)
    const backBtn = document.getElementById('backBtn');
    backBtn.click();

    // Verificar (Assert)
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  test('afterRender deve funcionar mesmo sem callback onBack (falha silenciosa/defensiva)', () => {
    // Preparar (Arrange)
    const viewSemCallback = new FeedbackView({});
    const element = viewSemCallback.render();
    document.body.appendChild(element);

    // Agir & Verificar (Act & Assert)
    expect(() => viewSemCallback.afterRender()).not.toThrow();
  });

  test('Deve ter layout flexível para acomodar iframe', () => {
    // Agir (Act)
    const element = feedbackView.render();

    // Verificar (Assert)
    expect(element.style.height).toBe('100%');
    expect(element.style.display).toBe('flex');
    expect(element.style.flexDirection).toBe('column');
  });
});
