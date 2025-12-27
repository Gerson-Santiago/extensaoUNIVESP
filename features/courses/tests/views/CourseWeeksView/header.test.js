/**
 * @jest-environment jsdom
 */
import { HeaderManager } from '../../../views/CourseWeeksView/HeaderManager.js';
import { CourseRefresher } from '../../../services/CourseRefresher.js';

jest.mock('../../../services/CourseRefresher.js');

describe('HeaderManager (Gerente de Cabeçalho)', () => {
  let container;
  let curso;
  let callbacks;
  let gerente;

  beforeEach(() => {
    // Arrange (Preparar) compartilhado
    container = document.createElement('div');
    container.innerHTML = `
            <button id="backBtn"></button>
            <button id="openCourseBtn"></button>
            <button id="refreshWeeksBtn"></button>
        `;
    curso = { name: 'Curso de Teste', url: 'http://teste.com', weeks: [] };
    callbacks = {
      onBack: jest.fn(),
      onOpenCourse: jest.fn(),
      onRefresh: jest.fn(),
    };
    gerente = new HeaderManager(curso, container, callbacks);
    jest.clearAllMocks();
  });

  it('deve chamar onBack quando o botão de voltar é clicado', () => {
    // Act (Agir)
    gerente.setup();
    const botao = container.querySelector('#backBtn');
    botao.click();

    // Assert (Verificar)
    expect(callbacks.onBack).toHaveBeenCalled();
  });

  it('deve chamar onOpenCourse com a URL do curso quando o botão de abrir matéria é clicado', () => {
    // Act
    gerente.setup();
    const botao = container.querySelector('#openCourseBtn');
    botao.click();

    // Assert
    expect(callbacks.onOpenCourse).toHaveBeenCalledWith(curso.url);
  });

  it('deve atualizar o curso quando o botão de atualizar semanas é clicado', async () => {
    // Arrange
    const mockSemanas = [{ name: 'Semana 1' }];
    /** @type {jest.Mock} */ (CourseRefresher.refreshCourse).mockResolvedValue({
      success: true,
      weeks: mockSemanas,
    });

    // Act
    gerente.setup();
    const botao = container.querySelector('#refreshWeeksBtn');
    await botao.onclick(); // Simula clique assíncrono

    // Assert
    expect(CourseRefresher.refreshCourse).toHaveBeenCalledWith(curso, botao);
    expect(curso.weeks).toBe(mockSemanas);
    expect(callbacks.onRefresh).toHaveBeenCalledWith(mockSemanas);
  });

  it('deve lidar com falha na atualização graciosamente', async () => {
    // Arrange
    /** @type {jest.Mock} */ (CourseRefresher.refreshCourse).mockResolvedValue({ success: false });

    // Act
    gerente.setup();
    const botao = container.querySelector('#refreshWeeksBtn');
    await botao.onclick();

    // Assert
    expect(callbacks.onRefresh).not.toHaveBeenCalled();
  });

  it('deve verificar se o callback é uma função antes de chamar (defensivo)', () => {
    // Arrange
    const gerenteMinimalista = new HeaderManager(curso, container, {}); // sem callbacks

    // Act
    gerenteMinimalista.setup();
    const botao = container.querySelector('#backBtn');

    // Assert
    expect(() => botao.click()).not.toThrow();
  });
});
