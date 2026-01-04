/**
 * @file SkeletonLoader.js
 * @description Componente de Skeleton Screen para carregamento de atividades
 * Técnica de UX para melhorar velocidade percebida
 */

export class SkeletonLoader {
  /**
   * Gera skeleton para lista de atividades
   * @param {number} count - Número de items skeleton para mostrar
   * @returns {HTMLElement} Container do skeleton
   */
  static renderActivitiesSkeleton(count = 5) {
    const container = document.createElement('div');
    container.className = 'skeleton-container';

    // Inject styles only if not present
    if (!document.getElementById('skeleton-styles')) {
      const style = document.createElement('style');
      style.id = 'skeleton-styles';
      style.textContent = `
          .skeleton-container { padding: 10px; }
          .skeleton-item { display: flex; align-items: center; gap: 10px; padding: 12px; margin-bottom: 10px; background: #f5f5f5; border-radius: 8px; animation: skeleton-pulse 1.5s ease-in-out infinite; }
          @keyframes skeleton-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
          .skeleton-shimmer { animation: skeleton-shimmer 2s linear infinite; background: linear-gradient(90deg, #f0f0f0 0%, #e0e0e0 20%, #f0f0f0 40%, #f0f0f0 100%); background-size: 200% 100%; }
          @keyframes skeleton-shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
          .skeleton-number { width: 24px; height: 24px; border-radius: 50%; background: #e0e0e0; flex-shrink: 0; }
          .skeleton-icon { width: 32px; height: 32px; border-radius: 6px; background: #e0e0e0; flex-shrink: 0; }
          .skeleton-text { flex: 1; display: flex; flex-direction: column; gap: 6px; }
          .skeleton-line { height: 14px; border-radius: 4px; background: #e0e0e0; }
          .skeleton-line-short { width: 60%; }
          .skeleton-button { width: 50px; height: 30px; border-radius: 4px; background: #e0e0e0; flex-shrink: 0; }
          .skeleton-loading-text { text-align: center; color: #999; font-size: 13px; margin-top: 10px; animation: skeleton-pulse 1.5s ease-in-out infinite; }
        `;
      document.head.appendChild(style);
    }

    const itemsFragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      itemsFragment.appendChild(this.renderSkeletonItem(i + 1));
    }
    container.appendChild(itemsFragment);

    const loadingText = document.createElement('div');
    loadingText.className = 'skeleton-loading-text';
    loadingText.textContent = '⏳ Carregando atividades...';
    container.appendChild(loadingText);

    return container;
  }

  static renderSkeletonItem(index) {
    const item = document.createElement('div');
    item.className = 'skeleton-item skeleton-shimmer';

    const num = document.createElement('div');
    num.className = 'skeleton-number';

    const icon = document.createElement('div');
    icon.className = 'skeleton-icon';

    const text = document.createElement('div');
    text.className = 'skeleton-text';

    const line1 = document.createElement('div');
    line1.className = 'skeleton-line';
    // Varia o tamanho da linha
    line1.style.width = index % 2 === 0 ? '80%' : '65%';

    const line2 = document.createElement('div');
    line2.className = 'skeleton-line skeleton-line-short';

    text.appendChild(line1);
    text.appendChild(line2);

    const btn = document.createElement('div');
    btn.className = 'skeleton-button';

    item.append(num, icon, text, btn);
    return item;
  }

  /**
   * Gera skeleton compacto para preview de tarefas
   * @param {number} count - Número de ícones skeleton
   * @returns {HTMLElement} Container do skeleton compacto
   */
  static renderTasksPreviewSkeleton(count = 8) {
    const container = document.createElement('div');
    Object.assign(container.style, {
      display: 'flex',
      gap: '5px',
      flexWrap: 'wrap',
      margin: '10px 0',
    });

    // Check/Inject styles
    if (!document.getElementById('skeleton-task-styles')) {
      const style = document.createElement('style');
      style.id = 'skeleton-task-styles';
      style.textContent = `
          .skeleton-task-icon { width: 28px; height: 28px; border-radius: 4px; background: #e0e0e0; animation: skeleton-pulse 1.5s ease-in-out infinite; }
        `;
      document.head.appendChild(style);
    }

    for (let i = 0; i < count; i++) {
      const icon = document.createElement('div');
      icon.className = 'skeleton-task-icon';
      container.appendChild(icon);
    }

    return container;
  }
}
