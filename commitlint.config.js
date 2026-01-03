const fs = require('fs');
const path = require('path');

module.exports = {
  extends: ['@commitlint/config-conventional'],

  // Plugin customizado para validar referências a issues
  plugins: [
    {
      rules: {
        'issue-reference': ({ subject, body }) => {
          const fullMessage = `${subject}\n${body || ''}`;

          // Verificar se tem "refs ISSUE-" ou "closes ISSUE-"
          const issueRefPattern = /(?:refs|closes)\s+ISSUE-(\d+)/gi;
          const matches = [...fullMessage.matchAll(issueRefPattern)];

          if (matches.length === 0) {
            // Não é obrigatório, apenas retorna true
            return [true];
          }

          // Validar se issues existem
          const issuesDir = path.join(__dirname, '.github', 'ISSUES');
          const errors = [];

          for (const match of matches) {
            const issueNum = match[1];
            const paddedNum = issueNum.padStart(3, '0');

            // Verificar em OPEN/ e CLOSED/
            const openDir = path.join(issuesDir, 'OPEN');
            const closedDir = path.join(issuesDir, 'CLOSED');

            try {
              let found = false;

              // Verificar OPEN/
              if (fs.existsSync(openDir)) {
                const openFiles = fs.readdirSync(openDir);
                found = openFiles.some(
                  (file) => file.startsWith(`OPEN-ISSUE-${paddedNum}_`) && file.endsWith('.md')
                );
              }

              // Verificar CLOSED/
              if (!found && fs.existsSync(closedDir)) {
                const closedFiles = fs.readdirSync(closedDir);
                found = closedFiles.some(
                  (file) => file.startsWith(`CLOSED-ISSUE-${paddedNum}_`) && file.endsWith('.md')
                );
              }

              if (!found) {
                errors.push(`ISSUE-${paddedNum} não encontrada em .github/ISSUES/`);
              }
            } catch (err) {
              // Se houver erro na leitura, aceitar (não bloquear commit)
              return [true];
            }
          }

          if (errors.length > 0) {
            return [false, errors.join('\n')];
          }

          return [true];
        },
      },
    },
  ],

  // Regras customizadas
  rules: {
    'subject-case': [0], // Desabilita validação de case (permite PT-BR)
    'body-max-line-length': [0], // Desabilita limite de linha no body
    'issue-reference': [1, 'always'], // Warning, não erro
  },
};
