// toggle.js

const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const menuLinks = document.querySelectorAll('.nav ul li a');

if (menuToggle && nav) {
    // Toggle menú en pantallas pequeñas
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}

if (menuLinks.length > 0) {
    // Cambiar la clase active cuando se hace clic en un enlace
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuLinks.forEach(link => link.classList.remove('active')); // limpia
            link.classList.add('active'); // asigna al actual

            // Si quieres que el menú se cierre en móvil al hacer clic
            if (window.innerWidth <= 768) {
                nav.classList.remove('active');
            }
        });
    });
}
