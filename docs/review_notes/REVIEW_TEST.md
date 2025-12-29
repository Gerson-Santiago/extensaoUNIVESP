# Scripts de Debug para Diagnóstico do Bug de Scroll

## 📌 Como Usar

1. Abra a página do AVA onde estão as atividades (semana/módulo)
2. Abra o DevTools (F12) → Console
3. Cole e execute os scripts abaixo

---

## Script 1: Análise de Estrutura DOM das Atividades

```javascript
// 🔍 DEBUG: Analisar estrutura DOM das atividades
(function analyzeActivityDOM() {
  console.group('🔍 [DEBUG] Análise DOM - Atividades');
  
  // 1. Encontrar todos os elementos de atividade
  const activities = document.querySelectorAll('li[id^="contentListItem"]');
  console.log('✅ Total de atividades encontradas:', activities.length);
  
  if (activities.length === 0) {
    console.warn('⚠️ Nenhuma atividade encontrada com seletor padrão!');
    console.log('💡 Tentando seletores alternativos...');
    
    const alternatives = [
      'li[id*="content"]',
      '.activity-item',
      '[data-content-id]',
      'li.listitem'
    ];
    
    alternatives.forEach(selector => {
      const found = document.querySelectorAll(selector);
      if (found.length > 0) {
        console.log(`   ✓ ${selector}: ${found.length} elementos`);
      }
    });
  }
  
  // 2. Analisar os primeiros 3 elementos em detalhes
  console.group('📋 Amostra de IDs e Estrutura (primeiros 3)');
  Array.from(activities).slice(0, 3).forEach((el, idx) => {
    console.group(`Atividade #${idx + 1}`);
    console.log('ID completo:', el.id);
    console.log('Classes:', el.className);
    console.log('Data attributes:', Object.keys(el.dataset));
    console.log('Altura:', el.offsetHeight, 'px');
    console.log('Visível:', el.offsetParent !== null);
    console.log('Nome da atividade:', el.querySelector('.item-title, h3, .title')?.textContent?.trim() || 'N/A');
    console.groupEnd();
  });
  console.groupEnd();
  
  // 3. Container com scroll
  console.group('📦 Container de Scroll');
  const mainContent = document.getElementById('main-content-inner');
  if (mainContent) {
    console.log('✅ #main-content-inner encontrado');
    console.log('   Altura total:', mainContent.scrollHeight, 'px');
    console.log('   Altura visível:', mainContent.clientHeight, 'px');
    console.log('   Scrollável:', mainContent.scrollHeight > mainContent.clientHeight);
  } else {
    console.warn('⚠️ #main-content-inner não encontrado');
  }
  console.groupEnd();
  
  // 4. Exportar IDs para clipboard (útil!)
  const ids = Array.from(activities).map(el => el.id);
  console.log('\n📋 IDs exportados (copie abaixo):');
  console.log(JSON.stringify(ids, null, 2));
  
  console.groupEnd();
  
  return {
    totalActivities: activities.length,
    ids: ids,
    mainContent: mainContent
  };
})();
```

---

## Script 2: Testar Scroll para ID Específico

```javascript
// 🎯 DEBUG: Testar scroll ROBUSTO (Lógica igual ao NavigationService)
(async function testScrollToActivity(activityIds) {
  console.group('🎯 [DEBUG] Teste de Scroll Robusto - Batch');
  
  // Lista de IDs para teste (extraídos dos logs)
  const targets = Array.isArray(activityIds) ? activityIds : [activityIds];
  console.log('Targets:', targets);

  // 1. Estratégia de Identificação
  const normalizeStrategy = (id) => {
     const shortId = id.replace('contentListItem:', '');
     return {
        fullId: id.includes('contentListItem:') ? id : `contentListItem:${id}`,
        shortId: shortId,
        selectors: [
           `#${id.includes('contentListItem:') ? id.replace(/:/g, '\\:') : 'contentListItem\\:' + id}`,
           `li[id^="contentListItem:${shortId}"]`,
           `li[id*="${shortId}"]`,
           `#${shortId}`
        ]
     };
  };

  const delay = ms => new Promise(r => setTimeout(r, ms));

  for (const activityId of targets) {
      console.group(`Testando ID: ${activityId}`);
      
      const { fullId, shortId, selectors } = normalizeStrategy(activityId);
      
      // 2. Busca
      let element = document.getElementById(fullId) || document.getElementById(shortId);
      if (!element) {
         for (const sel of selectors) {
            element = document.querySelector(sel);
            if (element) {
               console.log(`✓ Elemento encontrado via seletor: ${sel}`);
               break;
            }
         }
      }

      if (!element) {
        console.error('❌ Elemento NÃO encontrado!');
        console.groupEnd();
        continue;
      }
      
      // 3. Scroll e Highlight
      console.log('🚀 Scroll...');
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Efeito Visual
      const originalBg = element.style.backgroundColor;
      element.style.transition = 'all 0.5s';
      element.style.backgroundColor = '#fff3cd'; // Amarelo
      element.style.outline = '2px solid #ffc107';

      await delay(1000); // Pausa para ver o scroll

      // Reset
      element.style.backgroundColor = originalBg || '';
      element.style.outline = '';
      
      console.log('✅ OK');
      console.groupEnd();
      await delay(500);
  }
  
  console.log('🏁 Teste Batch Finalizado.');
  console.groupEnd();
  
})([
  '_1767543_1', // Semana 3 – Formato
  '_1767545_1', // Videoaula 7
  '_1767547_1', // Quiz Videoaula 7
  '_1767549_1', // Videoaula 8
  '_1767551_1'  // Quiz Videoaula 8
]);
```

---

## ✅ Checklist de Verificação (Pós-Correção)

Agora que a extensão foi atualizada, use este checklist para validar:

1.  **Teste de Scroll Simples**: Clique em "Ir" de uma atividade visível. O scroll deve apenas ajustar levemente.
2.  **Teste de Scroll Longo**: Clique em "Ir" de uma atividade no final da página. A página deve rolar até lá.
3.  **Teste de Carregamento**: Abra a aba do AVA, dê refresh (F5) e **imediatamente** tente clicar em "Ir" no popup da extensão antes da página carregar totalmente. A extensão deve aguardar (MutationObserver) e rolar assim que o item aparecer.


---

## Script 3: Monitorar Logs da Extensão

```javascript
// 📡 DEBUG: Interceptar console.log da extensão
(function interceptExtensionLogs() {
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  
  console.log = function(...args) {
    if (args[0]?.includes?.('[Extension]')) {
      console.group('📨 [EXTENSION LOG]');
      originalLog.apply(console, args);
      console.trace(); // Stack trace
      console.groupEnd();
    } else {
      originalLog.apply(console, args);
    }
  };
  
  console.warn = function(...args) {
    if (args[0]?.includes?.('[NavigationService]')) {
      console.group('⚠️ [EXTENSION WARN]');
      originalWarn.apply(console, args);
      console.trace();
      console.groupEnd();
    } else {
      originalWarn.apply(console, args);
    }
  };
  
  console.error = function(...args) {
    if (args[0]?.includes?.('[NavigationService]')) {
      console.group('❌ [EXTENSION ERROR]');
      originalError.apply(console, args);
      console.trace();
      console.groupEnd();
    } else {
      originalError.apply(console, args);
    }
  };
  
  originalLog('✅ [DEBUG] Logs da extensão interceptados! Clique em "Ir" e observe.');
})();
```

---

## Script 4: Medir Performance de Estratégias de Scroll

```javascript
// ⚡ DEBUG: Comparar performance de estratégias de scroll
(async function compareScrollStrategies(targetId) {
  console.group('⚡ [DEBUG] Comparação de Performance');
  
  const normalizeId = (id) => id.includes('contentListItem:') ? id : `contentListItem:${id}`;
  const fullId = normalizeId(targetId);
  const shortId = targetId.replace('contentListItem:', '');
  
  const strategies = {
    'getElementById (full)': () => document.getElementById(fullId),
    'getElementById (short)': () => document.getElementById(shortId),
    'querySelector (partial)': () => document.querySelector(`li[id*="${shortId}"]`),
    'querySelector (starts-with)': () => document.querySelector(`li[id^="contentListItem:${shortId}"]`)
  };
  
  const results = {};
  
  for (const [name, fn] of Object.entries(strategies)) {
    performance.mark(`${name}-start`);
    const element = fn();
    performance.mark(`${name}-end`);
    const measure = performance.measure(`${name}-measure`, `${name}-start`, `${name}-end`);
    
    results[name] = {
      found: !!element,
      time: measure.duration,
      element: element?.id || null
    };
  }
  
  console.table(results);
  
  // Recomendar melhor estratégia
  const fastest = Object.entries(results)
    .filter(([_, r]) => r.found)
    .sort((a, b) => a[1].time - b[1].time)[0];
  
  if (fastest) {
    console.log(`\n🏆 Estratégia mais rápida: ${fastest[0]} (${fastest[1].time.toFixed(4)}ms)`);
  }
  
  console.groupEnd();
  return results;
})(/* COLE O ID AQUI */);
```

---

## Script 5: Capturar Estado Completo para Relatório

```javascript
// 📸 DEBUG: Capturar estado completo do DOM
(function captureFullState() {
  const report = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    pageTitle: document.title,
    activities: [],
    scrollContainer: null,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollY: window.scrollY
    }
  };
  
  // Atividades
  const activities = document.querySelectorAll('li[id^="contentListItem"]');
  report.activities = Array.from(activities).map((el, idx) => ({
    index: idx + 1,
    id: el.id,
    offsetTop: el.offsetTop,
    offsetHeight: el.offsetHeight,
    visible: el.offsetParent !== null,
    name: el.querySelector('.item-title, h3, .title')?.textContent?.trim() || 'N/A'
  }));
  
  // Container
  const mainContent = document.getElementById('main-content-inner');
  if (mainContent) {
    report.scrollContainer = {
      id: 'main-content-inner',
      scrollHeight: mainContent.scrollHeight,
      clientHeight: mainContent.clientHeight,
      scrollTop: mainContent.scrollTop,
      isScrollable: mainContent.scrollHeight > mainContent.clientHeight
    };
  }
  
  console.log('📸 Estado capturado:');
  console.log(JSON.stringify(report, null, 2));
  
  // Copiar para clipboard (se suportado)
  if (navigator.clipboard) {
    navigator.clipboard.writeText(JSON.stringify(report, null, 2))
      .then(() => console.log('✅ Relatório copiado para clipboard!'))
      .catch(() => console.log('⚠️ Não foi possível copiar automaticamente'));
  }
  
  return report;
})();
```

---

## 🎯 Próximos Passos

Após executar os scripts:

1. Capturar outputs de todos os scripts
2. Identificar padrões nos IDs e seletores
3. Medir performance das estratégias
4. Documentar findings no `implementation_plan.md`
5. Criar solução otimizada baseada em dados reais