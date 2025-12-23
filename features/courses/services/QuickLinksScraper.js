/**
 * @file QuickLinksScraper.js
 * @description Scraper alternativo usando modal "Links Rápidos" do Blackboard
 * @architecture Screaming Architecture - Service Layer
 */

export class QuickLinksScraper {
    /**
     * Extrai items do modal "Links Rápidos" (executado inline na página)
     * @param {Document} dom - Documento onde buscar (padrão: document global)
     * @returns {Array<{name: string, id: string|null, type: string}>}
     */
    static extractFromModal(dom = document) {
        try {
            const items = [];
            const links = dom.querySelectorAll('li.quick_links_header_h3 a');

            links.forEach((link) => {
                // Extrai texto limpo
                const name = link.textContent.trim().replace(/\s+/g, ' ');

                if (!name) return; // Pula links vazios

                // Tenta extrair ID do onclick
                const onclick = link.getAttribute('onclick');
                let id = null;

                if (onclick) {
                    // onclick format: quickLinks.messageHelper.activateElement("7722825", ...)
                    const match = onclick.match(/activateElement\s*\(\s*["']([^"']+)["']/);
                    if (match && match[1]) {
                        id = match[1];
                    }
                }

                items.push({
                    name,
                    id,
                    type: 'document', // Tipo padrão, pode ser categorizado depois
                });
            });

            return items;
        } catch (error) {
            console.error('[QuickLinksScraper] Erro ao extrair do modal:', error);
            return [];
        }
    }

    /**
     * Scrape items do modal "Links Rápidos" em uma página do AVA
     * @param {string} weekUrl - URL da semana (usado para contexto, mas scraping é na aba AVA atual)
     * @returns {Promise<Array>} - Items extraídos
     */
    static async scrapeFromQuickLinks(_weekUrl) {
        try {
            // 1. Encontrar aba do AVA
            const tabs = await chrome.tabs.query({ url: '*://ava.univesp.br/*' });

            if (tabs.length === 0) {
                throw new Error('Nenhuma aba do AVA encontrada para scraping de Links Rápidos.');
            }

            // Usa a primeira aba encontrada (idealmente a ativa)
            const tab = tabs[0];

            console.warn('[QuickLinksScraper] Scraping na aba:', tab.id, tab.url);

            // 2. Executar scraping inline
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    // ===== EXECUTA INLINE NA PÁGINA =====
                    console.warn('🔗 [QuickLinks] Executando scraping...');

                    const items = [];
                    const links = document.querySelectorAll('li.quick_links_header_h3 a');

                    console.warn(`🔗 [QuickLinks] Encontrados ${links.length} links`);

                    links.forEach((link, index) => {
                        const name = link.textContent.trim().replace(/\s+/g, ' ');

                        if (!name) return;

                        // Extrai ID do onclick
                        const onclick = link.getAttribute('onclick');
                        let id = null;

                        if (onclick) {
                            const match = onclick.match(/activateElement\s*\(\s*["']([^"']+)["']/);
                            if (match && match[1]) {
                                id = match[1];
                            }
                        }

                        items.push({ name, id, type: 'document' });
                        console.warn(`🔗 [QuickLinks] Item ${index + 1}: ${name.substring(0, 50)}...`);
                    });

                    console.warn(`🔗 [QuickLinks] Retornando ${items.length} itens`);
                    return items;
                },
            });

            const items = results[0]?.result || [];

            console.warn(`[QuickLinksScraper] Scraping retornou ${items.length} itens`);

            return items;
        } catch (error) {
            console.error('[QuickLinksScraper] Erro ao fazer scraping:', error);
            throw error;
        }
    }
}
