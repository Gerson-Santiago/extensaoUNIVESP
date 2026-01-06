# 🛡️ ISSUE-046: Validação de Integridade de Imports e Código Morto

**Prioridade:** 🛡️ Alta (Qualidade & Manutenção)
**Status:** ✅ Resolvida
**Componente:** `architecture` / `tests`
**Versão Alvo:** v2.10.0

---

## 📖 Contexto
Após refatorações e limpezas, foi criada uma suite de testes de arquitetura para garantir a integridade referencial do projeto (Link Integrity) e higiene de código (Dead Code Detection).

## 🎯 Objetivos
1.  **Broken Links:** Garantir que TODO `import`, `require`, `url()`, `<link>` e `<script>` aponte para um arquivo existente.
2.  **Dead Code:** Identificar arquivos que existem no disco mas não são referenciados por ninguém.
3.  **Automação:** Criar testes automatizados (`tests/architecture/`).

## ✅ Critérios de Aceite
- [x] Teste `broken-links.test.js` criado e rodando no Jest.
- [x] Todos os imports JS (`import`, `require`) validados com exclusão de fixtures.
- [x] Imports CSS (`@import`, `url()`) validados com Regex preciso.
- [x] Referências HTML (`href`, `src`) validadas com filtro de links externos.
- [x] Relatório de arquivos órfãos gerado e verificado (`orphan-code.test.js` passando com 0 órfãos críticos).
- [x] Correção de quaisquer links quebrados e lint errors encontrados.

## 🛠️ Detalhes da Solução
- Implementado crawler de arquivos em `tests/architecture/`.
- Regex otimizado para não acusar falsos positivos em parenteses de `url()`.
- Filtros manuais para ignorar fixtures de testes que possuem caminhos simulados.
- Integração contínua via `npm test` garantida.

## 🛠️ Plano de Implementação
1.  Criar `tests/architecture/integrity.test.js`.
2.  Implementar crawler que varre o diretório do projeto.
3.  Usar Regex para extrair padrões de importação.
4.  Resolver caminhos relativos e absolutos.
5.  Validar existência de arquivos alvo.
6.  Listar arquivos varridos vs. arquivos referenciados para achar órfãos.
