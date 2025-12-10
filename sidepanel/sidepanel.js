document.addEventListener('DOMContentLoaded', () => {
    const itemList = document.getElementById('itemList');
    const nameInput = document.getElementById('nameInput');
    const urlInput = document.getElementById('urlInput');
    const addBtn = document.getElementById('addBtn');
    const addCurrentBtn = document.getElementById('addCurrentBtn');

    // Carregar itens salvos
    loadItems();

    // Botão Adicionar Manual
    addBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();

        if (name && url) {
            addItem(name, url, []);
            nameInput.value = '';
            urlInput.value = '';
        } else {
            alert('Preencha nome e URL.');
        }
    });

    // Função que será injetada para rodar na página
    function DOM_extractWeeks() {
        const weeks = [];
        // Seleciona todos os links da página
        const links = document.querySelectorAll('a');

        links.forEach(a => {
            const text = (a.innerText || "").trim();
            const title = (a.title || "").trim();
            const href = a.href;

            // Verifica se tem "Semana" no texto ou título
            // Ex user: <span title="Semana 1">Semana 1</span> dentro de <a>
            if ((text.includes('Semana') || title.includes('Semana')) && href) {
                // Tenta limpar o nome, pegar só "Semana X"
                let name = text || title;
                // Remove caracteres extras se precisar
                weeks.push({ name: name, url: href });
            }
        });

        // Remove duplicatas baseado na URL
        const uniqueWeeks = [];
        const map = new Map();
        for (const item of weeks) {
            if (!map.has(item.url)) {
                map.set(item.url, true);
                uniqueWeeks.push(item);
            }
        }

        // Ordena por número da semana, se possível
        uniqueWeeks.sort((a, b) => {
            const numA = parseInt(a.name.replace(/\D/g, '')) || 0;
            const numB = parseInt(b.name.replace(/\D/g, '')) || 0;
            return numA - numB;
        });

        return uniqueWeeks;
    }

    // Botão Adicionar Página Atual (com Scripting)
    addCurrentBtn.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
            if (tabs && tabs[0]) {
                const tab = tabs[0];
                let name = tab.title || "Nova Matéria";
                if (name.includes('-')) {
                    name = name.split('-')[0].trim();
                }

                let weeks = [];

                // Se tiver permissão e for uma URL http(s), tenta extrair as semanas
                if (tab.url.startsWith('http')) {
                    try {
                        const results = await chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            func: DOM_extractWeeks,
                        });

                        if (results && results[0] && results[0].result) {
                            weeks = results[0].result;
                        }
                    } catch (e) {
                        console.error("Erro ao extrair semanas:", e);
                        // Continua mesmo se falhar (pode não ser página da Univesp ou erro de permissão)
                    }
                }

                addItem(name, tab.url, weeks);
            }
        });
    });

    function loadItems() {
        chrome.storage.sync.get(['savedCourses'], (result) => {
            const courses = result.savedCourses || [];
            renderList(courses);
        });
    }

    function saveItems(courses) {
        chrome.storage.sync.set({ savedCourses: courses }, () => {
            renderList(courses);
        });
    }

    function addItem(name, url, weeks = []) {
        chrome.storage.sync.get(['savedCourses'], (result) => {
            const courses = result.savedCourses || [];
            // Verifica se já existe para atualizar weeks? Por enquanto adiciona novo.
            courses.push({ id: Date.now(), name, url, weeks });
            saveItems(courses);
        });
    }

    function deleteItem(id) {
        if (confirm('Remover esta matéria?')) {
            chrome.storage.sync.get(['savedCourses'], (result) => {
                const courses = result.savedCourses || [];
                const newCourses = courses.filter(item => item.id !== id);
                saveItems(newCourses);
            });
        }
    }

    function renderList(courses) {
        itemList.innerHTML = '';

        if (courses.length === 0) {
            itemList.innerHTML = '<li style="color: #999; text-align: center; padding: 10px;">Nenhuma matéria salva.</li>';
            return;
        }

        courses.forEach(course => {
            const li = document.createElement('li');
            li.className = 'item';

            // --- Header do Item ---
            const headerDiv = document.createElement('div');
            headerDiv.className = 'item-header';

            const infoDiv = document.createElement('div');
            infoDiv.className = 'item-info';

            // Container título com toggle (se tiver semanas)
            const titleContainer = document.createElement('div');
            titleContainer.style.display = 'flex';
            titleContainer.style.alignItems = 'center';

            const hasWeeks = course.weeks && course.weeks.length > 0;
            let weekListDiv = null;

            if (hasWeeks) {
                const toggleIcon = document.createElement('span');
                toggleIcon.className = 'toggle-icon';
                toggleIcon.textContent = '\u25B6'; // Seta direita
                toggleIcon.onclick = (e) => {
                    e.stopPropagation();
                    // Toggle lógica
                    const isOpen = weekListDiv.style.display === 'block';
                    weekListDiv.style.display = isOpen ? 'none' : 'block';
                    toggleIcon.className = isOpen ? 'toggle-icon' : 'toggle-icon expanded';
                };
                titleContainer.appendChild(toggleIcon);
            }

            const link = document.createElement('a');
            link.className = 'item-name';
            link.textContent = course.name;
            link.addEventListener('click', () => {
                chrome.tabs.create({ url: course.url });
            });
            titleContainer.appendChild(link);

            const urlSpan = document.createElement('div');
            urlSpan.className = 'item-url';
            urlSpan.textContent = course.url;

            infoDiv.appendChild(titleContainer);
            infoDiv.appendChild(urlSpan);

            const delBtn = document.createElement('button');
            delBtn.className = 'btn-delete';
            delBtn.innerHTML = '&times;';
            delBtn.title = 'Remover';
            delBtn.addEventListener('click', () => {
                deleteItem(course.id);
            });

            headerDiv.appendChild(infoDiv);
            headerDiv.appendChild(delBtn);
            li.appendChild(headerDiv);

            // --- Lista de Semanas ---
            if (hasWeeks) {
                weekListDiv = document.createElement('div');
                weekListDiv.className = 'week-list';

                course.weeks.forEach(week => {
                    const wItem = document.createElement('div');
                    wItem.className = 'week-item';

                    const wLink = document.createElement('a');
                    wLink.className = 'week-link';
                    wLink.textContent = week.name;
                    wLink.addEventListener('click', () => {
                        chrome.tabs.create({ url: week.url });
                    });

                    wItem.appendChild(wLink);
                    weekListDiv.appendChild(wItem);
                });
                li.appendChild(weekListDiv);
            }

            itemList.appendChild(li);
        });
    }
});
