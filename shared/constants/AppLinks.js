/**
 * Centraliza os links externos da aplicação para facilitar manutenção.
 * Se a UNIVESP mudar as URLs, alteramos apenas aqui.
 */
export const AppLinks = {
  // Portal SEI (Home)
  SEI_HOME: 'https://sei.univesp.br/index.xhtml',

  // AVA (Blackboard)
  AVA_HOME: 'https://ava.univesp.br/ultra/course',

  // Área do Aluno (Antigo Sistema Acadêmico?)
  ALUNO_HOME: 'https://univesp.br/acesso_aluno.html',

  // Sistema de Provas (Url frágil - pode mudar parâmetros m=13, ptp=...)
  // Última verificação: 01/01/2026 (runner.php com module 13)
  PROVAS_HOME: 'https://prova.univesp.br/runner.php?m=13&it=-1&ptp=c3JjPTk5OTky',

  // GitHub Oficial
  GITHUB_REPO: 'https://github.com/Gerson-Santiago/extensaoUNIVESP',
};
