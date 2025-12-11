# Uso dos Links UNIVESP

Esta extensão interage com os portais da UNIVESP para oferecer funcionalidades de produtividade. Abaixo detalhamos como cada sistema é acessado.

## 1. Portal SEI (Sistema Eletrônico de Informações)
- **URL Alvo**: `https://sei.univesp.br/*`
- **Funcionalidade**: 
  - A extensão injeta um script (`scripts/content.js`) apenas nas páginas deste domínio.
  - O script localiza o campo de email (`form:email`) na tela de login.
  - Se o campo estiver vazio, ele preenche automaticamente com o email configurado pelo usuário no Popup da extensão.
  - **Nota**: Nenhuma senha é coletada, armazenada ou preenchida. Apenas o email é inserido para agilizar o login.

## 2. AVA (Ambiente Virtual de Aprendizagem / Blackboard)
- **URLs Alvo**: Páginas de cursos no Blackboard (ex: `https://ava.univesp.br/...` ou domínios relacionados).
- **Funcionalidade**:
  - **Leitura (Scraping)**: Quando o usuário clica em "Adicionar Página Atual" ou "Atualizar" no Painel Lateral, a extensão lê o DOM (estrutura HTML) da aba ativa.
  - **Extração**: Ela busca por links (`<a>`) que contenham a palavra "Semana" (no texto ou no atributo `title`), inclusive em estruturas aninhadas (`span[title]`).
  - **Armazenamento**: O nome da semana e o link direto são salvos localmente no navegador do usuário (`chrome.storage.sync`) para criar um menu de navegação rápida.
  - **Privacidade**: Os dados do curso ficam salvos apenas no navegador do usuário. Nada é enviado para servidores externos.

## 3. Links Rápidos (Popup)
O menu da extensão (Popup) oferece atalhos diretos para os seguintes portais oficiais:
- **Portal SEI**: `https://sei.univesp.br/index.xhtml`
- **AVA (Cursos)**: `https://ava.univesp.br/ultra/course`
- **Área do Aluno**: `https://univesp.br/acesso_aluno.html`
- **Sistema de Provas**: `https://prova.univesp.br/`

Esses links apenas abrem uma nova aba no navegador, sem passar parâmetros adicionais.
