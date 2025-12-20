# 🎓 Identidade do Projeto UNIVESP Extensão

> "Organização não é burocracia, é liberdade."

## 🌟 Visão e Filosofia

O projeto **AutoPreencher UNIVESP** evoluiu. Mais do que um facilitador de login, somos hoje uma **Suíte de Produtividade Acadêmica** completa. Acreditamos que a tecnologia deve ser invisible e trabalhar *para* o aluno, eliminando a carga cognitiva de navegar em sistemas legados.

### Nossos Pilares (The Axioms)

1.  **Soberania dos Dados (Local-First)**:
    *   Nenhum dado sai do computador do aluno.
    *   Não existe backend proprietário.
    *   O aluno é o único dono do seu RA, suas configurações e seu histórico de navegação.

2.  **Produtividade Ética**:
    *   Automatizamos o *acesso* ao conteúdo, jamais o *consumo* dele.
    *   Facilitamos o login e a organização, mas o estudo depende 100% do aluno.

3.  **Excelência Técnica**:
    *   Nossa arquitetura (**Screaming Architecture**) reflete domínios acadêmicos, não frameworks.
    *   Nosso código é testado, lintado e padronizado. Qualidade de software industrial para um projeto estudantil.

---

## 🚀 Funcionalidades Chave (v2.6)

### 1. Painel Lateral de Gestão (Domain-Driven UI)
Um "hub" persistente que centraliza a vida acadêmica:
*   **Gestão de Cursos**: Importação automática de matérias e organização por Bimestre/Ano.
*   **Foco na Semana**: O sistema varre a estrutura complexa do Blackboard e entrega links diretos para a semana atual.
*   **Navegação Inteligente (Singleton Pattern)**: Acabou a poluição de abas. O sistema detecta se o AVA ou SEI já estão abertos e foca na aba existente, mantendo seu navegador limpo.

### 2. Autopreenchimento & Acesso Rápido
*   **Zero Fricção**: Login automático no SEI (apenas email).
*   **Portal Unificado**: Acesso rápido às ferramentas essenciais (Provas, Área do Aluno) direto da Home.

### 3. Arquitetura Robusta
*   **Zero Redirect Loops**: Algoritmos de navegação seguros.
*   **Smart Link Detection**: O sistema entende redirecionamentos de login e leva você ao destino final.

---

## 🎯 Público Alvo

*   **O Aluno UNIVESP**: Que trabalha, cuida da família e tem pouco tempo. Cada segundo economizado é convertido em estudo.
*   **Desenvolvedores**: Que buscam referência em **Clean Architecture** e **Manifest V3** no ecossistema Chrome.

---

## 🤝 Cultura de Desenvolvimento

Este não é um projeto de "fim de semana". É um produto de software mantido com rigor.

*   **Documentação First**: Nada é implementado sem antes ser desenhado (`docs/`).
*   **Test-Driven**: Se não tem teste, a feature não existe.
*   **Refatoração Contínua**: Não temos medo de reescrever módulos inteiros (como fizemos na v2.6.0) para melhorar a manutenibilidade.

---

> *Este projeto é Open Source (MIT), mantido pela comunidade e independente da UNIVESP.*
