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
    'sidepanel/styles/global.css',
    'sidepanel/styles/layout.css',
    'sidepanel/styles/components/nav.css',
    'sidepanel/styles/components/card.css',
    'sidepanel/styles/components/modal.css',
    'sidepanel/styles/components/button.css',
    'sidepanel/styles/views/home.css',
    'sidepanel/styles/views/courses.css',
    'sidepanel/styles/views/settings.css',
    'sidepanel/logic/scraper.js',
    'sidepanel/logic/storage.js',
    'sidepanel/logic/tabs.js',
    'sidepanel/logic/batchScraper.js', // 🆕
    'sidepanel/components/Items/CourseItem.js',
    'sidepanel/components/Items/WeekItem.js',
    'sidepanel/views/FeedbackView.js',
    'sidepanel/views/HomeView.js', // 🆕
    'sidepanel/views/CoursesView.js', // 🆕
    'sidepanel/views/CourseDetailsView.js', // 🆕
    'sidepanel/views/SettingsView.js', // 🆕
    'shared/utils/settings.js', // 🆕
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
      '../sidepanel/components/Items/CourseItem.js',
      '../sidepanel/components/Items/WeekItem.js',
      '../shared/utils/settings.js',
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

  // Testes de estrutura do manifest
  test('manifest.json deve ter estrutura válida', () => {
    const manifestPath = path.join(projectRoot, 'manifest.json');
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);

    expect(manifest).toHaveProperty('name');
    expect(manifest).toHaveProperty('version');
    expect(manifest).toHaveProperty('manifest_version');
    expect(manifest).toHaveProperty('permissions');
  });

  test('manifest.json deve ter permissões mínimas necessárias', () => {
    const manifestPath = path.join(projectRoot, 'manifest.json');
    const manifestContent = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(manifestContent);

    const requiredPermissions = ['storage', 'scripting', 'tabs', 'sidePanel'];

    requiredPermissions.forEach((permission) => {
      expect(manifest.permissions).toContain(permission);
    });
  });
});
