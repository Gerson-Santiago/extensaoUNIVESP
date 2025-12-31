# 📊 Plano de Observabilidade: Structured Logging

### 1. Base Conceitual
O sistema de logs da `extensaoUNIVESP` não é apenas para debug, é **Engenharia de Software Empírica**:
- **Teoria da Informação**: Logs são dados com semântica rica (`prefix`, `message`, `metadata`).
- **Observabilidade**: Capacidade de entender o estado interno do sistema apenas pelos sinais externos (Logs).
- **Semântica Explícita**: Uso de tags `/**#LOG_FEATURE*/` para auditoria e métricas.

### 2. Definição Técnica (v2.9.5)
- **Centralizador**: `shared/utils/Logger.js` é a única interface permitida.
- **Saída Estruturada**: 
  ```javascript
  Logger.info(NAMESPACE, 'Mensagem', { data: 123 });
  // [Namespace] Mensagem { data: 123 }
  ```
- **Controle**: Ativado via `localStorage.setItem('UNIVESP_DEBUG', 'true')`.
- **Higiene de Produção**: Zero `console.log` no bundle principal.

### 3. Exceção Técnica: Scripts Injetados
Scripts que rodam no contexto da página do AVA não têm acesso ao `Logger.js`.
- **Estratégia**: Recebem `isDebugEnabled` como argumento.
- **Padronização**: Usam função local `log()` com prefixo `[Extension:Tag]`.
- **Auditoria**: Marcados com `/**#LOG_INJECTED*/` para fácil identificação.

### 4. Roadmap de Observabilidade
- [x] Unificação em `Logger.js`.
- [x] Remoção de todos os console statements em código Core (v2.9.2 e v2.9.5).
- [ ] Integração com `runtime.sendMessage` para centralizar logs injetados no console da extensão.
- [ ] Exportação de logs para auditoria de suporte ao usuário.
