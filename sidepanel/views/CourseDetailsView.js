import { createWeekElement } from '../../features/courses/components/WeekItem.js';
import { ScraperService } from '../../features/courses/services/ScraperService.js';
import { CourseRepository } from '../data/repositories/CourseRepository.js';

export class CourseDetailsView {
  constructor(callbacks) {
    // callbacks: { onBack, onOpenCourse }
    this.callbacks = callbacks;
    this.course = null;
  }

  setCourse(course) {
    this.course = course;
  }

  render() {
    if (!this.course) return document.createElement('div');

    const div = document.createElement('div');
    div.className = 'view-details';
    div.innerHTML = `
            <div class="details-header">
                <button id="backBtn" class="btn-back">← Voltar</button>
                <h2 id="detailsTitle" class="details-title">${this.course.name}</h2>
            </div>
            
            <div id="detailsActions" style="margin-bottom: 15px; display: flex; gap: 5px;">
                <button id="openCourseBtn" class="btn-open-course" style="flex: 1;">Abrir Matéria</button>
                <button id="refreshWeeksBtn" class="btn-refresh" title="Atualizar Semanas" style="width: 40px; cursor: pointer;">↻</button>
            </div>

            <h3 style="font-size: 14px; color: #555; margin-bottom: 10px;">Semanas Disponíveis:</h3>
            <div id="weeksList" class="weeks-container">
                <!-- Lista de semanas aqui -->
            </div>
        `;
    return div;
  }

  afterRender() {
    if (!this.course) return;

    // Setup Buttons
    const backBtn = document.getElementById('backBtn');
    const openCourseBtn = document.getElementById('openCourseBtn');
    const refreshWeeksBtn = document.getElementById('refreshWeeksBtn');
    const weeksList = document.getElementById('weeksList');

    if (backBtn) {
      backBtn.onclick = () => this.callbacks.onBack();
    }

    if (openCourseBtn) {
      openCourseBtn.onclick = () => this.callbacks.onOpenCourse(this.course.url);
    }

    if (refreshWeeksBtn instanceof HTMLButtonElement) {
      refreshWeeksBtn.onclick = async () => {
        refreshWeeksBtn.disabled = true;
        refreshWeeksBtn.textContent = '...';
        await this.handleRefresh(refreshWeeksBtn);
      };
    }

    // Render Weeks
    this.renderWeeksList(weeksList);
  }

  renderWeeksList(weeksList) {
    if (!weeksList) return;
    weeksList.innerHTML = '';
    if (this.course.weeks && this.course.weeks.length > 0) {
      this.course.weeks.forEach((week) => {
        const wDiv = createWeekElement(week, {
          onClick: (url) => this.callbacks.onOpenCourse(url),
        });
        weeksList.appendChild(wDiv);
      });
    } else {
      weeksList.innerHTML =
        '<div style="padding:15px; text-align:center; color:#999;">Nenhuma semana detectada.</div>';
    }
  }

  async handleRefresh(btn) {
    // Importa a função para abrir/trocar abas
    const { Tabs } = await import('../../shared/utils/Tabs.js');

    // Primeiro, abre/troca para a aba da matéria correta
    Tabs.openOrSwitchTo(this.course.url);

    // Aguarda um pouco para a aba trocar/abrir
    // Aguarda um pouco para a aba trocar/abrir
    setTimeout(async () => {
      const activeTab = await Tabs.getCurrentTab();
      if (activeTab) {
        // Verifica se a aba ativa é realmente da matéria correta
        const courseMatch = activeTab.url && activeTab.url.match(/course_id=(_.+?)(&|$)/);
        const expectedCourseMatch =
          this.course.url && this.course.url.match(/course_id=(_.+?)(&|$)/);
        const activeCourseId = courseMatch ? courseMatch[1] : null;
        const expectedCourseId = expectedCourseMatch ? expectedCourseMatch[1] : null;

        if (!activeCourseId || activeCourseId !== expectedCourseId) {
          alert(
            `Por favor, aguarde a página da matéria "${this.course.name}" carregar e tente novamente.`
          );
          if (btn && btn instanceof HTMLButtonElement) {
            btn.disabled = false;
            btn.textContent = '↻';
          }
          return;
        }

        try {
          const result = await ScraperService.scrapeWeeksFromTab(activeTab.id);
          const weeks = result.weeks || [];

          if (weeks && weeks.length > 0) {
            CourseRepository.update(this.course.id, { weeks: weeks }, () => {
              this.course.weeks = weeks;
              alert(`${weeks.length} semanas atualizadas para "${this.course.name}"!`);
              // Re-render only list
              const weeksList = document.getElementById('weeksList');
              this.renderWeeksList(weeksList);
            });
          } else {
            alert('Nenhuma semana encontrada nesta página.');
          }
        } catch (error) {
          console.error(error);
          alert('Erro ao buscar semanas.');
        } finally {
          if (btn && btn instanceof HTMLButtonElement) {
            btn.disabled = false;
            btn.textContent = '↻';
          }
        }
      }
    }, 1000); // 1 segundo para dar tempo da aba trocar/carregar
  }
}
