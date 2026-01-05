/**
 * @file build-dist.js
 * @description Pipeline de Lançamento Profissional (Release Pipeline).
 *
 * Funcionalidades:
 * 1. Pre-flight Quality Gate (Check Lint/Types)
 * 2. Version Sync (package.json <-> manifest.json)
 * 3. Atomic Distribution Construction (dist/)
 * 4. Zip Archiving for CWS
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const CONFIG = {
  sourceDir: '.',
  distDir: './dist',
  appName: 'central-univesp',
  whitelist: [
    'assets',
    'background',
    'features',
    'shared',
    'sidepanel',
    'manifest.json',
    'LICENSE',
    'README.md',
  ],
  ignoreExtensions: ['.test.js', '.md', '.map', '.txt'],
  ignoreFolders: ['tests', '__tests__', 'mock', 'docs', 'scripts', '.git', '.github'],
};

function build() {
  console.log('🚀 [RELEASE PIPELINE] Iniciando Processo de Lançamento...');

  // 1. Pre-flight Check (Quality Gate)
  console.log('🔍 [1/4] Executando Quality Gate (Link & Type Check)...');
  try {
    execSync('npm run check', { stdio: 'inherit' });
    console.log('✅ Quality Gate: PASS');
  } catch {
    console.error(
      '❌ [CANCELADO] Falha no Quality Gate. Corrija os lints/erros antes de gerar o pacote.'
    );
    process.exit(1);
  }

  // 2. Sincronização de Versão
  console.log('🔄 [2/4] Sincronizando versões...');
  const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
  const manifestPath = './manifest.json';
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  if (manifest.version !== packageJson.version) {
    console.warn(
      `⚠️ Versão divergente! Manifest: ${manifest.version}, Package: ${packageJson.version}`
    );
    console.log(`➡️  Atualizando Manifest para v${packageJson.version}...`);
    manifest.version = packageJson.version;
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  }
  const version = packageJson.version;

  // 3. Limpar e Criar dist/
  if (fs.existsSync(CONFIG.distDir)) {
    fs.rmSync(CONFIG.distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(CONFIG.distDir);

  // 4. Cópia Blindada
  console.log('📦 [3/4] Empacotando arquivos de produção...');
  let filesCopied = 0;

  function copyRecursive(src, dest) {
    const stats = fs.statSync(src);
    const baseName = path.basename(src);

    if (stats.isDirectory()) {
      if (CONFIG.ignoreFolders.includes(baseName)) return;
      if (baseName.startsWith('.') && baseName !== '.') return;

      if (src === CONFIG.sourceDir) {
        fs.readdirSync(src).forEach((entry) => {
          if (CONFIG.whitelist.includes(entry)) {
            copyRecursive(path.join(src, entry), path.join(dest, entry));
          }
        });
        return;
      }

      if (!fs.existsSync(dest)) fs.mkdirSync(dest);
      fs.readdirSync(src).forEach((entry) =>
        copyRecursive(path.join(src, entry), path.join(dest, entry))
      );
    } else {
      const ext = path.extname(src);
      if (CONFIG.ignoreExtensions.includes(ext) && baseName !== 'README.md') return;

      fs.copyFileSync(src, dest);
      filesCopied++;
    }
  }

  copyRecursive(CONFIG.sourceDir, CONFIG.distDir);
  console.log(`✅ ${filesCopied} arquivos empacotados.`);

  // 5. ZIP Final
  const zipName = `${CONFIG.appName}-v${version}.zip`;
  console.log(`🤐 [4/4] Gerando artefato final: ${zipName}...`);
  try {
    execSync(`cd ${CONFIG.distDir} && zip -r ../${zipName} ./* -x "*.DS_Store*"`);
    const zipSize = (fs.statSync(`./${zipName}`).size / 1024 / 1024).toFixed(2);
    console.log('\n🎉 [SUCESSO] Build concluído com perfeição!');
    console.log(`🆔 Versão: v${version}`);
    console.log(`📊 Tamanho: ${zipSize} MB`);
    console.log(`📁 Local: ./${zipName}`);
  } catch {
    console.error('❌ Falha ao compactar pacote. Verifique o comando zip.');
  }
}

try {
  build();
} catch (err) {
  console.error('💥 Falha crítica no build:', err.message);
  process.exit(1);
}
