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
  - **Importação em Lote**: A extensão lê a lista de cursos na página "Cursos".
  - **Deep Scraping (Novo)**: Para garantir que o link do curso leve à "Página Inicial" e não aos Avisos, a extensão acessa brevemente a URL de entrada de cada curso em background (*fetch*) para capturar o ID de conteúdo correto (`content_id`).
  - **Leitura de Semanas**: Ao clicar em "Atualizar Semanas", a extensão lê o DOM da aba ativa para listar os links de aula.
  - **Armazenamento**: Todos os dados (nomes de cursos, links) são salvos **apenas localmente** no navegador (`chrome.storage.sync`). Nenhuma informação é enviada para servidores externos.


## 3. Links Rápidos (Popup)
O menu da extensão (Popup) oferece atalhos diretos para os seguintes portais oficiais:
- **Portal SEI**: `https://sei.univesp.br/index.xhtml`
- **AVA (Cursos)**: `https://ava.univesp.br/ultra/course`
- **Área do Aluno**: `https://univesp.br/acesso_aluno.html`
- **Sistema de Provas**: `https://prova.univesp.br/`

Esses links apenas abrem uma nova aba no navegador, sem passar parâmetros adicionais.
