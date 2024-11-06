let currentIndex = 0;
        const images = document.querySelectorAll('.banner img');
        const totalImages = images.length;

        function showNextImage() {
            images[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % totalImages;
            images[currentIndex].classList.add('active');
        }

        setInterval(showNextImage, 3000);

// Rolagem categorias de cursos;

 // Remove the automatic scroll on wheel event
 document.querySelector('.categorias').removeEventListener('wheel', (evt) => {
    evt.preventDefault();
    document.querySelector('.categorias').scrollLeft += evt.deltaY;
});

let isDown = false;
let startX;
let scrollLeft;

const slider = document.querySelector('.categorias');

slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', () => {
    isDown = false;
    slider.classList.remove('active');
});

slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('active');
});

slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 3; //scroll-fast
    slider.scrollLeft = scrollLeft - walk;
});

// Add touch event listeners for mobile devices
slider.addEventListener('touchstart', (e) => {
    isDown = true;
    startX = e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});

slider.addEventListener('touchend', () => {
    isDown = false;
});

slider.addEventListener('touchmove', (e) => {
    if (!isDown) return;
    const x = e.touches[0].pageX - slider.offsetLeft;
    const walk = (x - startX) * 3; //scroll-fast
    slider.scrollLeft = scrollLeft - walk;
});
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

let Index = 0;
const carrosselItems = document.querySelectorAll('.carrossel-item');
const totalItems = carrosselItems.length;

function showNextItem() {
    carrosselItems[Index].classList.remove('active');
    Index = (Index + 1) % totalItems;
    carrosselItems[Index].classList.add('active');
}

setInterval(showNextItem, 3000);

document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');

    burger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
});




// document.addEventListener('DOMContentLoaded', () => {
//     // Horizontal scroll for Top 10 section
//     const top10Slider = document.querySelector('.Top_10');
//     let isDownTop10 = false;
//     let startXTop10;
//     let scrollLeftTop10;

//     top10Slider.addEventListener('mousedown', (e) => {
//         isDownTop10 = true;
//         top10Slider.classList.add('active');
//         startXTop10 = e.pageX - top10Slider.offsetLeft;
//         scrollLeftTop10 = top10Slider.scrollLeft;
//     });

//     top10Slider.addEventListener('mouseleave', () => {
//         isDownTop10 = false;
//         top10Slider.classList.remove('active');
//     });

//     top10Slider.addEventListener('mouseup', () => {
//         isDownTop10 = false;
//         top10Slider.classList.remove('active');
//     });

//     top10Slider.addEventListener('mousemove', (e) => {
//         if (!isDownTop10) return;
//         e.preventDefault();
//         const x = e.pageX - top10Slider.offsetLeft;
//         const walk = (x - startXTop10) * 3; //scroll-fast
//         top10Slider.scrollLeft = scrollLeftTop10 - walk;
//     });
// });

function scrollLeft() {
    const container = document.getElementById('top-10-container');
    const scrollAmount = container.clientWidth; // Scroll by the width of the container
    container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
}

function scrollRight() {
    const container = document.getElementById('top-10-container');
    const scrollAmount = container.clientWidth; // Scroll by the width of the container
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
}