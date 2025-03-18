document.addEventListener("DOMContentLoaded", function () {

    let savedQuantities = {}; // Para guardar las cantidades seleccionadas
    // Cargar el archivo JSON de productos
    fetch('data/productos.json')
        .then(response => response.json())
        .then(products => {
            displayProducts(products);

            document.getElementById('search-bar').addEventListener('keyup', function () {
                searchProducts(products);
            });

            document.getElementById('category-filter').addEventListener('change', function () {
                filterCategory(products);
            });
        })
        .catch(error => console.error("Error al cargar intentar de nuevo", error));

    function displayProducts(products) {
        const productList = document.getElementById("product-list");
        productList.innerHTML = "";

        // Reordenar los productos, colocando los productos con cantidad seleccionada al principio
        const sortedProducts = products.sort((a, b) => {
            const quantityA = savedQuantities[a.id] || 0;
            const quantityB = savedQuantities[b.id] || 0;
            return quantityB - quantityA; // De mayor a menor
        });

        sortedProducts.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.id = `product-${product.id}`;

            const outOfStock = product.stock === 0;

            // Crear los estilos CSS para la animación directamente en el documento
            const style = document.createElement("style");
            style.innerHTML = `
                /* Estilos para la animación del icono de like al hacer clic */
                .bx-like.liked {
                    animation: likeAnimation 0.5s ease-in-out;
                }

                @keyframes likeAnimation {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.3);
                    }
                    100% {
                        transform: scale(1);
                    }
                }
            `;
            document.head.appendChild(style);

            // Crear los iconos para like y view
            const iconCard = document.createElement("div");
            iconCard.classList.add("icon_card");

            const likeIcon = document.createElement("i");
            likeIcon.classList.add('bx', 'bx-like');
            likeIcon.title = "Favorito";

            // Mantener el efecto hover existente
            likeIcon.addEventListener('mouseenter', () => {
                likeIcon.classList.add('bx-like-hover');
            });
            likeIcon.addEventListener('mouseleave', () => {
                likeIcon.classList.remove('bx-like-hover');
            });

            likeIcon.addEventListener('click', () => {
                // Añadir animación de "like" al hacer clic
                likeIcon.classList.add('liked');

                // Reproducir sonido
                const sound = new Audio('sound/Sound Effect.mp3'); // Reemplaza con la ruta de tu sonido
                setTimeout(() => {
                    sound.currentTime = 0.70;
                    sound.play();
                }, 1.0)

                // Llamar a la función para agregar a favoritos
                addToFavorites(product.id);

                // Remover la animación después de que termine
                setTimeout(() => {
                    likeIcon.classList.remove('liked');
                }, 500); // Duración de la animación
            });

            const viewIcon = document.createElement("i");
            viewIcon.classList.add('bx', 'bx-show-alt');
            viewIcon.title = "Vista previa";
            viewIcon.addEventListener('click', () => {
                viewProduct(product.id);
            });

            iconCard.appendChild(likeIcon);
            iconCard.appendChild(viewIcon);

            // Obtener la cantidad guardada previamente, si existe
            const savedQuantity = savedQuantities[product.id] || 0;

            // Contenido de la card
            productCard.innerHTML = `
                <div class="img-container" style="position: relative;">
                    <img src="${product.imagenes_url[0]}" alt="${product.nombre}" class="product-img" data-src="${product.imagenes_url[0]}">
                </div>
                <div class="product-info">
                    <h3>${product.nombre}</h3>
                    <p class="product-brand">Marca: ${product.fabricante}</p>
                    <p class="product-details">${product.detalles}</p>
                    <p class="product-price">Precio: ${product.precio}</p>
                    <p class="product-id">ID: ${product.id}</p>
                    <p class="product-category">Categoría: ${product.clase}</p>
                    <div class="quantity-container">
                        <button class="quantity-btn" id="minus-${product.id}" ${outOfStock ? 'disabled' : ''}>-</button>
                        <input 
                            type="number" 
                            class="quantity-input" 
                            id="quantity-${product.id}" 
                            placeholder="Cantidad" 
                            min="0" 
                            max="${product.stock}" 
                            value="${savedQuantity}"
                            ${outOfStock ? 'disabled' : ''}>
                        <button class="quantity-btn" id="plus-${product.id}" ${outOfStock ? 'disabled' : ''}>+</button>
                    </div>
                    <div class="out-of-stock-message" id="out-of-stock-${product.id}" style="color: red; display: ${outOfStock ? 'block' : 'none'};">
                        Out of stock
                    </div>
                    <div class="total-container" id="total-container-${product.id}" style="display: none;">
                        <label id="total-${product.id}">Total: L 0.00</label>
                    </div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})" ${outOfStock ? 'disabled' : ''}>Añadir al carrito</button>
                    <button class="buy-now-btn" onclick="buyNow(${product.id})" ${outOfStock ? 'disabled' : ''}>Comprar ahora</button>
                </div>
            `;

            const imgContainer = productCard.querySelector('.img-container');
            imgContainer.appendChild(iconCard);

            productList.appendChild(productCard);

            // Precargar imágenes adicionales para galería
            if (product.imagenes_url.length > 1) {
                let preloadImages = product.imagenes_url.slice(1);
                preloadImages.forEach(imageUrl => {
                    const img = new Image();
                    img.src = imageUrl;
                });
            }

            const quantityInput = document.getElementById(`quantity-${product.id}`);
            if (!outOfStock) {
                quantityInput.addEventListener('input', function () {
                    updateTotal(product.id);
                    markCardAsSelected(product.id);
                });

                document.getElementById(`minus-${product.id}`).addEventListener('click', function () {
                    changeQuantity(product.id, -1);
                });

                document.getElementById(`plus-${product.id}`).addEventListener('click', function () {
                    changeQuantity(product.id, 1);
                });
            }

            // Restaurar el color de la card según el valor de la cantidad guardada
            if (savedQuantity > 0) {
                productCard.style.backgroundColor = '#d4f8d4';
                updateTotal(product.id);  // Asegura que el total se mantenga actualizado
            }
        });
    }

    function searchProducts(products) {
        const searchTerm = document.getElementById('search-bar').value.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.nombre.toLowerCase().includes(searchTerm) ||
            product.detalles.toLowerCase().includes(searchTerm) ||
            product.clase.toLowerCase().includes(searchTerm)
        );
        displayProducts(filteredProducts);
    }

    function filterCategory(products) {
        const selectedCategory = document.getElementById('category-filter').value;
        const filteredProducts = selectedCategory === ''
            ? products
            : products.filter(product => product.clase === selectedCategory);
        displayProducts(filteredProducts);
    }

    function changeQuantity(productId, change) {
        const quantityInput = document.getElementById(`quantity-${productId}`);
        const outOfStockMessage = document.getElementById(`out-of-stock-${productId}`);
        let quantity = parseInt(quantityInput.value) || 0;

        quantity += change;

        const stock = parseInt(quantityInput.getAttribute('max'));

        if (quantity < 0) quantity = 0;

        if (stock === 0) {
            quantity = 0;
            outOfStockMessage.style.display = 'block';
        } else if (quantity > stock) {
            quantity = stock;
        }

        quantityInput.value = quantity;

        // Guardar la cantidad
        savedQuantities[productId] = quantity;

        updateTotal(productId);
        markCardAsSelected(productId);
    }

    function updateTotal(productId) {
        const productCard = document.querySelector(`#product-${productId}`);
        
        // Obtiene el texto del precio (ejemplo: "Precio: L 10,000.00")
        const priceText = productCard.querySelector('.product-price').textContent;
        
        // Limpia el texto eliminando "Precio: L", comas y espacios extra
        const cleanedPriceText = priceText
            .replace("Precio: L", "")
            .replace(/,/g, "")
            .trim();
        
        // Convierte el precio limpio a número flotante
        const productPrice = parseFloat(cleanedPriceText);
        
        const quantityInput = document.getElementById(`quantity-${productId}`);
        const quantity = parseInt(quantityInput.value) || 0;
    
        const stock = parseInt(quantityInput.getAttribute('max'));
    
        const total = productPrice * quantity;
    
        const totalLabel = document.getElementById(`total-${productId}`);
        const totalContainer = document.getElementById(`total-container-${productId}`); 
        const outOfStockMessage = document.getElementById(`out-of-stock-${productId}`);
    
        if (stock === 0) {
            totalLabel.textContent = `Total: L 0.00`;
            totalContainer.style.display = 'none';
            outOfStockMessage.style.display = 'block';
            return;
        }
    
        if (quantity > 0) {
            // Formatea el total con separador de miles y dos decimales
            const formattedTotal = total.toLocaleString('en-US', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            });
    
            totalLabel.textContent = `Total: L ${formattedTotal}`;
            totalContainer.style.display = 'block';
            outOfStockMessage.style.display = 'none';
        } else {
            totalLabel.textContent = `Total: L 0.00`;
            totalContainer.style.display = 'none';
        }
    }
    
    function markCardAsSelected(productId) {
        const productCard = document.querySelector(`#product-${productId}`);
        const quantityInput = document.getElementById(`quantity-${productId}`);

        if (parseInt(quantityInput.value) > 0) {
            productCard.style.backgroundColor = '#d4f8d4';
        } else {
            productCard.style.backgroundColor = '';
        }
    }
});