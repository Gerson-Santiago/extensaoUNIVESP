const fs = require('fs');
const path = require('path');
const glob = require('glob');

describe('Verificação de Integridade de Links (Anti-Tela Branca)', () => {
  const projectRoot = path.resolve(__dirname, '..');

  // Encontra todos os arquivos .js nas pastas relevantes
  const allJsFiles = glob.sync('**/*.js', {
    cwd: projectRoot,
    ignore: ['node_modules/**', 'tests/**', 'coverage/**', 'dist/**', 'jest.config.js', 'babel.config.js'],
    absolute: true,
  });

  test.each(allJsFiles)('Arquivo deve ter imports válidos: %s', (filePath) => {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativeFilePath = path.relative(projectRoot, filePath);

    // Regex para capturar imports estáticos (import x from 'path' e import 'path')
    // e imports dinâmicos (import('path'))
    const importRegex = /from\s+['"]([^'"]+)['"]|import\s*\(['"]([^'"]+)['"]\)|import\s+['"]([^'"]+)['"]/g;

    let match;
    while ((match = importRegex.exec(content)) !== null) {
      // O path pode estar no grupo 1, 2 ou 3 dependendo do tipo de import
      const importPath = match[1] || match[2] || match[3];

      // Ignora pacotes npm (não começam com . ou /) e aliases (começam com @ - assumimos que aliases são para testes, mas se tiver em prod, deve falhar se não houver bundler)
      // REGRA: Em prod, não aceitamos aliases sem bundler.
      if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
        // Se for um alias conhecido (@features), alertar se estiver em arquivo de prod
        if (importPath.startsWith('@') && !filePath.includes('.test.js')) {
          throw new Error(
            `PROIBIDO: Arquivo de produção '${relativeFilePath}' está usando alias '${importPath}'. Use caminho relativo (../) para compatibilidade com navegador.`
          );
        }
        continue; // Ignora bibliotecas externas pura
      }

      const dirName = path.dirname(filePath);
      const resolvedPath = path.resolve(dirName, importPath);

      // Verificação 1: O arquivo existe?
      const exists = fs.existsSync(resolvedPath);

      if (!exists) {
        throw new Error(
          `LINK QUEBRADO: '${relativeFilePath}' tenta importar '${importPath}', mas o arquivo não existe em '${resolvedPath}'.`
        );
      }
    }
  });

  test('Manifest resources devem existir', () => {
    const manifestPath = path.join(projectRoot, 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    // Verifica background service worker
    if (manifest.background && manifest.background.service_worker) {
      const swPath = path.join(projectRoot, manifest.background.service_worker);
      expect(fs.existsSync(swPath)).toBe(true);
    }

    // Verifica sidepanel
    if (manifest.side_panel && manifest.side_panel.default_path) {
      const spPath = path.join(projectRoot, manifest.side_panel.default_path);
      expect(fs.existsSync(spPath)).toBe(true);
    }

    // Verifica content scripts
    if (manifest.content_scripts) {
      manifest.content_scripts.forEach(cs => {
        if (cs.js) {
          cs.js.forEach(jsFile => {
            const jsPath = path.join(projectRoot, jsFile);
            if (!fs.existsSync(jsPath)) {
              throw new Error(`MANIFEST LINK QUEBRADO: Content script '${jsFile}' não existe.`);
            }
          });
        }
        if (cs.css) {
          cs.css.forEach(cssFile => {
            const cssPath = path.join(projectRoot, cssFile);
            if (!fs.existsSync(cssPath)) {
              throw new Error(`MANIFEST LINK QUEBRADO: CSS '${cssFile}' não existe.`);
            }
          });
        }
      });
    }
  });
});
