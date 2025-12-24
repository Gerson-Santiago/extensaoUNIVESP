# Estudo de Design Patterns na Prática (v2.8.0)

Este documento analisa os Padrões de Projeto (Design Patterns) identificados no código fonte da extensão, conectando a teoria à implementação real encontrada nos arquivos. A análise foca em **como** e **por que** cada padrão foi aplicado.

---

## 1. Padrões Arquiteturais

### 🏠 Screaming Architecture (Arquitetura que Grita)
**Teoria**: A estrutura de diretórios deve revelar a intenção do sistema ("Gerenciador de Cursos") e não o framework ("App React" ou "Projeto MVC").

**Implementação Real**:
Ao listar a raiz de `features/`:
```text
features/
├── courses/   <- O sistema trata de Cursos
├── session/   <- O sistema tem Autenticação
└── settings/  <- O sistema tem Configurações
```
Se tivéssemos pastas genéricas como `src/components` ou `src/utils` misturando tudo, a arquitetura estaria "gritando" Framework. Aqui, ela grita **Domínio**.

---

## 2. Padrões GoF (Gang of Four)

### 🛡️ Facade Pattern (Fachada)
**Teoria**: Fornecer uma interface unificada e simplificada para um conjunto de interfaces em um subsistema.

**Onde**: `WeekActivitiesService.js` (features/courses/services)
**Implementação Real**:
O método `getActivities` esconde uma complexidade enorme:
1.  Verifica se já existe cache (`if (week.items...)`).
2.  Decide qual `Scraper` usar.
3.  Chama o scraper.
4.  Trata erros (`try/catch`).
5.  Atualiza o objeto original.

**Benefício**: A View (`CourseWeeksView`) não sabe nada disso. Ela apenas chama `getActivities(w)` e espera um resultado. Se trocarmos o scraper para uma API REST amanhã, a View não muda.

### 🧠 Strategy Pattern (Estratégia)
**Teoria**: Definir uma família de algoritmos, encapsulá-los e torná-los intercambiáveis. O Strategy permite que o algoritmo varie independentemente dos clientes que o utilizam.

**Onde**: `WeekActivitiesService.js`
**Código Real**:
```javascript
// A escolha da estratégia é dinâmica baseada no argumento 'method'
const scraper = method === 'QuickLinks' ? QuickLinksScraper : WeekContentScraper;
const scrapeMethod = method === 'QuickLinks' ? 'scrapeFromQuickLinks' : 'scrapeWeekContent';

// A execução é polimórfica (ambos retornam Promise<Items[]>)
const items = await scraper[scrapeMethod](week.url);
```
**Benefício**: Respeita o **Open/Closed Principle (OCP)**. Podemos adicionar uma nova estratégia (ex: `OfflineScraper`) sem modificar a lógica de consumo, apenas a lógica de seleção.

### 🔌 Adapter Pattern (Adaptador)
**Teoria**: Converter a interface de uma classe em outra interface esperada pelos clientes. Permite que classes com interfaces incompatíveis trabalhem juntas.

**Onde**: `WeekContentScraper.js`
**Contexto**: O DOM da UNIVESP é "sujo" (HTML, classes CSS inconsistentes, iframes). O nosso sistema espera objetos limpos `{ name, url, type }`.
**Implementação Real**:
O método `extractItemsFromDOM` age como o Adaptador:
- **Input**: `document` (DOM hostil e variável).
- **Processamento**: Detecta ícones (`detectType`), normaliza URLs, limpa espaços em branco (`trim()`).
- **Output**: Array de Objetos JSON padronizados.

**Benefício**: O resto do sistema ("Cliente") nunca precisa lidar com `querySelector` ou `li.className`. Ele recebe dados limpos.

### 📦 Repository Pattern
**Teoria**: Mediar entre o domínio e as camadas de mapeamento de dados (banco), agindo como uma coleção de objetos em memória.

**Onde**: `CourseRepository.js`
**Código Real**:
O método `add` não apenas "salva":
```javascript
static async add(name, url...) {
  // 1. Carrega (Memory Collection)
  const courses = await this.loadItems(); 
  // 2. Valida Regra de Negócio (Duplicidade)
  if (exists) return callback(false...);
  // 3. Cria Objeto
  const newCourse = { ... };
  // 4. Persiste
  await this.saveItems(courses); 
}
```
**Benefício**: Separação de responsabilidades. `Course.js` (Modelo) define os dados. `CourseStorage.js` (Driver) define *como* gravar (Chrome API). `CourseRepository` (Regra) define o comportamento da coleção.

### 📡 Observer Pattern (via Callbacks/Events)
**Teoria**: Definir uma dependência um-para-muitos entre objetos, de modo que quando um objeto muda de estado, todos os seus dependentes são notificados e atualizados automaticamente.

**Onde**: `CourseWeeksView/index.js`
**Implementação Real (Variação JS)**:
Ao invés de uma lista de `observers`, usamos injeção de `callbacks`:
```javascript
// O "Sujeito" (View) notifica que algo aconteceu
if (this.callbacks.onViewActivities) {
  this.callbacks.onViewActivities(w);
}
```
**Análise**: Embora simplificado como "Callback Pattern", arquiteturalmente cumpre o papel do Observer: A View não conhece a `MainView` ou o `Router`. Ela apenas "emite o evento". Quem instanciou a View "assinou" esse evento passando a função.

---

## 3. Conclusão

O projeto `extensaoUNIVESP` v2.8.0 demonstra maturidade ao aplicar padrões não por "hype", mas para resolver problemas concretos de desacoplamento e manutenção:

1.  **Complexidade de Scraping** resolvidae com **Facade** e **Strategy**.
2.  **Sujeira do DOM externo** resolvida com **Adapter**.
3.  **Persistência assíncrona** resolvida com **Repository**.
4.  **Navegação entre telas** resolvida com **Observer/Callbacks**.
