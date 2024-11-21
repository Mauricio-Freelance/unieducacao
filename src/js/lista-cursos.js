document.addEventListener('DOMContentLoaded', function () {
    let cursosData = {};

    fetch('../../database.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o JSON');
            }
            return response.json();
        })
        .then(data => {
            cursosData = data;
            renderCategorias(cursosData);
        })
        .catch(error => console.error('Erro ao carregar o JSON:', error));

    // Adicionando evento para a barra de pesquisa
    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('input', function () {
        const query = searchBar.value.toLowerCase();
        if (query === '') {
            renderCategorias(cursosData);
        } else {
            const filteredData = filterCursos(cursosData, query);
            renderCursosFiltrados(filteredData);
        }
    });

    // Função de filtro dos cursos com base no nome do curso
    function filterCursos(data, query) {
        const filteredData = {};

        // Filtra as categorias
        Object.keys(data).forEach(categoria => {
            const subcategorias = data[categoria];
            const filteredSubcategorias = {};

            // Filtra as subcategorias
            Object.keys(subcategorias).forEach(subcategoria => {
                const cursos = subcategorias[subcategoria];
                const filteredCursos = {};

                // Filtra os cursos dentro das subcategorias
                Object.keys(cursos).forEach(key => {
                    const curso = cursos[key];

                    // Verifica se o nome do curso contém o texto da pesquisa
                    if (curso.Curso.toLowerCase().includes(query)) {
                        filteredCursos[key] = curso;
                    }
                });

                // Se algum curso for encontrado para essa subcategoria, adiciona ao resultado
                if (Object.keys(filteredCursos).length > 0) {
                    filteredSubcategorias[subcategoria] = filteredCursos;
                }
            });

            // Se alguma subcategoria foi filtrada, adiciona à categoria
            if (Object.keys(filteredSubcategorias).length > 0) {
                filteredData[categoria] = filteredSubcategorias;
            }
        });

        return filteredData;
    }

    // Função para renderizar as categorias e os cursos
    function renderCategorias(data) {
        const container = document.getElementById('curso-lista');
        container.innerHTML = ''; // Limpa o conteúdo anterior

        const mainContainer = document.createElement('div');
        mainContainer.className = 'main-container';
        container.appendChild(mainContainer);

        const subcategoriaContainer = document.createElement('div');
        subcategoriaContainer.className = 'subcategoria-container';
        subcategoriaContainer.style.display = 'none'; // Inicialmente oculto
        container.appendChild(subcategoriaContainer);

        // Renderiza as categorias
        Object.keys(data).forEach(categoria => {
            const subcategorias = data[categoria];

            // Contêiner para cada categoria
            const categoriaContainer = document.createElement('div');
            categoriaContainer.className = 'categoria-container';

            const categoriaTitle = document.createElement('h2');
            categoriaTitle.textContent = categoria;
            categoriaTitle.className = 'categoria-titulo';
            categoriaContainer.appendChild(categoriaTitle);

            categoriaTitle.addEventListener('click', () => {
                // Atualiza o contêiner global de subcategorias
                renderSubcategorias(subcategoriaContainer, subcategorias);
                subcategoriaContainer.style.display = subcategoriaContainer.style.display === 'none' ? 'block' : 'none';
            });

            mainContainer.appendChild(categoriaContainer);
        });
    }

    // Função para renderizar as subcategorias e cursos
    function renderSubcategorias(container, subcategorias) {
        container.innerHTML = ''; // Limpa subcategorias anteriores

        Object.keys(subcategorias).forEach(subcategoria => {
            const cursos = subcategorias[subcategoria];

            const subcategoriaTitle = document.createElement('h3');
            subcategoriaTitle.textContent = subcategoria;
            subcategoriaTitle.className = 'subcategoria-titulo';
            container.appendChild(subcategoriaTitle);

            subcategoriaTitle.addEventListener('click', () => {
                const cursosContainer = document.querySelector(`.cursos-container[data-subcategoria="${subcategoria}"]`);
                cursosContainer.style.display = cursosContainer.style.display === 'none' ? 'block' : 'none';
            });

            const cursosContainer = document.createElement('div');
            cursosContainer.className = 'cursos-container';
            cursosContainer.dataset.subcategoria = subcategoria;
            cursosContainer.style.display = 'none';

            Object.keys(cursos).forEach(key => {
                const curso = cursos[key];

                const card = document.createElement('div');
                card.className = 'curso-card';

                const button = document.createElement('a');
                button.href = 'https://wa.me/1234567890';
                button.textContent = 'Mais';
                button.className = 'curso-button';

                const title = document.createElement('span');
                title.textContent = curso.Curso;
                title.className = 'curso-titulo';

                const cargaHoraria = document.createElement('span');
                cargaHoraria.textContent = curso.Duração;
                cargaHoraria.className = 'curso-carga-horaria';

                card.appendChild(title);
                card.appendChild(cargaHoraria);
                card.appendChild(button);
                cursosContainer.appendChild(card);
            });

            container.appendChild(cursosContainer);
        });
    }

    // Função para renderizar os cursos filtrados
    function renderCursosFiltrados(data) {
        const container = document.getElementById('curso-lista');
        container.innerHTML = ''; // Limpa o conteúdo anterior

        const mainContainer = document.createElement('div');
        mainContainer.className = 'main-container';
        container.appendChild(mainContainer);

        // Renderiza os cursos filtrados
        Object.keys(data).forEach(categoria => {
            const subcategorias = data[categoria];

            Object.keys(subcategorias).forEach(subcategoria => {
                const cursos = subcategorias[subcategoria];

                const cursosContainer = document.createElement('div');
                cursosContainer.className = 'cursos-container';

                Object.keys(cursos).forEach(key => {
                    const curso = cursos[key];

                    const card = document.createElement('div');
                    card.className = 'curso-card';

                    const button = document.createElement('a');
                    button.href = 'https://wa.me/1234567890';
                    button.textContent = 'Mais';
                    button.className = 'curso-button';

                    const title = document.createElement('span');
                    title.textContent = curso.Curso;
                    title.className = 'curso-titulo';

                    const cargaHoraria = document.createElement('span');
                    cargaHoraria.textContent = curso.Duração;
                    cargaHoraria.className = 'curso-carga-horaria';

                    card.appendChild(title);
                    card.appendChild(cargaHoraria);
                    card.appendChild(button);
                    cursosContainer.appendChild(card);
                });

                mainContainer.appendChild(cursosContainer);
            });
        });
    }
});
