import { scrapeWeeksFromTab } from './logic/scraper.js';
import { loadItems, addItem, deleteItem, updateItem } from './logic/storage.js';
import { openOrSwitchToTab } from './logic/tabs.js';
import { createCourseElement, createWeekElement } from './ui/components.js';

// UI Components
import { initMenu } from './ui/menu.js';
import { initManualForm } from './ui/forms/manualForm.js';
import { initBatchForm } from './ui/forms/batchForm.js';

document.addEventListener('DOMContentLoaded', () => {
    // Referências da UI - Views
    const viewHome = document.getElementById('view-home');
    const viewDetails = document.getElementById('view-details');
    const itemList = document.getElementById('itemList');

    // Details Elements
    const backBtn = document.getElementById('backBtn');
    const detailsTitle = document.getElementById('detailsTitle');
    const openCourseBtn = document.getElementById('openCourseBtn');
    const refreshWeeksBtn = document.getElementById('refreshWeeksBtn');
    const weeksList = document.getElementById('weeksList');

    let currentCourse = null;

    // --- INICIALIZAÇÃO DE COMPONENTES ---

    // 1. Manual Form
    const manualForm = initManualForm((name, url) => {
        addItem(name, url, [], () => renderHome());
    });

    // 2. Batch Form
    const batchForm = initBatchForm(
        (name, url, doneCallback) => {
            addItem(name, url, [], doneCallback);
        },
        (totalCount) => {
            renderHome();
            alert(`${totalCount} matérias importadas com sucesso!`);
        }
    );

    // 3. Helper: Add Current Page Logic
    async function handleAddCurrent() {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            if (tabs && tabs[0]) {
                const tab = tabs[0];
                const confirmMsg = `Deseja adicionar a página atual?\n\n${tab.title}\n${tab.url}`;

                if (confirm(confirmMsg)) {
                    let name = tab.title || "Nova Matéria";
                    if (name.includes('-')) name = name.split('-')[0].trim();

                    let weeks = [];
                    let detectedName = null;

                    if (tab.url.startsWith('http')) {
                        const result = await scrapeWeeksFromTab(tab.id);
                        weeks = result.weeks || [];
                        detectedName = result.title;
                    }

                    if (detectedName) name = detectedName;

                    addItem(name, tab.url, weeks, () => {
                        renderHome();
                        alert('Página adicionada!');
                    });
                }
            }
        });
    }

    // 4. Menu Settings
    initMenu({
        onAddManual: () => manualForm.open(),
        onAddCurrent: () => handleAddCurrent(),
        onAddBatch: () => batchForm.open()
    });


    // --- INICIALIZAÇÃO VIEW ---
    renderHome();

    // --- VIEW NAVIGATION ---
    function showHome() {
        viewDetails.style.display = 'none';
        viewHome.style.display = 'block';
        currentCourse = null;
        renderHome();
    }

    function showDetails(course) {
        currentCourse = course;
        viewHome.style.display = 'none';
        viewDetails.style.display = 'block';

        // Setup Header
        detailsTitle.textContent = course.name;
        detailsTitle.title = course.name;

        // Setup Main Button
        openCourseBtn.onclick = () => {
            openOrSwitchToTab(course.url);
        };

        // Setup Refresh Button
        refreshWeeksBtn.onclick = async () => {
            refreshWeeksBtn.disabled = true;
            refreshWeeksBtn.textContent = '...';

            chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
                if (tabs && tabs[0]) {
                    const activeTab = tabs[0];

                    if (!activeTab.url || (!activeTab.url.includes('univesp.br') && !activeTab.url.includes('blackboard'))) {
                        alert('Por favor, acesse a página da matéria no Blackboard.');
                        refreshWeeksBtn.disabled = false;
                        refreshWeeksBtn.textContent = '↻';
                        return;
                    }

                    try {
                        const result = await scrapeWeeksFromTab(activeTab.id);
                        const weeks = result.weeks || [];

                        if (weeks && weeks.length > 0) {
                            updateItem(course.id, { weeks: weeks }, () => {
                                course.weeks = weeks;
                                showDetails(course);
                                alert(`${weeks.length} semanas atualizadas!`);
                            });
                        } else {
                            alert('Nenhuma semana encontrada nesta página.');
                        }
                    } catch (error) {
                        console.error(error);
                        alert('Erro ao buscar semanas.');
                    } finally {
                        refreshWeeksBtn.disabled = false;
                        refreshWeeksBtn.textContent = '↻';
                    }
                }
            });
        };

        // Render Weeks
        weeksList.innerHTML = '';
        if (course.weeks && course.weeks.length > 0) {
            course.weeks.forEach(week => {
                const wDiv = createWeekElement(week, {
                    onClick: (url) => openOrSwitchToTab(url)
                });
                weeksList.appendChild(wDiv);
            });
        } else {
            weeksList.innerHTML = '<div style="padding:15px; text-align:center; color:#999;">Nenhuma semana detectada.</div>';
        }
    }

    // --- BUTTON LISTENERS ---
    backBtn.addEventListener('click', showHome);

    // --- RENDER FUNCTIONS ---

    function renderHome() {
        loadItems((courses) => {
            itemList.innerHTML = '';

            if (courses.length === 0) {
                itemList.innerHTML = '<li style="color: #999; text-align: center; padding: 10px;">Nenhuma matéria salva.<br><span style="font-size:11px">Use a engrenagem para adicionar.</span></li>';
                return;
            }

            courses.forEach(course => {
                const li = createCourseElement(course, {
                    onDelete: (id) => deleteItem(id, () => renderHome()),
                    onClick: (url) => openOrSwitchToTab(url),
                    onViewDetails: (c) => showDetails(c)
                });
                itemList.appendChild(li);
            });
        });
    }
});
