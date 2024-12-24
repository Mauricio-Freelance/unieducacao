const fs = require('fs');

const getImage = (category, subcategoria, subsubcategory='', courseName) => {
    let path = './assets/grade-curso'
    const defaultPath = `${path}/default.png`

    if (subsubcategory) {
        path = `${path}/${category}/${subcategoria}/${subsubcategory}/${courseName}.png`
    } else {
        path = `${path}/${category}/${subcategoria}/${courseName}.png`
    }

    if (fs.existsSync(path)) {
        return path;
    } else {
        return defaultPath;
    }

}


console.log(getImage('Qualificação por Competência', 'Ead', '', 'Segurança do Trabalho'));