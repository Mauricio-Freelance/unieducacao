const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

burger.addEventListener('click', () =>
{
    burger.classList.toggle('active'); 
    navLinks.classList.toggle('active'); 
});

document.getElementById('contactForm').addEventListener('submit', function(event)
{
    event.preventDefault();

    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const whatsappNumber = '5519991428363'; 
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=Nome:%20${encodeURIComponent(name)}%0AEmail:%20${encodeURIComponent(email)}%0AMensagem:%20${encodeURIComponent(message)}`;

    window.location.href = whatsappURL;
});

document.querySelector('.categorias').removeEventListener('wheel', (evt) =>
{
    evt.preventDefault();
    document.querySelector('.categorias').scrollLeft += evt.deltaY;
});

let isDown = false;
let startX;
let scrollLeft;

const slider = document.querySelector('.categorias');

slider.addEventListener('mousedown', (e) =>
{
    isDown = true;
    slider.classList.add('active');
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});

slider.addEventListener('mouseleave', () =>
{
    isDown = false;
    slider.classList.remove('active');
});

slider.addEventListener('mouseup', () =>
{
    isDown = false;
    slider.classList.remove('active');
});

slider.addEventListener('mousemove', (e) =>
{
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 3; //scroll-fast
    slider.scrollLeft = scrollLeft - walk;
});

// Add touch event listeners for mobile devices
slider.addEventListener('touchstart', (e) =>
{
    isDown = true;
    startX = e.touches[0].pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
});

slider.addEventListener('touchend', () =>
{
    isDown = false;
});

slider.addEventListener('touchmove', (e) =>
{
    if (!isDown) return;
    const x = e.touches[0].pageX - slider.offsetLeft;
    const walk = (x - startX) * 3; //scroll-fast
    slider.scrollLeft = scrollLeft - walk;
});
document.addEventListener('DOMContentLoaded', () =>
{
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link =>
    {
        link.addEventListener('click', function()
        {
            navLinks.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
});
