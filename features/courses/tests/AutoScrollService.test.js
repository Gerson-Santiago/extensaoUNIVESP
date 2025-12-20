import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { DOM_autoScroll_Injected } from '../logic/AutoScrollService.js';

describe('AutoScrollService Logic (Injected)', () => {
  let mockScrollTo;
  let mockScrollBy;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML =
      '<div id="main-content-inner" style="height: 500px; overflow-y: auto;"></div>';

    // Mock Scroll Methods
    mockScrollTo = jest.fn();
    mockScrollBy = jest.fn();
    window.scrollTo = mockScrollTo;
    window.scrollBy = mockScrollBy;

    // Mock Element Scroll Methods
    Element.prototype.scrollBy = mockScrollBy;

    // Mock Dimensions
    Object.defineProperty(window, 'innerHeight', { value: 600, writable: true });
    Object.defineProperty(document.body, 'offsetHeight', { value: 1000, writable: true });
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      value: 2000,
      writable: true,
      configurable: true,
    });

    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    delete window['_autoScrollRun'];
  });

  it('deve iniciar o scroll e chamar scrollBy', () => {
    // Mock getScrollElement returning window (default fallback)
    document.body.innerHTML = ''; // Remove special container

    DOM_autoScroll_Injected();

    // Initial scroll
    expect(mockScrollBy).toHaveBeenCalledWith({ top: 300, behavior: 'smooth' });
  });

  it('deve parar se já estiver rodando', () => {
    window['_autoScrollRun'] = true;
    DOM_autoScroll_Injected();
    expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('já está em andamento'));
    expect(mockScrollBy).not.toHaveBeenCalled();
  });

  it('deve continuar scrolando se altura aumentar', () => {
    document.body.innerHTML = '';
    let currentHeight = 2000;

    // Mock height getter to simulate growth
    Object.defineProperty(global.document.documentElement, 'scrollHeight', {
      get: () => currentHeight,
    });

    DOM_autoScroll_Injected();
    expect(mockScrollBy).toHaveBeenCalledTimes(1);

    // Advance timer (wait 1.5s)
    currentHeight = 3000; // Grew!
    jest.advanceTimersByTime(1500);

    expect(mockScrollBy).toHaveBeenCalledTimes(2); // Should trigger next scroll
  });

  it('deve parar após MAX_RETRIES se altura não mudar', () => {
    document.body.innerHTML = '';

    DOM_autoScroll_Injected();

    // 5 Retries (Default MAX_RETRIES)
    for (let i = 0; i < 5; i++) {
      jest.advanceTimersByTime(1500);
    }

    // Advance one more to trigger finish
    jest.advanceTimersByTime(1500);

    expect(global.alert).toHaveBeenCalledWith(expect.stringContaining('Carregamento concluído'));
    expect(window['_autoScrollRun']).toBe(false);
  });
});
