function capitalizeWords(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

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
            // Seleciona a categoria "Profissionalizante" automaticamente
            const profissionalizanteTitle = Array.from(document.querySelectorAll('.categoria-titulo')).find(title => title.textContent.toLowerCase() === 'profissionalizante');
            if (profissionalizanteTitle) {
                profissionalizanteTitle.click();
            }
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

        Object.keys(data).forEach(categoria => {
            const subcategorias = data[categoria];
            const filteredSubcategorias = {};

            Object.keys(subcategorias).forEach(subcategoria => {
                const cursos = subcategorias[subcategoria];
                const filteredCursos = {};

                Object.keys(cursos).forEach(key => {
                    const curso = cursos[key];

                    if (curso.Curso.toLowerCase().includes(query)) {
                        filteredCursos[key] = curso;
                    }
                });

                if (Object.keys(filteredCursos).length > 0) {
                    filteredSubcategorias[subcategoria] = filteredCursos;
                }
            });

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

        Object.keys(data).forEach(categoria => {
            const subcategorias = data[categoria];

            const categoriaContainer = document.createElement('div');
            categoriaContainer.className = 'categoria-container';

            const categoriaTitle = document.createElement('h2');
            categoriaTitle.textContent = capitalizeWords(categoria);
            categoriaTitle.className = 'categoria-titulo';
            categoriaContainer.appendChild(categoriaTitle);

            categoriaTitle.addEventListener('click', () => {

                // Remove a classe 'active' das subcategorias anteriores
                document.querySelectorAll('.categoria-titulo').forEach(title => {
                    title.classList.remove('active');
                });

                // Adiciona a classe 'active' ao título de categoria clicado
                categoriaTitle.classList.add('active');

                renderSubcategorias(subcategoriaContainer, subcategorias);

                // Exibe ou oculta o container de subcategorias
                if (subcategoriaContainer.style.display === 'none' || subcategoriaContainer.dataset.categoria !== categoria) {
                    subcategoriaContainer.style.display = 'block';
                    subcategoriaContainer.dataset.categoria = categoria;
                } else {
                    subcategoriaContainer.style.display = 'none';
                    subcategoriaContainer.dataset.categoria = '';
                }
            });

            mainContainer.appendChild(categoriaContainer);
        });
    }

    // Função para ocultar todas as subcategorias
    function hideAllSubcategorias() {
        document.querySelectorAll('.cursos-container').forEach(container => {
            container.style.display = 'none';
        });
    }

    // Função para renderizar as subcategorias e cursos
    function renderSubcategorias(container, subcategorias) {
        container.innerHTML = ''; // Limpa subcategorias anteriores

        Object.keys(subcategorias).forEach(subcategoria => {
            const cursos = subcategorias[subcategoria];

            // Título da subcategoria
            const subcategoriaTitle = document.createElement('h3');
            subcategoriaTitle.textContent = capitalizeWords(subcategoria);
            subcategoriaTitle.className = 'subcategoria-titulo';
            container.appendChild(subcategoriaTitle);

            // Container dos cursos
            const cursosContainer = document.createElement('div');
            cursosContainer.className = 'cursos-container'; // Certifique-se de que esta classe seja aplicada
            cursosContainer.dataset.subcategoria = subcategoria;

            // Inicialmente oculto (exceto se for EAD)
            if (subcategoria.toLowerCase() === 'ead') {
                cursosContainer.style.display = 'grid'; // Mostra em grid
            } else {
                cursosContainer.style.display = 'none';
                subcategoriaTitle.addEventListener('click', () => {
                    hideAllSubcategorias(); // Oculta todas as subcategorias

                    // Remove a classe 'active' das subcategorias anteriores
                    document.querySelectorAll('.subcategoria-titulo').forEach(title => {
                        title.classList.remove('active');
                    });

                    // Adiciona a classe 'active' ao título de subcategoria clicado
                    subcategoriaTitle.classList.add('active');

                    cursosContainer.style.display = 'grid'; // Mostra a subcategoria clicada
                });
            }

            // Adiciona os cartões de curso
            Object.keys(cursos).forEach(key => {
                const curso = cursos[key];

                const card = document.createElement('div');
                card.className = 'curso-card';

                const button = document.createElement('a');
                // Link do WhatsApp do responsável por vender os cursos
                button.href = 'https://api.whatsapp.com/send/?phone=5519991428363&text&type=phone_number&app_absent=0';
                button.textContent = 'Saiba Mais';
                button.className = 'curso-button';

                const title = document.createElement('span');
                title.textContent = capitalizeWords(curso.Curso);
                title.className = 'curso-titulo';

                const cargaHoraria = document.createElement('span');
                cargaHoraria.textContent = capitalizeWords(curso.Duração);
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

        const cursosContainer = document.createElement('div');
        cursosContainer.className = 'cursos-container';
        mainContainer.appendChild(cursosContainer);

        Object.keys(data).forEach(categoria => {
            const subcategorias = data[categoria];

            Object.keys(subcategorias).forEach(subcategoria => {
                const cursos = subcategorias[subcategoria];

                Object.keys(cursos).forEach(key => {
                    const curso = cursos[key];

                    const card = document.createElement('div');
                    card.className = 'curso-card';

                    const button = document.createElement('a');
                    button.href = 'https://wa.me/1234567890';
                    button.textContent = 'Saiba Mais';
                    button.className = 'curso-button';

                    const title = document.createElement('span');
                    title.textContent = capitalizeWords(curso.Curso);
                    title.className = 'curso-titulo';

                    const cargaHoraria = document.createElement('span');
                    cargaHoraria.textContent = capitalizeWords(curso.Duração);
                    cargaHoraria.className = 'curso-carga-horaria';

                    card.appendChild(title);
                    card.appendChild(cargaHoraria);
                    card.appendChild(button);
                    cursosContainer.appendChild(card);
                });
            });
        });
    }
});