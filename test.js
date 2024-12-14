const jsonExample = {
    "Pós Graduação": {
        "Direito - Direito Penal": {
            "0": {
                "Curso": "Direito penal para políticos",
                "Duração": "2 a 4 anos"
            },
            "1": {
                "Curso": "Direito penal para advogados",
                "Duração": "2 a 4 anos"
            }
        },
        "Direito - Direito Civil": {
            "0": {
                "Curso": "Direito civil para políticos",
                "Duração": "2 a 4 anos"
            },
            "1": {
                "Curso": "Direito civil para advogados",
                "Duração": "2 a 4 anos"
            }
        },
        "Engenharia - Engenharia Civil": {
            "0": {
                "Curso": "Engenharia civil para políticos",
                "Duração": "2 a 4 anos"
            },
            "1": {
                "Curso": "Engenharia civil para engenheiros",
                "Duração": "2 a 4 anos"
            }
        },
        "Engenharia - Engenharia Elétrica": {
            "0": {
                "Curso": "Engenharia elétrica para políticos",
                "Duração": "2 a 4 anos"
            },
            "1": {
                "Curso": "Engenharia elétrica para engenheiros",
                "Duração": "2 a 4 anos"
            }
        }
    }
};

function getSubSubCategories(data, key = "Pós Graduação") {

    const posGraduacao = jsonExample["Pós Graduação"];

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

console.log(getSubSubCategories(jsonExample));