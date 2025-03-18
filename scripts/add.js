// Inicializar un array vacío para almacenar los productos favoritos
let favoriteProducts = [];

// Función para cargar los productos desde el archivo JSON
fetch('data/productos.json')
    .then(response => response.json())
    .then(data => {
        // Almacenar los productos cargados
        window.products = data;
        
        // Cargar los productos favoritos desde el localStorage si existen
        loadFavoritesFromStorage();
    })
    .catch(error => {
        console.error("Error al cargar productos:", error);
    });

// Función para cargar los productos favoritos desde el localStorage
function loadFavoritesFromStorage() {
    const storedFavorites = localStorage.getItem('favoriteProducts');
    if (storedFavorites) {
        favoriteProducts = JSON.parse(storedFavorites);
        updateFavoriteModal(); // Actualizar el modal con los productos favoritos cargados
    }
}

// Función para guardar los productos favoritos en el localStorage
function saveFavoritesToStorage() {
    localStorage.setItem('favoriteProducts', JSON.stringify(favoriteProducts));
}

// Función para agregar un producto a favoritos
function addToFavorites(productId) {
    // Buscar el producto en el array de productos cargados
    const product = window.products.find(p => p.id === productId);
    
    if (product) {
        // Comprobar si el producto ya está en favoritos
        if (!favoriteProducts.some(item => item.id === product.id)) {
            // Obtener la primera imagen de la card
            const firstImage = document.querySelector(`#product-${product.id} img`).src;

            // Agregar la imagen al producto
            product.firstImage = firstImage;

            // Agregar el producto a la lista de favoritos
            favoriteProducts.push(product);
            
            // Guardar los favoritos en el localStorage
            saveFavoritesToStorage();
            
            // Actualizar el contenido del modal de favoritos
            updateFavoriteModal();
        }
    } else {
        console.error(`Producto con ID ${productId} no encontrado.`);
    }
}

// Función para eliminar un producto de favoritos
function removeFromFavorites(productId) {
    // Eliminar el producto de la lista de favoritos
    favoriteProducts = favoriteProducts.filter(item => item.id !== productId);
    
    // Guardar los favoritos actualizados en el localStorage
    saveFavoritesToStorage();
    
    // Actualizar el contenido del modal de favoritos
    updateFavoriteModal();
}

// Función para actualizar el modal con los productos favoritos
function updateFavoriteModal() {
    const favoriteItemsContainer = document.getElementById('favorite-items');
    favoriteItemsContainer.innerHTML = ''; // Limpiar la lista de productos favoritos antes de actualizar

    if (favoriteProducts.length > 0) {
        // Crear una lista de los productos favoritos
        favoriteProducts.forEach(product => {
            const favoriteItem = document.createElement('div');
            favoriteItem.classList.add('favorite-item');
            
            // Crear el contenido del item favorito
            favoriteItem.innerHTML = ` 
                <img src="${product.firstImage}" alt="${product.nombre}" class="favorite-img"> <!-- Usar la primera imagen -->
                <p><strong>${product.nombre}</strong></p>
                <p>${product.fabricante}</p>
                <p>${product.detalles}</p>
                <p><strong>${product.precio}</strong></p>
                <button class="btn remove-from-favorites-btn" data-product-id="${product.id}">
                    Eliminar de favoritos
                </button>
            `;
            
            // Agregar el producto al contenedor de favoritos
            favoriteItemsContainer.appendChild(favoriteItem);
        });
    } else {
        // Si no hay productos favoritos, mostrar mensaje por defecto
        favoriteItemsContainer.innerHTML = `
            <div class="empty-favorites">
                <img src="https://cdn.pixabay.com/photo/2021/11/10/07/08/like-6783117_1280.png" alt="Sin favoritos">
                <p>No ha añadido nada a favoritos</p>
            </div>
        `;
    }
}

// Función para añadir un producto al carrito (lógica que puedes expandir más adelante)
function addToCart(productId) {
    console.log(`Producto ${productId} añadido al carrito`); 
    // Aquí puedes agregar la lógica para añadir al carrito
}

// Escuchar los clics en los iconos de like (para añadir a favoritos)
document.querySelectorAll('.icon-card .bx-like').forEach(icon => {
    icon.addEventListener('click', (event) => {
        const productId = event.target.closest('.card').dataset.productId;
        addToFavorites(productId);
    });
});

// Escuchar los clics en los botones de "Eliminar de favoritos"
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-from-favorites-btn')) {
        const productId = event.target.dataset.productId;
        removeFromFavorites(productId);
    }
});
