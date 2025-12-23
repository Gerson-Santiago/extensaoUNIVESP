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

        const div = document.createElement('div');
        div.className = 'view-details-activities';
        div.innerHTML = `
      <div class="details-header">
        <button id="backBtn" class="btn-back">← Voltar</button>
        <h2>${this.week.name} - Atividades</h2>
        <p class="subtitle">Clique em uma atividade para rolar até ela no AVA</p>
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

        this.renderActivities();
    }

    /**
     * Renderiza lista de atividades (ordem DOM original)
     */
    renderActivities() {
        try {
            // eslint-disable-next-line no-console
            console.log('[DetailsActivitiesWeekView] renderActivities() chamado');
            // eslint-disable-next-line no-console
            console.log('[DetailsActivitiesWeekView] this.week:', this.week);
            // eslint-disable-next-line no-console
            console.log('[DetailsActivitiesWeekView] this.week?.items:', this.week?.items);

            const container = document.getElementById('activitiesContainer');
            if (!container) {
                console.error('[DetailsActivitiesWeekView] Container activitiesContainer não encontrado!');
                return;
            }

            if (!this.week?.items || this.week.items.length === 0) {
                // eslint-disable-next-line no-console
                console.warn('[DetailsActivitiesWeekView] Nenhum item encontrado, exibindo mensagem vazia');
                container.innerHTML = '<p style="color:#999;">Nenhuma atividade encontrada.</p>';
                return;
            }

            // eslint-disable-next-line no-console
            console.log('[DetailsActivitiesWeekView] Renderizando', this.week.items.length, 'atividades');

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
     * @param {string} activityId - ID único da atividade (ex: "_1767514_1")
     * @param {string} fallbackUrl - URL da atividade (fallback se scroll falhar)
     */
    async scrollToActivity(activityId, fallbackUrl) {
        try {
            // Encontrar tab do AVA aberta
            const [tab] = await chrome.tabs.query({ url: '*://ava.univesp.br/*' });

            if (!tab || !tab.id) {
                // Nenhuma tab do AVA aberta, abrir URL
                chrome.tabs.create({ url: fallbackUrl });
                return;
            }

            // Executar scroll na tab existente
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
                    }
                },
                args: [activityId],
            });

            // Focar na tab
            await chrome.tabs.update(tab.id, { active: true });
        } catch (error) {
            console.error('Erro ao fazer scroll:', error);
            // Fallback: abrir URL
            chrome.tabs.create({ url: fallbackUrl });
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