document.addEventListener('DOMContentLoaded', () =>
{
    const top10Container = document.getElementById('top-10-container');
    let scrollAmount = top10Container.offsetWidth;

    function scrollLeft()
    {
        top10Container.scrollBy
        ({
            top: 0,
            left: -scrollAmount,
            behavior: 'smooth'
        });
    }

    function scrollRight()
    {
        top10Container.scrollBy
        ({
            top: 0,
            left: scrollAmount,
            behavior: 'smooth'
        });
    }

    // Atualizar o scrollAmount ao redimensionar a janela
    window.addEventListener('resize', () =>
    {
        scrollAmount = top10Container.offsetWidth;
    });

    // Atribuir os manipuladores de clique
    document.querySelector('.nav-button.left').addEventListener('click', scrollLeft);
    document.querySelector('.nav-button.right').addEventListener('click', scrollRight);
});
