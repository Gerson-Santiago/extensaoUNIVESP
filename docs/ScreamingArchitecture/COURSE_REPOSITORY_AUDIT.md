# 🏎️ Relatório de Auditoria: CourseRepository

**Data:** 17/12/2025
**Objeto:** `sidepanel/data/repositories/CourseRepository.js`
**Destino:** `features/courses/data/CourseRepository.js`

## 1. Análise Estática (Code Review)

### Ponto Fortes ✅
*   **Abstração**: O resto do app não chama `chrome.storage` diretamente, chama `CourseRepository.add`. Isso é excelente.
*   **API Assíncrona**: Usa callbacks (padrão legado do Chrome, mas funcional).
*   **Validação**: Checa duplicação de URL antes de salvar.

### Pontos de Atenção ⚠️
*   **Acoplamento**: A classe "sabe" que está no Chrome (`chrome.storage.sync`).
*   **Callback Hell**: Uso extensivo de callbacks aninhados em vez de Promises/Async-Await (embora o Chrome moderno suporte Promises).
*   **Formato de Dados**: O esquema do objeto `course` ({id, name, url, weeks}) está implícito no código.

---

## 2. Conformidade & Privacidade (LGPD Compliance)

Referência: `estudos/juridico/relatorio_conformidade.md`

### 🔒 Segurança de Dados
*   **Localização**: `chrome.storage.sync`.
    *   *Veredito*: **SEGURO**. Dados criptografados e sincronizados pela conta Google do usuário.
*   **Exposição**: O Repositório é público para a extensão, mas isolado do mundo web.
    *   *Risco*: Scripts de conteúdo (injetados) **NÃO** acessam isso diretamente. A comunicação deve ser via Mensagens ou o Repositório deve ser usado apenas no contexto do Sidepanel/Background.
    *   *Check*: O arquivo atual reside no sidepanel context. **OK**.

### 🛡️ Prevenção de Vazamento
*   O código contém apenas lógica de GET/SET local.
*   **Não há `fetch()`** ou envio para terceiros.
*   **Conformidade**: Atende ao princípio "Data Minimization" (Apenas nome/url/semanas).

---

## 3. Estratégia de Migração

Para realizar a migração "estilo Fórmula 1" (Rápida, Precisa, Segura), não faremos refatoração profunda de lógica agora (ex: mudar para Promises), para respeitar o princípio **"Move First, Refactor Later"** e manter o Green Build.

### Plano de Voo:
1.  **Isolamento**: Mover arquivo físico.
2.  **Blindagem**: Atualizar imports globais usando `grep` cirúrgico.
3.  **Teste de Carga**: O teste `storage.test.js` (agora `CourseRepository.test.js`) deve garantir que INSERIR, LER e DELETAR continue funcionando.

### 📝 Regra de Ouro (Screaming Arch)
> "O CourseRepository é o Guardião dos Dados do Curso. Ninguém toca no `chrome.storage.savedCourses` sem passar por ele."

---

## 4. Checklist de Aprovação

- [x] Arquivo movido para `features/courses/data/`.
- [x] Testes movidos e passando.
- [x] `sidepanel.js` atualizado.
- [x] `Import` feature atualizada.
- [x] Nenhum erro de `chrome is not defined` (garantir mock nos testes).
