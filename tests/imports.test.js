const fs = require('fs');
const path = require('path');

describe('Verificação de Integridade de Arquivos e Imports', () => {
  const projectRoot = path.resolve(__dirname, '..');

  const filesToVerify = [
    'manifest.json',
    'popup/popup.html',
    'popup/popup.js',
    'popup/popup.css',
    'sidepanel/sidepanel.html',
    'sidepanel/sidepanel.js',
    'sidepanel/sidepanel.css',
    'sidepanel/logic/scraper.js',
    'sidepanel/logic/storage.js',
    'sidepanel/logic/tabs.js',
    'sidepanel/ui/components.js',
    'scripts/content.js',
  ];

  test.each(filesToVerify)('Arquivo deve existir: %s', (relativePath) => {
    const fullPath = path.join(projectRoot, relativePath);
    expect(fs.existsSync(fullPath)).toBe(true);
  });

  // Teste de sintaxe/importação básica
  test('Deve conseguir importar módulos JS sem erro de sintaxe', async () => {
    const modulesToImport = [
      '../sidepanel/logic/scraper.js',
      '../sidepanel/logic/storage.js',
      '../sidepanel/logic/tabs.js',
      '../sidepanel/ui/components.js',
      '../popup/logic/settings.js',
    ];

    for (const modulePath of modulesToImport) {
      try {
        await import(modulePath);
      } catch (e) {
        // Falha se não conseguir importar (erro de sintaxe ou deps)
        throw new Error(`Erro ao importar ${modulePath}: ${e.message}`);
      }
    }
  });
});
