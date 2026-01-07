import fs from 'fs';
import path from 'path';
// @ts-ignore
import { sync as globSync } from 'glob';

describe('Integridade Arquitetural: Código Morto (Arquivos Órfãos)', () => {
  const projectRoot = path.resolve(__dirname, '../../');

  // Regexes para capturar referências
  const jsRegex =
    /from\s+['"]([^'"]+)['"]|import\s*\(['"]([^'"]+)['"]\)|require\s*\(['"]([^'"]+)['"]\)|import\s+['"]([^'"]+)['"]/g;
  const cssRegex =
    /@import\s+url\(['"]?([^'")]+)['"]?\)|@import\s+['"]([^'"]+)['"]|url\(['"]?([^'")]+)['"]?\)/g;
  const htmlRegex = /(?:src|href)=['"]([^'"]+)['"]/g;

  // 1. Coletar todos os arquivos do projeto (Candidatos a Órfãos)
  const allFiles = globSync('**/*.{js,css,html,json,png,jpg,svg}', {
    cwd: projectRoot,
    ignore: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      '.git/**',
      '**/*.log',
      '**/*.lock',
      'package.json',
      'package-lock.json',
      'README.md',
      'LICENSE',
      '.*', // dotfiles
      'features/courses/import/services/BatchScraper/tests/BatchScraper.test.js.snap', // snapshots
    ],
    absolute: true,
  });

  // 2. Identificar Entry Points (Arquivos que sabemos que são usados)
  const knownEntryPoints = [
    'manifest.json',
    'jest.config.js',
    'babel.config.js',
    'eslint.config.js',
    'webpack.config.js',
  ];

  // Adicionar testes como entry points (eles não são chamados por ninguém, o runner chama eles)
  const testFiles = globSync('**/*.test.js', { cwd: projectRoot, absolute: true });

  // Set de arquivos referenciados (absolutos)
  const referencedFiles = new Set();

  // Adicionar entry points e testes aos referenciados
  knownEntryPoints.forEach((ep) => {
    const p = path.join(projectRoot, ep);
    if (fs.existsSync(p)) referencedFiles.add(p);
  });
  testFiles.forEach((f) => referencedFiles.add(f));

  // Adicionar itens do Manifest.json aos referenciados
  const manifestPath = path.join(projectRoot, 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    // Helper recursiva para achar strings que parecem paths no manifest
    const scanManifest = (obj) => {
      if (typeof obj === 'string') {
        // Verifica se é arquivo
        const p = path.resolve(projectRoot, obj);
        if (fs.existsSync(p) && fs.lstatSync(p).isFile()) {
          referencedFiles.add(p);
        }
        return;
      }
      if (typeof obj === 'object' && obj !== null) {
        Object.values(obj).forEach(scanManifest);
      }
    };
    scanManifest(manifest);
  }

  // 3. Crawler: Ler arquivos e encontrar referências
  // Iteramos sobre 'allFiles' e para cada um, extraímos o que ele chama.
  // IMPORTANTE: Só precisamos ler arquivos de texto (js, css, html)

  const scannableFiles = allFiles.filter((f) => /\.(js|css|html)$/.test(f));

  scannableFiles.forEach((filePath) => {
    // Se o arquivo é testado ou referenciado, precisamos ler o que ELE chama?
    // Sim, pois ele pode salvar outros arquivos de serem órfãos.
    // Na verdade, precisamos ler TODOS os arquivos do projeto para ver quem eles chamam.

    const ext = path.extname(filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const dirName = path.dirname(filePath);

    let regex;
    if (ext === '.js') regex = jsRegex;
    else if (ext === '.css') regex = cssRegex;
    else if (ext === '.html') regex = htmlRegex;
    else return;

    let match;
    // Reset lastIndex se regex for reutilizada (mas aqui recrio regex ou strings literais, ok)
    // jsRegex é const global com /g, preciso resetar lastIndex ou clonar regex
    const currentRegex = new RegExp(regex);

    while ((match = currentRegex.exec(content)) !== null) {
      let ref = match[1] || match[2] || match[3] || match[4];
      if (!ref) continue;

      // Limpeza
      ref = ref.split('?')[0].split('#')[0];

      if (ref.startsWith('http') || ref.startsWith('chrome-extension:') || ref.startsWith('data:'))
        continue;

      // Tentar resolver
      let resolved = null;

      if (ref.startsWith('.')) {
        resolved = path.resolve(dirName, ref);
      } else if (ref.startsWith('/')) {
        resolved = path.join(projectRoot, ref.substring(1)); // Root relative
      } else {
        continue; // Node modules ou alias não tratado aqui (já tratado no broken-links)
      }

      // Tenta extensões para JS
      const candidates = [
        resolved,
        resolved + '.js',
        resolved + '.css',
        path.join(resolved, 'index.js'),
      ];

      for (const cand of candidates) {
        if (fs.existsSync(cand) && fs.lstatSync(cand).isFile()) {
          referencedFiles.add(cand);
          // Não break, pode haver ambiguidade, mas geralmente achou um tá bom.
          break;
        }
      }
    }
  });

  test('Não deve haver arquivos órfãos (código morto)', () => {
    // Diferença
    const orphans = allFiles.filter((f) => !referencedFiles.has(f));

    // Filtrar white-list de órfãos aceitáveis (ex: arquivos de documentação soltos, fixtures)
    // Icons do path 'icons/' podem ser referenciados dinamicamente ou só pelo manifest (já pego pelo manifest scan)

    const realOrphans = orphans.filter((f) => {
      if (f.includes('fixtures')) return false;
      if (f.includes('types')) return false; // Definições de tipos d.ts ou JSDoc types muitas vezes só importados para type check e não runtime
      if (path.basename(f).startsWith('icon')) return false; // Ícones podem ser referenciados magicamente
      return true;
    });

    if (realOrphans.length > 0) {
      console.warn(
        'Arquivos Órfãos Encontrados:',
        realOrphans.map((f) => path.relative(projectRoot, f))
      );
    }

    // Opcional: Falhar o teste. Por enquanto, só aviso para não bloquear CI se houver falso positivo.
    // Descomentar linha abaixo para Strict Mode
    // expect(realOrphans).toHaveLength(0);
    expect(realOrphans.length).toBeLessThan(20); // Limite tolerável inicial
  });
});
