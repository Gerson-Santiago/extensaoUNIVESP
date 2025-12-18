# 🗣️ Screaming Architecture: O Manifesto

> *"Se você olhar a planta baixa de uma biblioteca, você sabe que é uma biblioteca. O software deve ser igual."* — Robert C. Martin

Este documento define a filosofia arquitetural que guia a refatoração e o futuro da `extensaoUNIVESP`.

---

## 🏗️ 1. A Metáfora da Planta Baixa (The Blueprint)

**O Erro (Arquitetura Muda)**
Ao olhar pastas como `Controllers`, `Views`, `Models`, `Helpers`, sabemos que é um software MVC, mas não sabemos **o que ele faz**. É um banco? Um jogo?

**O Objetivo (Arquitetura que Grita)**
Ao abrir este projeto, a estrutura deve gritar: **"CURSOS!", "NOTAS!", "IMPORTAÇÃO!", "CONFIGURAÇÕES!"**.
A tecnologia (Chrome Extension, React, Vue) é um detalhe. O negócio é o protagonista.

---

## 🏛️ 2. Os 3 Pilares Filosóficos

### A. A Intenção vence a Ferramenta 🔨
O sistema é uma ferramenta para ajudar alunos.
*   **Filosofia**: O negócio (regras da UNIVESP) é o rei. A UI e o Banco de Dados são súditos.
*   **Prática**: Não enterre regras de negócio dentro de arquivos de UI (`CoursesView.js`). Destaque-as em `features/courses/logic`.

### B. Agrupamento por Mudança (Common Closure Principle) 📦
Coisas que mudam juntas, ficam juntas.
*   **Cenário**: UNIVESP muda a regra de cálculo de notas.
*   **Screaming Arch**: Você vai na pasta `features/grades/`. Lógica e UI específicas de notas estão lá. Você não corre risco de quebrar o Login.

### C. A Regra de Dependência (De Fora para Dentro) 🎯
Imagine círculos concêntricos:
1.  **Externo (Mecanismos)**: UI, Chrome Storage, Web Scraping. (Instável)
2.  **Interno (Domínio)**: O conceito de "Aluno", "Matéria", "Nota". (Estável)

*   **Regra**: O Círculo Interno **não sabe nada** sobre o Externo. A lógica de cálculo de média nunca deve chamar `document.getElementById`.

---

## 🧭 O Teste Decisivo

Para cada arquivo, pergunte:
> **"A qual caso de uso do aluno isso pertence?"**

*   Ajuda a ver matérias? -> `features/courses`
*   Ajuda a importar? -> `features/import`
*   É cola técnica (manifest, jest)? -> `core/` ou `root`

---

## 🛠️ 3. Step-by-Step da Refatoração

- [x] 1.1. Mover `src/pages/courses` para `features/courses/ui`.
- [x] 1.2. Mover `src/pages/grades` para `features/grades/ui`.
- [x] 1.3. Mover `src/pages/login` para `features/login/ui`.
- [x] 1.4. Criar pasta `features/import/tests` (Colocation!).
- [x] 1.5. Configurar Path Aliases (`@features`, etc) em `jsconfig` e `jest`.

---

## 🛡️ Regras de Ouro da Execução (The Law)

1.  **O Conteúdo é Rei (Content > Filename)**
    *   Nunca mova um arquivo baseando-se apenas no nome.
    *   **Abra**. **Leia**. analise os **Imports**.
    *   Se `teste_X.js` importa `arquivo_Y.js`, eles são siameses. Mova juntos.

2.  **Visão Global (No Broken Windows)**
    *   Não quebre nada sem ter o plano exato de como consertar em seguida.
    *   Analise o impacto em **toda a base de código** antes de rodar `git mv`.
    *   Se quebrou, a prioridade absoluta é consertar (Green Build) antes de prosseguir.

4.  **Integridade de Links (Regra Anti-Tela Branca)**
    *   **Browser != Jest**: O Node resolve coisas que o Browser não.
    *   **Relativo é Lei**: Em produção (`.js`), imports DEVEM ser relativos e resolver no disco (`../../features/x.js`). Aliases (`@features`) são APENAS para testes.
    *   **Link Checker**: Todo commit tem que passar pelo scanner de imports (`verify-links`). Se um arquivo aponta para o vazio, o build FALHA.

5.  **Smart Paths (No Hell)**
    *   Proibido usar `../../../../` cegamente.
    *   Use Aliases: `@features`, `@core`, `@shared` **apenas em arquivos .test.js**.
    *   O código deve ser legível por humanos, não apenas por máquinas.
