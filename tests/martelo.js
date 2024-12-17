
const categoria = document.querySelector('.categoria');
const subcategoria = document.querySelector('.subcategoria');

const gestao = document.querySelector('.gestao');
const marketing = document.querySelector('.marketing');

// quando subcategoria é clicada as divs gestao e marketing são ativadas, trocando sua opacidade de 0 para 1 e seu display de none para flex.
subcategoria.addEventListener('click', () => {
    gestao.classList.toggle('active');
});
categoria.addEventListener('click', () => {
    subcategoria.classList.toggle('active');
    gestao.classList.remove('active');
    marketing.classList.toggle('active');
});


const json = {
    "Direito": {
        "Direito Penal": {
            "0": {
                "Curso": "Direito penal para políticos",
                "Duração": "2 a 4 anos"
            },
            "1": {
                "Curso": "Direito penal para advogados",
                "Duração": "2 a 4 anos"
            }
        }
    }
};

// Acessando os cursos dentro do objeto
const cursos = json["Pós Graduação"]["Direito - Direito Penal"];

// Usando Object.keys para iterar sobre os cursos
// Object.keys(cursos).forEach(function(key) {
//     console.log(cursos[key].Curso); // Exibe o nome do curso
// });


Object.keys(json).forEach(function(key) {
    const sub = json[key] 

    Object.keys(sub).forEach(function(keyItem){
        const item = sub[keyItem];

        Object.keys(item).forEach(function(keyID){
            const row = item[keyID];
            console.log(row["Curso"]); // Exibe o nome do curso
            console.log(row["Duração"]); // Exibe a duração do curso
        })

        
    });

    // console.log(json[key].Curso); // Exibe o nome do curso
});