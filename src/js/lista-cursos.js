document.addEventListener('DOMContentLoaded', function() {
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
            renderCursos(data);
        })
        .catch(error => console.error('Erro ao carregar o JSON:', error));

    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('input', function() {
        const query = searchBar.value.toLowerCase();
        const filteredData = filterCursos(cursosData, query);
        renderCursos(filteredData, query);
    });

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

    function renderCursos(data, query = '') {
        const container = document.getElementById('curso-lista');
        container.innerHTML = '';

        if (query) {
            // Renderizar apenas os cursos que correspondem à busca
            Object.keys(data).forEach(categoria => {
                const subcategorias = data[categoria];
                Object.keys(subcategorias).forEach(subcategoria => {
                    const cursos = subcategorias[subcategoria];
                    Object.keys(cursos).forEach(key => {
                        const curso = cursos[key];

                        const row = document.createElement('div');
                        row.className = 'curso-row';

                        const button = document.createElement('a');
                        if (categoria === 'Pós Graduação') {
                            button.href = 'https://wa.me/1234567890';
                        } else if (categoria === 'Tecnologia') {
                            button.href = 'https://example.com';
                        } else {
                            button.href = '#';
                        }
                        button.textContent = 'Mais';
                        button.className = 'curso-button';

                        const title = document.createElement('span');
                        title.textContent = curso.Curso;
                        title.className = 'curso-titulo';

                        const cargaHoraria = document.createElement('span');
                        cargaHoraria.textContent = curso.Duração;
                        cargaHoraria.className = 'curso-carga-horaria';

                        row.appendChild(title);
                        row.appendChild(cargaHoraria);
                        row.appendChild(button);

                        container.appendChild(row);
                    });
                });
            });
        } else {
            Object.keys(data).forEach(categoria => {
                const subcategorias = data[categoria];

                const categoriaContainer = document.createElement('div');
                categoriaContainer.className = 'categoria-container';

                const categoriaTitle = document.createElement('h2');
                categoriaTitle.textContent = categoria;
                categoriaContainer.appendChild(categoriaTitle);

                categoriaTitle.addEventListener('click', () => {
                    const subcategoriaContainers = categoriaContainer.querySelectorAll('.subcategoria-container');
                    subcategoriaContainers.forEach(subcategoriaContainer => {
                        subcategoriaContainer.style.display = subcategoriaContainer.style.display === 'none' ? 'block' : 'none';
                    });
                });

                Object.keys(subcategorias).forEach(subcategoria => {
                    const cursos = subcategorias[subcategoria];

                    const subcategoriaContainer = document.createElement('div');
                    subcategoriaContainer.className = 'subcategoria-container';

                    const subcategoriaTitle = document.createElement('h3');
                    subcategoriaTitle.textContent = subcategoria;
                    subcategoriaContainer.appendChild(subcategoriaTitle);

                    subcategoriaTitle.addEventListener('click', () => {
                        const cursoRows = subcategoriaContainer.querySelectorAll('.curso-row');
                        cursoRows.forEach(cursoRow => {
                            cursoRow.style.display = cursoRow.style.display === 'none' ? 'block' : 'none';
                        });
                    });

                    Object.keys(cursos).forEach(key => {
                        const curso = cursos[key];

                        const row = document.createElement('div');
                        row.className = 'curso-row';
                        row.style.display = 'none';

                        const button = document.createElement('a');
                        if (categoria === 'Pós Graduação') {
                            button.href = 'https://wa.me/1234567890';
                        } else if (categoria === 'Tecnologia') {
                            button.href = 'https://example.com';
                        } else {
                            button.href = '#';
                        }
                        button.textContent = 'Mais';
                        button.className = 'curso-button';

                        const title = document.createElement('span');
                        title.textContent = curso.Curso;
                        title.className = 'curso-titulo';

                        const cargaHoraria = document.createElement('span');
                        cargaHoraria.textContent = curso.Duração;
                        cargaHoraria.className = 'curso-carga-horaria';

                        row.appendChild(title);
                        row.appendChild(cargaHoraria);
                        row.appendChild(button);

                        subcategoriaContainer.appendChild(row);
                    });

                    categoriaContainer.appendChild(subcategoriaContainer);
                });

                container.appendChild(categoriaContainer);
            });
        }
    }
});