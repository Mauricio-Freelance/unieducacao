document.addEventListener('DOMContentLoaded', function() {
    fetch('../../database.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o JSON');
            }
            return response.json();
        })
        .then(data => {
            const container = document.getElementById('curso-lista');

            // Iterar sobre as categorias principais (Pós Graduação)
            Object.keys(data).forEach(categoria => {
                const subcategorias = data[categoria];

                // Criar um contêiner para a categoria
                const categoriaContainer = document.createElement('div');
                categoriaContainer.className = 'categoria-container';

                const categoriaTitle = document.createElement('h2');
                categoriaTitle.textContent = categoria;
                categoriaContainer.appendChild(categoriaTitle);

                // Adicionar evento de clique para mostrar/ocultar subcategorias
                categoriaTitle.addEventListener('click', () => {
                    const subcategoriaContainers = categoriaContainer.querySelectorAll('.subcategoria-container');
                    subcategoriaContainers.forEach(subcategoriaContainer => {
                        subcategoriaContainer.style.display = subcategoriaContainer.style.display === 'none' ? 'block' : 'none';
                    });
                });

                // Iterar sobre as subcategorias (Comunicação, Direito, etc.)
                Object.keys(subcategorias).forEach(subcategoria => {
                    const cursos = subcategorias[subcategoria];

                    // Criar um contêiner para a subcategoria
                    const subcategoriaContainer = document.createElement('div');
                    subcategoriaContainer.className = 'subcategoria-container';

                    const subcategoriaTitle = document.createElement('h3');
                    subcategoriaTitle.textContent = subcategoria;
                    subcategoriaContainer.appendChild(subcategoriaTitle);

                    // Iterar sobre os cursos
                    Object.keys(cursos).forEach(key => {
                        const curso = cursos[key];

                        const row = document.createElement('div');
                        row.className = 'curso-row';

                        const button = document.createElement('a');
                        button.href = '#'; // Adicione o link correto aqui se disponível
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
        })
        .catch(error => console.error('Erro ao carregar o JSON:', error));
});