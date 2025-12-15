# 🎓 Identidade do Projeto UNIVESP Extensão

> "Organização não é burocracia, é liberdade."

## 🌟 Visão e Filosofia

O projeto **AutoPreencher UNIVESP** nasceu de uma necessidade real: simplificar a rotina acadêmica dos alunos da UNIVESP. Acreditamos que o tempo do aluno deve ser gasto **estudando**, não navegando em menus complexos ou preenchendo formulários repetitivos.

### Nossos Pilares

1.  **Produtividade Ética**: Criamos ferramentas para agilizar processos, nunca para burlar o sistema. Não automatizamos o consumo de conteúdo (o aluno deve assistir as aulas), automatizamos o *acesso* ao conteúdo.
2.  **Transparência Total**: Como lidamos com dados sensíveis (RA, navegação), nosso código é aberto e nossa arquitetura é *Local-First*. O aluno é dono dos seus dados.
3.  **Simplicidade Radical**: A interface deve ser "invisível". Se o aluno precisa de um tutorial para usar a extensão, falhamos no design.

---

## 🚀 Funcionalidades Chave

A extensão atua em três frentes principais para melhorar a experiência no AVA (Blackboard) e SEI.

### 1. Autopreenchimento Inteligente (SEI)
Detecta automaticamente os campos de login no Sistema Eletrônico de Informações (SEI) e preenche com o email institucional do aluno.
*   **Filosofia**: Eliminar a fricção do login diário.

### 2. Painel Lateral de Produtividade (Side Panel)
Um "hub" central que acompanha o aluno durante a navegação.
*   **Importação em Lote**: Com um clique, o aluno traz todas as suas matérias do bimestre para o painel.
*   **Deep Scraping**: A extensão "mergulha" na estrutura do curso para encontrar os links diretos das semanas de aula, ignorando banners e avisos irrelevantes.
*   **Navegação Contextual**: Ao clicar em uma matéria, a extensão sabe se ela já está aberta em outra aba e leva o usuário até lá, evitando a desorganização de "1000 abas abertas".

### 3. Foco e Organização
*   **Lista de Semanas**: As semanas de aula são extraídas e listadas de forma limpa. O aluno vê exatamente o que precisa estudar.
*   **Privacidade**: O RA e as configurações ficam salvas apenas no navegador do usuário.

---

## 🎯 Público Alvo

*   **O Aluno UNIVESP**: Principalmente aqueles que trabalham e estudam, e precisam otimizar cada minuto do seu tempo disponível.
*   **A Comunidade Open Source**: Desenvolvedores que querem aprender sobre Chrome Extensions, Arquitetura Local-First e Scrapers éticos.

---

## 🤝 Cultura de Desenvolvimento

Para quem contribui com o código:
*   **Código Limpo**: Mantemos um padrão rigoroso. Se não está testado, não existe.
*   **Documentação Viva**: Este projeto é mantido por pessoas. Documentamos nossas decisões para que futuros mantenedores entendam o "porquê" das coisas.
*   **Zero Gambiarra**: Preferimos refatorar a arquitetura a fazer um "patch" sujo.

---

> *Este projeto não possui vínculo oficial com a UNIVESP. É uma iniciativa de alunos para alunos.*
