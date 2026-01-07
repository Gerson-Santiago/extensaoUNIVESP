import { SettingsController } from '../logic/SettingsController.js';
import { BackupService } from '../../../shared/services/BackupService.js';

// Mock dependencies
jest.mock('../../../shared/services/BackupService.js');

// Mock Modal with esModule flag to ensure Import() picks it up correctly
const mockModalInstance = {
  render: jest.fn(),
  close: jest.fn(),
  setOnClose: jest.fn(),
};

// Quando o controller fizer import(...) ele vai pegar esse objeto.
// Se ele fizer const { Modal } destructuring, vai funcionar.
jest.mock('../../../shared/ui/Modal.js', () => ({
  __esModule: true,
  Modal: jest.fn().mockImplementation(() => mockModalInstance),
}));

describe('SettingsController', () => {
  let controller;
  let mockToaster;
  let mockLogger;

  beforeEach(() => {
    jest.clearAllMocks();

    mockToaster = {
      show: jest.fn(),
    };
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    // @ts-ignore
    global.chrome = /** @type {any} */ ({
      runtime: {
        reload: jest.fn(),
      },
      storage: {
        local: {
          clear: jest.fn(),
        },
      },
    });

    controller = new SettingsController({
      toaster: mockToaster,
      logger: mockLogger,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('handleExport', () => {
    it('deve exportar dados com sucesso', async () => {
      // @ts-ignore
      BackupService.exportData.mockResolvedValue(true);

      await controller.handleExport();

      expect(BackupService.exportData).toHaveBeenCalled();
      expect(mockToaster.show).toHaveBeenCalledWith(expect.stringContaining('sucesso'), 'success');
      expect(mockLogger.info).toHaveBeenCalled();
    });

    it('deve lidar com erro na exportação', async () => {
      const error = new Error('Falha de escrita');
      // @ts-ignore
      BackupService.exportData.mockRejectedValue(error);

      await controller.handleExport();

      expect(mockLogger.error).toHaveBeenCalledWith('Export failed', error);
      expect(mockToaster.show).toHaveBeenCalledWith(expect.stringContaining('Falha'), 'error');
    });
  });

  describe('handleImport', () => {
    it('não deve fazer nada se arquivo for nulo', async () => {
      await controller.handleImport(null);
      expect(BackupService.importData).not.toHaveBeenCalled();
    });

    it('deve importar dados válidos com sucesso e recarregar', async () => {
      // Mock object mimicking File behavior to bypass JSDOM limitations
      const mockFile = {
        text: jest.fn().mockResolvedValue('{"data":"test"}'),
      };

      // @ts-ignore
      BackupService.importData.mockResolvedValue({ success: true });

      jest.useFakeTimers();
      // @ts-ignore
      await controller.handleImport(mockFile);

      expect(mockFile.text).toHaveBeenCalled();
      expect(BackupService.importData).toHaveBeenCalledWith('{"data":"test"}');
      expect(mockToaster.show).toHaveBeenCalledWith(expect.stringContaining('sucesso'), 'success');

      jest.runAllTimers();
      expect(chrome.runtime.reload).toHaveBeenCalled();
    });

    it('deve exibir erro se a validação da importação falhar', async () => {
      // Mock File
      const mockFile = {
        text: jest.fn().mockResolvedValue('invalid content'),
      };

      // @ts-ignore
      BackupService.importData.mockResolvedValue({ success: false, error: 'Formato inválido' });

      // @ts-ignore
      await controller.handleImport(mockFile);

      expect(mockToaster.show).toHaveBeenCalledWith(
        expect.stringContaining('Erro na importação'),
        'error'
      );
      expect(mockLogger.warn).toHaveBeenCalled();
      expect(chrome.runtime.reload).not.toHaveBeenCalled();
    });

    it('deve lidar com erro crítico na leitura do arquivo', async () => {
      // Mock File.text() to reject
      const mockFile = {
        text: jest.fn().mockRejectedValue(new Error('Erro leitura')),
      };

      // @ts-ignore
      await controller.handleImport(mockFile);

      expect(mockLogger.error).toHaveBeenCalledWith('Import failed', expect.any(Error));
      expect(mockToaster.show).toHaveBeenCalledWith(
        expect.stringContaining('Falha crítica'),
        'error'
      );
    });
  });

  describe('handleReset', () => {
    // Helper to simulate modal rendering content using polling
    async function getModalContent() {
      // 1. Inicia a chamada (promise pendente)
      const resetPromise = controller.handleReset();

      // 2. Poll para esperar o modal renderizar (max 1s)
      let attempts = 0;
      // Esperamos até que mockModalInstance.render tenha sido chamado
      while (mockModalInstance.render.mock.calls.length === 0 && attempts < 50) {
        // Se timers falsos estiverem ativos, precisamos avança-los para o setTimeout do poll rodar?
        // Não, o poll usa setTimeout real ou promise loops?
        // O loop usa setTimeout(r, 20). Se fake timers estiverem ON, isso trava.
        // Mas handleReset deve rodar com timers REAIS, exceto quando explicitamente testando timer.
        // Nos testes com fakeTimers, PRECISAMOS avançar o tempo ou não usar polling baseado em setTimeout.
        // Mas aqui usamos Promise(setTimeout).
        // Solução: garantir que getModalContent avance tempo se fakeTimers estiver ON?
        // Ou apenas não usar FakeTimers DURANTE o getModalContent.
        await new Promise((r) => setTimeout(r, 20));
        attempts++;
      }

      if (mockModalInstance.render.mock.calls.length === 0) {
        throw new Error('Modal.render não foi chamado - timeout esperando import/render');
      }

      const content = mockModalInstance.render.mock.calls[0][0]; // Primeiro arg
      return { content, resetPromise };
    }

    it('deve renderizar o modal corretamente', async () => {
      const { content } = await getModalContent();

      expect(content.querySelector('p').textContent).toContain('apagará TODOS');
      expect(content.querySelector('#confirmReset')).not.toBeNull();
      // Botão confirmar deve começar desabilitado
      const buttons = content.querySelectorAll('button');
      const confirmBtn = buttons[1];
      expect(confirmBtn.disabled).toBe(true);
    });

    it('deve habilitar botão confirmar ao marcar checkbox', async () => {
      const { content } = await getModalContent();
      const checkbox = content.querySelector('#confirmReset');
      const buttons = content.querySelectorAll('button');
      const confirmBtn = buttons[1];

      // Simula click/change
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change'));

      expect(confirmBtn.disabled).toBe(false);
      expect(confirmBtn.style.opacity).toBe('1');

      // Desmarcar
      checkbox.checked = false;
      checkbox.dispatchEvent(new Event('change'));
      expect(confirmBtn.disabled).toBe(true);
    });

    it('deve fechar modal e resolver false ao clicar cancelar', async () => {
      const { content, resetPromise } = await getModalContent();
      const buttons = content.querySelectorAll('button');
      const cancelBtn = buttons[0];

      cancelBtn.click();

      const result = await resetPromise;
      expect(result).toBe(false);
      expect(mockModalInstance.close).toHaveBeenCalled();
    });

    it('deve realizar reset e resolver true ao confirmar', async () => {
      const { content, resetPromise } = await getModalContent();
      const checkbox = content.querySelector('#confirmReset');
      const buttons = content.querySelectorAll('button');
      const confirmBtn = buttons[1];

      // Habilitar
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change'));

      // Antes de clicar, ativamos fake timers para controlar o reload
      jest.useFakeTimers();

      // Clicar Confirmar (dispara processo async)
      await confirmBtn.dispatchEvent(new Event('click'));

      // Flush promises sem usar setTimeout (pois fake timers estão ON)
      // Precisamos rodar microtasks pendentes (await chrome.storage...)
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();

      expect(chrome.storage.local.clear).toHaveBeenCalled();
      expect(mockLogger.info).toHaveBeenCalledWith('User performed factory reset.');
      expect(mockToaster.show).toHaveBeenCalledWith(expect.stringContaining('resetada'), 'warning');

      // O modal deve fechar e a promise resolver
      const result = await resetPromise;
      expect(result).toBe(true);

      // Verificar reload (dentro do setTimeout 1000ms)
      jest.runAllTimers();
      expect(chrome.runtime.reload).toHaveBeenCalled();
    });

    it('deve tratar erro no reset', async () => {
      const { content, resetPromise } = await getModalContent();
      const checkbox = content.querySelector('#confirmReset');
      const buttons = content.querySelectorAll('button');
      const confirmBtn = buttons[1];

      // @ts-ignore
      chrome.storage.local.clear.mockRejectedValue(new Error('Storage Fail'));

      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change'));

      // Click and catch potential rejection inside the handler (it catches)
      confirmBtn.dispatchEvent(new Event('click'));

      // Flush promises
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockLogger.error).toHaveBeenCalled();
      expect(mockToaster.show).toHaveBeenCalledWith(
        expect.stringContaining('Falha ao resetar'),
        'error'
      );

      const result = await resetPromise;
      expect(result).toBe(false);
    });
  });
});
