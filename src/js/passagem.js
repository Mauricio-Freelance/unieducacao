const top10Container = document.getElementById('top-10-container');
const scrollAmount = top10Container.offsetWidth;
console.log("Scroll Amount:", scrollAmount); // Verificar o valor inicial de scrollAmount

function scrollLeft() {
    console.log("Scroll Left clicked"); // Verificação do clique no botão esquerdo
    top10Container.scrollBy({
        top: 0,
        left: -scrollAmount,
        behavior: 'smooth'
    });
}

function scrollRight() {
    console.log("Scroll Right clicked"); // Verificação do clique no botão direito
    top10Container.scrollBy({
        top: 0,
        left: scrollAmount,
        behavior: 'smooth'
    });
}

window.addEventListener('resize', () => {
    scrollAmount = top10Container.offsetWidth; // Recalcular scrollAmount em caso de redimensionamento
});
