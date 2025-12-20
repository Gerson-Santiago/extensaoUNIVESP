> Status: Active
> Last Update: 2025-12-18
> Owner: Gerson Santiago

# ⚠️ Pontos Cegos (Blind Spots): O que pode dar errado?

> *"O diabo mora nos detalhes... e no CSS global."*

Você tem um plano sólido para o JS (Lógica e UI), mas em arquiteturas modulares, os problemas costumam surgir nas beiradas. Aqui estão 4 armadilhas que ainda não discutimos e como evitá-las.

---

## 1. O Vazamento de Estilos (CSS Leakage) 🎨
**O Risco:** Você move `CourseCard.js` para `features/courses`, mas o CSS dele (`.course-card`) continua num arquivo gigante `styles/main.css`.
*   **Problema:** A feature não é autônoma. Se você copiar a pasta `features/courses` para outro projeto, ela chega "pelada" (sem estilo).
*   **A Pista Oculta:** Seletores genéricos como `div.card` ou `button.primary` que afetam componentes internos das features.
*   **Solução:**
    *   Adote **CSS Modules** (se usar bundler) ou nomenclatura BEM rigorosa (`.feature-course__card`).
    *   Coloque o CSS **dentro** da pasta da feature: `features/courses/styles/course-card.css`.

## 2. A Comunicação Invisível (Event Bus) 🗣️
**O Risco:** A `Tela de Cursos` precisa avisar a `TopNav` (na `Shell`) que o título mudou.
*   **Problema:** Se `CoursesView` importar `TopNav` diretamente para chamar `TopNav.setTitle()`, você criou o acoplamento que jurou destruir.
*   **A Pista Oculta:** Callbacks passados por 3 ou 4 níveis de profundidade (`prop drilling`).
*   **Solução:** Use **Custom Events** do navegador.
    *   A Feature grita: `window.dispatchEvent(new CustomEvent('app:title-change', { detail: 'Meus Cursos' }))`.
    *   A Shell escuta: `window.addEventListener('app:title-change', ...)`
    *   *Ninguém conhece ninguém, mas todos se falam.*

## 3. A Armadilha dos Dados (Storage Schema) 💾
**O Risco:** Você muda a classe `Course` de lugar, mas esquece que o JSON salvo no `localStorage` / `chrome.storage` tem o formato antigo.
*   **Problema:** O código novo tenta ler o dado velho e quebra (`undefined is not an object`).
*   **A Solução:**
    *   O `Core` (`core/storage`) deve ser o guardião do esquema.
    *   As Features pedem dados, mas nunca acessam o `chrome.storage` direto.
    *   Se mudar a estrutura do objeto, crie um **Migration Script** que roda no `onInstalled` do background.

## 4. Onde moram as imagens? (Asset Gravity) 🖼️
**O Risco:** O ícone do botão "Importar" está em `assets/icons/import.png`.
*   **Problema:** Se é um ícone genérico, tudo bem. Mas se é uma imagem explicativa exclusiva da Importação, ela deveria estar em `features/import/assets/`.
*   **Regra:** Assets globais (Logo, Favicon) em `/assets`. Assets específicos (Banner do Tutorial de Login) na pasta da feature.

---

### Resumo da Defesa Civil

Ao refatorar, vigie:
1.  **CSS**: Está junto do JS?
2.  **Eventos**: Estou importando o pai ou emitindo um evento?
3.  **Storage**: O dado salvo ainda é compatível?
4.  **Imagens**: São públicas ou privadas da feature?
