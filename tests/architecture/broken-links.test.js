import fs from 'fs';
import path from 'path';
// @ts-ignore
import { sync as globSync } from 'glob';

describe('Integridade Arquitetural: Links e Referências', () => {
    const projectRoot = path.resolve(__dirname, '../../');

    // Helper para validar existência de arquivo
    const validatePath = (baseFile, relativeImport) => {
        // Ignora pacotes NPM, node builtins e aliases de teste
        if (!relativeImport.startsWith('.') && !relativeImport.startsWith('/')) {
            return;
        }

        // Ignora aliases configurados (ex: @/) se for arquivo de teste
        if (relativeImport.startsWith('@') && baseFile.includes('.test.js')) {
            return;
        }

        const dirName = path.dirname(baseFile);
        let resolvedPath;

        if (relativeImport.startsWith('/')) {
            // Root relative (comum em web)
            resolvedPath = path.resolve(projectRoot, relativeImport.substring(1));
        } else {
            // Relative
            resolvedPath = path.resolve(dirName, relativeImport);
        }

        // Tenta resolver com e sem extensão se for import JS
        let finalPath = resolvedPath;
        if (!fs.existsSync(finalPath) && !path.extname(finalPath) && !relativeImport.endsWith('/')) {
            // Tenta adicionar .js
            if (fs.existsSync(finalPath + '.js')) finalPath += '.js';
            // Tenta index.js
            else if (fs.existsSync(path.join(finalPath, 'index.js'))) finalPath = path.join(finalPath, 'index.js');
        }

        if (!fs.existsSync(finalPath)) {
            throw new Error(`LINK QUEBRADO em '${path.relative(projectRoot, baseFile)}':
        Referência: '${relativeImport}'
        Caminho Absoluto Tentado: '${finalPath}'
        O arquivo não existe.`);
        }
    };

    const isFixture = (f) => f.includes('fixtures') || f.includes('__mocks__');

    // 1. Validação de JavaScript (Imports e Requires)
    const jsFiles = globSync('**/*.js', {
        cwd: projectRoot,
        ignore: ['node_modules/**', 'dist/**', 'coverage/**', '.git/**'],
        absolute: true,
    }).filter(f => !isFixture(f));

    test.each(jsFiles)('JS: %s deve ter imports válidos', (filePath) => {
        const content = fs.readFileSync(filePath, 'utf8');
        const regex = /from\s+['"]([^'"]+)['"]|import\s*\(['"]([^'"]+)['"]\)|require\s*\(['"]([^'"]+)['"]\)|import\s+['"]([^'"]+)['"]/g;

        let match;
        while ((match = regex.exec(content)) !== null) {
            const importPath = match[1] || match[2] || match[3] || match[4];
            if (importPath) validatePath(filePath, importPath);
        }
    });

    // 2. Validação de CSS (@import e url())
    const cssFiles = globSync('**/*.css', {
        cwd: projectRoot,
        ignore: ['node_modules/**', 'dist/**', 'coverage/**'],
        absolute: true,
    }).filter(f => !isFixture(f));

    if (cssFiles.length > 0) {
        test.each(cssFiles)('CSS: %s deve ter referências válidas', (filePath) => {
            const content = fs.readFileSync(filePath, 'utf8');
            const regex = /@import\s+url\(['"]?([^'")]+)['"]?\)|@import\s+['"]([^'"]+)['"]|url\(['"]?([^'")]+)['"]?\)/g;

            let match;
            while ((match = regex.exec(content)) !== null) {
                const importPath = match[1] || match[2] || match[3];
                if (importPath && !importPath.startsWith('data:')) {
                    validatePath(filePath, importPath);
                }
            }
        });
    }

    // 3. Validação de HTML (src e href)
    const htmlFiles = globSync('**/*.html', {
        cwd: projectRoot,
        ignore: ['node_modules/**', 'dist/**', 'coverage/**'],
        absolute: true,
    }).filter(f => !isFixture(f));

    if (htmlFiles.length > 0) {
        test.each(htmlFiles)('HTML: %s deve ter links válidos', (filePath) => {
            const content = fs.readFileSync(filePath, 'utf8');
            const regex = /(?:src|href)=['"]([^'"]+)['"]/g;

            let match;
            while ((match = regex.exec(content)) !== null) {
                const linkPath = match[1];
                if (
                    linkPath.startsWith('http') ||
                    linkPath.startsWith('//') ||
                    linkPath.startsWith('#') ||
                    linkPath.startsWith('javascript:') ||
                    linkPath.startsWith('mailto:') ||
                    linkPath.startsWith('chrome-extension:')
                ) {
                    continue;
                }
                validatePath(filePath, linkPath);
            }
        });
    }
});
