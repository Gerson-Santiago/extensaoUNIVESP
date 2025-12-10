import { DOM_extractWeeks, scrapeWeeksFromTab } from './logic/scraper.js';
import { loadItems, addItem, deleteItem } from './logic/storage.js';

document.addEventListener('DOMContentLoaded', () => {
    // Referências da UI - Views
    const viewHome = document.getElementById('view-home');
    const viewDetails = document.getElementById('view-details');

    // Home Elements
    constitemList = document.getElementById('itemList');
    const nameInput = document.getElementById('nameInput');
    const urlInput = document.getElementById('urlInput');
    const addBtn = document.getElementById('addBtn');
    const addCurrentBtn = document.getElementById('addCurrentBtn');
    const itemList = document.getElementById('itemList');

    // Details Elements
    const backBtn = document.getElementById('backBtn');
    const detailsTitle = document.getElementById('detailsTitle');
    const openCourseBtn = document.getElementById('openCourseBtn');
    const weeksList = document.getElementById('weeksList');

    let currentCourse = null; // Armazena o curso selecionado atualmente

    // --- INICIALIZAÇÃO ---
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
        detailsTitle.title = course.name; // Tooltip para nomes longos

        // Setup Main Button
        openCourseBtn.onclick = () => {
            chrome.tabs.create({ url: course.url });
        };

        // Render Weeks
        weeksList.innerHTML = '';
        if (course.weeks && course.weeks.length > 0) {
            course.weeks.forEach(week => {
                const wDiv = document.createElement('div');
                wDiv.className = 'week-item';
                wDiv.innerHTML = `
                    <span class="week-name">${week.name}</span>
                    <span class="week-arrow">›</span>
                `;
                wDiv.onclick = () => {
                    chrome.tabs.create({ url: week.url });
                };
                weeksList.appendChild(wDiv);
            });
        } else {
            weeksList.innerHTML = '<div style="padding:15px; text-align:center; color:#999;">Nenhuma semana detectada.</div>';
        }
    }

    // --- EVENT LISTENERS ---

    // Back Button
    backBtn.addEventListener('click', showHome);

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
                if (tab.url.startsWith('http')) {
                    weeks = await scrapeWeeksFromTab(tab.id);
                }

                addItem(name, tab.url, weeks, () => renderHome());
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
                const li = document.createElement('li');
                li.className = 'item';

                // Info Container (Clicável para ir aos Detalhes)
                const infoDiv = document.createElement('div');
                infoDiv.className = 'item-info';
                infoDiv.onclick = () => {
                    // Ao clicar na matéria: Abre nova aba E navega para detalhes
                    // A pedido do usuário: "Quando eu clicar numa materia vai no navegador abrir a materia então o sidepanel... abrir as opções"
                    chrome.tabs.create({ url: course.url });
                    showDetails(course);
                };

                const nameSpan = document.createElement('span');
                nameSpan.className = 'item-name';
                nameSpan.textContent = course.name;

                const urlSpan = document.createElement('div');
                urlSpan.className = 'item-url';
                urlSpan.textContent = course.url;

                infoDiv.appendChild(nameSpan);
                infoDiv.appendChild(urlSpan);

                // Botão Remover (Não triggera onClick do pai)
                const delBtn = document.createElement('button');
                delBtn.className = 'btn-delete';
                delBtn.innerHTML = '&times;';
                delBtn.title = 'Remover';
                delBtn.onclick = (e) => {
                    e.stopPropagation();
                    if (confirm('Remover esta matéria?')) {
                        deleteItem(course.id, () => renderHome());
                    }
                };

                li.appendChild(infoDiv);
                li.appendChild(delBtn);
                itemList.appendChild(li);
            });
        });
    }
});
