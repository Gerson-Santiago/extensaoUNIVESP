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
            addItem(name, url);
            nameInput.value = '';
            urlInput.value = '';
        } else {
            alert('Preencha nome e URL.');
        }
    });

    // Botão Adicionar Página Atual
    addCurrentBtn.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs[0]) {
                const tab = tabs[0];
                // Tenta pegar o título da página ou uma parte dele
                // Ex: "Matemática Básica - Univesp..." -> "Matemática Básica"
                let name = tab.title || "Nova Matéria";
                // Sugestão simples de limpeza de título, pode ser melhorada
                if (name.includes('-')) {
                    name = name.split('-')[0].trim();
                }

                nameInput.value = name;
                urlInput.value = tab.url;

                // Opcional: já salvar direto? Ou deixar o usuário confirmar?
                // Vamos deixar ele confirmar clicando em Adicionar, mas preenchemos os campos authomaticamente
                // Se quiser salvar direto:
                // addItem(name, tab.url);
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

    function addItem(name, url) {
        chrome.storage.sync.get(['savedCourses'], (result) => {
            const courses = result.savedCourses || [];
            courses.push({ id: Date.now(), name, url });
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

            const infoDiv = document.createElement('div');
            infoDiv.className = 'item-info';

            const link = document.createElement('a');
            link.className = 'item-name';
            link.textContent = course.name;
            // Ao clicar, abre o link
            link.addEventListener('click', () => {
                chrome.tabs.create({ url: course.url });
            });

            const urlSpan = document.createElement('div');
            urlSpan.className = 'item-url';
            urlSpan.textContent = course.url;

            infoDiv.appendChild(link);
            infoDiv.appendChild(urlSpan);

            const delBtn = document.createElement('button');
            delBtn.className = 'btn-delete';
            delBtn.innerHTML = '&times;';
            delBtn.title = 'Remover';
            delBtn.addEventListener('click', () => {
                deleteItem(course.id);
            });

            li.appendChild(infoDiv);
            li.appendChild(delBtn);
            itemList.appendChild(li);
        });
    }
});
