// import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { AutoScroll } from '../AutoScroll.js';

describe('Lógica de AutoScroll', () => {
  let autoScroll;
  let mockScrollTo;
  let scrollHeightGetter;

  beforeEach(() => {
    // Arrange (Setup comum)
    // Mock window.scrollTo
    mockScrollTo = jest.fn();
    global.window.scrollTo = mockScrollTo;
    /** @type {any} */ (global.window).scrollTo = mockScrollTo;

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
    // Arrange
    autoScroll = new AutoScroll();

    // Act
    autoScroll.start();
    jest.advanceTimersByTime(1000);

    // Assert
    expect(mockScrollTo).toHaveBeenCalled();
  });

  it('deve parar o scroll quando atingir o final (altura não muda)', async () => {
    // Arrange
    autoScroll = new AutoScroll({ interval: 100, maxRetries: 2 });
    autoScroll.start();

    // Act
    // Simula 3 ciclos onde a altura não muda
    jest.advanceTimersByTime(100); // 1
    jest.advanceTimersByTime(100); // 2
    jest.advanceTimersByTime(100); // 3

    // Assert
    // Deve ter parado
    expect(autoScroll.isRunning).toBe(false);
  });

  it('deve continuar o scroll se a altura aumentar', () => {
    // Arrange
    autoScroll = new AutoScroll({ interval: 100 });
    autoScroll.start();

    // Act 1: Ciclo 1 (altura 1000)
    jest.advanceTimersByTime(100);

    // Assert 1
    expect(mockScrollTo).toHaveBeenCalledTimes(2);

    // Act 2: Aumenta altura
    scrollHeightGetter.mockReturnValue(2000);

    // Ciclo 2: detecta mudança e continua
    jest.advanceTimersByTime(100);

    // Assert 2
    expect(mockScrollTo).toHaveBeenCalledTimes(3);
    expect(autoScroll.isRunning).toBe(true);
  });

  it('deve permitir parada manual', () => {
    // Arrange
    autoScroll = new AutoScroll();
    autoScroll.start();
    expect(autoScroll.isRunning).toBe(true);

    // Act
    autoScroll.stop();

    // Assert
    expect(autoScroll.isRunning).toBe(false);

    // Verificar que não chama mais
    jest.advanceTimersByTime(1000);
    const callsBefore = mockScrollTo.mock.calls.length;
    jest.advanceTimersByTime(1000);
    expect(mockScrollTo).toHaveBeenCalledTimes(callsBefore);
  });
});
