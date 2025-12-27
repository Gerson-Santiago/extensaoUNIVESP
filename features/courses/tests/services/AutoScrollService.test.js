// import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { DOM_autoScroll_Injected } from '../../logic/AutoScrollService.js';

describe('AutoScrollService - Lógica Injetada', () => {
  let mockScrollTo;
  let mockScrollBy;

  beforeEach(() => {
    // Preparar (Arrange) - Reset do DOM e Mocks
    document.body.innerHTML =
      '<div id="main-content-inner" style="height: 500px; overflow-y: auto;"></div>';

    // Mock métodos de Scroll
    mockScrollTo = jest.fn();
    mockScrollBy = jest.fn();
    window.scrollTo = mockScrollTo;
    window.scrollBy = mockScrollBy;

    // Mock métodos de Scroll em Elementos
    Element.prototype.scrollBy = mockScrollBy;

    // Mock Dimensões
    Object.defineProperty(window, 'innerHeight', { value: 600, writable: true });
    Object.defineProperty(document.body, 'offsetHeight', { value: 1000, writable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 2000,
      writable: true,
      configurable: true,
    });

    // Mock Timers e Alert
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    /** @type {any} */ (window)['_autoScrollRun'] = undefined;
  });

  it('deve iniciar o scroll e chamar scrollBy', () => {
    // Preparar (Arrange) - Forçar fallback para window (removendo container específico)
    document.body.innerHTML = '';

    // Agir (Act)
    DOM_autoScroll_Injected();

    // Verificar (Assert) - Scroll inicial
    expect(mockScrollBy).toHaveBeenCalledWith({ top: 300, behavior: 'smooth' });
  });

  it('deve parar se já estiver rodando', () => {
    // Preparar (Arrange) - Simular flag de execução
    /** @type {any} */ (window)['_autoScrollRun'] = true;

    // Agir (Act)
    DOM_autoScroll_Injected();

    // Verificar (Assert)
    expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('já está em andamento'));
    expect(mockScrollBy).not.toHaveBeenCalled();
  });

  it('deve continuar rolando (scrolling) se a altura da página aumentar', () => {
    // Preparar (Arrange)
    document.body.innerHTML = '';
    let currentHeight = 2000;

    // Mock dinâmico de altura
    Object.defineProperty(global.document.documentElement, 'scrollHeight', {
      get: () => currentHeight,
    });

    // Agir (Act) - Início
    DOM_autoScroll_Injected();
    expect(mockScrollBy).toHaveBeenCalledTimes(1);

    // Simular crescimento da página após delay
    currentHeight = 3000; // Cresceu!
    jest.advanceTimersByTime(1500);

    // Verificar (Assert)
    expect(mockScrollBy).toHaveBeenCalledTimes(2); // Deve ter disparado o próximo scroll
  });

  it('deve parar após atingir o número máximo de tentativas (MAX_RETRIES) se a altura não mudar', () => {
    // Preparar (Arrange)
    document.body.innerHTML = '';

    // Agir (Act)
    DOM_autoScroll_Injected();

    // Avançar timers 5 vezes (MAX_RETRIES padrão)
    for (let i = 0; i < 5; i++) {
      jest.advanceTimersByTime(1500);
    }

    // Avançar mais uma vez para acionar a finalização
    jest.advanceTimersByTime(1500);

    // Verificar (Assert)
    expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Carregamento concluído'));
    expect(/** @type {any} */ (window)['_autoScrollRun']).toBe(false);
  });
});
