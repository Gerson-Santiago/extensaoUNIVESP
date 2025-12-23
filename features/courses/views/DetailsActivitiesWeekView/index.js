/**
 * @file DetailsActivitiesWeekView.js
 * @description Índice navegável de atividades com scroll automático
 * @architecture Screaming Architecture - View Layer
 * 
 * Navegação: Minhas Matérias > Semanas > [Ver Atividades]
 * Funcionalidade: Lista clicável que faz scroll até a atividade no AVA
 */

import { categorizeTask } from '../../logic/TaskCategorizer.js';
import { Toaster } from '../../../../shared/ui/feedback/Toaster.js';

export class DetailsActivitiesWeekView {
    /**
     * @param {Object} callbacks - { onBack }
     */
    constructor(callbacks) {
        this.callbacks = callbacks;
        this.week = null;
    }

    /**
     * Define a semana a ser exibida
     * @param {Object} week - { name, url, items: [{name, url, id}] }
     */
    setWeek(week) {
        // eslint-disable-next-line no-console
        console.log('[DetailsActivitiesWeekView] setWeek() chamado com:', week);
        this.week = week;
    }

    /**
     * Renderiza a view
     * @returns {HTMLElement}
     */
    render() {
        if (!this.week) {
            return document.createElement('div');
        }

        const method = this.week.method || 'DOM';
        const methodLabel = method === 'QuickLinks' ? 'Links Rápidos' : 'Scraping DOM';

        const div = document.createElement('div');
        div.className = 'view-details-activities';
        div.innerHTML = `
      <div class="details-header">
        <button id="backBtn" class="btn-back">← Voltar</button>
        <div class="details-header-info">
          <div class="details-breadcrumb">${this.week.courseName || 'Matéria'}</div>
          <h2 class="details-title">${this.week.name} - Atividades</h2>
          <p class="details-subtitle">Clique em uma atividade para rolar até ela no AVA</p>
          <p class="method-indicator">Método: ${methodLabel}</p>
        </div>
        <div class="details-header-actions">
          <button id="clearBtn" class="btn-clear" title="Limpar cache e voltar">🗑️ Limpar</button>
          <button id="refreshBtn" class="btn-refresh" title="Atualizar lista">↻</button>
        </div>
      </div>
      <div id="activitiesContainer" class="activities-container"></div>
    `;
        return div;
    }

    /**
     * Hook pós-renderização
     */
    afterRender() {
        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.onclick = () => this.callbacks.onBack();
        }

        const refreshBtn = /** @type {HTMLButtonElement} */ (document.getElementById('refreshBtn'));
        if (refreshBtn) {
            refreshBtn.onclick = () => this.handleRefresh(refreshBtn);
        }

        const clearBtn = /** @type {HTMLButtonElement} */ (document.getElementById('clearBtn'));
        if (clearBtn) {
            clearBtn.onclick = () => this.handleClear();
        }

        this.renderActivities();
    }

    /**
     * Atualiza lista de atividades re-executando scraping
     * @param {HTMLButtonElement} btn - Botão de refresh (para loading state)
     */
    async handleRefresh(btn) {
        if (!this.week) return;

        const method = this.week.method || 'DOM';
        const originalText = btn.textContent;

        try {
            // Loading state
            btn.disabled = true;
            btn.textContent = '⏳';

            // eslint-disable-next-line no-console
            console.log(`[DetailsActivitiesWeekView] Refresh com método: ${method}`);

            // Re-executar scraping baseado no método
            let items = [];
            if (method === 'QuickLinks') {
                const { QuickLinksScraper } = await import('../../services/QuickLinksScraper.js');
                items = await QuickLinksScraper.scrapeFromQuickLinks(this.week.url);
            } else {
                const { WeekContentScraper } = await import('../../services/WeekContentScraper.js');
                items = await WeekContentScraper.scrapeWeekContent(this.week.url);
            }

            // Atualizar week.items
            this.week.items = items;

            // Re-renderizar lista
            this.renderActivities();

            // eslint-disable-next-line no-console
            console.log(`[DetailsActivitiesWeekView] Refresh concluído: ${items.length} items`);
        } catch (error) {
            console.error('[DetailsActivitiesWeekView] Erro ao atualizar:', error);
            const { Toaster } = await import('../../../../shared/ui/feedback/Toaster.js');
            const toaster = new Toaster();
            toaster.show('Erro ao atualizar lista. Tente novamente.', 'error');
        } finally {
            // Restaurar estado
            btn.disabled = false;
            btn.textContent = originalText;
        }
    }

    /**
     * Limpa cache de atividades e volta para lista de semanas
     */
    handleClear() {
        if (!this.week) return;

        // Confirmar com usuário
        const confirmed = confirm(
            `Deseja limpar o cache de atividades de "${this.week.name}"?\n\n` +
            'Isso forçará um novo scraping na próxima vez.'
        );

        if (!confirmed) return;

        // Limpar items do cache
        this.week.items = [];
        this.week.method = undefined;

        // Voltar para lista de semanas
        if (this.callbacks.onBack) {
            this.callbacks.onBack();
        }
    }

    /**
     * Renderiza lista de atividades (ordem DOM original)
     */
    renderActivities() {
        try {
            const container = document.getElementById('activitiesContainer');
            if (!container) {
                console.error('[DetailsActivitiesWeekView] Container activitiesContainer não encontrado!');
                return;
            }

            // Limpar container antes de renderizar (evita duplicação no refresh)
            container.innerHTML = '';

            if (!this.week?.items || this.week.items.length === 0) {
                container.innerHTML = '<p style="color:#999;">Nenhuma atividade encontrada.</p>';
                return;
            }

            // Lista na ordem exata do DOM
            const list = document.createElement('ul');
            list.className = 'activities-list';

            this.week.items.forEach((item, index) => {
                const categorized = categorizeTask(item);
                const li = this.createActivityItem(categorized, index + 1);
                list.appendChild(li);
            });

            container.appendChild(list);
        } catch (error) {
            console.error('[DetailsActivitiesWeekView] Erro ao renderizar atividades:', error);
            const toaster = new Toaster();
            toaster.show('Erro ao carregar atividades.', 'error');
        }
    }

    /**
     * Cria item de atividade com scroll automático
     * @param {Object} task - Tarefa categorizada
     * @param {number} position - Posição na lista (1-indexed)
     * @returns {HTMLElement}
     */
    createActivityItem(task, position) {
        const li = document.createElement('li');
        li.className = 'activity-item';

        const icon = this.getTypeIcon(task.type);

        li.innerHTML = `
      <span class="activity-position">#${position}</span>
      <span class="activity-icon">${icon}</span>
      <span class="activity-name">${task.original.name}</span>
      <button class="btn-scroll" data-id="${task.id}">Ir →</button>
    `;

        // Evento de scroll
        const btn = /** @type {HTMLButtonElement} */ (li.querySelector('.btn-scroll'));
        btn.onclick = () => this.scrollToActivity(task.id, task.original.url);

        return li;
    }

    /**
     * Faz scroll até a atividade na página do AVA
     * @param {string} activityId - ID único da atividade (ex: "_1767514_1" ou "anonymous_element_9")
     * @param {string} fallbackUrl - URL da atividade (fallback se scroll falhar)
     */
    async scrollToActivity(activityId, fallbackUrl) {
        try {
            // 1. Encontrar tab do AVA aberta
            const [tab] = await chrome.tabs.query({ url: '*://ava.univesp.br/*' });

            if (!tab || !tab.id) {
                // Nenhuma tab do AVA aberta, abrir URL da semana
                chrome.tabs.create({ url: this.week.url || fallbackUrl });
                return;
            }

            // 2. Navegar para a URL da semana (se ainda não estiver lá)
            if (this.week.url && !tab.url.includes(this.week.url)) {
                await chrome.tabs.update(tab.id, { url: this.week.url, active: true });

                // Aguardar página carregar
                await new Promise(resolve => {
                    const listener = (tabId, info) => {
                        if (tabId === tab.id && info.status === 'complete') {
                            chrome.tabs.onUpdated.removeListener(listener);
                            resolve();
                        }
                    };
                    chrome.tabs.onUpdated.addListener(listener);

                    // Timeout de segurança (5s)
                    setTimeout(() => {
                        chrome.tabs.onUpdated.removeListener(listener);
                        resolve();
                    }, 5000);
                });

                // Aguardar mais 500ms para JS do AVA executar
                await new Promise(resolve => setTimeout(resolve, 500));
            } else {
                // Já está na página correta, apenas focar
                await chrome.tabs.update(tab.id, { active: true });
            }

            // 3. Executar scroll na tab
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (id) => {
                    const element = document.getElementById(id);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        // Highlight temporário
                        element.style.backgroundColor = '#fff3cd';
                        setTimeout(() => {
                            element.style.backgroundColor = '';
                        }, 2000);
                    } else {
                        // Elemento não encontrado - silencioso
                    }
                },
                args: [activityId],
            });
        } catch (error) {
            console.error('Erro ao fazer scroll:', error);
            // Fallback: abrir URL da semana ou fallback
            chrome.tabs.create({ url: this.week.url || fallbackUrl });
        }
    }

    /**
     * Retorna ícone para o tipo
     */
    getTypeIcon(type) {
        const icons = {
            VIDEOAULA: '🎬',
            QUIZ: '📝',
            VIDEO_BASE: '📹',
            TEXTO_BASE: '📄',
            APROFUNDANDO: '📚',
            OUTROS: '📎',
        };
        return icons[type] || '📄';
    }
}