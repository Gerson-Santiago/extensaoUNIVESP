import { scrapeWeeksFromTab } from './logic/scraper.js';
import { scrapeCourseList } from './logic/batchScraper.js';
import { loadItems, addItem, deleteItem, updateItem } from './logic/storage.js';
import { openOrSwitchToTab } from './logic/tabs.js';
import { createCourseElement, createWeekElement } from './ui/components.js';

document.addEventListener('DOMContentLoaded', () => {
    // Referências da UI - Views
    const viewHome = document.getElementById('view-home');
    const viewDetails = document.getElementById('view-details');
    const viewSettings = document.getElementById('view-settings');

    // Home Elements
    const itemList = document.getElementById('itemList');
    const nameInput = document.getElementById('nameInput');
    const urlInput = document.getElementById('urlInput');
    const addBtn = document.getElementById('addBtn');
    const addCurrentBtn = document.getElementById('addCurrentBtn');
    const settingsBtn = document.getElementById('settingsBtn');

    // Settings Elements
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const btnImportBatch = document.getElementById('btnImportBatch');
    const batchCountInput = document.getElementById('batchCount');
    const batchStatus = document.getElementById('batchStatus');

    // Details Elements
    const backBtn = document.getElementById('backBtn');
    const detailsTitle = document.getElementById('detailsTitle');
    const openCourseBtn = document.getElementById('openCourseBtn');
    const refreshWeeksBtn = document.getElementById('refreshWeeksBtn');
    const weeksList = document.getElementById('weeksList');

    let currentCourse = null; // Armazena o curso selecionado atualmente

    // --- INICIALIZAÇÃO ---
    renderHome();

    // --- VIEW NAVIGATION ---
    function showHome() {
        viewDetails.style.display = 'none';
        viewSettings.style.display = 'none';
        viewHome.style.display = 'block';
        currentCourse = null;
        renderHome();
    }

    function showDetails(course) {
        currentCourse = course;
        viewHome.style.display = 'none';
        viewSettings.style.display = 'none';
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

    function showSettings() {
        viewHome.style.display = 'none';
        viewDetails.style.display = 'none';
        viewSettings.style.display = 'block';
        batchStatus.textContent = '';
    }

    // --- EVENT LISTENERS ---

    // Navigation
    backBtn.addEventListener('click', showHome);
    settingsBtn.addEventListener('click', showSettings);
    closeSettingsBtn.addEventListener('click', showHome);

    // Botão Adicionar Manual
    addBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();

        if (name && url) {
            addItem(name, url, [], () => renderHome());
            nameInput.value = '';
            urlInput.value = '';
        } else {
            alert('Preencha nome e URL.');
        }
    });

    // Botão Adicionar Página Atual
    addCurrentBtn.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            if (tabs && tabs[0]) {
                const tab = tabs[0];
                let name = tab.title || "Nova Matéria";
                if (name.includes('-')) {
                    name = name.split('-')[0].trim();
                }

                let weeks = [];
                let detectedName = null;

                if (tab.url.startsWith('http')) {
                    const result = await scrapeWeeksFromTab(tab.id);
                    weeks = result.weeks || [];
                    detectedName = result.title;
                }

                // Se o scraper achou um título melhor (h1.panel-title), usa ele.
                if (detectedName) {
                    name = detectedName;
                }

                addItem(name, tab.url, weeks, () => renderHome());
            }
        });
    });

    // Botão Importar em Lote (Configurações)
    btnImportBatch.addEventListener('click', async () => {
        batchStatus.textContent = 'Iniciando...';
        btnImportBatch.disabled = true;

        const max = parseInt(batchCountInput.value) || 6;

        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            if (tabs && tabs[0]) {
                const tab = tabs[0];

                // Validação de URL básica antes de injetar
                if (!tab.url.includes('/ultra/course')) {
                    batchStatus.textContent = 'Erro: Você não está na página de Cursos do AVA.';
                    btnImportBatch.disabled = false;
                    return;
                }

                batchStatus.textContent = 'Analisando página...';

                const result = await scrapeCourseList(tab.id, max);

                if (result.success) {
                    batchStatus.textContent = `Sucesso! Adicionando ${result.courses.length} cursos...`;

                    // Adiciona sequencialmente para não travar storage
                    let count = 0;
                    for (const course of result.courses) {
                        // Adiciona apenas se URL não for vazia
                        if (course.url) {
                            // addItem é assíncrono? No código original usa callback, vamos envolver em promise se precisar,
                            // mas o storage chrome é async. O addItem do código original não retorna promise, recebe callback.
                            // Vamos fazer um "fire and forget" com pequeno delay ou apenas chamar.
                            // Para garantir atualização da home, chamamos renderHome no final.
                            addItem(course.name, course.url, [], () => { });
                            count++;
                        }
                    }

                    setTimeout(() => {
                        batchStatus.textContent = `Concluído: ${count} cursos importados via ${result.message}`;
                        btnImportBatch.disabled = false;
                        // Opcional: voltar para home automaticamente após um tempo
                    }, 1000);

                } else {
                    batchStatus.textContent = `Erro: ${result.message}`;
                    btnImportBatch.disabled = false;
                }
            }
        });
    });


    // --- RENDER FUNCTIONS ---

    function renderHome() {
        loadItems((courses) => {
            itemList.innerHTML = '';

            if (courses.length === 0) {
                itemList.innerHTML = '<li style="color: #999; text-align: center; padding: 10px;">Nenhuma matéria salva.</li>';
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
