function initModals() {
    const globalModal = document.getElementById('global_modal');
    const cartModal = document.getElementById('cart-modal');
    const likeModal = document.getElementById('like-modal');

    const cartIcon = document.getElementById('cart-icon');
    const likeIcon = document.getElementById('like-icon');

    const cartCounter = cartIcon.querySelector('.contador');
    const likeCounter = likeIcon.querySelector('.contador');

    const closeButtons = document.querySelectorAll('.close');

    const cartItemsContainer = document.getElementById('cart-items');
    const favoriteItemsContainer = document.getElementById('favorite-items');

    // --- FUNCIONES DE MODALES ---
    function closeAllModals() {
        globalModal.style.display = 'none';
        cartModal.style.display = 'none';
        likeModal.style.display = 'none';
    }

    cartIcon.addEventListener('click', () => {
        globalModal.style.display = 'flex';
        cartModal.style.display = 'block';
    });

    likeIcon.addEventListener('click', () => {
        globalModal.style.display = 'flex';
        likeModal.style.display = 'block';
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    globalModal.addEventListener('click', event => {
        if (event.target === globalModal) {
            closeAllModals();
        }
    });

    // --- FAVORITOS DESDE LOCAL STORAGE ---
    function cargarFavoritosDesdeLocalStorage() {
        const favoritosGuardados = JSON.parse(localStorage.getItem('favoritos')) || [];
        
        // Limpia el contenedor por si acaso
        favoriteItemsContainer.innerHTML = '';

        favoritosGuardados.forEach(itemHTML => {
            const itemElement = document.createElement('div');
            itemElement.classList.add('favorite-item');
            itemElement.innerHTML = itemHTML;
            favoriteItemsContainer.appendChild(itemElement);
        });

        // Actualiza el contador al iniciar
        actualizarContadores();
    }

    function guardarFavoritosEnLocalStorage() {
        const favoritosHTML = Array.from(favoriteItemsContainer.querySelectorAll('.favorite-item')).map(item => item.innerHTML);
        localStorage.setItem('favoritos', JSON.stringify(favoritosHTML));

        // Actualiza el contador después de guardar
        actualizarContadores();
    }

    // --- FUNCIONES DE CONTADORES CON ANIMACIÓN ---
    function actualizarContadores() {
        // CARRITO
        const cartItems = cartItemsContainer.querySelectorAll('.cart-item');
        const cantidadCarrito = cartItems.length;
        actualizarContadorConAnimacion(cartCounter, cantidadCarrito);

        // FAVORITOS
        const favoriteItems = favoriteItemsContainer.querySelectorAll('.favorite-item');
        const cantidadFavoritos = favoriteItems.length;
        actualizarContadorConAnimacion(likeCounter, cantidadFavoritos);
    }

    function actualizarContadorConAnimacion(contadorElemento, nuevoValor) {
        const valorActual = parseInt(contadorElemento.textContent);

        if (valorActual !== nuevoValor) {
            contadorElemento.textContent = nuevoValor;

            // Agrega la clase para animar
            contadorElemento.classList.add('contador-pop');

            // La quita después de 300ms para permitir nuevas animaciones
            setTimeout(() => {
                contadorElemento.classList.remove('contador-pop');
            }, 300);
        }
    }

    // --- OBSERVADORES DE CAMBIOS ---
    const observerConfig = { childList: true, subtree: true };

    const cartObserver = new MutationObserver(() => {
        actualizarContadores();
        // Aquí podrías guardar el carrito si lo deseas
    });

    const favoriteObserver = new MutationObserver(() => {
        guardarFavoritosEnLocalStorage(); // Cada vez que cambia, se guarda en localStorage
    });

    cartObserver.observe(cartItemsContainer, observerConfig);
    favoriteObserver.observe(favoriteItemsContainer, observerConfig);

    // --- INICIO ---
    cargarFavoritosDesdeLocalStorage();
}

// Espera a que el DOM cargue para iniciar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initModals);
} else {
    initModals();
}
