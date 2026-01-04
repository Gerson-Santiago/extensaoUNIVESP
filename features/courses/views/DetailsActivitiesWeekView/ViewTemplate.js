/**
 * @file ViewTemplate.js
 * @description Centraliza o HTML da View de Detalhes
 */
export const ViewTemplate = {
  /**
   * @param {string} courseName - Nome da matéria
   * @param {string} weekName - Nome da semana
   * @returns {DocumentFragment} Fragmento DOM contendo a estrutura inicial da view
   */
  render: (courseName, weekName) => {
    // Header
    const header = document.createElement('div');
    header.className = 'details-header';

    // Back Button
    const backBtn = document.createElement('button');
    backBtn.id = 'backBtn';
    backBtn.className = 'btn-back';
    backBtn.textContent = '← Voltar';
    header.appendChild(backBtn);

    // Info Section
    const infoDiv = document.createElement('div');
    infoDiv.className = 'details-header-info';

    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'details-breadcrumb';
    const strong = document.createElement('strong');
    strong.textContent = courseName || 'Matéria';
    breadcrumb.appendChild(strong);

    const titleH2 = document.createElement('h2');
    titleH2.className = 'details-title';
    titleH2.textContent = weekName;

    infoDiv.appendChild(breadcrumb);
    infoDiv.appendChild(titleH2);
    header.appendChild(infoDiv);

    // Actions Section
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'details-header-actions';

    const clearBtn = document.createElement('button');
    clearBtn.id = 'clearBtn';
    clearBtn.className = 'btn-clear';
    clearBtn.title = 'Limpar cache e voltar';
    clearBtn.textContent = '🗑️';

    const refreshBtn = document.createElement('button');
    refreshBtn.id = 'refreshBtn';
    refreshBtn.className = 'btn-refresh';
    refreshBtn.title = 'Atualizar lista';
    refreshBtn.textContent = '↻';

    actionsDiv.appendChild(clearBtn);
    actionsDiv.appendChild(refreshBtn);
    header.appendChild(actionsDiv);

    // Chips Container
    const chipsContainer = document.createElement('div');
    chipsContainer.id = 'chipsContainer';
    chipsContainer.className = 'chips-container';
    header.appendChild(chipsContainer);

    // Activities Container
    const activitiesContainer = document.createElement('div');
    activitiesContainer.id = 'activitiesContainer';
    activitiesContainer.className = 'activities-container';

    // Assemble Main Container
    // Note: The original template returned 2 sibling divs.
    // Ideally we should return a wrapper or a DocumentFragment.
    // However, existing consumers might append this result to something.
    // Let's check `DetailsActivitiesWeekView/index.js` usage.
    // It likely does `this.container.innerHTML = ViewTemplate.render(...)`.
    // So we will need to update the consumer too.
    // For now let's return a DocumentFragment or Wrapper.
    // Since we can't return multiple nodes easily without Fragment.

    // Let's assume consumers will be updated to `appendChild(result)`.
    // Returning a Fragment is safer.
    const fragment = document.createDocumentFragment();
    fragment.appendChild(header);
    fragment.appendChild(activitiesContainer);

    return fragment;
  },
};
