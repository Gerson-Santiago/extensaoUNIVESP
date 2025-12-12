// Variável para controlar logs de debug (desativar em produção)
const DEBUG = false;

export function openOrSwitchToTab(url) {
  // if (DEBUG) console.log('🔍 DEBUG openOrSwitchToTab chamado com URL:', url);
  if (!url) {
    // if (DEBUG) console.error('❌ DEBUG: URL vazia, abortando');
    return;
  }

  // Tenta extrair o course_id E content_id da URL
  const courseMatch = url.match(/course_id=(_.+?)(&|$)/);
  const contentMatch = url.match(/content_id=(_.+?)(&|$)/);
  const targetCourseId = courseMatch ? courseMatch[1] : null;
  const targetContentId = contentMatch ? contentMatch[1] : null;

  // if (DEBUG) console.log('🔍 DEBUG: targetCourseId extraído:', targetCourseId);
  // if (DEBUG) console.log('🔍 DEBUG: targetContentId extraído:', targetContentId);

  chrome.tabs.query({}, (tabs) => {
    // if (DEBUG) console.log('🔍 DEBUG: Total de abas encontradas:', tabs.length);
    let existingTab = null;

    // Busca aba que contenha AMBOS: course_id E content_id (página específica)
    if (targetCourseId && targetContentId) {
      existingTab = tabs.find((t) =>
        t.url &&
        t.url.includes(targetCourseId) &&
        t.url.includes(targetContentId)
      );
      // if (DEBUG) console.log('🔍 DEBUG: Aba existente com courseId E contentId?', existingTab ? existingTab.id : 'NÃO');
    } else if (targetCourseId) {
      // Fallback: apenas course_id (para páginas principais sem content_id)
      existingTab = tabs.find((t) => t.url && t.url.includes(targetCourseId));
      // if (DEBUG) console.log('🔍 DEBUG: Aba existente apenas por courseId?', existingTab ? existingTab.id : 'NÃO');
    }

    // Fallback adicional: tenta por URL exata
    if (!existingTab) {
      const cleanUrl = url.split('&mode=')[0];
      existingTab = tabs.find(
        (t) => t.url && (t.url.startsWith(url) || t.url.startsWith(cleanUrl))
      );
      // eslint-disable-next-line no-console
      if (DEBUG) console.debug('🔍 DEBUG: Aba existente por URL exata?', existingTab ? existingTab.id : 'NÃO');
    }

    if (existingTab) {
      // eslint-disable-next-line no-console
      if (DEBUG) console.debug('✅ DEBUG: Aba encontrada! Trocando para aba ID:', existingTab.id);
      // console.log('Tabs.js: activateExistingTab', tabId);
      chrome.tabs.update(existingTab.id, { active: true });
      chrome.windows.update(existingTab.windowId, { focused: true });
    } else {
      // eslint-disable-next-line no-console
      if (DEBUG) console.debug('📝 DEBUG: Nenhuma aba encontrada. Criando nova aba com URL:', url);
      chrome.tabs.create({ url: url }, (newTab) => {
        // eslint-disable-next-line no-console
        if (DEBUG) console.debug('✅ DEBUG: Nova aba criada! ID:', newTab.id);
      });
    }
  });
}
