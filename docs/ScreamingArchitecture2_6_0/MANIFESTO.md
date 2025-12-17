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

> *"Se transformarmos essa extensão em um App Mobile amanhã, devemos conseguir levar a pasta `features/` inteira e reaproveitar 80% do código (a lógica)."*
