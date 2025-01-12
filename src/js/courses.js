document.addEventListener('DOMContentLoaded', async () => {

    // Base functions to use

    function capitalizeWords(str) {
        return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }
    
    function getImage(category, subCategory, subsubcategory = '', courseName) {
        const basePath = '../../assets/grade-curso';

        let targetPath = '';
    
        if (subsubcategory) {
            targetPath = `${basePath}/${category}/${subCategory}/${subsubcategory}/${courseName}.png`;
        } else {
            targetPath = `${basePath}/${capitalizeWords(category)}/${capitalizeWords(subCategory)}/${courseName}.png`;
            
        }

        return targetPath
        
    }

    async function getDatabase() {
        try {
            const response = await fetch('../../database.json');
            if (!response.ok) {
                throw new Error(`Erro ao carregar o JSON: ${response.status}`);
            }
            const jsonData = await response.json();
            return jsonData;
        } catch (error) {
            console.error('Erro ao carregar o JSON:', error);
            return null;
        }
    }

    
    function getSubSubCategories(data) {
    
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

    function clearAllActive() {
        const subCategoryDiv = document.getElementById("sub-categories")
        subCategoryDiv.innerHTML = "";
        const coursesDiv = document.getElementById("courses")
        coursesDiv.innerHTML = "";
    }

    function cleanCoursesActives() {
        const coursesDiv = document.getElementById("courses")
        coursesDiv.innerHTML = "";
    }

    function generateCard(course, categoryName, subCategoryName, subSubCategoryName = ''){
        /*
        Gera um cartão com as informações do curso

        - Args:
            - course: Objeto com as informações do curso
            - categoryName: Nome da categoria do curso
            - subCategoryName: Nome da sub categoria do curso
            - subSubCategoryName: Nome da subsub categoria do curso (Opcional)

        - Returns:
            - Elemento do cartão com as informações do curso
        */
        const card = document.createElement('div');
        card.className = 'course-card';

        

        const img = document.createElement('img');
        img.src = getImage(categoryName, subCategoryName, subSubCategoryName, course["Curso"]);
        img.alt = course["Curso"];
        img.className = 'course-image';
    
        // Define fallback para imagem padrão se a original falhar, carrega a default
        img.onerror = () => {
            img.src = '../../assets/grade-curso/default.png';
        };


        const button = document.createElement('a');
        button.href = 'https://api.whatsapp.com/send/?phone=5519991428363&text=type=phone_number&app_absent=0';
        button.textContent = 'Saiba Mais';
        button.className = 'course-button';

        const title = document.createElement('span');
        title.textContent = capitalizeWords(course["Curso"]);
        title.className = 'course-title';

        const duration = document.createElement('span');
        duration.textContent = capitalizeWords(course["Duração"]);
        duration.className = 'course-duration';

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(duration);
        card.appendChild(button);
        return card;
    }


    function generateSubCategory(subCategory, subCategoryDatabase, CategoryName){

        const subCategoryContainer = document.createElement("div");

        const subCategoryTitle = document.createElement("h3");

        subCategoryTitle.classList.add('subCategory');

        if (CategoryName !== "Pós Graduação"){


            subCategoryTitle.textContent = capitalizeWords(subCategory);
            

            subCategoryTitle.addEventListener("click", () => {
                if (subCategoryTitle.classList.contains("active")) {
                    subCategoryTitle.classList.remove("active");
                    cleanCoursesActives();
                } 
                else {
                    document.querySelectorAll('.subCategory').forEach(subCategory => subCategory.classList.remove('active'));

                    subCategoryTitle.classList.add('active');

                    cleanCoursesActives()

                    const coursesDiv = document.getElementById("courses");

                    Object.keys(subCategoryDatabase[subCategory]).forEach(course => {

                        const courseElement = generateCard(subCategoryDatabase[subCategory][course], CategoryName,subCategory, '');

                        coursesDiv.appendChild(courseElement);

                    });
                }
            })
            subCategoryContainer.appendChild(subCategoryTitle);
        }
        else
        {
            /*
            Direito:
                Direito Institucional:
                    - Curso 1
                        -   Curso
                        -   Duração
                    - Curso 2
            */
            subCategoryTitle.textContent = capitalizeWords(subCategory);// Direito

            const subSubCategoryContainer = document.createElement("div"); // Div para guardar as filhas de Direito
            subSubCategoryContainer.classList.add('subSubCategories'); // Classe da Div que ira guardar as subsub Categorias de Direito


            subCategoryContainer.appendChild(subCategoryTitle);
            subCategoryContainer.appendChild(subSubCategoryContainer)

            subCategoryTitle.addEventListener("click", () => { // Adiciona um evento de clique ao h3 para abrir ou esconder as subsubcategorias
                if (subCategoryTitle.classList.contains("active")) {
                    subCategoryTitle.classList.remove("active");
                    cleanCoursesActives();
                    //subSubCategoryContainer.style.display = "none"; // Inicialmente, as subsubcategorias ficam escondidas
                    subSubCategoryContainer.innerHTML = ""; // Limpa as subsubcategorias
                    document.querySelectorAll('.subSubCategory').forEach(subSubCategory => subSubCategory.classList.remove('active'));
                } 
                else {
                    document.querySelectorAll('.subCategory').forEach(subCategory => subCategory.classList.remove('active'));
                    document.querySelectorAll('.subSubCategory').forEach(subSubCategory => subSubCategory.classList.remove('active'));
                    document.querySelectorAll('.subSubCategories').forEach(subSubCategory => subSubCategory.innerHTML = "");
                    subCategoryTitle.classList.add('active');

                    cleanCoursesActives()

                    Object.keys(subCategoryDatabase).forEach(subSubCategory => { // Pega todas as chaves dentro da subcategoria direito
                        const subSubCategoryTitle = document.createElement("h4"); // Cria um elemento h4 para cada subsubcategoria
        
                        subSubCategoryTitle.textContent = capitalizeWords(subSubCategory); // Coloca o nome da subsubcategoria no h4
                        subSubCategoryTitle.classList.add('subSubCategory'); // Adiciona a classe subSubCategory ao h4
        
                        subSubCategoryContainer.appendChild(subSubCategoryTitle); // Adiciona o h4 à Div subSubCategoryContainer
                        //subSubCategoryContainer.style.display = "none"; // Inicialmente, as subsubcategorias ficam escondidas
        
                        subSubCategoryTitle.addEventListener("click", () => { // Adiciona um evento de clique ao h4
                            if (subSubCategoryTitle.classList.contains("active")) { // Se a subsubcategoria estiver ativa, ela é desativada
                                subSubCategoryTitle.classList.remove('active');
                                cleanCoursesActives();
                            }
                            else {
                                document.querySelectorAll('.subSubCategory').forEach(subSubCategory => subSubCategory.classList.remove('active')); // Desativa todas as subsubcategorias
                                subSubCategoryTitle.classList.add('active'); // Ativa a subsubcategoria clicada
        
                                cleanCoursesActives();
        
                                const coursesDiv = document.getElementById("courses"); // Pega a div que guarda os cursos
        
                                Object.keys(subCategoryDatabase[subSubCategory]).forEach(course => { // Para cada curso dentro da subsubcategoria
                                    const courseElement = generateCard(subCategoryDatabase[subSubCategory][course], CategoryName, subCategory, subSubCategory); // Gera um card com as informações do curso
                                    coursesDiv.appendChild(courseElement); // Adiciona o card à div que guarda os cursos
                                });
                            }
                        }) 
        
                    });
        

                }    
            });

                        

        }

        return subCategoryContainer;
    };

    function generateCategory(category, database) {
        /*
        Gera a categoria que fica no topo da pagina
        */
        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = capitalizeWords(category);
        categoryTitle.classList.add('category');
        categoryTitle.addEventListener('click', () => {
            if (categoryTitle.classList.contains('active')) { // Quando ativa e clicada, fica desativada
                categoryTitle.classList.remove('active');

                clearAllActive();
            } 
            else {
                document.querySelectorAll('.category').forEach(category => category.classList.remove('active')); // Quando clicada e estiver desativada, fica ativa e desativa as outras
                categoryTitle.classList.add('active');

                clearAllActive();

        
                const categoryName = categoryTitle.innerText
                const subCategoriesData = database[categoryName];

                const subCategoryDiv = document.getElementById("sub-categories")

                let count = 0;
                if (categoryName !== "Pós Graduação"){
                    Object.keys(subCategoriesData).forEach(subCategory => {
                        count += 1;
                        const subCategoryElement = generateSubCategory(subCategory, database[categoryName], categoryName);
                        if (count === 1){
                            subCategoryElement.firstChild.classList.remove('active');
                            subCategoryElement.firstChild.click();
                        }
                        subCategoryDiv.appendChild(subCategoryElement);
                    });
                }
                else{
                    const subData = getSubSubCategories(database[categoryName]);
                    Object.keys(subData).forEach(fakeCategory => {
                        const subCategoryElement = generateSubCategory(fakeCategory, subData[fakeCategory], categoryName);
                        subCategoryDiv.appendChild(subCategoryElement);
                    });
                    
                }
            }
        });
        return categoryTitle;
    }


    /////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // Create Categories

    // No evento DOMContentLoaded:
    const data = await getDatabase();

    const categoriesContainer = window.document.getElementById("categories")

    let count = 0;
    Object.keys(data).forEach(category => {
        count += 1;
        const categoryElement = generateCategory(category, data);
        if (count === 1){
            categoryElement.classList.remove('active');
            categoryElement.click();
        }
        categoriesContainer.appendChild(categoryElement);
    });


    
});