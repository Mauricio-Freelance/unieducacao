function capitalizeWords(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}


function getSubSubCategories(data, key = "Pós Graduação") {
    const posGraduacao = data[key];

    const subCategory = [];
    const subSubCategory = [];

    for (const course in posGraduacao) {
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

    for (const course in posGraduacao) {
        const [mainCategory, subCategoryPart] = course.split(" - ");
        subCategoryJson[mainCategory][subCategoryPart] = posGraduacao[course];
    }

    return subCategoryJson;

}


document.addEventListener('DOMContentLoaded', function ()
{
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

    // Função para renderizar as categorias e os cursos
    function renderCategorias(data)
    {
        const container = document.getElementById('curso-lista');
        container.innerHTML = ''; // Limpa o conteúdo anterior

        const mainContainer = document.createElement('div');
        mainContainer.className = 'main-container';
        container.appendChild(mainContainer);

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

                console.log("Linha 163: ", type)

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
            mainContainer.appendChild(categoriaContainer);
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

    // Função para renderizar as subcategorias e cursos
    function renderSubcategorias(container, subcategorias, subCategoryType = "subcategory")
    {
        container.innerHTML = ''; // Limpa subcategorias anteriores
        console.log("Linha 198: ", subCategoryType)

        Object.keys(subcategorias).forEach(subcategoria =>
        {
            const cursos = subcategorias[subcategoria];
            //console.log(subcategoria)
            if (subCategoryType != "subcategory") {
                console.log("Entrei na 198")
                console.log(subcategorias)
                console.log(subcategoria)
                const subSubData = getSubSubCategories(subcategorias, subcategoria)

                console.log("Linha 201: \n", subSubData)

                Object.keys(subSubData).forEach(function(key) {
                    const sub = subSubData[key]  // Direito
                    console.log("Linha 205: \n", key)
                    console.log("Linha 206: \n", sub)
                    
                    const subCategoryDiv = document.createElement('div');
                    subCategoryDiv.id = 'subCategoryDiv';
                    document.body.appendChild(subCategoryDiv); // Adiciona a div ao DOM para que possa ser acessada

                    const subCategoryContainer = document.getElementById('subCategoryDiv'); // Agora pode acessar pelo ID
                    const subCategorySpan = document.createElement('span');
                    
                    subCategorySpan.textContent = capitalizeWords(key);

                    subCategoryContainer.appendChild(subCategorySpan); // Adiciona o span dentro da div
                    
                   
                    Object.keys(sub).forEach(function(keyItem){
                        const item = sub[keyItem]; // Direito Penal
                        
                        console.log("Linha 223: \n", item)
                        console.log("Linha 224",keyItem); // Exibe o nome do curso
                        
                        const subSubCategoryDiv = document.createElement('div');
                        subSubCategoryDiv.id = 'subSubCategoryDiv';
                        document.body.appendChild(subSubCategoryDiv); // Adiciona a div ao DOM para que possa ser acessada

                        const subSubCategoryContainer = document.getElementById('subSubCategoryDiv'); // Agora pode acessar pelo ID
                        const subSubCategorySpan = document.createElement('span');
                        
                        // não sei se vai dar certo
                        subSubCategorySpan.textContent = capitalizeWords(keyItem); // Tabnine que recomendou

                        subSubCategoryContainer.appendChild(subSubCategorySpan); // Adiciona o span dentro da div


                        Object.keys(item).forEach(function(keyID){
                            const row = item[keyID]; // ID "0"
                            console.log(row["Curso"]); // Exibe o nome do curso
                            console.log(row["Duração"]); // Exibe a duração do curso
                        })
                  
                    });
                });
    
                // Container das sub-subcategorias
                const subSubCategoriaContainer = document.createElement('div');
                subSubCategoriaContainer.className = 'subsubcategoria-container';
                subSubCategoriaContainer.style.display = 'none'; // Inicialmente oculto
                container.appendChild(subSubCategoriaContainer);
    
                // Adiciona eventos para mostrar/ocultar as sub-subcategorias
                subcategoriaTitle.addEventListener('click', () =>
                {
                    if (subSubCategoriaContainer.style.display === 'none')
                    {
                        subSubCategoriaContainer.style.display = 'block';
                    }
                    else
                    {
                        subSubCategoriaContainer.style.display = 'none';
                    }
                });
    
                // Renderiza as sub-subcategorias
                Object.keys(cursos).forEach(subSubCategoria =>
                {
                    const subSubCursos = cursos[subSubCategoria];
    
                    // Título da sub-subcategoria
                    const subSubTitle = document.createElement('h4');
                    subSubTitle.textContent = capitalizeWords(subSubCategoria);
                    subSubTitle.className = 'subsubcategoria-titulo';
                    subSubCategoriaContainer.appendChild(subSubTitle);
    
                    // Container dos cursos da sub-subcategoria
                    const subSubCursosContainer = document.createElement('div');
                    subSubCursosContainer.className = 'subsub-cursos-container';
                    subSubCursosContainer.style.display = 'none'; // Inicialmente oculto
                    subSubCategoriaContainer.appendChild(subSubCursosContainer);
    
                    // Adiciona evento para expandir os cursos da sub-subcategoria
                    subSubTitle.addEventListener('click', () =>
                    {
                        if (subSubCursosContainer.style.display === 'none')
                        {
                            subSubCursosContainer.style.display = 'grid';
                        }
                        else
                        {
                            subSubCursosContainer.style.display = 'none';
                        }
                    });
    
                    // Adiciona os cursos dentro de cada sub-subcategoria
                    Object.keys(subSubCursos).forEach(key =>
                    {
                        const curso = subSubCursos[key];
    
                        const card = document.createElement('div');
                        card.className = 'curso-card';
    
                        const button = document.createElement('a');
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
                        subSubCursosContainer.appendChild(card);
                    });
                });
            }
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

            if (subcategoria.toLowerCase() === 'ead')
            {
                cursosContainer.style.display = 'grid'; // Mostra em grid
            }

            else
            {
                cursosContainer.style.display = 'none';
                subcategoriaTitle.addEventListener('click', () =>
                {
                    hideAllSubcategorias(); // Oculta todas as subcategorias

                    // Remove a classe 'active' das subcategorias anteriores
                    document.querySelectorAll('.subcategoria-titulo').forEach(title =>
                    {
                        title.classList.remove('active');
                    });

                    // Adiciona a classe 'active' ao título de subcategoria clicado
                    subcategoriaTitle.classList.add('active');

                    cursosContainer.style.display = 'grid'; // Mostra a subcategoria clicada
                });
            }

            // Adiciona os cartões de curso
            Object.keys(cursos).forEach(key =>
            {
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
    function renderCursosFiltrados(data)
    {
        const container = document.getElementById('curso-lista');
        container.innerHTML = ''; // Limpa o conteúdo anterior

        const mainContainer = document.createElement('div');
        mainContainer.className = 'main-container';
        container.appendChild(mainContainer);

        const cursosContainer = document.createElement('div');
        cursosContainer.className = 'cursos-container';
        mainContainer.appendChild(cursosContainer);

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