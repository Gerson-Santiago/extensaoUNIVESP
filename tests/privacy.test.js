const fs = require('fs');
const path = require('path');

// Configuração dos diretórios a serem analisados
const PROJECT_ROOT = path.resolve(__dirname, '..');
const SEARCH_DIRS = ['scripts', 'popup', 'sidepanel', 'logic', 'views', 'utils'];

// Função auxiliar para listar todos os arquivos .js recursivamente
function getAllJsFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllJsFiles(fullPath, arrayOfFiles);
    } else {
      if (file.endsWith('.js')) {
        arrayOfFiles.push(fullPath);
      }
    }
  });
  return arrayOfFiles;
}

describe('Auditoria de Privacidade e Segurança (Deep Scan)', () => {
  let allJsFiles = [];

  beforeAll(() => {
    SEARCH_DIRS.forEach((dir) => {
      const fullPath = path.join(PROJECT_ROOT, dir);
      if (fs.existsSync(fullPath)) {
        allJsFiles = getAllJsFiles(fullPath, allJsFiles);
      }
    });
  });

  test('ZERO BACKEND: Não deve haver chamadas para domínios externos não autorizados (Firebase, Analytics, etc)', () => {
    // Domínios estritamente proibidos pois implicariam que temos um backend ou tracker oculto
    const forbiddenDomains = [
      'firebaseio.com',
      'googleapis.com', // Cuidado: APIs oficiais podem usar, mas queremos saber se há uso não documentado
      'google-analytics.com',
      'mixpanel.com',
      'hotjar.com',
      'segment.io',
      'amplitude.com',
      'herokuapp.com',
      'vercel.app',
      'aws.amazon.com',
    ];

    // Exceções conhecidas e justificadas (se houver, adicione aqui com comentário explicativo)
    const whitelistedFiles = [
      // 'caminho/arquivo.js'
    ];

    let violations = [];

    allJsFiles.forEach((file) => {
      if (whitelistedFiles.some((w) => file.includes(w))) return;

      const content = fs.readFileSync(file, 'utf8');
      forbiddenDomains.forEach((domain) => {
        if (content.includes(domain)) {
          violations.push(`Arquivo: ${path.basename(file)} contém domínio proibido: ${domain}`);
        }
      });
    });

    expect(violations).toEqual([]);
  });

  test('SEGURANÇA ARQUITETURAL: Preferência por chrome.storage sobre localStorage', () => {
    /**
     * @why
     * Content Scripts compartilham a mesma origem da página web, mas vivem em um "Isolated World".
     * Porém, se usarmos 'localStorage', ele é COMPARTILHADO com a página.
     * Isso significa que um script malicioso na página da UNIVESP (ou um XSS nela) poderia ler
     * dados que a extensão salvou no localStorage.
     *
     * O 'chrome.storage' é isolado e só acessível pela extensão, mitigando vazamento de dados
     * caso o site hospedeiro seja comprometido.
     */

    let localStorageUsages = [];

    allJsFiles.forEach((file) => {
      const content = fs.readFileSync(file, 'utf8');
      // Busca uso de localStorage.setItem ou localStorage.getItem
      // Ignoramos comentários
      const lines = content.split('\n');
      lines.forEach((line, index) => {
        const cleanLine = line.trim();
        if (
          !cleanLine.startsWith('//') &&
          (cleanLine.includes('localStorage.setItem') || cleanLine.includes('localStorage.getItem'))
        ) {
          localStorageUsages.push(`${path.basename(file)}:${index + 1}`);
        }
      });
    });

    // Se houver uso legítimo, adicionar à lista de exceções abaixo e justificar
    // Atualmente, a política é ZERO localStorage para dados sensíveis.
    expect(localStorageUsages).toEqual([]);
  });

  test('PRIVACIDADE: Não deve haver envio de dados via fetch para IPs ou domínios desconhecidos', () => {
    // Procura por fetch() solto que não seja para a própria API do browser ou URLs relativas conhecidas
    let suspiciousFetches = [];

    allJsFiles.forEach((file) => {
      const content = fs.readFileSync(file, 'utf8');
      // Regex simples para achar fetch de literais de string que comecem com http
      // Não pega tudo, mas pega "hardcoded backends"
      const matches = content.match(
        /fetch\(['"`]https?:\/\/(?!ava\.univesp\.br|sei\.univesp\.br)/g
      );

      if (matches) {
        suspiciousFetches.push({ file: path.basename(file), matches });
      }
    });

    expect(suspiciousFetches).toHaveLength(0);
  });
});
