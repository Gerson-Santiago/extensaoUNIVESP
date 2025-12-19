import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { AutoScroll } from '../AutoScroll.js';

describe('AutoScroll Logic', () => {
  let autoScroll;
  let mockScrollTo;
  let scrollHeightGetter;

  beforeEach(() => {
    // Mock window.scrollTo
    mockScrollTo = jest.fn();
    global.window.scrollTo = mockScrollTo;

    // Mock document.documentElement.scrollHeight
    // Usamos defineProperty para poder alterar o valor durante o teste
    scrollHeightGetter = jest.fn().mockReturnValue(1000);
    Object.defineProperty(global.document.documentElement, 'scrollHeight', {
      get: scrollHeightGetter,
      configurable: true,
    });

    // Mock window.innerHeight e scrollY
    global.window.innerHeight = 800;
    global.window.scrollY = 0;

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('deve iniciar o scroll e chamar scrollTo', () => {
    autoScroll = new AutoScroll();
    autoScroll.start();

    jest.advanceTimersByTime(1000);

    expect(mockScrollTo).toHaveBeenCalled();
  });

  it('deve parar o scroll quando atingir o final (altura não muda)', async () => {
    autoScroll = new AutoScroll({ interval: 100, maxRetries: 2 });
    autoScroll.start();

    // Simula 3 ciclos onde a altura não muda
    jest.advanceTimersByTime(100); // 1
    jest.advanceTimersByTime(100); // 2
    jest.advanceTimersByTime(100); // 3

    // Deve ter parado
    expect(autoScroll.isRunning).toBe(false);
  });

  it('deve continuar o scroll se a altura aumentar', () => {
    autoScroll = new AutoScroll({ interval: 100 });
    autoScroll.start();

    // Ciclo 1: altura 1000
    jest.advanceTimersByTime(100);
    expect(mockScrollTo).toHaveBeenCalledTimes(2);

    // Aumenta altura
    scrollHeightGetter.mockReturnValue(2000);

    // Ciclo 2: detecta mudança e continua
    jest.advanceTimersByTime(100);
    expect(mockScrollTo).toHaveBeenCalledTimes(3);

    expect(autoScroll.isRunning).toBe(true);
  });

  it('deve permitir parada manual', () => {
    autoScroll = new AutoScroll();
    autoScroll.start();
    expect(autoScroll.isRunning).toBe(true);

    autoScroll.stop();
    expect(autoScroll.isRunning).toBe(false);

    jest.advanceTimersByTime(1000);
    // Não deve ter chamado mais vezes após stop
    const callsBefore = mockScrollTo.mock.calls.length;
    jest.advanceTimersByTime(1000);
    expect(mockScrollTo).toHaveBeenCalledTimes(callsBefore);
  });
});
