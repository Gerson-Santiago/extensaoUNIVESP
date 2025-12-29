/**
 * @file TaskCategorizer.js
 * @description Categoriza tarefas do AVA por tipo (Videoaula, Quiz, etc.)
 * @architecture Screaming Architecture - Logic Layer
 *
 * DEBUG: Para ver logs de categorização, ative no console:
 *   localStorage.setItem('UNIVESP_DEBUG', 'true');
 */

import { Logger } from '../../../shared/utils/Logger.js';

/**
 * DESIGN DECISION: Typedef inline (não em models/)
 *
 * Motivo: CategorizedTask é um tipo de retorno específico desta função de lógica.
 * Representa um dado transformado/processado, não uma entidade de domínio.
 * Se outros serviços precisarem do mesmo tipo no futuro, mover para models/Task.js
 *
 * @typedef {Object} CategorizedTask
 * @property {string} type - Tipo da tarefa (VIDEOAULA, QUIZ, etc.)
 * @property {number|null} number - Número da videoaula/quiz (se aplicável)
 * @property {string} id - ID único da tarefa
 * @property {Object} original - Dados originais da tarefa
 */

/**
 * Categoriza uma tarefa baseado no título
 * @param {Object} task - Tarefa com { name, title, id, ... }
 * @param {Object} [context] - Contexto opcional { courseName, weekName }
 * @returns {CategorizedTask}
 */
export function categorizeTask(task, context = null) {
  // Aceita 'name' ou 'title' (compatibilidade com diferentes fontes)
  const text = task.name || task.title || '';

  // Validação básica
  if (!text) {
    Logger.warn('TaskCategorizer', 'Task sem name/title:', task); /**#LOG_CATEGORIZER*/
    return {
      type: 'OUTROS',
      number: null,
      id: task.contentId || task.id || 'unknown',
      original: task,
    };
  }

  // Regex patterns para cada tipo (ordem IMPORTA! Mais específico primeiro)
  const patterns = {
    QUIZ: /Quiz\s+da\s+Videoaula\s+(\d+)/i, // Deve vir ANTES de VIDEOAULA
    VIDEOAULA: /Videoaula\s+(\d+)/i,
    VIDEO_BASE: /Video-base/i,
    TEXTO_BASE: /Texto-base/i,
    APROFUNDANDO: /Aprofundando\s+o\s+Tema/i,
    ATIVIDADE_AVALIATIVA: /(?:Atividade\s+[Aa]valiativa|Avaliação\s+Institucional)/i,
    FORUM_TEMATICO: /Fórum\s+[Tt]emático/i,
    FORUM_DUVIDAS: /Fórum\s+de\s+dúvidas/i,
    QUIZ_OBJETO_EDUCACIONAL: /Quiz\s+de\s+Objeto\s+Educacional|Quiz\s+Objeto\s+Educacional/i,
    MATERIAL_BASE: /Material(?:-|\s+de\s+)(?:base|apoio)/i,
    VIDEO_BASE_COMPLEMENTAR: /Vídeo-base/i,
  };

  // Tenta encontrar match para cada padrão
  for (const [type, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match) {
      const result = {
        type,
        number: match[1] ? parseInt(match[1], 10) : null,
        id: task.contentId || task.id || 'unknown',
        original: task,
      };

      // Log de atividade categorizada (para validação)
      Logger.debug('TaskCategorizer', `✅ Categorizada: ${type}`, {
        ...(context && { courseName: context.courseName, weekName: context.weekName }),
        name: text,
        type,
        number: result.number,
        id: result.id,
      }); /**#LOG_CATEGORIZER*/

      return result;
    }
  }

  // Fallback: OUTROS (atividades sem padrão específico)
  Logger.debug('TaskCategorizer', '⚠️ Atividade NÃO categorizada (OUTROS)', {
    ...(context && { courseName: context.courseName, weekName: context.weekName }),
    name: text,
    type: task.type,
    contentId: task.contentId,
    id: task.id,
    url: task.url,
  }); /**#LOG_CATEGORIZER*/

  return {
    type: 'OUTROS',
    number: null,
    id: task.contentId || task.id || 'unknown',
    original: task,
  };
}
