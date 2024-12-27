function capitalizeWords(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

const getImage = (category, subcategoria, subsubcategory='', courseName) => {
    let path = '../../assets/grade-curso'
    const defaultPath = `${path}/default.png`

    if (subsubcategory) {
        path = `${path}/${category}/${subcategoria}/${subsubcategory}/${courseName}.png`
    } else {
        path = `${path}/${category}/${subcategoria}/${courseName}.png`
    }

    return fetch(path, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                return path;
            } else {
                return defaultPath;
            }
        })
        .catch(() => defaultPath);
}

function getSubSubCategories(data) {
    /*
    Busca as subsubcategory de uma sub categoria e refeita a estrutura para o formato categoria e subcategoria, onde a subsubcategory vira a sub categoria e a subcategoria vira a categoria
    */

    const subCategory = [];
    const subSubCategory = [];

    for (const course in data) {
        const [mainCategory, subCategoryPart] = course.split(" - ");
        subCategory.push(mainCategory);
        subSubCategory.push(subCategoryPart);
    }

    const aux = [];
    const subCategoryJson = {};

    for (const category of subCategory) {
        if (!aux.includes(category)) {
            aux.push(category);
            subCategoryJson[category] = {};
        }
    }

    for (const course in data) {
        const [mainCategory, subCategoryPart] = course.split(" - ");
        subCategoryJson[mainCategory][subCategoryPart] = data[course];
    }

    return subCategoryJson;
}

// Função de filtro dos cursos com base no nome do curso
function filterCursos(data, query)
{
    const filteredData = {};

    Object.keys(data).forEach(categoria =>
    {
        const subcategorias = data[categoria];
        const filteredSubcategorias = {};

        Object.keys(subcategorias).forEach(subcategoria =>
        {
            const cursos = subcategorias[subcategoria];
            const filteredCursos = {};

            Object.keys(cursos).forEach(key =>
            {
                const curso = cursos[key];

                if (curso.Curso.toLowerCase().includes(query))
                {
                    filteredCursos[key] = curso;
                }
            });

            if (Object.keys(filteredCursos).length > 0)
            {
                filteredSubcategorias[subcategoria] = filteredCursos;
            }
        });

        if (Object.keys(filteredSubcategorias).length > 0)
        {
            filteredData[categoria] = filteredSubcategorias;
        }
    });

    return filteredData;
}

/////////////////////////////////////////////////////////////////////////// MAIN A BAIXO


document.addEventListener('DOMContentLoaded', function () {
    let cursosData = {};

    fetch('../../database.json')
        .then(response =>
        {
            if (!response.ok) {
                throw new Error('Erro ao carregar o JSON');
            }
            return response.json();
        })
        .then(data =>
        {
            cursosData = data;
            renderCategorias(cursosData);
            // Seleciona a categoria "Profissionalizante" automaticamente
            const profissionalizanteTitle = Array.from(document.querySelectorAll('.categoria-titulo')).find(title => title.textContent.toLowerCase() === 'profissionalizante');
            if (profissionalizanteTitle)
            {
                profissionalizanteTitle.click();
            }
        })
        .catch(error => console.error('Erro ao carregar o JSON:', error));

    // Adicionando evento para a barra de pesquisa
    const searchBar = document.getElementById('search-bar');

    searchBar.addEventListener('input', function ()
    {
        const query = searchBar.value.toLowerCase();
        if (query === '')
        {
            renderCategorias(cursosData);
        }

        else
        {
            const filteredData = filterCursos(cursosData, query);
            renderCursosFiltrados(filteredData);
        }
    });

    // Função para renderizar as categorias e os cursos
    function renderCategorias(data)
    {
        // DIV a Baixo do menu de busca (), onde ela contem toda a parte dinâmica do JS
        const container = document.getElementById('curso-lista');
        //container.style.background = "black";

        container.innerHTML = ''; // Limpa o conteúdo anterior

        // Categorias Container
        const categoriesContainer = document.createElement('div');
        //categoriesContainer.style.background = 'black';
        categoriesContainer.className = 'categories-container';
        container.appendChild(categoriesContainer);

        const subcategoriaContainer = document.createElement('div');
        subcategoriaContainer.className = 'subcategoria-container';
        subcategoriaContainer.style.display = 'none'; // Inicialmente oculto
        container.appendChild(subcategoriaContainer);

        Object.keys(data).forEach(categoria =>
        {
            const subcategorias = data[categoria];
            //console.log("Linha 138: ",categoria)
            const categoriaContainer = document.createElement('div');
            categoriaContainer.className = 'categoria-container';

            const categoriaTitle = document.createElement('h2');
            categoriaTitle.textContent = capitalizeWords(categoria);
            categoriaTitle.className = 'categoria-titulo';
            categoriaContainer.appendChild(categoriaTitle);

            categoriaTitle.addEventListener('click', () =>
            {

                // Remove a classe 'active' das subcategorias anteriores
                document.querySelectorAll('.categoria-titulo').forEach(title =>
                {
                    title.classList.remove('active');
                });

                // Adiciona a classe 'active' ao título de categoria clicado
                categoriaTitle.classList.add('active');
                //console.log("158: ", subcategorias)
                // Verificiar se a categoria a ser rendenizada será pós graduação ou outra

                const type = categoriaTitle.textContent === capitalizeWords("Pós Graduação") ? "subsubcategory" : "subcategory";

                //console.log("Linha 163: ", type)

                renderSubcategorias(subcategoriaContainer, subcategorias, type);

                // Exibe ou oculta o container de subcategorias

                if (subcategoriaContainer.style.display === 'none' || subcategoriaContainer.dataset.categoria !== categoria)
                {
                    subcategoriaContainer.style.display = 'block';
                    subcategoriaContainer.dataset.categoria = categoria;
                }

                else
                {
                    subcategoriaContainer.style.display = 'none';
                    subcategoriaContainer.dataset.categoria = '';
                }
            });
            categoriesContainer.appendChild(categoriaContainer);
        });
    }

    function renderSubcategorias(container, subcategorias, subCategoryType = "subcategory") {
        container.innerHTML = '';
        
        let count = 0;
        Object.keys(subcategorias).forEach(subcategoria => {
            const cursos = subcategorias[subcategoria];
            count +=  1;
    
            if (subCategoryType !== "subcategory") {
                const subSubData = getSubSubCategories(subcategorias);
    
                Object.keys(subSubData).forEach(mainCategory => {
                    const sub = subSubData[mainCategory];
                    const subCategoryDiv = document.createElement('div');
                    subCategoryDiv.className = 'subCategoryDiv';
    
                    const subCategoryTitle = document.createElement('h2');
                    subCategoryTitle.textContent = capitalizeWords(mainCategory);
                    subCategoryTitle.className = 'subCategoryTitle';
                    subCategoryDiv.appendChild(subCategoryTitle);
    
                    subCategoryTitle.addEventListener('click', () => {
                        // Fecha todas as subSubContainers antes de exibir o novo
                        document.querySelectorAll('.subSubContainer').forEach(container => {
                            container.style.display = 'none';
                        });
    
                        document.querySelectorAll('.subCategoryTitle').forEach(title => {
                            title.classList.remove('active');
                        });
    
                        subCategoryTitle.classList.toggle('active');
    
                        const subSubContainer = document.createElement('div');
                        subSubContainer.className = 'subSubContainer';
                        subCategoryDiv.appendChild(subSubContainer);
    
                        Object.keys(sub).forEach(subSubCategory => {
                            const subSubCategoryDiv = document.createElement('div');
                            subSubCategoryDiv.className = 'subSubCategoryDiv';
    
                            const subSubCategoryTitle = document.createElement('h6');
                            subSubCategoryTitle.textContent = capitalizeWords(subSubCategory);
                            subSubCategoryTitle.className = 'subSubCategoryTitle';
                            subSubCategoryDiv.appendChild(subSubCategoryTitle);
    
                            const cursosContainer = document.createElement('div');
                            cursosContainer.className = 'cursos-container';
                            cursosContainer.style.display = 'none';
                            subSubCategoryDiv.appendChild(cursosContainer);
    
                            const subSubCursos = sub[subSubCategory];
                            Object.keys(subSubCursos).forEach(key => {
                                const curso = subSubCursos[key];
    
                                const card = document.createElement('div');
                                card.className = 'curso-card';
    
                                const img = document.createElement('img');
                                img.src = "../../assets/grade-curso/default.png"
                                //img.src = `path/to/images/${curso.Curso}.jpg`;
                                //path = getImage(mainCategory, subcategoria, subSubCategory, curso.Curso);
                                //console.log(path);
                                img.src = path
                                img.alt = curso.Curso;
                                img.className = 'curso-imagem';
    
                                const button = document.createElement('a');
                                button.href = 'https://api.whatsapp.com/send/?phone=5519991428363&text=type=phone_number&app_absent=0';
                                button.textContent = 'Saiba Mais';
                                button.className = 'curso-button';
    
                                const title = document.createElement('span');
                                title.textContent = capitalizeWords(curso.Curso);
                                title.className = 'curso-titulo';
    
                                const cargaHoraria = document.createElement('span');
                                cargaHoraria.textContent = capitalizeWords(curso.Duração);
                                cargaHoraria.className = 'curso-carga-horaria';
    
                                card.appendChild(img);
                                card.appendChild(title);
                                card.appendChild(cargaHoraria);
                                card.appendChild(button);
                                cursosContainer.appendChild(card);
                            });
    
                            subSubCategoryTitle.addEventListener('click', () => {
                                // Alterna a visibilidade da sub-subcategoria clicada
                                console.log("Linha 302: Situação do display:", cursosContainer.style.display)
                                if (cursosContainer.style.display && cursosContainer.style.display === 'none'){
                                    cursosContainer.style.display = 'grid';
                                    cursosContainer.style.gridTemplateColumns == 'repeat(3, 1fr)';
                                }
                                else{
                                    cursosContainer.style.display = 'none';
                                }
                                subSubCategoryTitle.classList.toggle('active');

                                // cursosContainer.style.display =
                                //     cursosContainer.style.display === 'none' ? 'grid' : 'none';
                                // subSubCategoryTitle.classList.toggle('active');
                            });
    
                            subSubContainer.appendChild(subSubCategoryDiv);
                        });
    
                        if (subSubContainer.style.display === 'none' || subSubContainer.dataset.mainCategory !== mainCategory) {
                            document.querySelectorAll('.subSubContainer').forEach(container => {
                                container.style.display = 'none';
                            });
                            subSubContainer.style.display = 'block';
                            subSubContainer.dataset.mainCategory = mainCategory;
                        } else {
                            subSubContainer.style.display = 'none';
                            subSubContainer.dataset.mainCategory = '';
                        }
                    });
    
                    container.appendChild(subCategoryDiv);
                });
            } else {
                const subcategoriaTitle = document.createElement('h3');
                subcategoriaTitle.textContent = capitalizeWords(subcategoria);
                subcategoriaTitle.className = 'subcategoria-titulo';
                container.appendChild(subcategoriaTitle);
    
                const cursosContainer = document.createElement('div');
                cursosContainer.className = 'cursos-container';
                cursosContainer.dataset.subcategoria = subcategoria;
                console.log("Linha 343: Situação do display:", cursosContainer.style.display)
                if (subcategoria.toLowerCase() === 'ead' || count === 1) {
                    //cursosContainer.style.display = 'grid';
                    cursosContainer.style.display = 'grid';
                    cursosContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
                } else {
                    cursosContainer.style.display = 'none';
                    // subcategoriaTitle.addEventListener('click', () => {
                    //     // Alterna a visibilidade da subcategoria clicada
                    //     cursosContainer.style.display =
                    //         cursosContainer.style.display === 'none' ? 'grid' : 'none';
                    //     subcategoriaTitle.classList.toggle('active');
                    // });
                }
                subcategoriaTitle.addEventListener('click', () => {
                // Alterna a visibilidade da subcategoria clicada
                console.log("Linha 357: Situação do display:", cursosContainer.style.display)
                cursosContainer.style.display = cursosContainer.style.display === 'none' ? 'grid' : 'none';
                subcategoriaTitle.classList.toggle('active');
                });
    
                Object.keys(cursos).forEach(key => {
                    const curso = cursos[key];
    
                    const card = document.createElement('div');
                    card.className = 'curso-card';
    
                    const img = document.createElement('img');
                    img.src = "../../assets/grade-curso/default.png"
                    //img.src = `path/to/images/${curso.Curso}.jpg`; // Ajuste o caminho conforme necessário
                    // path = getImage(mainCategory, subcategoria, '', curso.Curso);
                    // console.log(path);
                    // img.src = path;
                    img.alt = curso.Curso;
                    img.className = 'curso-imagem';
    
                    const button = document.createElement('a');
                    button.href = 'https://api.whatsapp.com/send/?phone=5519991428363&text=type=phone_number&app_absent=0';
                    button.textContent = 'Saiba Mais';
                    button.className = 'curso-button';
    
                    const title = document.createElement('span');
                    title.textContent = capitalizeWords(curso.Curso);
                    title.className = 'curso-titulo';
    
                    const cargaHoraria = document.createElement('span');
                    cargaHoraria.textContent = capitalizeWords(curso.Duração);
                    cargaHoraria.className = 'curso-carga-horaria';
    
                    card.appendChild(img);
                    card.appendChild(title);
                    card.appendChild(cargaHoraria);
                    card.appendChild(button);
                    cursosContainer.appendChild(card);
                });
    
                container.appendChild(cursosContainer);
            }
        });
    }
     

    // Função para ocultar todas as subcategorias
    function hideAllSubcategorias()
    {
        document.querySelectorAll('.cursos-container').forEach(container =>
        {
            container.style.display = 'none';
        });
    }

    // Função para renderizar os cursos filtrados
    function renderCursosFiltrados(data)
    {
        const container = document.getElementById('curso-lista');
        container.innerHTML = ''; // Limpa o conteúdo anterior

        const categoriesContainer = document.createElement('div');
        categoriesContainer.className = 'categories-container';
        container.appendChild(categoriesContainer);

        const cursosContainer = document.createElement('div');
        cursosContainer.className = 'cursos-container';
        categoriesContainer.appendChild(cursosContainer);

        Object.keys(data).forEach(categoria =>
        {
            const subcategorias = data[categoria];

            Object.keys(subcategorias).forEach(subcategoria =>
            {
                const cursos = subcategorias[subcategoria];

                Object.keys(cursos).forEach(key =>
                {
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
