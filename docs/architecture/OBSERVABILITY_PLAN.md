# Plano de Observabilidade
Status: v2.9.7 | Centralizador: Logger.js

Estratégia: Logs estruturados (info, warn, error) com namespaces.
Acesso: localStorage.setItem('UNIVESP_DEBUG', 'true').
Saída: Zero console.log em bundle de produção.
Scripts Injetados: Recebem isDebugEnabled; log local com prefixo [Extension].
Roadmap: Centralizar via sendMessage; exportar para suporte.
