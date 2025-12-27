# NEXT: Documentar Uso da Chrome Tabs API

**Status**: 📚 Documentação Pendente  
**Prioridade**: Baixa  
**Estimativa**: 2-3 horas  

---

## 🎯 Objetivo

Criar documentação técnica explicando o uso da **Chrome Tabs API** no projeto, especialmente para desenvolvedores novos ou contribuidores.

---

## 🤔 Contexto - Dúvida do Usuário

> "o que é o chrome.tabs.update(tabs.id, {url: week.url}) é a API nativa do CHROME? essa TAB? o que são ou o que é??"

**Resposta curta**: 
- ✅ Sim, é API nativa do Chrome Extension
- `chrome.tabs` = namespace para gerenciar abas do navegador
- `.update()` = atualiza propriedades de uma aba (URL, título, etc)

---

## 📚 Chrome Tabs API - Explicação

### O que é?

A **Chrome Tabs API** permite extensões **interagirem com abas** do navegador:
- Criar novas abas
- Buscar abas existentes
- Atualizar abas (URL, título)
- Fechar, mover, agrupar abas

**Documentação oficial**: https://developer.chrome.com/docs/extensions/reference/tabs/

---

### Uso no Projeto

#### 1. **Buscar Abas** (`chrome.tabs.query`)

```javascript
// Busca abas que batem com o pattern
const tabs = await chrome.tabs.query({ 
  url: '*://ava.univesp.br/*' 
});

// Retorna array de Tab objects:
// [{ id: 123, url: "...", title: "AVA UNIVESP", active: true }]
```

**Usado em**: 
- `shared/utils/Tabs.js` (buscar aba do AVA)
- `DetailsActivitiesWeekView` (scroll automático)

---

#### 2. **Atualizar Aba** (`chrome.tabs.update`)

```javascript
// Atualizar URL de uma aba existente
await chrome.tabs.update(tabId, { 
  url: 'https://ava.univesp.br/nova-url',
  active: true  // Focar na aba
});
```

**Usado em**:
- Navegação para semanas (`CourseWeeksView`)
- Scroll até atividade (`DetailsActivitiesWeekView`)

**Exemplo concreto**:
```javascript
// features/courses/views/DetailsActivitiesWeekView/index.js
async scrollToActivity(activityId, fallbackUrl) {
  // 1. Buscar aba do AVA
  const [tab] = await chrome.tabs.query({ 
    url: '*://ava.univesp.br/*' 
  });
  
  // 2. Se encontrou, navegar para week.url
  if (tab && week.url) {
    await chrome.tabs.update(tab.id, { 
      url: week.url,  // ← Atualiza URL da aba
      active: true    // ← Foca na aba
    });
  }
}
```

---

#### 3. **Criar Aba** (`chrome.tabs.create`)

```javascript
// Abrir nova aba
await chrome.tabs.create({ 
  url: 'https://ava.univesp.br/course/view.php?id=123' 
});
```

**Usado em**:
- Botão "Abrir Matéria" (`CoursesView`)
- Fallback quando aba não existe

---

### 4. **Executar Script em Aba** (`chrome.scripting.executeScript`)

```javascript
// Injetar JavaScript na aba
await chrome.scripting.executeScript({
  target: { tabId: tab.id },
  func: (elementId) => {
    // Este código roda NO CONTEXTO DA ABA
    const el = document.getElementById(elementId);
    el.scrollIntoView({ behavior: 'smooth' });
    el.style.backgroundColor = '#fff3cd'; // Highlight
  },
  args: [activityId]  // Argumentos passados para func
});
```

**Usado em**:
- Scroll automático até atividade
- Highlight de elementos

---

## 📂 Arquivo a Criar

**Localização**: `docs/CHROME_TABS_API.md`

### Estrutura Sugerida

```markdown
# Chrome Tabs API - Guia de Uso

## O que é?
Explicação básica da API

## Métodos Usados no Projeto
- chrome.tabs.query
- chrome.tabs.update
- chrome.tabs.create
- chrome.scripting.executeScript

## Casos de Uso
### Navegação para Semana
(código + explicação)

### Scroll Automático
(código + explicação)

### Abertura de Curso
(código + explicação)

## Permissões Necessárias
manifest.json configuration

## Debugging
Como testar/debugar uso de Tabs API

## Links Úteis
- Documentação oficial
- Exemplos
```

---

## 📝 Conteúdo Adicional

### Permissões no Manifest

```json
// manifest.json
{
  "permissions": [
    "tabs",        // ← Necessário para chrome.tabs.*
    "scripting"    // ← Necessário para executeScript
  ],
  "host_permissions": [
    "*://ava.univesp.br/*"  // ← Acesso ao AVA
  ]
}
```

---

### Debugging

```javascript
// Console.log em background.js (service worker)
chrome.tabs.query({ url: '*://ava.univesp.br/*' })
  .then(tabs => console.log('Abas do AVA:', tabs));

// Inspecionar: chrome://extensions → Service Worker → Console
```

---

## ✅ Critérios de Aceitação

- [ ] `docs/CHROME_TABS_API.md` criado
- [ ] Todos os métodos usados documentados
- [ ] Exemplos práticos do projeto incluídos
- [ ] Permissões explicadas
- [ ] Links para documentação oficial
- [ ] Revisado por desenvolvedor sênior

---

## 🔗 Referências

- [Chrome Tabs API Reference](https://developer.chrome.com/docs/extensions/reference/tabs/)
- [Chrome Scripting API Reference](https://developer.chrome.com/docs/extensions/reference/scripting/)
- [Manifest V3 Permissions](https://developer.chrome.com/docs/extensions/mv3/declare_permissions/)

---

## 📝 Notas

- Documentação deve ser **prática**, não apenas teoria
- Incluir screenshots/GIFs se possível (navegação visual)
- Atualizar quando novos usos da API forem adicionados

---

**Criado em**: 2025-12-23  
**Relacionado a**: Dúvida do usuário sobre `chrome.tabs.update`
