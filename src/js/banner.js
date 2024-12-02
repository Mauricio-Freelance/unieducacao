document.addEventListener('DOMContentLoaded', function()
{
    let currentIndex = 0;
    const images = document.querySelectorAll('.banner img');
    const totalImages = images.length;

    if (totalImages === 0)
    {
        console.error('Nenhuma imagem encontrada dentro do elemento .banner');
        return;
    }

    function showNextImage()
    {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % totalImages;
        images[currentIndex].classList.add('active');
    }

    const banner = document.querySelector('.banner');
    if (!banner) {
        console.error('Elemento .banner não encontrado');
        return;
    }

    banner.addEventListener('click', showNextImage);
});