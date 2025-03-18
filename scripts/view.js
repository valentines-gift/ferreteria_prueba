// Función para abrir el modal con la información del producto
function viewProduct(productId) {
    // Buscar el producto en el array de productos cargados
    const product = window.products.find(p => p.id === productId);

    if (product) {
        // Crear el modal
        const modal = document.createElement('div');
        modal.id = 'viewModal';
        modal.classList.add('modal');

        // Crear el contenido del modal
        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        // Agregar el HTML con las imágenes de la galería
        const imagesHtml = product.imagenes_url.map((imgUrl, index) => `
            <img src="${imgUrl}" alt="${product.nombre}" class="modal-img" style="display: ${index === 0 ? 'block' : 'none'}">
        `).join('');

        modalContent.innerHTML = `
            <span class="close-btn">&times;</span>
            <div class="image-container">
                ${imagesHtml}
            </div>
            <h2>${product.nombre}</h2>
            <p><strong>Fabricante:</strong> ${product.fabricante}</p>
            <p><strong>Detalles:</strong> ${product.detalles}</p>
            <p><strong>Precio:</strong> ${product.precio}</p>
            <button class="prev-btn">&#10094;</button>
            <button class="next-btn">&#10095;</button>
        `;

        // Añadir el contenido del modal al modal
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        const style = document.createElement('style');
        style.innerHTML = `
            .modal {
                display: flex;
                justify-content: center;
                align-items: center;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                z-index: 9999;
            }
            .modal-content {
                background-color: white;
                padding: 20px;
                border-radius: 8px;
                width: 80%;
                max-width: 500px;
                text-align: center;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                position: relative;
            }
            .modal-content h2 {
                margin-top: 20px;
                font-size: 24px;
                border-top: 3px solid #333; /* Borde oscuro */
                padding-top: 10px; /* Espacio entre el borde y el texto */
            }
            .modal-content p {
                margin: 10px 0;
                font-size: 16px;
            }
            .image-container {
                height: 320px;
                overflow: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 20px;
            }
            .modal-img {
                max-width: 100%;
                height: 100%;
                object-fit: cover;
                border-radius: 8px;
            }
            .close-btn {
                color: #ff3b3b;
                float: right;
                font-size: 33px;
                font-weight: bold;
                cursor: pointer;
                transition: color 0.3s;
            }
            .close-btn:hover {
                color: red;
            }
            .prev-btn, .next-btn {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                font-size: 30px;
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                border-radius: 1px;
                padding: 10px;
                cursor: pointer;
                z-index: 10;
            }
            .prev-btn {
                left: 10px;
            }
            .next-btn {
                right: 10px;
            }
        
            /* Estilos para pantallas pequeñas (móviles) */
            @media (max-width: 768px) {
                .modal-content {
                    width: 90%; /* Aumenta el tamaño del modal en pantallas más pequeñas */
                    max-width: 400px; /* Limita el tamaño máximo */
                    padding: 15px; /* Reduce el padding */
                }
        
                .modal-content h2 {
                    font-size: 20px; /* Reduce el tamaño de fuente del título */
                }
        
                .modal-content p {
                    font-size: 14px; /* Reduce el tamaño de fuente de los párrafos */
                }
        
                .image-container {
                    height: 250px; /* Reduce la altura de la imagen en pantallas pequeñas */
                }
        
                .modal-img {
                    height: 100%;
                    object-fit: cover;
                    border-radius: 5px;
                }
        
                .close-btn {
                    font-size: 28px; /* Reduce el tamaño del botón de cerrar */
                }
        
                .prev-btn, .next-btn {
                    font-size: 25px; /* Reduce el tamaño de los botones de navegación */
                    padding: 8px; /* Reduce el tamaño de los botones */
                }
            }
        
            /* Estilos para pantallas muy pequeñas (móviles más pequeños) */
            @media (max-width: 480px) {
                .modal-content {
                    width: 95%; /* Aumenta aún más el tamaño del modal en pantallas muy pequeñas */
                    max-width: 350px; /* Limita el tamaño máximo */
                }
        
                .modal-content h2 {
                    font-size: 18px; /* Reduce aún más el tamaño del título */
                }
        
                .modal-content p {
                    font-size: 12px; /* Reduce aún más el tamaño de los párrafos */
                }
        
                .image-container {
                    height: 200px; /* Reduce más la altura de la imagen */
                }
        
                .close-btn {
                    font-size: 25px; /* Reduce el tamaño del botón de cerrar aún más */
                }
        
                .prev-btn, .next-btn {
                    font-size: 20px; /* Reduce el tamaño de los botones de navegación */
                    padding: 6px; /* Reduce el tamaño de los botones */
                }
            }
        `;
        document.head.appendChild(style);

        // Lógica para cerrar el modal al hacer clic en el botón de cierre
        const closeButton = modal.querySelector('.close-btn');
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal); // Eliminar el modal de la vista
            document.head.removeChild(style); // Eliminar los estilos dinámicos
        });

        // Cerrar el modal si el usuario hace clic fuera del contenido
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                document.head.removeChild(style);
            }
        });

        // Navegación entre imágenes
        const images = modalContent.querySelectorAll('.modal-img');
        let currentIndex = 0;

        const prevButton = modalContent.querySelector('.prev-btn');
        const nextButton = modalContent.querySelector('.next-btn');

        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateImageDisplay();
        });

        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateImageDisplay();
        });

        function updateImageDisplay() {
            images.forEach((img, index) => {
                img.style.display = index === currentIndex ? 'block' : 'none';
            });
        }
    } else {
        console.error("Producto no encontrado.");
    }
}

// Asignar el evento de clic al ícono de vista previa (en el archivo app.js o donde esté el icono)
document.querySelectorAll('.icon-card .bx-show-alt').forEach(icon => {
    icon.addEventListener('click', (event) => {
        const productId = event.target.closest('.card').dataset.productId;
        viewProduct(productId);
    });
});
