/**
 * @file SkeletonLoader.js
 * @description Componente de Skeleton Screen para carregamento de atividades
 * Técnica de UX para melhorar velocidade percebida
 */

export class SkeletonLoader {
  /**
   * Gera HTML de skeleton para lista de atividades
   * @param {number} count - Número de items skeleton para mostrar
   * @returns {string} HTML do skeleton
   */
  static renderActivitiesSkeleton(count = 5) {
    const items = Array.from({ length: count }, (_, i) => this.renderSkeletonItem(i + 1)).join('');

    return `
      <div class="skeleton-container">
        <style>
          .skeleton-container {
            padding: 10px;
          }
          
          .skeleton-item {
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 12px;
            margin-bottom: 10px;
            background: #f5f5f5;
            border-radius: 8px;
            animation: skeleton-pulse 1.5s ease-in-out infinite;
          }
          
          @keyframes skeleton-pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          
          .skeleton-shimmer {
            animation: skeleton-shimmer 2s linear infinite;
            background: linear-gradient(
              90deg,
              #f0f0f0 0%,
              #e0e0e0 20%,
              #f0f0f0 40%,
              #f0f0f0 100%
            );
            background-size: 200% 100%;
          }
          
          @keyframes skeleton-shimmer {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
          
          .skeleton-number {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: #e0e0e0;
            flex-shrink: 0;
          }
          
          .skeleton-icon {
            width: 32px;
            height: 32px;
            border-radius: 6px;
            background: #e0e0e0;
            flex-shrink: 0;
          }
          
          .skeleton-text {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          
          .skeleton-line {
            height: 14px;
            border-radius: 4px;
            background: #e0e0e0;
          }
          
          .skeleton-line-short {
            width: 60%;
          }
          
          .skeleton-button {
            width: 50px;
            height: 30px;
            border-radius: 4px;
            background: #e0e0e0;
            flex-shrink: 0;
          }
          
          .skeleton-loading-text {
            text-align: center;
            color: #999;
            font-size: 13px;
            margin-top: 10px;
            animation: skeleton-pulse 1.5s ease-in-out infinite;
          }
        </style>
        
        ${items}
        
        <div class="skeleton-loading-text">
          ⏳ Carregando atividades...
        </div>
      </div>
    `;
  }

  /**
   * Gera um item skeleton individual
   * @param {number} index - Índice do item
   * @returns {string} HTML do item skeleton
   */
  static renderSkeletonItem(index) {
    // Varia o tamanho da linha de texto para parecer mais realista
    const textWidth = index % 2 === 0 ? '80%' : '65%';

    return `
      <div class="skeleton-item skeleton-shimmer">
        <div class="skeleton-number"></div>
        <div class="skeleton-icon"></div>
        <div class="skeleton-text">
          <div class="skeleton-line" style="width: ${textWidth}"></div>
          <div class="skeleton-line skeleton-line-short"></div>
        </div>
        <div class="skeleton-button"></div>
      </div>
    `;
  }

  /**
   * Gera skeleton compacto para preview de tarefas
   * @param {number} count - Número de ícones skeleton
   * @returns {string} HTML do skeleton compacto
   */
  static renderTasksPreviewSkeleton(count = 8) {
    const icons = Array.from(
      { length: count },
      () => '<div class="skeleton-task-icon"></div>'
    ).join('');

    return `
      <div style="display: flex; gap: 5px; flex-wrap: wrap; margin: 10px 0;">
        <style>
          .skeleton-task-icon {
            width: 28px;
            height: 28px;
            border-radius: 4px;
            background: #e0e0e0;
            animation: skeleton-pulse 1.5s ease-in-out infinite;
          }
        </style>
        ${icons}
      </div>
    `;
  }
}
