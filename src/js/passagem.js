document.addEventListener('DOMContentLoaded', () => {
    function setupScrolling(containerId, leftButtonClass, rightButtonClass) {
        const container = document.getElementById(containerId);
        let scrollAmount = container.offsetWidth;

        function scrollLeft() {
            container.scrollBy({
                top: 0,
                left: -scrollAmount,
                behavior: 'smooth',
            });
        }

        function scrollRight() {
            container.scrollBy({
                top: 0,
                left: scrollAmount,
                behavior: 'smooth',
            });
        }

        // Atualizar o scrollAmount ao redimensionar a janela
        window.addEventListener('resize', () => {
            scrollAmount = container.offsetWidth;
        });

        // Atribuir os manipuladores de clique
        document.querySelector(leftButtonClass).addEventListener('click', scrollLeft);
        document.querySelector(rightButtonClass).addEventListener('click', scrollRight);
    }

    // Configurar os dois contêineres
    setupScrolling('top-10-container', '.nav-button.left', '.nav-button.right');
    setupScrolling('modalidades-container', '.nav-buton.left', '.nav-buton.right');
});
