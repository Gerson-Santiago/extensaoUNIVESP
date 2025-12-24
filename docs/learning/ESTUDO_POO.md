# Estudo de Padrões: Orientação a Objetos vs. Funcional

Este documento analisa como o projeto `extensaoUNIVESP` aplica conceitos de Programação Orientada a Objetos (POO) e onde opta por paradigmas Funcionais.

> **Resumo**: O projeto utiliza uma arquitetura **Híbrida e Pragmática**. Usamos OOP para gerenciar **Estado e Efeitos Colaterais** (UI, Banco de Dados), e Programação Funcional para **Regras de Negócio e Transformação de Dados**.

---

## 1. Onde aplicamos OOP (Classes & Objetos)

A POO é utilizada principalmente onde precisamos de **encapsulamento de estado** ou agrunpamento lógico de responsabilidades.

### 1.1 Repositories (Classes Estáticas / Singletons)
**Exemplo**: `features/courses/data/CourseRepository.js`

```javascript
export class CourseRepository {
  static async loadItems() { ... }
  static async saveItems(items) { ... }
}
```

*   **Padrão**: Namespace Estático / Singleton.
*   **Por que**: Não precisamos criar múltiplas instâncias de um repositório (ex: `new CourseRepository()`). O acesso ao Storage é global. Usar `static` agrupa essas funções sob um nome forte e semântico.

### 1.2 Services (Classes Estáticas / Facades)
**Exemplo**: `features/courses/services/WeekActivitiesService.js`

```javascript
export class WeekActivitiesService {
  static async getActivities(week, method) { ... }
}
```

*   **Padrão**: Facade (Fachada).
*   **Por que**: Esconde a complexidade de escolher entre múltiplos scrapers. A classe serve apenas como organizadora.

### 1.3 Views (Classes com Estado)
**Exemplo**: `features/courses/views/CourseWeeksView/index.js` (Conceitual)

As Views geralmente mantêm o estado da tela (qual semana está aberta, qual curso foi clicado).

*   **Conceito**: `this` context.
*   **Uso**: Métodos da classe (`render`, `onClick`) acessam `this.state` ou `this.props`. Aqui a POO brilha, pois UI é inerentemente um objeto com estado.

---

## 2. Onde NÃO aplicamos OOP (Pure Data & Functions)

Diferente de sistemas Java/C# tradicionais (ex: Hibernate), aqui não misturamos Dados com Comportamento.

### 2.1 Models (Anêmicos / TypeDefs)
**Exemplo**: `features/courses/models/Course.js`

```javascript
/**
 * @typedef {Object} Course
 * @property {string} name
 * ...
 */
```

*   **Padrão**: POJO (Plain Old JavaScript Object).
*   **Explicação**: Nossos modelos NÃO são classes `class Course`. Eles são apenas definições de tipo (JSDoc).
*   **Design**: Em vez de fazer `course.save()`, fazemos `CourseRepository.save(course)`. Isso se chama **Separação de Dados e Comportamento**. Facilita a serialização (salvar no Chrome Storage) e a transferência de dados.

### 2.2 Logic Layer (Programação Funcional)
**Exemplo**: `features/courses/logic/CourseGrouper.js`

```javascript
export function groupCoursesByTerm(courses) {
  // Entra array -> Sai array transformado
}
```

*   **Padrão**: Pure Functions.
*   **Por que**: Funções puras são muito mais fáceis de testar. Elas não dependem de `this`, nem de banco de dados, nem de estado global. Se você passar o mesmo input, sempre terá o mesmo output.

---

## 3. Diagrama de Decisão

Como decidimos qual paradigma usar?

```mermaid
graph TD
    A[Preciso implementar...] --> B{Envolve Estado ou UI?}
    
    B -- Sim --> C[Use CLASSE (OOP)]
    C --> D[Views, Controllers]
    
    B -- Não --> E{É Persistência/I.O.?}
    
    E -- Sim --> F[Use STATIC CLASS (Singleton)]
    F --> G[Repository, Service, Scraper]
    
    E -- Não (Regra Pura) --> H[Use FUNÇÃO (Funcional)]
    H --> I[Logic, Formatters, Parsers]
```

## 4. Conclusão do Estudo

O projeto não segue POO por dogma (Injeção de Dependência pesada, Interfaces complexas, Herança profunda).
*   **Evitamos Herança**: Preferimos Composição. Quase não há `class A extends B`.
*   **Abraçamos Módulos**: O sistema de módulos do ES6 (`import/export`) substitui muitas necessidades de classes.

Essa arquitetura resulta em um código **mais leve (menos boilerplate)** e **mais fácil de testar** (o núcleo lógico é puramente funcional).
