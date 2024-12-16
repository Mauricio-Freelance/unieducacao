const fs = require('fs').promises;

async function readJsonFile(filePath) {
    try {
        // Lê o arquivo JSON local
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data); // Converte o conteúdo do arquivo para um objeto JSON
    } catch (err) {
        console.error(`Erro ao ler o arquivo: ${err.message}`);
        throw err;
    }
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

// Leitura do JSON e execução da lógica
(async () => {
    try {
        const jsonExample = await readJsonFile('../database.json'); // Ajuste o caminho se necessário
        const result = getSubSubCategories(jsonExample);
        console.log(result);
    } catch (err) {
        console.error('Erro:', err.message);
    }
})();
