/**
 * @file ActivityProgress.js
 * @description Modelo unificado de progresso de atividades
 * @architecture Domain Layer (models/)
 */

/**
 * Status de progresso de uma atividade
 * @typedef {'TODO' | 'DOING' | 'DONE'} ProgressStatus
 */

/**
 * @typedef {Object} ActivityProgressData
 * @property {string} activityId - ID único da atividade (formato: courseId_weekId_elemId)
 * @property {ProgressStatus} status - Status workflow
 * @property {boolean} markedByUser - Marcado manualmente pelo usuário?
 * @property {boolean} completedInAVA - Concluído no AVA (scraped)?
 * @property {number} lastUpdated - Timestamp da última atualização
 */

/**
 * Helpers para manipulação de progresso
 */
export class ActivityProgress {
    /** @type {{TODO: 'TODO', DOING: 'DOING', DONE: 'DONE'}} */
    static STATUS = {
        TODO: 'TODO',
        DOING: 'DOING',
        DONE: 'DONE',
    };

    /**
     * Cria progresso a partir de status scraped do AVA
     * @param {string} activityId
     * @param {ProgressStatus} status
     * @returns {ActivityProgressData}
     */
    static fromScraped(activityId, status) {
        /** @type {ActivityProgressData} */
        const progress = {
            activityId,
            status,
            markedByUser: false,
            completedInAVA: status === this.STATUS.DONE,
            lastUpdated: Date.now(),
        };
        return progress;
    }

    /**
     * Cria progresso a partir de toggle manual do usuário
     * @param {string} activityId
     * @param {boolean} isCompleted
     * @returns {ActivityProgressData}
     */
    static fromUserToggle(activityId, isCompleted) {
        /** @type {ActivityProgressData} */
        const progress = {
            activityId,
            status: isCompleted ? this.STATUS.DONE : this.STATUS.TODO,
            markedByUser: true,
            completedInAVA: false,
            lastUpdated: Date.now(),
        };
        return progress;
    }

    /**
     * Verifica se atividade está completa (qualquer fonte)
     * @param {Partial<ActivityProgressData> | null | undefined} progress
     * @returns {boolean}
     */
    static isCompleted(progress) {
        return progress?.status === this.STATUS.DONE;
    }

    /**
     * Gera ID composto para atividade
     * @param {string} courseId
     * @param {string} weekId
     * @param {string} elementId
     * @returns {string}
     */
    static generateId(courseId, weekId, elementId) {
        return `${courseId}_${weekId}_${elementId}`;
    }
}
