document.addEventListener('DOMContentLoaded', async () => {

    // Base functions to use

    function capitalizeWords(str) {
        return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }
    
    const getImage = (category, subCategory, subsubcategory='', courseName) => {
        let path = './assets/grade-curso'
        const defaultPath = `${path}/default.png`
    
        if (subsubcategory) {
            path = `${path}/${category}/${subCategory}/${subsubcategory}/${courseName}.png`
        } else {
            path = `${path}/${category}/${subCategory}/${courseName}.png`
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

    async function getDatabase() {
        try {
            const response = await fetch('../../database.json');
            if (!response.ok) {
                throw new Error(`Erro ao carregar o JSON: ${response.status}`);
            }
            const jsonData = await response.json();
            console.log('JSON carregado:', jsonData); // Verifique os dados aqui
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


    // Create Categories

    // No evento DOMContentLoaded:
    const data = await getDatabase();

    const categoriesContainer = window.document.getElementById("categories")

    Object.keys(data).forEach(async (category) => {
        const categoryTitle = document.createElement('h2')
        categoryTitle.textContent = capitalizeWords(category)
        categoriesContainer.appendChild(categoryTitle)

        // const subcategoriesContainer = document.createElement('div')
        // subcategoriesContainer.classList.add('subcategories')
        // categoriesContainer.appendChild(subcategoriesContainer)

        const subcategories = data[category]
    })
    
});