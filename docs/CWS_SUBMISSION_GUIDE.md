# Guia de Submissão Chrome Web Store - Central Univesp

Este guia contém os textos e justificativas técnicos necessários para preencher o painel do desenvolvedor da CWS, garantindo conformidade com o Manifest V3 e evitando rejeições por "Permission Creep" ou "Single Purpose".

---

## 1. Justificativas de Permissões (Permissions Justification)

No painel da CWS, você deve explicar o uso de cada permissão. Use os textos abaixo:

### storage
- **PT**: Usado para persistir localmente as preferências do usuário, temas e o cache das atividades acadêmicas para permitir acesso offline e performance.
- **EN**: Used to locally persist user preferences, themes, and academic activity cache to enable offline access and improved performance.

### sidePanel
- **PT**: Fornece uma interface de produtividade persistente e contextual que acompanha o aluno durante a navegação no AVA Univesp, sem cobrir o conteúdo da página.
- **EN**: Provides a persistent and contextual productivity interface that assists students while navigating the Univesp AVA, without overlapping web page content.

### scripting
- **PT**: Necessário para executar funções de extração de dados locais dentro do contexto acadêmico (DOM) para converter a estrutura do AVA em um formato organizado. Não injeta código remoto.
- **EN**: Required to execute local data extraction functions within the academic context (DOM) to transform the AVA structure into an organized format. Does not inject remotely hosted code.

### downloads
- **PT**: Permite que o usuário exporte seus dados de organização e backups no formato JSON, garantindo a soberania e portabilidade dos seus dados acadêmicos.
- **EN**: Allows the user to export their organization data and backups in JSON format, ensuring sovereignty and portability of their academic data.

---

## 2. Propósito Único (Single Purpose Statement)

**Texto para a Descrição da Loja:**
> A Central Univesp é um assistente acadêmico focado exclusivamente em otimizar a experiência do aluno no ecossistema UNIVESP. Ela centraliza a gestão de tarefas, oferece navegação inteligente por semanas e facilita o acesso a materiais de estudo através de uma interface integrada (SidePanel).

---

## 3. Checklist de Showstoppers (Antes de Apertar o Botão)

1. [ ] **Remote Code Check**: Confirmado que nenhum arquivo JS é carregado via `http://` ou `https://` externo.
2. [ ] **Visual Assets**: As 5 capturas de tela mostram a extensão aberta em `ava.univesp.br`? (Obrigatório).
3. [ ] **Privacy Policy**: O link da política de privacidade no dashboard está ativo e aponta para a versão final.
4. [ ] **User Gesture**: O SidePanel abre apenas quando o usuário clica no ícone da extensão? (Confirmado no código).

---
[Voltar para Documentação](../docs/README.md)
